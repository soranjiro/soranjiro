import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import { renderStyles } from "./components/styles.mjs";
import { renderHeader } from "./components/header.mjs";
import { renderActivityRadar, renderActivityTimeline } from "./components/activity.mjs";
import { renderLanguages } from "./components/languages.mjs";
import { renderTechStack } from "./components/tech-stack.mjs";
import { renderOrgs } from "./components/orgs.mjs";
import { renderRepos } from "./components/repos.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

function renderContributionCalendar(data) {
  const allCalendar = data.allCalendar || [];
  const recent = allCalendar.slice(-365);
  const weeks = [];
  for (let i = 0; i < recent.length; i += 7) {
    weeks.push(recent.slice(i, i + 7));
  }

  const cellSize = 11;
  const cellGap = 2;
  const totalW = weeks.length * (cellSize + cellGap) + 40;

  const monthLabels = [];
  let lastMonth = "";
  weeks.forEach((week, wi) => {
    const d = week[0];
    if (d) {
      const m = d.date.slice(0, 7);
      if (m !== lastMonth) {
        lastMonth = m;
        const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        const mi = parseInt(d.date.slice(5, 7)) - 1;
        monthLabels.push(`<text x="${wi * (cellSize + cellGap) + 32}" y="10" fill="var(--text-dim)" font-size="9" font-family="var(--font-mono)">${monthNames[mi]}</text>`);
      }
    }
  });

  const cells = weeks.map((week, wi) => {
    return week.map((day, di) => {
      if (!day) return "";
      const x = wi * (cellSize + cellGap) + 32;
      const y = di * (cellSize + cellGap) + 18;
      const opacity = day.count === 0 ? 0.08 : Math.min(0.2 + (day.count / 20) * 0.8, 1);
      const fill = day.count === 0 ? "var(--text-dim)" : "var(--matcha)";
      return `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="2" fill="${fill}" opacity="${opacity}"><title>${day.date}: ${day.count} contributions</title></rect>`;
    }).join("");
  }).join("");

  const totalContribs = recent.reduce((s, d) => s + d.count, 0);
  const streak = data.streak || { current: 0 };

  return `
    <div class="glass-card anim d3" style="overflow-x:auto;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <span class="sub-label" style="margin-bottom:0;">Contribution Calendar</span>
        <span style="font-size:11px;color:var(--text-secondary);font-family:var(--font-mono);">
          ${totalContribs.toLocaleString()} contributions in the last year
          ${streak.current > 0 ? ` · ${streak.current} day streak` : ""}
        </span>
      </div>
      <svg width="${totalW}" height="${7 * (cellSize + cellGap) + 24}" style="display:block;">
        ${monthLabels.join("")}
        ${cells}
      </svg>
    </div>`;
}

function generateDashboard() {
  const data = JSON.parse(readFileSync(join(ROOT, "output/data.json"), "utf-8"));
  const today = new Date().toISOString().slice(0, 10);
  const desc = data.aiSummary || `${data.profile.login}'s GitHub Profile Dashboard`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.profile.login} — GitHub Profile Dashboard</title>
  <meta name="description" content="${desc.replace(/"/g, '&quot;').slice(0, 160)}">
  <meta property="og:title" content="${data.profile.login} — GitHub Profile Dashboard">
  <meta property="og:description" content="${desc.replace(/"/g, '&quot;').slice(0, 160)}">
  <meta property="og:image" content="${data.profile.avatarUrl}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://soranjiro.github.io/soranjiro/">
  <meta name="twitter:card" content="summary">
  <link rel="icon" href="${data.profile.avatarUrl}" type="image/png">
  <script>
    (function(){
      var t = localStorage.getItem('theme');
      if (!t) t = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
      if (t === 'light') document.documentElement.setAttribute('data-theme','light');
    })();
  </script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css">
  ${renderStyles()}
  <style>
    .nav-bar {
      position: sticky; top: 0; z-index: 50;
      background: var(--bg);
      border-bottom: 1px solid var(--border);
      padding: 10px 32px;
      display: flex; align-items: center; justify-content: center; gap: 24px;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      transition: background 0.4s;
    }
    .nav-link {
      font-size: 11px; font-weight: 500; letter-spacing: 0.5px;
      color: var(--text-secondary); text-decoration: none;
      padding: 4px 12px; border-radius: 100px;
      transition: color 0.2s, background 0.2s;
    }
    .nav-link:hover { color: var(--accent); background: var(--accent-soft); }
    .footer { text-align: center; padding: 48px 0 0; margin-top: 24px; font-size: 10px; color: var(--text-dim); letter-spacing: 0.5px; }
    .streak-banner {
      display: flex; align-items: center; justify-content: center; gap: 24px;
      padding: 16px; margin-bottom: 24px;
      border-radius: var(--radius-sm);
      background: var(--accent-soft);
      border: 1px solid var(--accent-glow);
    }
    .streak-num {
      font-size: 32px; font-weight: 700;
      font-family: var(--font-mono); color: var(--accent);
      line-height: 1;
    }
    .streak-label { font-size: 11px; color: var(--text-secondary); letter-spacing: 0.5px; }
  </style>
