import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SVG_DIR = join(ROOT, "output/assets/svg");
mkdirSync(SVG_DIR, { recursive: true });
const data = JSON.parse(readFileSync(join(ROOT, "output/data.json"), "utf-8"));

const SVG_W = 400;

function esc(s) {
  return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function fmtNum(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return String(n);
}

function themeCSS(theme) {
  const vars = theme === 'light'
    ? '.auto { --text: #24292f; --muted: #656d76; --accent: #0969da; --border: #d0d7de; --bar-bg: #eaeef2; --sub: #8957e5; }'
    : '.auto { --text: #e6edf3; --muted: #8b949e; --accent: #58a6ff; --border: #30363d; --bar-bg: #21262d; --sub: #a371f7; }';
  return `
    ${vars}
    * { margin: 0; padding: 0; box-sizing: border-box; }
    .auto { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; font-size: 13px; color: var(--text); background: transparent; }
    .card { background: transparent; padding: 16px; }
    h2 { font-size: 14px; font-weight: 600; margin-bottom: 10px; display: flex; align-items: center; gap: 6px; color: var(--text); }
    h2 svg { fill: var(--accent); flex-shrink: 0; }
    .row { display: flex; gap: 12px; flex-wrap: wrap; }
    .stat { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--muted); margin-bottom: 4px; }
    .stat svg { fill: var(--muted); flex-shrink: 0; }
    .stat strong { color: var(--text); font-weight: 600; }
    .lang-bar { display: flex; height: 8px; border-radius: 4px; overflow: hidden; margin: 8px 0; }
    .lang-bar span { display: block; height: 100%; }
    .lang-legend { display: flex; flex-wrap: wrap; gap: 4px 12px; font-size: 11px; color: var(--muted); }
    .lang-legend .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 3px; vertical-align: middle; }
    .section-label { font-size: 9px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--sub); margin-bottom: 6px; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
    .anim { animation: fadeIn 0.4s ease both; }
    .anim-d1 { animation-delay: 0.05s; } .anim-d2 { animation-delay: 0.1s; } .anim-d3 { animation-delay: 0.15s; }
    .anim-d4 { animation-delay: 0.2s; } .anim-d5 { animation-delay: 0.25s; } .anim-d6 { animation-delay: 0.3s; }
  `;
}

function wrapSVG(height, body, theme) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SVG_W}" height="${height}">
  <foreignObject x="0" y="0" width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml" class="auto">
      <style>${themeCSS(theme)}</style>
      <div class="card">${body}</div>
    </div>
  </foreignObject>
</svg>`;
}

function iconSVG(path, size = 16) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="${size}" height="${size}"><path fill-rule="evenodd" d="${path}"/></svg>`;
}

const ICONS = {
  commit: "M10.5 7.75a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm1.43.75a4.002 4.002 0 01-7.86 0H.75a.75.75 0 110-1.5h3.32a4.001 4.001 0 017.86 0h3.32a.75.75 0 110 1.5h-3.32z",
  pr: "M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zM11 2.5h-1V4h1a1 1 0 011 1v5.628a2.251 2.251 0 101.5 0V5A2.5 2.5 0 0011 2.5zm1 10.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.75 12a.75.75 0 100 1.5.75.75 0 000-1.5z",
  review: "M2.5 1.75a.25.25 0 01.25-.25h8.5a.25.25 0 01.25.25v7.736a.75.75 0 101.5 0V1.75A1.75 1.75 0 0011.25 0h-8.5A1.75 1.75 0 001 1.75v11.5c0 .966.784 1.75 1.75 1.75h3.17a.75.75 0 000-1.5H2.75a.25.25 0 01-.25-.25V1.75zM4.75 4a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5zM4 7.75A.75.75 0 014.75 7h2a.75.75 0 010 1.5h-2A.75.75 0 014 7.75zm11.774 3.537a.75.75 0 00-1.048-1.074L10.7 14.145 9.281 12.72a.75.75 0 00-1.062 1.058l1.943 1.95a.75.75 0 001.055.008l4.557-4.45z",
  issue: "M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z",
  star: "M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z",
  repo: "M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 010-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1h-8a1 1 0 00-1 1v6.708A2.486 2.486 0 014.5 9h8V1.5zm-3 2a.75.75 0 01.75.75v2a.75.75 0 01-1.5 0v-2a.75.75 0 01.75-.75z",
  org: "M1.75 16A1.75 1.75 0 010 14.25V1.75C0 .784.784 0 1.75 0h8.5C11.216 0 12 .784 12 1.75v12.5c0 .085-.006.168-.018.25h2.268a.25.25 0 00.25-.25V8.285a.25.25 0 00-.111-.208l-1.055-.703a.75.75 0 11.832-1.248l1.055.703c.487.325.779.871.779 1.456v5.965A1.75 1.75 0 0114.25 16h-3.5a.75.75 0 01-.197-.026c-.099.017-.2.026-.303.026h-3a.75.75 0 01-.75-.75V14h-1v1.25a.75.75 0 01-.75.75h-3zM3 3.75A.75.75 0 013.75 3h.5a.75.75 0 010 1.5h-.5A.75.75 0 013 3.75zM3.75 6a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5zM3 9.75A.75.75 0 013.75 9h.5a.75.75 0 010 1.5h-.5A.75.75 0 013 9.75zM7.75 9a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5zM7 6.75A.75.75 0 017.75 6h.5a.75.75 0 010 1.5h-.5A.75.75 0 017 6.75zM7.75 3a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5z",
  clock: "M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zm.5 4.75a.75.75 0 00-1.5 0v3.5a.75.75 0 00.471.696l2.5 1a.75.75 0 00.557-1.392L8.5 7.742V4.75z",
  copilot: "M7.53 1.282a.5.5 0 01.94 0l1.478 4.007a.5.5 0 00.312.312l4.007 1.478a.5.5 0 010 .94l-4.007 1.478a.5.5 0 00-.312.312L8.47 14.816a.5.5 0 01-.94 0L6.052 10.81a.5.5 0 00-.312-.312L1.733 9.019a.5.5 0 010-.94L5.74 6.601a.5.5 0 00.312-.312z",
  contrib: "M1 2.5A2.5 2.5 0 013.5 0h8.75a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V1.5h-8a1 1 0 00-1 1v6.708A2.492 2.492 0 013.5 9h3.25a.75.75 0 010 1.5H3.5a1 1 0 100 2h5.75a.75.75 0 010 1.5H3.5A2.5 2.5 0 011 11.5v-9zm13.23 7.79a.75.75 0 001.06-1.06l-2.505-2.505a.75.75 0 00-1.06 0L9.22 9.229a.75.75 0 001.06 1.061l1.225-1.224v6.184a.75.75 0 001.5 0V9.066l1.224 1.224z",
};

