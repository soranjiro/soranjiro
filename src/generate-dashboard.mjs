import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import { renderStyles } from "./components/styles.mjs";
import { renderHeader } from "./components/header.mjs";
import { renderActivity } from "./components/activity.mjs";
import { renderLanguages } from "./components/languages.mjs";
import { renderTechStack } from "./components/tech-stack.mjs";
import { renderCopilot } from "./components/copilot.mjs";
import { renderOrgs } from "./components/orgs.mjs";
import { renderRepos } from "./components/repos.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

function generateDashboard() {
  const data = JSON.parse(readFileSync(join(ROOT, "output/data.json"), "utf-8"));

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.profile.login} — GitHub Profile Dashboard</title>
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
</head>
<body>
  <div class="page-bg"></div>
  <div class="container">
    ${renderHeader(data)}
    <div class="bento">
      ${renderRepos(data)}
      ${renderActivity(data)}
      ${renderLanguages(data)}
      ${renderOrgs(data)}
      ${renderCopilot(data)}
      ${renderTechStack(data)}
    </div>
    <footer class="footer">
      <p>Last updated: ${new Date(data.fetchedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </footer>
  </div>
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
  <style>
    .footer {
      text-align: center; padding: 40px 0 0; margin-top: 20px;
      font-size: 11px; color: var(--text-dim); letter-spacing: 0.5px;
    }
  </style>
</body>
</html>`;

  writeFileSync(join(ROOT, "output/dashboard.html"), html);
  console.log("Generated output/dashboard.html");
}

generateDashboard();
