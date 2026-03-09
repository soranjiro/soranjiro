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

// ─── Overview SVG (GitHub Profile Summary style) ────────────────────
function generateOverviewSVG(theme) {
  const { profile, activity, repoStats, copilot, streak, allCalendar } = data;
  const isDark = theme === "dark";
  const text = isDark ? "#e6edf3" : "#24292f";
  const muted = isDark ? "#8b949e" : "#656d76";
  const accent = isDark ? "#58a6ff" : "#0969da";
  const green = isDark ? "#3fb950" : "#1a7f37";
  const border = isDark ? "#30363d" : "#d0d7de";
  const bg2 = isDark ? "#161b22" : "#f6f8fa";
  const streakData = streak || { current: 0, bestDay: 0, activeDays: 0, totalDays: 1 };

  const recentWeeks = [];
  const cal = allCalendar || [];
  const last105 = cal.slice(-105);
  for (let w = 0; w < 15; w++) {
    let sum = 0;
    for (let d = 0; d < 7; d++) {
      const idx = w * 7 + d;
      if (idx < last105.length) sum += last105[idx].count;
    }
    recentWeeks.push(sum);
  }
  const wMax = Math.max(...recentWeeks, 1);
  const levels = [
    isDark ? "#161b22" : "#ebedf0",
    isDark ? "#0e4429" : "#9be9a8",
    isDark ? "#006d32" : "#40c463",
    isDark ? "#26a641" : "#30a14e",
    isDark ? "#39d353" : "#216e39",
  ];
  const weekColors = recentWeeks.map(v => {
    if (v === 0) return levels[0];
    const lv = Math.min(4, Math.ceil((v / wMax) * 4));
    return levels[lv];
  });
  const contribBar = weekColors.map((c, i) =>
    `<rect x="${210 + i * 18}" y="22" width="14" height="14" rx="2" fill="${c}"><animate attributeName="opacity" from="0" to="1" dur="0.15s" begin="${(i * 0.04).toFixed(2)}s" fill="freeze"/></rect>`
  ).join("\n    ");

  const W = 480, H = 400;
  const font = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";

  function iconPath(pathD, x, y, fillColor, size = 12) {
    const s = size / 16;
    return `<path d="${pathD}" fill="${fillColor}" transform="translate(${x},${y}) scale(${s.toFixed(4)})"/>`;
  }

  function statRow(x, y, icon, label, fillColor, delay = 0) {
    const anim = delay > 0 ? ` opacity="0"><animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="${delay.toFixed(2)}s" fill="freeze"/` : '';
    return `<g${delay > 0 ? ` opacity="0"` : ''}>${delay > 0 ? `<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="${delay.toFixed(2)}s" fill="freeze"/>` : ''}${iconPath(ICONS[icon], x, y - 10, fillColor)}<text x="${x + 16}" y="${y}" fill="${fillColor}" font-size="11" font-family="${font}">${label}</text></g>`;
  }

  function sectionHeader(x, y, icon, label) {
    return `${iconPath(ICONS[icon], x, y - 12, green, 14)}<text x="${x + 20}" y="${y}" fill="${green}" font-size="12" font-weight="600" font-family="${font}">${label}</text>`;
  }

  const sections = `
    <text x="24" y="38" fill="${accent}" font-size="16" font-weight="700" font-family="${font}">${esc(profile.login)}</text>
    <text x="24" y="58" fill="${muted}" font-size="11" font-family="${font}">Joined GitHub ${profile.joinedYearsAgo} years ago</text>
    <text x="24" y="74" fill="${muted}" font-size="11" font-family="${font}">Followed by ${profile.followers} users</text>
    ${contribBar}
    <text x="210" y="54" fill="${muted}" font-size="10" font-family="${font}">Contributed to ${activity.contributedTo} repositories</text>

    <line x1="24" y1="92" x2="${W - 24}" y2="92" stroke="${border}" stroke-width="0.5"/>

    ${sectionHeader(24, 112, 'commit', 'Activity')}
    ${statRow(24, 132, 'commit', `${activity.totalCommits.toLocaleString()} Commits`, muted, 0.15)}
    ${statRow(24, 150, 'pr', `${activity.prs.toLocaleString()} Pull requests opened`, muted, 0.22)}
    ${statRow(24, 168, 'review', `${activity.reviews.toLocaleString()} Pull requests reviewed`, muted, 0.29)}
    ${statRow(24, 186, 'issue', `${activity.issues.toLocaleString()} Issues opened`, muted, 0.36)}
    ${statRow(24, 204, 'contrib', `${(activity.issueComments + activity.prComments).toLocaleString()} Comments`, muted, 0.43)}

    ${sectionHeader(260, 112, 'org', 'Community')}
    ${statRow(260, 132, 'org', `Member of ${profile.organizations} organizations`, muted, 0.18)}
    ${statRow(260, 150, 'star', `Starred ${repoStats.stars} repositories`, muted, 0.25)}
    ${statRow(260, 168, 'copilot', `${fmtNum(copilot.premiumRequests || 0)} Copilot requests`, muted, 0.32)}
    <g opacity="0"><animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="0.39s" fill="freeze"/>
      ${iconPath(ICONS.clock, 260, 176, muted)}<text x="276" y="186" fill="${muted}" font-size="11" font-family="${font}">${streakData.current}-day streak</text>
      <circle cx="${276 + String(streakData.current).length * 6.5 + 72}" cy="182" r="3" fill="${green}"><animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/></circle>
    </g>
    ${statRow(260, 204, 'star', `Best: ${streakData.bestDay}/day`, muted, 0.46)}

    <line x1="24" y1="218" x2="${W - 24}" y2="218" stroke="${border}" stroke-width="0.5"/>

    ${sectionHeader(24, 240, 'repo', `${repoStats.total} Repositories`)}
    <text x="24" y="260" fill="${muted}" font-size="11" font-family="${font}">Prefers ${repoStats.preferredLicense} license</text>
    <text x="24" y="278" fill="${muted}" font-size="11" font-family="${font}">${repoStats.releases} Releases</text>

    <text x="260" y="260" fill="${muted}" font-size="11" font-family="${font}">${repoStats.stars} Stargazers</text>
    <text x="260" y="278" fill="${muted}" font-size="11" font-family="${font}">${repoStats.forks} Forkers</text>
  `;

  const pulseData = (allCalendar || []).slice(-60);
  const pMax = Math.max(...pulseData.map(d => d.count), 1);
  const pW = W - 48, pH = 46, pY0 = 302;
  const pPoints = pulseData.map((d, i) => {
    const x = 24 + (i / (pulseData.length - 1)) * pW;
    const y = pY0 + pH - (d.count / pMax) * pH;
    return [x, y];
  });
  let pPath = `M${pPoints[0][0].toFixed(1)},${pPoints[0][1].toFixed(1)}`;
  for (let i = 0; i < pPoints.length - 1; i++) {
    const [a, b, c, e] = [pPoints[Math.max(0, i-1)], pPoints[i], pPoints[i+1], pPoints[Math.min(pPoints.length-1, i+2)]];
    const t = 0.35;
    pPath += ` C${(b[0]+(c[0]-a[0])*t/3).toFixed(1)},${(b[1]+(c[1]-a[1])*t/3).toFixed(1)} ${(c[0]-(e[0]-b[0])*t/3).toFixed(1)},${(c[1]-(e[1]-b[1])*t/3).toFixed(1)} ${c[0].toFixed(1)},${c[1].toFixed(1)}`;
  }
  const pArea = pPath + ` L${(24 + pW).toFixed(1)},${pY0 + pH} L24,${pY0 + pH} Z`;
  const pLen = pulseData.length * 12;

  const pulse = `
    <text x="24" y="${pY0 - 6}" fill="${muted}" font-size="9" font-weight="600" letter-spacing="1" font-family="-apple-system,sans-serif">LAST 60 DAYS</text>
    <path d="${pArea}" fill="${isDark ? 'rgba(63,185,80,0.08)' : 'rgba(26,127,55,0.06)'}"/>
    <path d="${pPath}" fill="none" stroke="${green}" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="${pLen}" stroke-dashoffset="${pLen}" filter="url(#glow)">
      <animate attributeName="stroke-dashoffset" from="${pLen}" to="0" dur="2s" fill="freeze" begin="0.3s"/>
    </path>
    <text x="${W - 24}" y="${pY0 + pH + 14}" text-anchor="end" fill="${muted}" font-size="9" font-family="-apple-system,sans-serif">peak: ${pMax}</text>
  `;

  const svgCSS = `text{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
<filter id="glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<style>${svgCSS}</style>
<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="6" fill="${isDark ? '#0d1117' : '#ffffff'}" stroke="${border}"/>
${sections}
${pulse}
</svg>`;
}

