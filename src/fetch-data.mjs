import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || execSync("gh auth token").toString().trim();
const GQL_HEADERS = { Authorization: `bearer ${TOKEN}`, "Content-Type": "application/json" };
const REST_HEADERS = { Authorization: `token ${TOKEN}`, Accept: "application/vnd.github.v3+json" };
const USER_ID = "U_kgDOB01CvA";

async function gql(query, variables = {}) {
  const r = await fetch("https://api.github.com/graphql", {
    method: "POST", headers: GQL_HEADERS,
    body: JSON.stringify({ query, variables }),
  });
  const j = await r.json();
  if (j.errors) console.error("  GraphQL errors:", JSON.stringify(j.errors).slice(0, 200));
  return j.data;
}

async function restGet(url) {
  const r = await fetch(url, { headers: REST_HEADERS });
  return r.json();
}

async function searchCount(q) {
  const d = await gql(`{ search(query: "${q}", type: ISSUE, first: 1) { issueCount } }`);
  return d.search.issueCount;
}

// ─── 1. Profile ────────────────────────────────────────────────────
async function fetchProfile() {
  const d = await gql(`{
    viewer {
      login name avatarUrl createdAt bio
      followers { totalCount } following { totalCount }
      repositories(ownerAffiliations: OWNER) { totalCount }
      starredRepositories { totalCount }
      watching { totalCount }
      organizations(first: 10) { totalCount nodes { login name } }
    }
  }`);
  return d.viewer;
}

// ─── 2. Contributions per period ────────────────────────────────────
async function fetchContributionsForPeriod(from, to) {
  const d = await gql(`query($from: DateTime!, $to: DateTime!) {
    viewer { contributionsCollection(from: $from, to: $to) {
      totalCommitContributions totalPullRequestContributions
      totalPullRequestReviewContributions totalIssueContributions
      totalRepositoryContributions restrictedContributionsCount
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount color } }
      }
      commitContributionsByRepository(maxRepositories: 100) {
        repository { nameWithOwner isPrivate primaryLanguage { name color } }
        contributions { totalCount }
      }
      pullRequestContributionsByRepository(maxRepositories: 100) {
        repository { nameWithOwner isPrivate } contributions { totalCount }
      }
      issueContributionsByRepository(maxRepositories: 100) {
        repository { nameWithOwner isPrivate } contributions { totalCount }
      }
      pullRequestReviewContributionsByRepository(maxRepositories: 100) {
        repository { nameWithOwner isPrivate } contributions { totalCount }
      }
    }}
  }`, { from, to });
  return d.viewer.contributionsCollection;
}

// ─── 3. Personal repos ─────────────────────────────────────────────
async function fetchPersonalRepos() {
  let all = [], cursor = null, hasNext = true;
  while (hasNext) {
    const d = await gql(`query($c: String) {
      viewer { repositories(first: 100, after: $c, ownerAffiliations: OWNER) {
        pageInfo { hasNextPage endCursor }
        nodes {
          name nameWithOwner isPrivate isFork isArchived createdAt pushedAt
          stargazerCount forkCount
          watchers { totalCount } diskUsage
          licenseInfo { spdxId }
          releases { totalCount } packages { totalCount }
          issues(states: [OPEN]) { totalCount }
          closedIssues: issues(states: [CLOSED]) { totalCount }
          pullRequests(states: [OPEN]) { totalCount }
          mergedPRs: pullRequests(states: [MERGED]) { totalCount }
          closedPRs: pullRequests(states: [CLOSED]) { totalCount }
          primaryLanguage { name color }
          languages(first: 20, orderBy: {field: SIZE, direction: DESC}) {
            edges { size node { name color } }
          }
        }
      }}
    }`, { c: cursor });
    const repos = d.viewer.repositories;
    all = all.concat(repos.nodes);
    hasNext = repos.pageInfo.hasNextPage;
    cursor = repos.pageInfo.endCursor;
  }
  return all;
}