</head>
<body>
  <div class="page-bg"></div>
  <div class="scroll-progress" id="scrollProgress"></div>

  <nav class="nav-bar">
    <a href="#projects" class="nav-link">Projects</a>
    <a href="#activity" class="nav-link">Activity</a>
    <a href="#languages" class="nav-link">Languages</a>
    <a href="#community" class="nav-link">Community</a>
  </nav>

  <div class="container">
    ${renderHeader(data)}

    ${data.streak ? `
    <div class="streak-banner anim d2">
      <div style="text-align:center;">
        <div class="streak-num">${data.streak.current}</div>
        <div class="streak-label">day streak</div>
      </div>
      <div style="text-align:center;">
        <div class="streak-num">${data.streak.bestDay}</div>
        <div class="streak-label">best day</div>
      </div>
      <div style="text-align:center;">
        <div class="streak-num">${Math.round(data.streak.activeDays / Math.max(data.streak.totalDays, 1) * 100)}%</div>
        <div class="streak-label">active days</div>
      </div>
    </div>` : ""}

    <div class="section-divider"></div>

    <section class="page-section" id="projects">
      <h2 class="section-title">Featured Projects <span class="section-jp">\u2500 \u4F5C\u54C1</span></h2>
      ${renderRepos(data)}
    </section>

    <div class="section-divider"></div>

    <section class="page-section" id="activity">
      <h2 class="section-title">Activity <span class="section-jp">\u2500 \u6D3B\u52D5</span></h2>
      ${renderContributionCalendar(data)}
      <div style="height:16px;"></div>
      ${renderActivityRadar(data)}
      ${renderActivityTimeline(data)}
    </section>

    <div class="section-divider"></div>

    <section class="page-section" id="languages">
      <h2 class="section-title">Languages & Tools <span class="section-jp">\u2500 \u9053\u5177</span></h2>
      ${renderLanguages(data)}
      ${renderTechStack(data)}
    </section>

    <div class="section-divider"></div>

    <section class="page-section" id="community">
      <h2 class="section-title">Community <span class="section-jp">\u2500 \u4EF2\u9593</span></h2>
      ${renderOrgs(data)}
    </section>

    <footer class="footer">
      <p>Last updated: ${new Date(data.fetchedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <p style="margin-top:4px;">Auto-generated daily via GitHub Actions · Powered by GitHub Copilot SDK &amp; GitHub GraphQL API</p>
    </footer>
  </div>
  <script>
    (function(){
      var sp = document.getElementById('scrollProgress');
      window.addEventListener('scroll', function() {
        var pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        sp.style.height = Math.min(pct, 100) + '%';
      }, { passive: true });
    })();
  </script>
  <script>
    (function(){
      var btn = document.getElementById('themeToggle');
      function apply(theme) {
        if (theme === 'light') {
          document.documentElement.setAttribute('data-theme','light');
          btn.textContent = '\\u263D';
        } else {
          document.documentElement.removeAttribute('data-theme');
          btn.textContent = '\\u2600';
        }
        localStorage.setItem('theme', theme);
        window.__currentTheme = theme;
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: theme } }));
      }
      var saved = localStorage.getItem('theme');
      if (!saved) saved = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
      apply(saved);
      btn.addEventListener('click', function(){
        apply(localStorage.getItem('theme') === 'light' ? 'dark' : 'light');
      });
    })();
  </script>
  <script>
    (function(){
      var counters = document.querySelectorAll('.streak-num');
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var target = el.textContent.trim();
            if (target.endsWith('%')) {
              var num = parseInt(target);
              animateNum(el, 0, num, '%');
            } else {
              var num = parseInt(target);
              if (!isNaN(num)) animateNum(el, 0, num, '');
            }
            observer.unobserve(el);
          }
        });
      }, { threshold: 0.5 });
      counters.forEach(function(c) { observer.observe(c); });
      function animateNum(el, from, to, suffix) {
        var dur = 800;
        var start = performance.now();
        function step(now) {
          var pct = Math.min((now - start) / dur, 1);
          var ease = 1 - Math.pow(1 - pct, 3);
          el.textContent = Math.round(from + (to - from) * ease) + suffix;
          if (pct < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      }
    })();
  </script>
</body>
</html>`;

  writeFileSync(join(ROOT, "output/dashboard.html"), html);
  writeFileSync(join(ROOT, "output/index.html"), html);
  console.log("Generated output/dashboard.html and output/index.html");
}

generateDashboard();