// ─── Overview SVG (merged with Activity) ─────────────────────────────
function generateOverviewSVG(theme) {
  const { profile, activity, repoStats, copilot } = data;
  const comments = activity.prComments + activity.issueComments;

  const stats = [
    { icon: "commit", label: "Commits", value: fmtNum(activity.totalCommits) },
    { icon: "pr", label: "PRs authored", value: fmtNum(activity.prs) },
    { icon: "review", label: "Reviews", value: fmtNum(activity.reviews) },
    { icon: "issue", label: "Issues", value: fmtNum(activity.issues) },
    { icon: "star", label: "Stars", value: fmtNum(repoStats.stars) },
    { icon: "repo", label: "Repos", value: fmtNum(repoStats.total) },
  ];

  const aiStats = [
    { icon: "copilot", label: "Premium requests", value: fmtNum(copilot.premiumRequests || 0), bold: true },
    { icon: "copilot", label: "Copilot mentions", value: String(copilot.copilotMentions || 0) },
    { icon: "commit", label: "Co-authored", value: String(copilot.coauthoredCommits || 0) },
    { icon: "commit", label: "Comments", value: fmtNum(comments) },
  ];

  const body = `
    <h2 class="anim">${iconSVG(ICONS.contrib, 16)} ${esc(profile.login)}</h2>
    <div style="display:flex;gap:16px;">
      <div style="flex:1;">
        ${stats.map((s, i) => `
          <div class="stat anim anim-d${Math.min(i + 1, 6)}">
            ${iconSVG(ICONS[s.icon], 14)}
            <strong>${s.value}</strong> ${s.label}
          </div>
        `).join("")}
        <div style="margin-top:6px;padding-top:6px;border-top:1px solid var(--border);">
          <div class="stat anim anim-d4">${iconSVG(ICONS.clock, 14)} Joined ${profile.joinedYearsAgo}+ years ago</div>
          <div class="stat anim anim-d5">${iconSVG(ICONS.org, 14)} ${profile.organizations} organizations</div>
          <div class="stat anim anim-d6">${iconSVG(ICONS.contrib, 14)} ${activity.contributedTo} contributed to</div>
        </div>
      </div>
      <div style="flex:0 0 auto;padding-left:16px;border-left:1px solid var(--border);">
        <div class="section-label anim">AI Collaboration</div>
        ${aiStats.map((s, i) => `
          <div class="stat anim anim-d${Math.min(i + 1, 6)}">
            ${iconSVG(ICONS[s.icon], 14)}
            <strong>${s.value}</strong> ${s.label}
          </div>
        `).join("")}
      </div>
    </div>
  `;

  return wrapSVG(260, body, theme);
}