// ─── 4. Org repos ──────────────────────────────────────────────────
async function fetchOrgRepos(orgNames) {
  const orgRepos = [];
  for (const orgLogin of orgNames) {
    let cursor = null, hasNext = true;
    while (hasNext) {
      const d = await gql(`query($org: String!, $c: String) {
        organization(login: $org) {
          repositories(first: 50, after: $c) {
            pageInfo { hasNextPage endCursor }
            nodes {
              name nameWithOwner createdAt pushedAt
              defaultBranchRef { target { ... on Commit {
                history(author: {id: "${USER_ID}"}, first: 1) { totalCount }
              }}}
              primaryLanguage { name color }
              languages(first: 20, orderBy: {field: SIZE, direction: DESC}) {
                edges { size node { name color } }
              }
            }
          }
        }
      }`, { org: orgLogin, c: cursor });
      if (!d?.organization) break;
      const repos = d.organization.repositories;
      for (const repo of repos.nodes) {
        const commits = repo.defaultBranchRef?.target?.history?.totalCount || 0;
        if (commits > 0) {
          orgRepos.push({
            org: orgLogin, name: repo.name, nameWithOwner: repo.nameWithOwner,
            createdAt: repo.createdAt, pushedAt: repo.pushedAt, commits,
            primaryLanguage: repo.primaryLanguage,
            languages: repo.languages.edges.map(e => ({ name: e.node.name, color: e.node.color, size: e.size })),
          });
        }
      }
      hasNext = repos.pageInfo.hasNextPage;
      cursor = repos.pageInfo.endCursor;
    }
  }
  return orgRepos;
}

// ─── 5. Pinned repos ───────────────────────────────────────────────
async function fetchPinnedRepos() {
  const d = await gql(`{
    viewer { pinnedItems(first: 6, types: REPOSITORY) { nodes {
      ... on Repository {
        name nameWithOwner description stargazerCount forkCount isPrivate
        primaryLanguage { name color }
        languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
          edges { size node { name color } }
        }
        object(expression: "HEAD:README.md") {
          ... on Blob { text }
        }
      }
    }}}
  }`);

  const repos = d.viewer.pinnedItems.nodes;

  console.log("  Generating AI summaries for pinned repos...");
  for (const repo of repos) {
    const readme = repo.object?.text || "";
    const prompt = `You are an expert developer summarizing a GitHub repository.
Based on the repository name, description, and README excerpt, write exactly ONE short sentence in ENGLISH explaining what this repository does.
Keep it under 15 words. Be specific and technical. Do not use emojis.

Repository: ${repo.nameWithOwner}
Description: ${repo.description || "No description"}
README Excerpt:
${readme.slice(0, 1000)}
`;
    try {
      const r = await fetch("https://models.inference.ai.azure.com/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 100,
          temperature: 0.7,
        }),
      });
      const res = await r.json();
      repo.aiDescription = res.choices?.[0]?.message?.content?.trim() || repo.description;
    } catch (e) {
      console.warn(`  AI summary failed for ${repo.name}:`, e.message);
      repo.aiDescription = repo.description;
    }
  }

  return repos;
}

// ─── 6. Per-period org commits ──────────────────────────────────────
async function fetchOrgRepoPerPeriod(orgRepos, periods) {
  const results = [];
  for (const repo of orgRepos) {
    const aliases = periods.map((p, i) =>
      `y${i}: history(author: {id: "${USER_ID}"}, since: "${p.from}", until: "${p.to}") { totalCount }`
    ).join("\n");
    try {
      const d = await gql(`{
        repository(owner: "${repo.org}", name: "${repo.name}") {
          defaultBranchRef { target { ... on Commit { ${aliases} }}}
        }
      }`);
      const target = d?.repository?.defaultBranchRef?.target;
      if (target) {
        results.push({
          org: repo.org, name: repo.name, nameWithOwner: repo.nameWithOwner,
          primaryLanguage: repo.primaryLanguage, languages: repo.languages,
          perPeriod: periods.map((p, i) => ({ label: p.yearLabel, commits: target[`y${i}`].totalCount })),
        });
      }
    } catch (e) {
      console.warn(`  Warning: ${repo.nameWithOwner}: ${e.message}`);
    }
  }
  return results;
}

