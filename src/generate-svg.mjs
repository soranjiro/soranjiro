import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const data = JSON.parse(readFileSync(join(ROOT, "output/data.json"), "utf-8"));

const SVG_W = 480;

function esc(s) {
  return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function fmtNum(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return String(n);
}

function themeCSS() {
  return `
    .light { --bg: #ffffff; --card: #f6f8fa; --text: #24292f; --muted: #656d76; --accent: #0969da; --border: #d0d7de; --bar-bg: #eaeef2; }
    .dark { --bg: #0d1117; --card: #161b22; --text: #e6edf3; --muted: #8b949e; --accent: #58a6ff; --border: #30363d; --bar-bg: #21262d; }
    @media (prefers-color-scheme: light) {
      .auto { --bg: #ffffff; --card: #f6f8fa; --text: #24292f; --muted: #656d76; --accent: #0969da; --border: #d0d7de; --bar-bg: #eaeef2; }
    }
    @media (prefers-color-scheme: dark) {
      .auto { --bg: #0d1117; --card: #161b22; --text: #e6edf3; --muted: #8b949e; --accent: #58a6ff; --border: #30363d; --bar-bg: #21262d; }
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; font-size: 13px; color: var(--text); background: var(--bg); }
    .card { background: var(--card); border: 1px solid var(--border); border-radius: 6px; padding: 16px; }
    h2 { font-size: 14px; font-weight: 600; margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
    h2 svg { fill: var(--accent); flex-shrink: 0; }
    .row { display: flex; gap: 12px; flex-wrap: wrap; }
    .stat { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--muted); margin-bottom: 4px; }
    .stat svg { fill: var(--muted); flex-shrink: 0; }
    .stat strong { color: var(--text); font-weight: 600; }
    .lang-bar { display: flex; height: 8px; border-radius: 4px; overflow: hidden; margin: 8px 0; }
    .lang-bar span { display: block; height: 100%; }
    .lang-legend { display: flex; flex-wrap: wrap; gap: 4px 12px; font-size: 11px; color: var(--muted); }
    .lang-legend .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 3px; vertical-align: middle; }
    .mini-cal { display: flex; gap: 2px; flex-wrap: wrap; }
    .mini-cal .day { width: 10px; height: 10px; border-radius: 2px; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
    .anim { animation: fadeIn 0.4s ease both; }
    .anim-d1 { animation-delay: 0.05s; } .anim-d2 { animation-delay: 0.1s; } .anim-d3 { animation-delay: 0.15s; }
    .anim-d4 { animation-delay: 0.2s; } .anim-d5 { animation-delay: 0.25s; } .anim-d6 { animation-delay: 0.3s; }
  `;
}

function wrapSVG(height, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SVG_W}" height="${height}">
  <foreignObject x="0" y="0" width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml" class="auto">
      <style>${themeCSS()}</style>
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
  copilot: "M7.998 15.035c-4.405 0-7.998-3.592-7.998-8s3.593-8 7.998-8C12.407-.965 16 2.627 16 7.035s-3.593 8-8.002 8zM12.5 10c0-1.5-1-2.5-2.5-2.5S7.5 8.5 7.5 10h5zM5.5 6.5a1 1 0 100 2 1 1 0 000-2zm5 0a1 1 0 100 2 1 1 0 000-2z",
  contrib: "M1 2.5A2.5 2.5 0 013.5 0h8.75a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V1.5h-8a1 1 0 00-1 1v6.708A2.492 2.492 0 013.5 9h3.25a.75.75 0 010 1.5H3.5a1 1 0 100 2h5.75a.75.75 0 010 1.5H3.5A2.5 2.5 0 011 11.5v-9zm13.23 7.79a.75.75 0 001.06-1.06l-2.505-2.505a.75.75 0 00-1.06 0L9.22 9.229a.75.75 0 001.06 1.061l1.225-1.224v6.184a.75.75 0 001.5 0V9.066l1.224 1.224z",
};