// ─── Languages & Tech Stack SVG ──────────────────────────────────────
function generateLanguagesSVG(theme) {
  const langs = data.overallLanguages.slice(0, 8);
  const totalBytes = langs.reduce((s, l) => s + l.bytes, 0);

  const barSegments = langs.map(l => {
    const pct = l.bytes / totalBytes * 100;
    return `<span style="width:${pct}%;background:${l.color};"></span>`;
  }).join("");

  const legend = langs.map(l => {
    const pct = (l.bytes / totalBytes * 100).toFixed(1);
    return `<span><span class="dot" style="background:${l.color};"></span>${esc(l.name)} ${pct}%</span>`;
  }).join(" ");

  const trends = data.languageTrends;
  const allTrendLangs = new Set();
  trends.forEach(t => t.languages.slice(0, 5).forEach(l => allTrendLangs.add(l.name)));
  const trendLangList = [...allTrendLangs].slice(0, 5);

  const trendHeight = 60;
  const trendWidth = 420;

  function trendPath(langName) {
    const points = trends.map((t, i) => {
      const lang = t.languages.find(l => l.name === langName);
      const pct = lang ? lang.pct : 0;
      const x = (i / (trends.length - 1)) * trendWidth;
      const y = trendHeight - (pct / 100) * trendHeight;
      return `${x},${y}`;
    });
    return points.join(" ");
  }

  const langColor = (name) => {
    const found = data.overallLanguages.find(l => l.name === name);
    return found?.color || "#888";
  };

  const trendLines = trendLangList.map(name => {
    const pts = trendPath(name);
    return `<polyline points="${pts}" fill="none" stroke="${langColor(name)}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>`;
  }).join("");

  const xLabels = trends.map((t, i) => {
    const x = (i / (trends.length - 1)) * trendWidth;
    return `<text x="${x}" y="${trendHeight + 12}" fill="var(--muted)" font-size="10" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,sans-serif">${t.period.split(" ~ ")[0].slice(0, 4)}</text>`;
  }).join("");

  const trendLegend = trendLangList.map(name =>
    `<span><span class="dot" style="background:${langColor(name)};"></span>${esc(name)}</span>`
  ).join(" ");

  // ── Tech Stack ──
  const langMap = {};
  (data.overallLanguages || []).forEach(l => { langMap[l.name] = true; });

  const iconMap = {
    'Ruby':       { label: 'Ruby', cat: 'Languages', color: '#CC342D' },
    'Python':     { label: 'Python', cat: 'Languages', color: '#3572A5' },
    'Go':         { label: 'Go', cat: 'Languages', color: '#00ADD8' },
    'TypeScript': { label: 'TypeScript', cat: 'Languages', color: '#3178C6' },
    'JavaScript': { label: 'JavaScript', cat: 'Languages', color: '#F1E05A' },
    'Rust':       { label: 'Rust', cat: 'Languages', color: '#DEA584' },
    'C++':        { label: 'C++', cat: 'Languages', color: '#F34B7D' },
    'Java':       { label: 'Java', cat: 'Languages', color: '#B07219' },
    'C':          { label: 'C', cat: 'Languages', color: '#555555' },
    'C#':         { label: 'C#', cat: 'Languages', color: '#178600' },
    'PHP':        { label: 'PHP', cat: 'Languages', color: '#4F5D95' },
    'Swift':      { label: 'Swift', cat: 'Languages', color: '#F05138' },
    'Svelte':     { label: 'Svelte', cat: 'Frameworks', color: '#FF3E00' },
    'Vue':        { label: 'Vue', cat: 'Frameworks', color: '#41B883' },
    'HCL':        { label: 'Terraform', cat: 'DevOps', color: '#7B42BC' },
    'Dockerfile': { label: 'Docker', cat: 'DevOps', color: '#2496ED' },
    'Shell':      { label: 'Shell', cat: 'Tools', color: '#89E051' },
  };

  const extraTools = [
    { label: 'Rails', cat: 'Frameworks', color: '#CC0000' },
    { label: 'AWS', cat: 'DevOps', color: '#FF9900' },
    { label: 'GitHub', cat: 'Tools', color: '#8b949e' },
    { label: 'PostgreSQL', cat: 'Tools', color: '#336791' },
    { label: 'Linux', cat: 'Tools', color: '#FCC624' },
  ];

  const allTools = [];
  Object.entries(iconMap).forEach(([lang, info]) => {
    if (langMap[lang]) allTools.push(info);
  });
  extraTools.forEach(t => allTools.push(t));

  const categories = {};
  allTools.forEach(t => {
    if (!categories[t.cat]) categories[t.cat] = [];
    categories[t.cat].push(t);
  });

  const stackSections = Object.entries(categories).map(([cat, tools]) => {
    const badges = tools.map(t =>
      `<span style="display:inline-flex;align-items:center;gap:3px;padding:2px 7px;border:1px solid var(--border);border-radius:10px;font-size:10px;color:var(--text);background:var(--bg);white-space:nowrap;"><span style="width:6px;height:6px;border-radius:50%;background:${t.color};flex-shrink:0;"></span>${esc(t.label)}</span>`
    ).join("");
    return `
      <div style="margin-bottom:6px;">
        <div style="font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--muted);margin-bottom:4px;">${esc(cat)}</div>
        <div style="display:flex;flex-wrap:wrap;gap:4px;">${badges}</div>
      </div>
    `;
  }).join("");

  const body = `
    <h2 class="anim">${iconSVG(ICONS.repo, 16)} Languages &amp; Tech Stack</h2>
    <div class="lang-bar anim anim-d1">${barSegments}</div>
    <div class="lang-legend anim anim-d2">${legend}</div>
    <div style="margin-top:14px;padding-top:10px;border-top:1px solid var(--border);" class="anim anim-d3">
      <div style="font-size:11px;color:var(--muted);margin-bottom:8px;">Skill Stack</div>
      ${stackSections}
    </div>
  `;

  return wrapSVG(310, body, theme);
}