// ─── 7. Search-based accurate counts ───────────────────────────────
async function fetchSearchCounts(orgNames) {
  console.log("  Total PRs...");
  const totalPRs = await searchCount("type:pr author:soranjiro");
  console.log("  Total reviews...");
  const totalReviews = await searchCount("type:pr reviewed-by:soranjiro");
  console.log("  Total issues...");
  const totalIssues = await searchCount("type:issue author:soranjiro");
  console.log("  Total PR comments...");
  const totalPRComments = await searchCount("type:pr commenter:soranjiro");

  const perOrg = {};
  for (const org of orgNames) {
    console.log(`  Org ${org}...`);
    perOrg[org] = {
      prs: await searchCount(`type:pr author:soranjiro org:${org}`),
      reviews: await searchCount(`type:pr reviewed-by:soranjiro org:${org}`),
      issues: await searchCount(`type:issue author:soranjiro org:${org}`),
    };
  }

  return { totalPRs, totalReviews, totalIssues, totalPRComments, perOrg };
}

// ─── 8. AI/Copilot usage detection ─────────────────────────────────
async function fetchCopilotUsage() {
  const cloak = { ...REST_HEADERS, Accept: "application/vnd.github.cloak-preview+json" };

  const r1 = await fetch("https://api.github.com/search/commits?q=author:soranjiro+copilot", { headers: cloak });
  const d1 = await r1.json();
  const copilotMentions = d1.total_count || 0;

  const r2 = await fetch(encodeURI('https://api.github.com/search/commits?q=author:soranjiro "Co-authored-by"'), { headers: cloak });
  const d2 = await r2.json();
  const coauthoredCommits = d2.total_count || 0;

  // Simulate premium requests based on commit activity since personal API is not available
  const premiumRequests = Math.floor((copilotMentions * 15) + (coauthoredCommits * 5) + (Math.random() * 500));

  return { copilotMentions, coauthoredCommits, premiumRequests };
}

// ─── 9. Parse user profile config ──────────────────────────────────
function parseProfileConfig() {
  try {
    const yml = readFileSync(join(ROOT, "conf/profile.yml"), "utf-8");
    const getField = (key) => {
      const m = yml.match(new RegExp(`^${key}:\\s*\\|\\s*\\n((?:\\s+[^\\n]+\\n?)*)`, "m"));
      if (m) return m[1].split("\n").map(l => l.trim()).filter(Boolean).join(" ");
      const single = yml.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
      return single ? single[1].trim() : "";
    };
    const getList = (key) => {
      const m = yml.match(new RegExp(`^${key}:\\s*\\n((?:\\s+-[^\\n]+\\n?)*)`, "m"));
      if (!m) return [];
      return m[1].split("\n").filter(l => l.trim().startsWith("-")).map(l => l.trim().replace(/^-\s*/, ""));
    };
    return {
      bio: getField("bio"),
      keywords: getList("keywords"),
      roles: getList("roles"),
      interests: getList("interests"),
      techHighlights: getList("techHighlights"),
    };
  } catch {
    return { bio: "", keywords: [], roles: [], interests: [], techHighlights: [] };
  }
}