// ─── Contribution Heatmap Calendar SVG ──────────────────────────────
function generateHeatmapSVG(theme) {
  const isDark = theme === "dark";
  const text = isDark ? "#e6edf3" : "#24292f";
  const muted = isDark ? "#8b949e" : "#656d76";
  const accent = isDark ? "#58a6ff" : "#0969da";
  const green = isDark ? "#3fb950" : "#1a7f37";
  const border = isDark ? "#30363d" : "#d0d7de";
  const bg = isDark ? "#0d1117" : "#ffffff";
  const barBg = isDark ? "#21262d" : "#eaeef2";
  const font = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";

  const levels = isDark
    ? ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"]
    : ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];

  const cal = data.allCalendar || [];
  const today = cal.length > 0 ? new Date(cal[cal.length - 1].date) : new Date();
  const startDay = new Date(today);
  startDay.setDate(startDay.getDate() - 364);
  const startDow = startDay.getDay();
  if (startDow !== 0) startDay.setDate(startDay.getDate() - startDow);

  const calMap = {};
  cal.forEach(d => { calMap[d.date] = d.count; });

  const cellSize = 7, gap = 2, total = cellSize + gap;
  const padL = 24, padT = 40;
  const W = 480, H = 400;
  const maxCount = Math.max(...cal.slice(-371).map(d => d.count), 1);

  let cells = "";
  let totalContribs = 0;
  const months = {};
  const dowCounts = [0, 0, 0, 0, 0, 0, 0];
  const d = new Date(startDay);
  let weekIdx = 0;
  while (d <= today) {
    const dow = d.getDay();
    if (dow === 0 && d > startDay) weekIdx++;
    const ds = d.toISOString().slice(0, 10);
    const count = calMap[ds] || 0;
    totalContribs += count;
    dowCounts[dow] += count;
    const lv = count === 0 ? 0 : Math.min(4, Math.ceil((count / maxCount) * 4));
    const x = padL + weekIdx * total;
    const y = padT + dow * total;

    const monthKey = ds.slice(0, 7);
    if (!months[monthKey]) months[monthKey] = x;

    cells += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="2" fill="${levels[lv]}">`;
    cells += `<animate attributeName="opacity" from="0" to="1" dur="0.08s" begin="${(weekIdx * 0.015).toFixed(3)}s" fill="freeze"/>`;
    cells += `</rect>\n`;
    d.setDate(d.getDate() + 1);
  }

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let dayText = "";
  dayLabels.forEach((lab, i) => {
    if (i % 2 === 1) dayText += `<text x="${padL - 4}" y="${padT + i * total + 6}" text-anchor="end" fill="${muted}" font-size="7" font-family="${font}">${lab}</text>\n`;
  });

  let monthText = "";
  const seen = new Set();
  Object.entries(months).forEach(([m, x]) => {
    const label = new Date(m + "-15").toLocaleString("en", { month: "short" });
    if (!seen.has(label)) {
      seen.add(label);
      monthText += `<text x="${x}" y="${padT - 6}" fill="${muted}" font-size="7" font-family="${font}">${label}</text>\n`;
    }
  });

  const calH = padT + 7 * total + 8;
  const legend = levels.map((c, i) =>
    `<rect x="${W - 70 + i * 10}" y="${calH}" width="${cellSize}" height="${cellSize}" rx="2" fill="${c}"/>`
  ).join("\n    ");

  const streakData = data.streak || { current: 0, longest: 0, bestDay: 0, activeDays: 0, totalDays: 1 };
  const avgPerDay = (totalContribs / 365).toFixed(1);

  const statsY = calH + 28;
  const stats = `
    <line x1="24" y1="${statsY - 10}" x2="${W - 24}" y2="${statsY - 10}" stroke="${border}" stroke-width="0.5"/>
    <text x="24" y="${statsY + 8}" fill="${green}" font-size="11" font-weight="600" font-family="${font}">Contribution Stats</text>
    <text x="24" y="${statsY + 28}" fill="${muted}" font-size="10" font-family="${font}">Total: ${totalContribs.toLocaleString()}</text>
    <text x="140" y="${statsY + 28}" fill="${muted}" font-size="10" font-family="${font}">Avg: ${avgPerDay}/day</text>
    <text x="260" y="${statsY + 28}" fill="${muted}" font-size="10" font-family="${font}">Peak: ${maxCount}/day</text>
    <text x="24" y="${statsY + 46}" fill="${muted}" font-size="10" font-family="${font}">Streak: ${streakData.current} days</text>
    <text x="140" y="${statsY + 46}" fill="${muted}" font-size="10" font-family="${font}">Longest: ${streakData.longest || streakData.current} days</text>
    <text x="260" y="${statsY + 46}" fill="${muted}" font-size="10" font-family="${font}">Active: ${streakData.activeDays} days</text>
  `;

  const dowBarY = statsY + 68;
  const dowMax = Math.max(...dowCounts, 1);
  const barW = 200, barH = 10;
  let dowBars = `<text x="24" y="${dowBarY}" fill="${green}" font-size="11" font-weight="600" font-family="${font}">Day of Week Activity</text>\n`;
  dayLabels.forEach((lab, i) => {
    const rowY = dowBarY + 16 + i * 18;
    const w = (dowCounts[i] / dowMax) * barW;
    dowBars += `<text x="44" y="${rowY + 9}" text-anchor="end" fill="${muted}" font-size="9" font-family="${font}">${lab}</text>`;
    dowBars += `<rect x="50" y="${rowY}" width="${barW}" height="${barH}" rx="3" fill="${barBg}"/>`;
    dowBars += `<rect x="50" y="${rowY}" width="0" height="${barH}" rx="3" fill="${green}"><animate attributeName="width" from="0" to="${w.toFixed(1)}" dur="0.5s" begin="${(0.3 + i * 0.06).toFixed(2)}s" fill="freeze"/></rect>`;
    dowBars += `<text x="${50 + barW + 8}" y="${rowY + 9}" fill="${muted}" font-size="9" font-family="${font}">${dowCounts[i].toLocaleString()}</text>\n`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<style>text{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif}</style>
<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="6" fill="${bg}" stroke="${border}"/>
<text x="${padL}" y="24" fill="${accent}" font-size="12" font-weight="600">${totalContribs.toLocaleString()} contributions in the last year</text>
${monthText}
${dayText}
${cells}
<text x="${W - 86}" y="${calH + 9}" fill="${muted}" font-size="7">Less</text>
${legend}
<text x="${W - 20}" y="${calH + 9}" fill="${muted}" font-size="7">More</text>
${stats}
${dowBars}
</svg>`;
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
  const fx = v => v.toFixed(1);

  const monthly = aggregateMonthly();
  const { labels: mLabels, commits: mC, prs: mP, reviews: mR } = monthly;

  const rLabels = ["Commits", "PRs", "Reviews", "Issues", "Comments"];
  const rRaw = [data.activity.totalCommits, data.activity.prs, data.activity.reviews,
    data.activity.issues, data.activity.prComments + data.activity.issueComments];
  const rNorm = rRaw.map(v => Math.log10(v + 1) / 4);

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
  const radarPoly = dPts.map(p => p.map(fx).join(',')).join(' ');
  const zeroPoly = Array.from({length: N}, () => `${rcx},${rcy}`).join(' ');
  radar += `<polygon points="${zeroPoly}" fill="var(--accent-fill)" stroke="var(--accent)" stroke-width="1.5" stroke-linejoin="round">
    <animate attributeName="points" from="${zeroPoly}" to="${radarPoly}" dur="0.8s" fill="freeze" begin="0.2s" calcMode="spline" keySplines="0.4 0 0.2 1"/>
  </polygon>\n`;
  dPts.forEach((p, i) => { radar += `<circle cx="${fx(p[0])}" cy="${fx(p[1])}" r="3" fill="var(--accent)" opacity="0"><animate attributeName="opacity" from="0" to="1" dur="0.15s" begin="${(0.8 + i * 0.08).toFixed(2)}s" fill="freeze"/></circle>\n`; });

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
  mc += `<path d="${cArea}" fill="var(--matcha-fill)" opacity="0"><animate attributeName="opacity" from="0" to="1" dur="0.6s" begin="0.5s" fill="freeze"/></path>\n`;
  const drawLen = 3000;
  mc += `<path d="${cLine}" fill="none" stroke="var(--matcha)" stroke-width="1.5" stroke-dasharray="${drawLen}" stroke-dashoffset="${drawLen}"><animate attributeName="stroke-dashoffset" from="${drawLen}" to="0" dur="1.2s" begin="0.3s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></path>\n`;
  mc += `<path d="${pLine}" fill="none" stroke="var(--sora)" stroke-width="1.5" stroke-dasharray="4,2" opacity="0"><animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="1s" fill="freeze"/></path>\n`;
  mc += `<path d="${rvLine}" fill="none" stroke="var(--fuji)" stroke-width="1.5" stroke-dasharray="2,2" opacity="0"><animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="1.2s" fill="freeze"/></path>\n`;
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
  let cumDelay = 0;
  distLangs.forEach(l => {
    const w = (l.bytes / totalBytes) * bW;
    dist += `<rect x="${fx(bX)}" y="${bY}" width="0" height="${bH}" fill="${l.color}"><animate attributeName="width" from="0" to="${fx(w)}" dur="0.5s" begin="${(0.3 + cumDelay).toFixed(2)}s" fill="freeze"/></rect>\n`;
    cumDelay += 0.06;
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

  const skY0 = 340;
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

  const H = 530;

  const chartCSS = theme === 'light'
    ? 'svg{--text:#24292f;--muted:#656d76;--dim:#8b949e;--grid:rgba(101,109,118,0.15);--accent:#0969da;--accent-fill:rgba(9,105,218,0.10);--matcha:#1a7f37;--matcha-fill:rgba(26,127,55,0.08);--sora:#0969da;--fuji:#8250df}'
    : 'svg{--text:#e6edf3;--muted:#8b949e;--dim:#656d76;--grid:rgba(139,148,158,0.15);--accent:#58a6ff;--accent-fill:rgba(88,166,255,0.12);--matcha:#3fb950;--matcha-fill:rgba(63,185,80,0.10);--sora:#58a6ff;--fuji:#bc8cff}';

  const chartBg = theme === 'light' ? '#ffffff' : '#0d1117';
  const chartBorder = theme === 'light' ? '#d0d7de' : '#30363d';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="${-PAD_L} ${-PAD_T} ${W + PAD_L + PAD_R} ${H + PAD_T + PAD_B}">
<defs>
<style>
${chartCSS}
text{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif}
</style>
</defs>
<rect x="${-PAD_L + 0.5}" y="${-PAD_T + 0.5}" width="${W + PAD_L + PAD_R - 1}" height="${H + PAD_T + PAD_B - 1}" rx="6" fill="${chartBg}" stroke="${chartBorder}"/>
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
${sk}</g>
</svg>`;
}

console.log("Generating SVG cards...");

function generateTypingSVG(theme) {
  const summary = data.aiSummary || "";
  const maxCharsPerLine = 70;
  const lines = [];
  const words = summary.split(/\s+/);
  let current = "";
  for (const w of words) {
    if ((current + " " + w).trim().length > maxCharsPerLine) {
      lines.push(current.trim());
      current = w;
    } else {
      current = current ? current + " " + w : w;
    }
  }
  if (current.trim()) lines.push(current.trim());

  const lineH = 24;
  const topPad = 36;
  const charW = 9.6;
  const height = topPad + lines.length * lineH + 20;
  const textColor = theme === "light" ? "#24292f" : "#e6edf3";
  const mutedColor = theme === "light" ? "#656d76" : "#8b949e";
  const cursorColor = theme === "light" ? "#0969da" : "#58a6ff";
  const charDur = 0.045;
  const totalChars = lines.reduce((s, l) => s + l.length, 0);
  const totalDur = totalChars * charDur + 2;

  let charIdx = 0;
  let tspans = "";
  lines.forEach((line, li) => {
    const y = topPad + li * lineH;
    for (let ci = 0; ci < line.length; ci++) {
      const begin = (charIdx * charDur).toFixed(3);
      const ch = esc(line[ci]);
      const x = 20 + ci * charW;
      tspans += `<text x="${x.toFixed(1)}" y="${y}" fill="${textColor}" font-size="15" font-family="'Geist Mono','SF Mono','Fira Code',monospace" opacity="0"><animate attributeName="opacity" from="0" to="1" dur="0.01s" begin="${begin}s" fill="freeze"/>${ch}</text>\n`;
      charIdx++;
    }
  });

  const cursorKeyframes = [];
  let cIdx = 0;
  lines.forEach((line, li) => {
    for (let ci = 0; ci <= line.length; ci++) {
      const t = ((cIdx * charDur) / totalDur * 100).toFixed(2);
      const cx = 20 + ci * charW;
      const cy = topPad + li * lineH - 14;
      cursorKeyframes.push(`${t}% { x: ${cx.toFixed(1)}px; y: ${cy}px; }`);
      if (ci < line.length) cIdx++;
    }
  });
  cursorKeyframes.push(`100% { x: ${(20 + lines[lines.length - 1].length * charW).toFixed(1)}px; y: ${topPad + (lines.length - 1) * lineH - 14}px; }`);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="${height}" viewBox="0 0 800 ${height}">
<style>
  @keyframes blink { 0%,49% { opacity: 1; } 50%,100% { opacity: 0; } }
  @keyframes cursor-move {
    ${cursorKeyframes.join("\n    ")}
  }
  .cursor { fill: ${cursorColor}; animation: blink 0.7s step-end infinite, cursor-move ${totalDur.toFixed(2)}s steps(1,end) forwards; }
</style>
<text x="20" y="18" fill="${mutedColor}" font-size="10" font-weight="600" letter-spacing="1.5" font-family="'Geist Mono','SF Mono',monospace">$ profile --summary</text>
${tspans}<rect class="cursor" x="20" y="${topPad - 14}" width="2" height="18" rx="1"/>
</svg>`;
  return svg;
}

for (const theme of ['dark', 'light']) {
  console.log(`  theme: ${theme}`);

  writeFileSync(join(SVG_DIR, `overview-${theme}.svg`), generateOverviewSVG(theme));
  console.log(`    overview-${theme}.svg`);

  writeFileSync(join(SVG_DIR, `heatmap-${theme}.svg`), generateHeatmapSVG(theme));
  console.log(`    heatmap-${theme}.svg`);

  writeFileSync(join(SVG_DIR, `activity-${theme}.svg`), generateActivitySVG(theme));
  console.log(`    activity-${theme}.svg`);

  writeFileSync(join(SVG_DIR, `copilot-${theme}.svg`), generateCopilotSVG(theme));
  console.log(`    copilot-${theme}.svg`);

  writeFileSync(join(SVG_DIR, `repos-${theme}.svg`), generateReposSVG(theme));
  console.log(`    repos-${theme}.svg`);

  writeFileSync(join(SVG_DIR, `charts-${theme}.svg`), await generateChartsSVG(theme));
  console.log(`    charts-${theme}.svg`);

  writeFileSync(join(SVG_DIR, `typing-${theme}.svg`), generateTypingSVG(theme));
  console.log(`    typing-${theme}.svg`);
}

console.log("Done.");