// ─── Activity SVG ────────────────────────────────────────────────────
function generateActivitySVG(theme) {
  const { activity, copilot, profile, repoStats } = data;

  const stats = [
    { icon: "commit", label: "Commits", value: fmtNum(activity.totalCommits) },
    { icon: "pr", label: "PRs authored", value: fmtNum(activity.prs) },
    { icon: "review", label: "Reviews", value: fmtNum(activity.reviews) },
    { icon: "issue", label: "Issues", value: fmtNum(activity.issues) },
    { icon: "star", label: "Stars", value: fmtNum(repoStats.stars) },
    { icon: "repo", label: "Repos", value: fmtNum(repoStats.total) },
  ];

  const meta = [
    { icon: "clock", label: `Joined ${profile.joinedYearsAgo}+ years ago` },
    { icon: "org", label: `${profile.organizations} organizations` },
    { icon: "contrib", label: `${activity.contributedTo} contributed to` },
  ];

  const body = `
    <h2 class="anim">${iconSVG(ICONS.pr, 16)} Activity</h2>
    <div class="row" style="margin-bottom: 10px;">
      <div style="flex: 1;">
        ${stats.map((s, i) => `
          <div class="stat anim anim-d${i + 1}">
            ${iconSVG(ICONS[s.icon], 14)}
            <strong>${s.value}</strong> ${s.label}
          </div>
        `).join("")}
      </div>
      <div style="flex: 1;">
        ${meta.map((m, i) => `
          <div class="stat anim anim-d${i + 1}">
            ${iconSVG(ICONS[m.icon], 14)} ${m.label}
          </div>
        `).join("")}
        <div style="margin-top:6px;padding-top:6px;border-top:1px solid var(--border);">
          <div class="stat anim anim-d4">${iconSVG(ICONS.copilot, 14)} <strong>${copilot.copilotMentions}</strong> Copilot commits</div>
          <div class="stat anim anim-d5">${iconSVG(ICONS.commit, 14)} <strong>${copilot.coauthoredCommits}</strong> Co-authored</div>
          <div class="stat anim anim-d6">${iconSVG(ICONS.commit, 14)} <strong>${activity.issueComments + activity.prComments}</strong> Comments</div>
        </div>
      </div>
    </div>
  `;

  return wrapSVG(230, body, theme);
}

// ─── Copilot SVG ─────────────────────────────────────────────────────
function generateCopilotSVG(theme) {
  const { copilot, activity } = data;
  const mentions = copilot.copilotMentions || 0;
  const coauthored = copilot.coauthoredCommits || 0;
  const premium = copilot.premiumRequests || 0;
  const total = activity.totalCommits || 1;
  const aiPct = ((coauthored / total) * 100).toFixed(2);

  const outerR = 30;
  const innerR = 22;
  const outerC = 2 * Math.PI * outerR;
  const innerC = 2 * Math.PI * innerR;
  const outerPct = Math.min((mentions / total) * 100 * 20, 100);
  const innerPct = Math.min((premium / 1000) * 100, 100);

  const body = `
    <h2 class="anim">${iconSVG(ICONS.copilot, 16)} AI Collaboration</h2>
    <div style="display:flex;align-items:center;gap:20px;">
      <div style="position:relative;width:80px;height:80px;flex-shrink:0;" class="anim anim-d1">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
          <circle cx="40" cy="40" r="${outerR}" fill="none" stroke="var(--bar-bg)" stroke-width="4"/>
          <circle cx="40" cy="40" r="${outerR}" fill="none" stroke="var(--sub, #8957e5)" stroke-width="4"
            stroke-linecap="round" stroke-dasharray="${outerC.toFixed(1)}"
            stroke-dashoffset="${(outerC * (1 - outerPct / 100)).toFixed(1)}"
            transform="rotate(-90 40 40)"/>
          <circle cx="40" cy="40" r="${innerR}" fill="none" stroke="var(--bar-bg)" stroke-width="3"/>
          <circle cx="40" cy="40" r="${innerR}" fill="none" stroke="var(--accent, #58a6ff)" stroke-width="3"
            stroke-linecap="round" stroke-dasharray="${innerC.toFixed(1)}"
            stroke-dashoffset="${(innerC * (1 - innerPct / 100)).toFixed(1)}"
            transform="rotate(-90 40 40)"/>
          <text x="40" y="36" text-anchor="middle" fill="var(--text)" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="13" font-weight="600">${fmtNum(premium)}</text>
          <text x="40" y="48" text-anchor="middle" fill="var(--muted)" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="7">premium</text>
        </svg>
      </div>
      <div style="flex:1;">
        <div class="stat anim anim-d1">${iconSVG(ICONS.copilot, 14)} <strong>${fmtNum(premium)}</strong> Premium requests</div>
        <div class="stat anim anim-d2">${iconSVG(ICONS.copilot, 14)} <strong>${mentions}</strong> Copilot mentions</div>
        <div class="stat anim anim-d3">${iconSVG(ICONS.commit, 14)} <strong>${coauthored}</strong> Co-authored commits</div>
        <div class="stat anim anim-d4">${iconSVG(ICONS.commit, 14)} <strong>${aiPct}%</strong> AI collaboration rate</div>
      </div>
    </div>
    <div class="anim anim-d5" style="margin-top:10px;font-size:10px;color:var(--muted);padding:6px 10px;background:var(--bar-bg);border-radius:4px;">
      <strong style="color:var(--text);">GitHub Copilot</strong> — account: <strong style="color:var(--text);">marronee</strong> · Chat, completions, co-authoring
    </div>
  `;

  return wrapSVG(200, body, theme);
}