// ─── Overview SVG ────────────────────────────────────────────────────
function generateOverviewSVG() {
  const { profile, activity, repoStats } = data;

  const last90 = data.allCalendar.slice(-91);
  const maxCount = Math.max(...last90.map(d => d.count), 1);

  const calColors = {
    light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
    dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
  };

  function dayColor(count, scheme) {
    const colors = calColors[scheme];
    if (count === 0) return colors[0];
    const level = Math.min(4, Math.ceil((count / maxCount) * 4));
    return colors[level];
  }

  const weeks = [];
  for (let i = 0; i < last90.length; i += 7) {
    weeks.push(last90.slice(i, i + 7));
  }

  function calendarGrid(scheme) {
    let rects = "";
    weeks.forEach((week, wi) => {
      week.forEach((day, di) => {
        const x = wi * 12;
        const y = di * 12;
        rects += `<rect x="${x}" y="${y}" width="10" height="10" rx="2" fill="${dayColor(day.count, scheme)}"><title>${day.date}: ${day.count}</title></rect>`;
      });
    });
    const w = weeks.length * 12;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="84">${rects}</svg>`;
  }

  const stats = [
    { icon: "commit", label: "Commits", value: fmtNum(activity.totalCommits) },
    { icon: "pr", label: "PRs", value: fmtNum(activity.prs) },
    { icon: "review", label: "Reviews", value: fmtNum(activity.reviews) },
    { icon: "issue", label: "Issues", value: fmtNum(activity.issues) },
    { icon: "star", label: "Stars", value: fmtNum(repoStats.stars) },
    { icon: "repo", label: "Repos", value: fmtNum(repoStats.total) },
  ];

  const body = `
    <h2 class="anim">${iconSVG(ICONS.contrib, 16)} ${esc(profile.login)}</h2>
    <div class="row" style="margin-bottom: 10px;">
      <div style="flex: 1;">
        ${stats.map((s, i) => `
          <div class="stat anim anim-d${i + 1}">
            ${iconSVG(ICONS[s.icon], 14)}
            <strong>${s.value}</strong> ${s.label}
          </div>
        `).join("")}
      </div>
      <div style="flex: 0 0 auto;">
        <div class="stat anim anim-d1">${iconSVG(ICONS.clock, 14)} Joined ${profile.joinedYearsAgo}+ years ago</div>
        <div class="stat anim anim-d2">${iconSVG(ICONS.org, 14)} ${profile.organizations} organizations</div>
        <div class="stat anim anim-d3">${iconSVG(ICONS.contrib, 14)} ${activity.contributedTo} contributed to</div>
      </div>
    </div>
    <div class="anim anim-d4" style="overflow-x:auto;">
      <div style="font-size:11px; color:var(--muted); margin-bottom:4px;">Last 90 days</div>
      <div class="light-only">${calendarGrid("light")}</div>
      <div class="dark-only">${calendarGrid("dark")}</div>
    </div>
  `;

  const css = `
    .light .dark-only { display: none; }
    .light .light-only { display: block; }
    .dark .light-only { display: none; }
    .dark .dark-only { display: block; }
    @media (prefers-color-scheme: light) {
      .auto .dark-only { display: none; }
      .auto .light-only { display: block; }
    }
    @media (prefers-color-scheme: dark) {
      .auto .light-only { display: none; }
      .auto .dark-only { display: block; }
    }
  `;

  const height = 240;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SVG_W}" height="${height}">
  <foreignObject x="0" y="0" width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml" class="auto">
      <style>${themeCSS()}${css}</style>
      <div class="card">${body}</div>
    </div>
  </foreignObject>
</svg>`;
}

// ─── Languages SVG ───────────────────────────────────────────────────
function generateLanguagesSVG() {
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
  const trendPadLeft = 0;

  function trendPath(langName) {
    const points = trends.map((t, i) => {
      const lang = t.languages.find(l => l.name === langName);
      const pct = lang ? lang.pct : 0;
      const x = trendPadLeft + (i / (trends.length - 1)) * trendWidth;
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
    const x = trendPadLeft + (i / (trends.length - 1)) * trendWidth;
    return `<text x="${x}" y="${trendHeight + 12}" fill="var(--muted)" font-size="10" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,sans-serif">${t.period.split(" ~ ")[0].slice(0, 4)}</text>`;
  }).join("");

  const trendLegend = trendLangList.map(name =>
    `<span><span class="dot" style="background:${langColor(name)};"></span>${esc(name)}</span>`
  ).join(" ");

  const body = `
    <h2 class="anim">${iconSVG(ICONS.repo, 16)} Languages</h2>
    <div class="lang-bar anim anim-d1">${barSegments}</div>
    <div class="lang-legend anim anim-d2">${legend}</div>
    <div style="margin-top: 14px;" class="anim anim-d3">
      <div style="font-size: 11px; color: var(--muted); margin-bottom: 6px;">Language Evolution</div>
      <svg xmlns="http://www.w3.org/2000/svg" width="${trendWidth + 20}" height="${trendHeight + 18}" style="overflow:visible;">
        <line x1="0" y1="${trendHeight}" x2="${trendWidth}" y2="${trendHeight}" stroke="var(--border)" stroke-width="1"/>
        ${trendLines}
        ${xLabels}
      </svg>
      <div class="lang-legend" style="margin-top: 4px;">${trendLegend}</div>
    </div>
  `;

  return wrapSVG(280, body);
}

// ─── Activity SVG ────────────────────────────────────────────────────
function generateActivitySVG() {
  const { activity, copilot } = data;

  const orgEntries = Object.entries(activity.perOrg)
    .filter(([, v]) => v.prs + v.reviews + v.issues > 0)
    .sort((a, b) => (b[1].prs + b[1].reviews) - (a[1].prs + a[1].reviews));

  const maxOrgTotal = Math.max(...orgEntries.map(([, v]) => v.prs + v.reviews + v.issues), 1);

  const orgBars = orgEntries.map(([name, v]) => {
    const total = v.prs + v.reviews + v.issues;
    const barW = Math.max(1, (total / maxOrgTotal) * 200);
    const prW = (v.prs / total) * barW;
    const revW = (v.reviews / total) * barW;
    const issW = (v.issues / total) * barW;
    return `
      <div style="display:flex; align-items:center; gap:6px; margin-bottom:3px; font-size:11px;">
        <span style="width:100px; text-align:right; color:var(--muted); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${esc(name)}</span>
        <div style="display:flex; height:6px; border-radius:3px; overflow:hidden;">
          <span style="width:${prW}px; background:#238636;"></span>
          <span style="width:${revW}px; background:#58a6ff;"></span>
          <span style="width:${issW}px; background:#8957e5;"></span>
        </div>
        <span style="color:var(--muted); font-size:10px;">${total}</span>
      </div>
    `;
  }).join("");

  const body = `
    <h2 class="anim">${iconSVG(ICONS.pr, 16)} Activity</h2>
    <div class="row" style="margin-bottom: 10px;">
      <div style="flex: 1;">
        <div class="stat anim anim-d1">${iconSVG(ICONS.pr, 14)} <strong>${activity.prs}</strong> PRs authored</div>
        <div class="stat anim anim-d2">${iconSVG(ICONS.review, 14)} <strong>${activity.reviews}</strong> PRs reviewed</div>
        <div class="stat anim anim-d3">${iconSVG(ICONS.issue, 14)} <strong>${activity.issues}</strong> Issues opened</div>
      </div>
      <div style="flex: 1;">
        <div class="stat anim anim-d1">${iconSVG(ICONS.copilot, 14)} <strong>${copilot.copilotMentions}</strong> Copilot commits</div>
        <div class="stat anim anim-d2">${iconSVG(ICONS.commit, 14)} <strong>${copilot.coauthoredCommits}</strong> Co-authored</div>
        <div class="stat anim anim-d3">${iconSVG(ICONS.commit, 14)} <strong>${activity.issueComments + activity.prComments}</strong> Comments</div>
      </div>
    </div>
    <div class="anim anim-d4">
      <div style="font-size: 11px; color: var(--muted); margin-bottom: 6px;">Contribution by Organization</div>
      ${orgBars}
      <div class="lang-legend" style="margin-top: 6px;">
        <span><span class="dot" style="background:#238636;"></span>PRs</span>
        <span><span class="dot" style="background:#58a6ff;"></span>Reviews</span>
        <span><span class="dot" style="background:#8957e5;"></span>Issues</span>
      </div>
    </div>
  `;

  const height = 230 + orgEntries.length * 18;
  return wrapSVG(height, body);
}

// ─── Generate all ────────────────────────────────────────────────────
console.log("Generating SVG cards...");

writeFileSync(join(ROOT, "output/overview.svg"), generateOverviewSVG());
console.log("  overview.svg");

writeFileSync(join(ROOT, "output/languages.svg"), generateLanguagesSVG());
console.log("  languages.svg");

writeFileSync(join(ROOT, "output/activity.svg"), generateActivitySVG());
console.log("  activity.svg");

console.log("Done.");