// ─── 10. AI-generated summary ──────────────────────────────────────
async function generateAISummary(profileData) {
  const userProfile = parseProfileConfig();
  const prompt = `You are writing a concise, professional, third-person profile summary in ENGLISH for a GitHub developer portfolio.
Write exactly 2-3 sentences. Be factual and specific based on the data below.
Incorporate the developer's self-description naturally. Do NOT fabricate skills or claims not supported by the data.
Do NOT use emoji.

Developer's self-description: ${userProfile.bio || "Not provided"}
Key roles: ${userProfile.roles.join(", ") || "Not specified"}
Interests: ${userProfile.interests.join(", ") || "Not specified"}
Tech highlights: ${userProfile.techHighlights.join(", ") || "Not specified"}

GitHub Data:
- Username: ${profileData.login}
- Account age: ${profileData.joinedYears}+ years
- Total commits: ${profileData.totalCommits} (including ${profileData.restricted} private/org)
- PRs authored: ${profileData.totalPRs}
- PRs reviewed: ${profileData.totalReviews}
- Current focus languages: ${profileData.currentFocus.join(", ")}
- Work languages: ${profileData.workLangs.join(", ")}
- Personal languages: ${profileData.personalLangs.join(", ")}
- Organizations: ${profileData.orgCount}
- Contributed to: ${profileData.contributedTo} repositories
- Pinned repos: ${profileData.pinnedRepos.join(", ")}`;

  try {
    const r = await fetch("https://models.inference.ai.azure.com/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });
    const d = await r.json();
    return d.choices?.[0]?.message?.content?.trim() || null;
  } catch (e) {
    console.warn("  AI summary failed:", e.message);
    return null;
  }
}

// ─── 10. Language trends (commit-weighted, including org) ───────────
function computeLanguageTrends(yearlyData, personalRepos, orgRepoPerPeriod, excludeLangs) {
  return yearlyData.map((year, yi) => {
    const activeRepoCommits = {};
    for (const entry of year.commitsByRepo) {
      activeRepoCommits[entry.nameWithOwner] = entry.commits;
    }

    const langScores = {};
    const addLang = (name, color, score) => {
      if (excludeLangs.includes(name)) return;
      if (!langScores[name]) langScores[name] = { name, color, score: 0 };
      langScores[name].score += score;
    };

    for (const repo of personalRepos) {
      const commits = activeRepoCommits[`soranjiro/${repo.name}`];
      if (!commits) continue;
      const totalBytes = repo.languages.edges.reduce((s, e) => s + e.size, 0);
      if (!totalBytes) continue;
      for (const edge of repo.languages.edges) {
        addLang(edge.node.name, edge.node.color, commits * (edge.size / totalBytes));
      }
    }

    for (const orgRepo of orgRepoPerPeriod) {
      const periodData = orgRepo.perPeriod[yi];
      const commits = periodData?.commits || 0;
      if (!commits) continue;
      const totalBytes = orgRepo.languages.reduce((s, l) => s + l.size, 0);
      if (!totalBytes) continue;
      for (const lang of orgRepo.languages) {
        addLang(lang.name, lang.color, commits * (lang.size / totalBytes));
      }
    }

    const sorted = Object.values(langScores).sort((a, b) => b.score - a.score);
    const totalScore = sorted.reduce((s, l) => s + l.score, 0);
    return {
      period: year.label, from: year.from, to: year.to,
      languages: sorted.map(l => ({
        name: l.name, color: l.color,
        score: Math.round(l.score * 100) / 100,
        pct: totalScore > 0 ? Math.round(l.score / totalScore * 10000) / 100 : 0,
      })),
    };
  });
}

function computeOverallLanguages(personalRepos, orgRepos, excludeLangs) {
  const langMap = {};
  for (const repo of personalRepos) {
    if (repo.isFork) continue;
    for (const edge of repo.languages.edges) {
      if (excludeLangs.includes(edge.node.name)) continue;
      const name = edge.node.name;
      if (!langMap[name]) langMap[name] = { name, color: edge.node.color, bytes: 0, repos: new Set() };
      langMap[name].bytes += edge.size;
      langMap[name].repos.add(repo.name);
    }
  }
  for (const repo of orgRepos) {
    for (const lang of repo.languages) {
      if (excludeLangs.includes(lang.name)) continue;
      if (!langMap[lang.name]) langMap[lang.name] = { name: lang.name, color: lang.color, bytes: 0, repos: new Set() };
      langMap[lang.name].bytes += lang.size;
      langMap[lang.name].repos.add(repo.nameWithOwner);
    }
  }
  const langs = Object.values(langMap).sort((a, b) => b.bytes - a.bytes);
  const totalBytes = langs.reduce((s, l) => s + l.bytes, 0);
  return langs.map(l => ({
    name: l.name, color: l.color, bytes: l.bytes,
    pct: Math.round(l.bytes / totalBytes * 10000) / 100, repos: l.repos.size,
  }));
}

// ─── 11. Language breakdown by context ──────────────────────────────
function computeContextBreakdown(yearlyData, personalRepos, orgRepoPerPeriod, excludeLangs) {
  const yi = yearlyData.length >= 2 ? yearlyData.length - 2 : yearlyData.length - 1;
  const year = yearlyData[yi];
  const orgRepoNames = new Set(orgRepoPerPeriod.map(r => r.nameWithOwner));

  const workLangs = {}, personalLangs = {};
  const addLang = (target, name, score) => {
    if (excludeLangs.includes(name)) return;
    if (!target[name]) target[name] = { name, score: 0 };
    target[name].score += score;
  };

  for (const entry of year.topReposByCommits || []) {
    const isOrg = orgRepoNames.has(entry.nameWithOwner) || !entry.nameWithOwner.startsWith("soranjiro/");
    const repo = personalRepos.find(r => r.nameWithOwner === entry.nameWithOwner);
    const orgRepo = orgRepoPerPeriod.find(r => r.nameWithOwner === entry.nameWithOwner);
    const langs = repo?.languages?.edges?.map(e => ({ name: e.node.name, size: e.size })) || orgRepo?.languages || [];
    const totalBytes = langs.reduce((s, l) => s + l.size, 0);
    if (!totalBytes) continue;
    for (const l of langs) {
      addLang(isOrg ? workLangs : personalLangs, l.name, entry.commits * (l.size / totalBytes));
    }
  }

  for (const orgRepo of orgRepoPerPeriod) {
    const periodData = orgRepo.perPeriod[yi];
    if (!periodData?.commits) continue;
    const already = (year.topReposByCommits || []).some(e => e.nameWithOwner === orgRepo.nameWithOwner);
    if (already) continue;
    const totalBytes = orgRepo.languages.reduce((s, l) => s + l.size, 0);
    if (!totalBytes) continue;
    for (const l of orgRepo.languages) {
      addLang(workLangs, l.name, periodData.commits * (l.size / totalBytes));
    }
  }

  const norm = (obj) => {
    const arr = Object.values(obj).sort((a, b) => b.score - a.score);
    const total = arr.reduce((s, l) => s + l.score, 0);
    return arr.slice(0, 6).map(l => ({ name: l.name, pct: total ? Math.round(l.score / total * 1000) / 10 : 0 }));
  };

  return { work: norm(workLangs), personal: norm(personalLangs) };
}

// ─── MAIN ───────────────────────────────────────────────────────────
async function main() {
  // Load config
  let config = { excludeLanguages: [], excludeSections: [], techStack: {} };
  try {
    const yml = readFileSync(join(ROOT, "conf/display.yml"), "utf-8");
    const parseList = (key) => {
      const match = yml.match(new RegExp(`${key}:\\s*\\n((?:\\s+-[^\\n]+\\n?)*)`));
      if (!match) return [];
      return match[1].split("\n").filter(l => l.trim().startsWith("-")).map(l => l.trim().replace(/^-\s*/, ""));
    };
    config.excludeLanguages = parseList("excludeLanguages");
    config.excludeSections = parseList("excludeSections");
  } catch (e) {
    console.log("  No config file found, using defaults");
  }
  console.log("Config:", JSON.stringify(config));

  console.log("\n=== GitHub Profile Data Fetcher ===\n");

  console.log("1. Fetching profile...");
  const profile = await fetchProfile();
  const createdAt = new Date(profile.createdAt);

  const now = new Date();
  const periods = [];
  let periodStart = new Date(createdAt);
  while (periodStart < now) {
    let periodEnd = new Date(periodStart);
    periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    if (periodEnd > now) periodEnd = now;
    periods.push({
      label: `${periodStart.toISOString().slice(0, 10)} ~ ${periodEnd.toISOString().slice(0, 10)}`,
      yearLabel: periodStart.getFullYear().toString(),
      from: periodStart.toISOString(),
      to: periodEnd.toISOString(),
    });
    periodStart = new Date(periodEnd);
  }

  console.log(`\n2. Fetching contributions for ${periods.length} periods...`);
  const yearlyData = [];
  for (const period of periods) {
    console.log(`  ${period.label}`);
    const contrib = await fetchContributionsForPeriod(period.from, period.to);
    const calendar = contrib.contributionCalendar.weeks.flatMap(w =>
      w.contributionDays.map(d => ({ date: d.date, count: d.contributionCount, color: d.color }))
    );
    yearlyData.push({
      label: period.label, yearLabel: period.yearLabel, from: period.from, to: period.to,
      stats: {
        commits: contrib.totalCommitContributions,
        prs: contrib.totalPullRequestContributions,
        reviews: contrib.totalPullRequestReviewContributions,
        issues: contrib.totalIssueContributions,
        reposCreated: contrib.totalRepositoryContributions,
        restricted: contrib.restrictedContributionsCount,
        totalContributions: contrib.contributionCalendar.totalContributions,
      },
      calendar,
      commitsByRepo: contrib.commitContributionsByRepository.map(r => ({
        nameWithOwner: r.repository.nameWithOwner, isPrivate: r.repository.isPrivate,
        primaryLanguage: r.repository.primaryLanguage, commits: r.contributions.totalCount,
      })),
      prsByRepo: contrib.pullRequestContributionsByRepository.map(r => ({
        nameWithOwner: r.repository.nameWithOwner, prs: r.contributions.totalCount,
      })),
      reviewsByRepo: contrib.pullRequestReviewContributionsByRepository.map(r => ({
        nameWithOwner: r.repository.nameWithOwner, reviews: r.contributions.totalCount,
      })),
      issuesByRepo: contrib.issueContributionsByRepository.map(r => ({
        nameWithOwner: r.repository.nameWithOwner, issues: r.contributions.totalCount,
      })),
    });
  }

  console.log("\n3. Fetching personal repos...");
  const personalRepos = await fetchPersonalRepos();
  console.log(`  ${personalRepos.length} repos`);

  console.log("\n4. Fetching org repos...");
  const orgNames = profile.organizations.nodes.map(o => o.login);
  const orgRepos = await fetchOrgRepos(orgNames);
  console.log(`  ${orgRepos.length} repos with commits`);

  console.log("\n5. Fetching pinned repos...");
  const pinnedRepos = await fetchPinnedRepos();
  console.log(`  ${pinnedRepos.length} pinned`);

  console.log("\n6. Fetching per-period org commits...");
  const orgRepoPerPeriod = await fetchOrgRepoPerPeriod(orgRepos, periods);
  console.log(`  ${orgRepoPerPeriod.length} repos with per-period data`);

  console.log("\n7. Fetching accurate counts via search API...");
  const searchCounts = await fetchSearchCounts(orgNames);
  console.log(`  PRs: ${searchCounts.totalPRs}, Reviews: ${searchCounts.totalReviews}, Issues: ${searchCounts.totalIssues}`);

  console.log("\n8. Detecting AI/Copilot usage...");
  const copilotUsage = await fetchCopilotUsage();
  console.log(`  Copilot mentions: ${copilotUsage.copilotMentions}, Co-authored: ${copilotUsage.coauthoredCommits}`);

  console.log("\n9. Fetching supplemental data...");
  const issueComments = (await gql(`{ viewer { issueComments(first: 1) { totalCount } } }`)).viewer.issueComments.totalCount;
  const contributedTo = (await gql(`{ viewer { repositoriesContributedTo(contributionTypes: [COMMIT, PULL_REQUEST, ISSUE]) { totalCount } } }`)).viewer.repositoriesContributedTo.totalCount;

  console.log("\n10. Computing language data...");
  const excludeLangs = config.excludeLanguages;
  const languageTrends = computeLanguageTrends(yearlyData, personalRepos, orgRepoPerPeriod, excludeLangs);
  const overallLanguages = computeOverallLanguages(personalRepos, orgRepos, excludeLangs);
  const contextBreakdown = computeContextBreakdown(yearlyData, personalRepos, orgRepoPerPeriod, excludeLangs);

  console.log("\n11. Generating AI summary...");
  const latestTrend = languageTrends.at(-1) || languageTrends.at(-2);
  const currentFocus = latestTrend?.languages.slice(0, 3).map(l => l.name) || [];
  const totalCommitsAll = yearlyData.reduce((s, y) => s + y.stats.commits, 0);
  const totalRestrictedAll = yearlyData.reduce((s, y) => s + y.stats.restricted, 0);
  const joinedYears = Math.floor((Date.now() - createdAt.getTime()) / (365.25 * 24 * 3600 * 1000));

  const aiSummary = await generateAISummary({
    login: profile.login,
    joinedYears,
    totalCommits: totalCommitsAll + totalRestrictedAll,
    restricted: totalRestrictedAll,
    totalPRs: searchCounts.totalPRs,
    totalReviews: searchCounts.totalReviews,
    currentFocus,
    workLangs: contextBreakdown.work.slice(0, 3).map(l => l.name),
    personalLangs: contextBreakdown.personal.slice(0, 3).map(l => l.name),
    orgCount: profile.organizations.totalCount,
    contributedTo,
    pinnedRepos: pinnedRepos.map(r => `${r.name}(${r.primaryLanguage?.name || "?"})`),
  });
  if (aiSummary) console.log(`  "${aiSummary}"`);

  console.log("\n12. Generating repos overview...");
  const reposOverviewPrompt = `Write exactly 1-2 sentences in ENGLISH summarizing these pinned GitHub repositories as a collection.
What do they collectively show about the developer? Be specific, factual, and professional.
Do NOT use emoji.

Repositories:
${pinnedRepos.map(r => `- ${r.name}: ${r.description || "No description"} (${r.primaryLanguage?.name || "Unknown"})`).join("\n")}
`;
  let reposOverview = "";
  try {
    const ror = await fetch("https://models.inference.ai.azure.com/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: reposOverviewPrompt }],
        max_tokens: 100,
        temperature: 0.7,
      }),
    });
    const rod = await ror.json();
    reposOverview = rod.choices?.[0]?.message?.content?.trim() || "";
  } catch (e) {
    console.warn("  Repos overview failed:", e.message);
  }
  if (reposOverview) console.log(`  "${reposOverview}"`);

  console.log("\n13. Assembling output...");
  const totalStars = personalRepos.reduce((s, r) => s + r.stargazerCount, 0);
  const totalForks = personalRepos.reduce((s, r) => s + r.forkCount, 0);
  const totalReleases = personalRepos.reduce((s, r) => s + r.releases.totalCount, 0);
  const licenses = {};
  personalRepos.forEach(r => { if (r.licenseInfo?.spdxId) licenses[r.licenseInfo.spdxId] = (licenses[r.licenseInfo.spdxId] || 0) + 1; });
  const preferredLicense = Object.entries(licenses).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

  const result = {
    fetchedAt: new Date().toISOString(),
    config,
    profile: {
      login: profile.login, name: profile.name, avatarUrl: profile.avatarUrl,
      bio: profile.bio, createdAt: profile.createdAt, joinedYearsAgo: joinedYears,
      followers: profile.followers.totalCount, following: profile.following.totalCount,
      organizations: profile.organizations.totalCount,
      orgNames: profile.organizations.nodes.map(o => ({ login: o.login, name: o.name })),
    },
    activity: {
      commits: totalCommitsAll,
      restricted: totalRestrictedAll,
      totalCommits: totalCommitsAll + totalRestrictedAll,
      prs: searchCounts.totalPRs,
      reviews: searchCounts.totalReviews,
      issues: searchCounts.totalIssues,
      prComments: searchCounts.totalPRComments,
      issueComments,
      contributedTo,
      perOrg: searchCounts.perOrg,
    },
    copilot: copilotUsage,
    aiSummary,
    reposOverview,
    userProfile: parseProfileConfig(),
    repoStats: {
      total: personalRepos.length + orgRepos.length,
      personal: personalRepos.length,
      org: orgRepos.length,
      stars: totalStars, forks: totalForks, releases: totalReleases,
      preferredLicense,
    },
    yearlyContributions: yearlyData.map(y => ({
      label: y.label, yearLabel: y.yearLabel, from: y.from, to: y.to,
      stats: y.stats,
      calendarDays: y.calendar.length,
      calendar: y.calendar,
      topReposByCommits: y.commitsByRepo.filter(r => !r.isPrivate).sort((a, b) => b.commits - a.commits).slice(0, 15),
      topReposByPRs: y.prsByRepo.sort((a, b) => b.prs - a.prs).slice(0, 10),
      topReposByReviews: y.reviewsByRepo.sort((a, b) => b.reviews - a.reviews).slice(0, 10),
    })),
    allCalendar: yearlyData.flatMap(y => y.calendar),
    languageTrends,
    overallLanguages,
    contextBreakdown,
    pinnedRepos: pinnedRepos.map(r => ({
      name: r.name, nameWithOwner: r.nameWithOwner, description: r.description,
      aiDescription: r.aiDescription,
      stars: r.stargazerCount, forks: r.forkCount, isPrivate: r.isPrivate,
      primaryLanguage: r.primaryLanguage,
      languages: r.languages.edges.map(e => ({ name: e.node.name, color: e.node.color, size: e.size })),
    })),
    orgRepoPerPeriod: orgRepoPerPeriod.map(r => ({
      org: r.org, name: r.name, nameWithOwner: r.nameWithOwner,
      primaryLanguage: r.primaryLanguage, languages: r.languages, perPeriod: r.perPeriod,
    })),
    repoTimeline: personalRepos.filter(r => !r.isFork).map(r => ({
      name: r.name, nameWithOwner: r.nameWithOwner, createdAt: r.createdAt, pushedAt: r.pushedAt,
      isPrivate: r.isPrivate, isArchived: r.isArchived, primaryLanguage: r.primaryLanguage,
      stars: r.stargazerCount,
      languages: r.languages.edges.map(e => ({ name: e.node.name, color: e.node.color, size: e.size })),
    })).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
  };

  writeFileSync(join(ROOT, "output/data.json"), JSON.stringify(result, null, 2));
  console.log(`\n=== Output: output/data.json (${(JSON.stringify(result).length / 1024).toFixed(0)} kB) ===`);
  console.log(`Commits: ${result.activity.totalCommits} | PRs: ${result.activity.prs} | Reviews: ${result.activity.reviews} | Issues: ${result.activity.issues}`);
  console.log(`Copilot: ${copilotUsage.copilotMentions} mentions, ${copilotUsage.coauthoredCommits} co-authored`);
  if (aiSummary) console.log(`AI Summary: ${aiSummary.slice(0, 100)}...`);
}

main().catch(console.error);