// ─── Repos SVG ───────────────────────────────────────────────────────
function generateReposSVG(theme) {
  const { pinnedRepos } = data;
  if (!pinnedRepos || pinnedRepos.length === 0) return "";

  const repos = pinnedRepos.slice(0, 4);

  const repoCards = repos.map((r, i) => {
    const desc = esc(r.aiDescription || r.description || "");
    const lang = r.primaryLanguage;
    const langDot = lang ? `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${lang.color};margin-right:3px;vertical-align:middle;"></span><span style="font-size:10px;color:var(--muted);">${esc(lang.name)}</span>` : "";
    const stars = r.stars > 0 ? `<span style="font-size:10px;color:var(--muted);margin-left:8px;">${iconSVG(ICONS.star, 10)} ${r.stars}</span>` : "";

    return `
      <div style="flex:1;min-width:200px;padding:10px 12px;border:1px solid var(--border);border-radius:6px;" class="anim anim-d${i + 1}">
        <div style="font-size:12px;font-weight:600;color:var(--accent);margin-bottom:4px;">${iconSVG(ICONS.repo, 12)} ${esc(r.name)}</div>
        ${desc ? `<div style="font-size:10px;color:var(--muted);margin-bottom:6px;line-height:1.4;">${desc}</div>` : ""}
        <div style="display:flex;align-items:center;">${langDot}${stars}</div>
      </div>
    `;
  }).join("");

  const body = `
    <h2 class="anim">${iconSVG(ICONS.repo, 16)} Featured Projects</h2>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      ${repoCards}
    </div>
  `;

  const rows = Math.ceil(repos.length / 2);
  const height = 80 + rows * 90;
  return wrapSVG(height, body, theme);
}

// ─── Generate all ────────────────────────────────────────────────────

function aggregateMonthly() {
  const yearly = data.yearlyContributions || [];
  const mm = {};
  yearly.forEach(y => {
    let yc = 0;
    const ym = {};
    (y.calendar || []).forEach(d => {
      const k = d.date.slice(0, 7);
      ym[k] = (ym[k] || 0) + (d.count || 0);
      yc += d.count || 0;
    });
    const fr = new Date(y.from), to = new Date(y.to);
    const tm = (to.getFullYear() - fr.getFullYear()) * 12 + (to.getMonth() - fr.getMonth()) + 1;
    for (let d = new Date(fr); d <= to; d.setMonth(d.getMonth() + 1)) {
      const k = d.toISOString().slice(0, 7);
      if (!mm[k]) mm[k] = { c: 0, p: 0, r: 0 };
      const mc = ym[k] || 0;
      mm[k].c += mc;
      const ratio = yc > 0 ? mc / yc : 1 / tm;
      mm[k].p += (y.stats.prs || 0) * ratio;
      mm[k].r += (y.stats.reviews || 0) * ratio;
    }
  });
  const sorted = Object.keys(mm).sort();
  return { labels: sorted, commits: sorted.map(m => mm[m].c), prs: sorted.map(m => Math.round(mm[m].p)), reviews: sorted.map(m => Math.round(mm[m].r)) };
}

function interpolateLangMonthly() {
  const trends = data.languageTrends || [];
  const ltTot = {}, ltCol = {};
  trends.forEach(t => t.languages.forEach(l => {
    ltTot[l.name] = (ltTot[l.name] || 0) + l.score;
    ltCol[l.name] = l.color;
  }));
  const topL = Object.entries(ltTot).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const rows = [];
  for (let i = 0; i < trends.length; i++) {
    const s = new Date(trends[i].from);
    const e = i + 1 < trends.length ? new Date(trends[i + 1].from) : new Date(trends[i].to);
    const cur = trends[i], nxt = i + 1 < trends.length ? trends[i + 1] : null;
    for (let d = new Date(s); d < e; d.setMonth(d.getMonth() + 1)) {
      const tM = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
      const el = (d.getFullYear() - s.getFullYear()) * 12 + (d.getMonth() - s.getMonth());
      const t = tM > 0 ? el / tM : 0;
      const sc = {};
      topL.forEach(([n]) => {
        const cv = (cur.languages.find(l => l.name === n) || {}).score || 0;
        const nv = nxt ? ((nxt.languages.find(l => l.name === n) || {}).score || 0) : cv;
        sc[n] = cv + (nv - cv) * t;
      });
      rows.push({ month: d.toISOString().slice(0, 7), scores: sc });
    }
  }
  return {
    labels: rows.map(r => r.month),
    datasets: topL.map(([name]) => ({
      name, color: ltCol[name] || '#888',
      vals: rows.map(r => +(r.scores[name] || 0).toFixed(1))
    }))
  };
}

function smoothPath(pts, t = 0.4) {
  if (pts.length < 2) return '';
  const fx = v => v.toFixed(1);
  let d = `M${fx(pts[0][0])},${fx(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [a, b, c, e] = [pts[Math.max(0, i - 1)], pts[i], pts[i + 1], pts[Math.min(pts.length - 1, i + 2)]];
    d += ` C${fx(b[0] + (c[0] - a[0]) * t / 3)},${fx(b[1] + (c[1] - a[1]) * t / 3)} ${fx(c[0] - (e[0] - b[0]) * t / 3)},${fx(c[1] - (e[1] - b[1]) * t / 3)} ${fx(c[0])},${fx(c[1])}`;
  }
  return d;
}

function ceilNice(v) {
  if (v <= 0) return 1;
  const target = v * 1.1;
  const exp = Math.pow(10, Math.floor(Math.log10(target)));
  return Math.ceil(target / exp) * exp;
}

// ─── Combined Charts SVG ─────────────────────────────────────────────
async function generateChartsSVG(theme) {
  const W = 840, PAD_L = 25, PAD_R = 10, PAD_T = 5, PAD_B = 5;
  const H = 660;
  const fx = v => v.toFixed(1);

  const monthly = aggregateMonthly();
  const { labels: mLabels, commits: mC, prs: mP, reviews: mR } = monthly;

  const rLabels = ["Commits", "PRs", "Reviews", "Issues", "Comments"];
  const rRaw = [data.activity.totalCommits, data.activity.prs, data.activity.reviews,
    data.activity.issues, data.activity.prComments + data.activity.issueComments];
  const rNorm = rRaw.map(v => Math.log10(v + 1) / 4);

  const lang = interpolateLangMonthly();
  const distLangs = (data.overallLanguages || []).slice(0, 7);
  const totalBytes = distLangs.reduce((s, l) => s + l.bytes, 0);

  // ── Radar ──
  const rcx = 148, rcy = 158, rr = 92, N = 5;
  const rAngle = i => -Math.PI / 2 + (2 * Math.PI * i) / N;
  const rPt = (i, r) => [rcx + r * Math.cos(rAngle(i)), rcy + r * Math.sin(rAngle(i))];

  let radar = '';
  for (let lv = 1; lv <= 4; lv++) {
    const pts = Array.from({ length: N }, (_, i) => rPt(i, (lv / 4) * rr).map(fx).join(',')).join(' ');
    radar += `<polygon points="${pts}" fill="none" stroke="var(--grid)" stroke-width="0.7"/>\n`;
  }
  for (let i = 0; i < N; i++) {
    const [x, y] = rPt(i, rr);
    radar += `<line x1="${rcx}" y1="${rcy}" x2="${fx(x)}" y2="${fx(y)}" stroke="var(--grid)" stroke-width="0.7"/>\n`;
  }
  const dPts = rNorm.map((v, i) => rPt(i, v * rr));
  radar += `<polygon points="${dPts.map(p => p.map(fx).join(',')).join(' ')}" fill="var(--accent-fill)" stroke="var(--accent)" stroke-width="1.5" stroke-linejoin="round"/>\n`;
  dPts.forEach(p => { radar += `<circle cx="${fx(p[0])}" cy="${fx(p[1])}" r="3" fill="var(--accent)"/>\n`; });

  const lCfg = [
    { dx: 0, dy: -16, a: 'middle' }, { dx: 10, dy: 0, a: 'start' },
    { dx: 8, dy: 14, a: 'start' }, { dx: -8, dy: 14, a: 'end' }, { dx: -10, dy: 0, a: 'end' },
  ];
  rLabels.forEach((lab, i) => {
    const [x, y] = rPt(i, rr + 14);
    const c = lCfg[i];
    radar += `<text x="${fx(x + c.dx)}" y="${fx(y + c.dy)}" text-anchor="${c.a}" style="fill:var(--muted);font-size:10px">${lab}</text>\n`;
    radar += `<text x="${fx(x + c.dx)}" y="${fx(y + c.dy + 13)}" text-anchor="${c.a}" style="fill:var(--text);font-size:11px;font-weight:600">${rRaw[i].toLocaleString()}</text>\n`;
  });
  ['10', '100', '1k'].forEach((lab, i) => {
    radar += `<text x="${rcx + 3}" y="${fx(rcy - ((i + 1) / 4) * rr - 2)}" style="fill:var(--dim);font-size:7px">${lab}</text>\n`;
  });

  // ── Monthly Chart ──
  const mcL = 345, mcR = 795, mcT = 44, mcB = 222;
  const mcW = mcR - mcL, mcH = mcB - mcT;
  const cMax = ceilNice(Math.max(...mC));
  const pMax = ceilNice(Math.max(...mP, ...mR));
  const xS = i => mcL + (i / (mLabels.length - 1)) * mcW;
  const yC = v => mcB - (v / cMax) * mcH;
  const yP = v => mcB - (v / pMax) * mcH;

  const cPts = mC.map((v, i) => [xS(i), yC(v)]);
  const pPts = mP.map((v, i) => [xS(i), yP(v)]);
  const rvPts = mR.map((v, i) => [xS(i), yP(v)]);
  const cLine = smoothPath(cPts, 0.35);
  const pLine = smoothPath(pPts, 0.35);
  const rvLine = smoothPath(rvPts, 0.35);
  const cArea = cLine + ` L${mcR},${mcB} L${mcL},${mcB} Z`;

  let mc = '';
  for (let i = 0; i <= 4; i++) {
    const v = (cMax * i) / 4, y = yC(v);
    mc += `<line x1="${mcL}" y1="${fx(y)}" x2="${mcR}" y2="${fx(y)}" stroke="var(--grid)" stroke-width="0.5"/>\n`;
    mc += `<text x="${mcL - 6}" y="${fx(y + 3)}" text-anchor="end" style="fill:var(--matcha);font-size:8px">${Math.round(v)}</text>\n`;
  }
  for (let i = 0; i <= 2; i++) {
    const v = (pMax * i) / 2, y = yP(v);
    mc += `<text x="${mcR + 5}" y="${fx(y + 3)}" text-anchor="start" style="fill:var(--sora);font-size:8px">${Math.round(v)}</text>\n`;
  }
  mc += `<path d="${cArea}" fill="var(--matcha-fill)"/>\n`;
  mc += `<path d="${cLine}" fill="none" stroke="var(--matcha)" stroke-width="1.5"/>\n`;
  mc += `<path d="${pLine}" fill="none" stroke="var(--sora)" stroke-width="1.5" stroke-dasharray="4,2"/>\n`;
  mc += `<path d="${rvLine}" fill="none" stroke="var(--fuji)" stroke-width="1.5" stroke-dasharray="2,2"/>\n`;
  mLabels.forEach((m, i) => {
    if (i % 6 === 0) mc += `<text x="${fx(xS(i))}" y="${mcB + 14}" text-anchor="middle" style="fill:var(--muted);font-size:8px">${m.slice(2)}</text>\n`;
  });
  const mlY = mcB + 30;
  mc += `<text x="${mcL - 6}" y="38" text-anchor="end" style="fill:var(--matcha);font-size:8px">Commits</text>\n`;
  mc += `<text x="${mcR}" y="38" text-anchor="end" style="fill:var(--sora);font-size:8px">PRs / Reviews</text>\n`;
  mc += `<line x1="${mcL}" y1="${mlY}" x2="${mcL + 14}" y2="${mlY}" stroke="var(--matcha)" stroke-width="2"/><text x="${mcL + 18}" y="${mlY + 3}" style="fill:var(--muted);font-size:9px">Commits</text>\n`;
  mc += `<line x1="${mcL + 80}" y1="${mlY}" x2="${mcL + 94}" y2="${mlY}" stroke="var(--sora)" stroke-width="1.5" stroke-dasharray="4,2"/><text x="${mcL + 98}" y="${mlY + 3}" style="fill:var(--muted);font-size:9px">PRs</text>\n`;
  mc += `<line x1="${mcL + 128}" y1="${mlY}" x2="${mcL + 142}" y2="${mlY}" stroke="var(--fuji)" stroke-width="1.5" stroke-dasharray="2,2"/><text x="${mcL + 146}" y="${mlY + 3}" style="fill:var(--muted);font-size:9px">Reviews</text>\n`;

  // ── Language Distribution Bar ──
  const bY = 306, bH = 6, bW = 788;
  let bX = 26;
  let dist = `<clipPath id="bc"><rect x="26" y="${bY}" width="${bW}" height="${bH}" rx="3"/></clipPath>\n<g clip-path="url(#bc)">\n`;
  distLangs.forEach(l => {
    const w = (l.bytes / totalBytes) * bW;
    dist += `<rect x="${fx(bX)}" y="${bY}" width="${fx(w)}" height="${bH}" fill="${l.color}"/>\n`;
    bX += w;
  });
  dist += `</g>\n`;
  let dlX = 26;
  distLangs.forEach(l => {
    const pct = ((l.bytes / totalBytes) * 100).toFixed(1);
    const label = `${l.name} ${pct}%`;
    dist += `<circle cx="${dlX}" cy="${bY + 16}" r="3" fill="${l.color}"/>\n`;
    dist += `<text x="${dlX + 7}" y="${bY + 19}" style="fill:var(--muted);font-size:8px">${esc(label)}</text>\n`;
    dlX += label.length * 5.6 + 16;
  });

  // ── Language Evolution Chart ──
  const leL = 56, leR = 812, leT = 340, leB = 438;
  const leW = leR - leL, leH = leB - leT;
  const maxS = ceilNice(Math.max(...lang.datasets.flatMap(d => d.vals), 1));
  const lxS = i => leL + (i / Math.max(1, lang.labels.length - 1)) * leW;
  const lyS = v => leB - (v / maxS) * leH;

  let le = '';
  for (let i = 0; i <= 3; i++) {
    const v = (maxS * i) / 3, y = lyS(v);
    le += `<line x1="${leL}" y1="${fx(y)}" x2="${leR}" y2="${fx(y)}" stroke="var(--grid)" stroke-width="0.5"/>\n`;
    le += `<text x="${leL - 6}" y="${fx(y + 3)}" text-anchor="end" style="fill:var(--dim);font-size:7px">${Math.round(v)}</text>\n`;
  }
  lang.datasets.forEach(ds => {
    const pts = ds.vals.map((v, i) => [lxS(i), lyS(v)]);
    le += `<path d="${smoothPath(pts, 0.35)}" fill="none" stroke="${ds.color}" stroke-width="1.5" opacity="0.85"/>\n`;
  });
  lang.labels.forEach((m, i) => {
    if (i % 4 === 0) le += `<text x="${fx(lxS(i))}" y="${leB + 14}" text-anchor="middle" style="fill:var(--muted);font-size:8px">${m.slice(2)}</text>\n`;
  });
  let llX = leL;
  const llY = leB + 28;
  lang.datasets.forEach(ds => {
    le += `<circle cx="${llX}" cy="${llY}" r="3" fill="${ds.color}"/>\n`;
    le += `<text x="${llX + 7}" y="${llY + 3}" style="fill:var(--muted);font-size:9px">${esc(ds.name)}</text>\n`;
    llX += ds.name.length * 6 + 22;
  });

  // ── Skill Stack (skillicons.dev) ──
  const skillIconMap = {
    'TypeScript': 'ts', 'JavaScript': 'js', 'Go': 'go', 'Python': 'py',
    'Ruby': 'ruby', 'C++': 'cpp', 'C': 'c', 'Rust': 'rust', 'Java': 'java',
    'Svelte': 'svelte', 'Vue': 'vue', 'Tauri': 'tauri', 'React': 'react',
    'Next.js': 'nextjs', 'Rails': 'rails',
    'Docker': 'docker', 'AWS': 'aws', 'Terraform': 'terraform',
    'Linux': 'linux', 'PostgreSQL': 'postgres',
    'Git': 'git', 'GitHub': 'github', 'VS Code': 'vscode',
    'LaTeX': 'latex', 'Bash': 'bash',
  };

  const skillCategories = [
    { label: 'LANGUAGES', items: ['TypeScript', 'JavaScript', 'Go', 'Python', 'Ruby', 'C++', 'C', 'Rust', 'Java'] },
    { label: 'FRAMEWORKS', items: ['Svelte', 'Vue', 'Tauri', 'React', 'Next.js', 'Rails'] },
    { label: 'INFRA', items: ['Docker', 'AWS', 'Terraform', 'Linux', 'PostgreSQL'] },
    { label: 'TOOLS', items: ['Git', 'GitHub', 'VS Code', 'LaTeX', 'Bash'] },
  ];

  const iconDataURIs = {};
  for (const cat of skillCategories) {
    const ids = cat.items.map(name => skillIconMap[name]).join(',');
    const url = `https://skillicons.dev/icons?i=${ids}&theme=${theme}`;
    try {
      const res = await fetch(url);
      const svgText = await res.text();
      iconDataURIs[cat.label] = `data:image/svg+xml;base64,${Buffer.from(svgText).toString('base64')}`;
    } catch {
      iconDataURIs[cat.label] = null;
    }
  }

  const skY0 = 478;
  const iconH = 36;
  const rowGap = 6;
  let sk = '';
  sk += `<line x1="26" y1="${skY0}" x2="${mcR}" y2="${skY0}" stroke="var(--grid)" stroke-width="0.5"/>\n`;
  sk += `<text x="26" y="${skY0 + 16}" style="fill:var(--accent);font-size:9px;font-weight:700;letter-spacing:1.5px">SKILL STACK</text>\n`;

  let rowY = skY0 + 26;
  for (const cat of skillCategories) {
    sk += `<text x="26" y="${rowY + iconH / 2 + 3}" style="fill:var(--dim);font-size:7px;font-weight:700;letter-spacing:1px">${cat.label}</text>\n`;
    const dataURI = iconDataURIs[cat.label];
    if (dataURI) {
      const iconW = cat.items.length * (iconH + 12);
      sk += `<image x="105" y="${rowY}" width="${iconW}" height="${iconH}" href="${dataURI}"/>\n`;
    }
    rowY += iconH + rowGap;
  }

  const chartCSS = theme === 'light'
    ? 'svg{--text:#24292f;--muted:#656d76;--dim:#8b949e;--grid:rgba(101,109,118,0.15);--accent:#0969da;--accent-fill:rgba(9,105,218,0.10);--matcha:#1a7f37;--matcha-fill:rgba(26,127,55,0.08);--sora:#0969da;--fuji:#8250df}'
    : 'svg{--text:#e6edf3;--muted:#8b949e;--dim:#656d76;--grid:rgba(139,148,158,0.15);--accent:#58a6ff;--accent-fill:rgba(88,166,255,0.12);--matcha:#3fb950;--matcha-fill:rgba(63,185,80,0.10);--sora:#58a6ff;--fuji:#bc8cff}';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="${-PAD_L} ${-PAD_T} ${W + PAD_L + PAD_R} ${H + PAD_T + PAD_B}">
<defs>
<style>
${chartCSS}
text{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif}
</style>
</defs>
<text x="26" y="20" style="fill:var(--accent);font-size:9px;font-weight:700;letter-spacing:1.5px">ACTIVITY</text>
<text x="310" y="20" style="fill:var(--accent);font-size:9px;font-weight:700;letter-spacing:1.5px">MONTHLY CONTRIBUTIONS</text>
<text x="26" y="294" style="fill:var(--accent);font-size:9px;font-weight:700;letter-spacing:1.5px">LANGUAGES</text>
<line x1="26" y1="276" x2="812" y2="276" stroke="var(--grid)" stroke-width="0.5"/>
<g>
${radar}</g>
<g>
${mc}</g>
<g>
${dist}</g>
<g>
${le}</g>
<g>
${sk}</g>
</svg>`;
}

console.log("Generating SVG cards...");

for (const theme of ['dark', 'light']) {
  console.log(`  theme: ${theme}`);

  writeFileSync(join(SVG_DIR, `overview-${theme}.svg`), generateOverviewSVG(theme));
  console.log(`    overview-${theme}.svg`);

  writeFileSync(join(SVG_DIR, `languages-${theme}.svg`), generateLanguagesSVG(theme));
  console.log(`    languages-${theme}.svg`);

  writeFileSync(join(SVG_DIR, `activity-${theme}.svg`), generateActivitySVG(theme));
  console.log(`    activity-${theme}.svg`);

  writeFileSync(join(SVG_DIR, `copilot-${theme}.svg`), generateCopilotSVG(theme));
  console.log(`    copilot-${theme}.svg`);

  writeFileSync(join(SVG_DIR, `repos-${theme}.svg`), generateReposSVG(theme));
  console.log(`    repos-${theme}.svg`);

  writeFileSync(join(SVG_DIR, `charts-${theme}.svg`), await generateChartsSVG(theme));
  console.log(`    charts-${theme}.svg`);
}

console.log("Done.");
