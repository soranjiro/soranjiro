import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const data = JSON.parse(readFileSync(join(ROOT, "output/data.json"), "utf-8"));

const { profile } = data;

const today = new Date().toISOString().slice(0, 10);

const readme = `![](https://komarev.com/ghpvc/?username=soranjiro&color=blue) <img src="./output/assets/svg/ai-badge.svg" alt="AI Generated" height="20" />

<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./output/assets/svg/typing-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="./output/assets/svg/typing-light.svg">
  <img src="./output/assets/svg/typing-dark.svg" alt="Profile" width="480" />
</picture>

</div>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./output/assets/svg/overview-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="./output/assets/svg/overview-light.svg">
    <img src="./output/assets/svg/overview-dark.svg" alt="Overview" width="410" />
  </picture>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./output/assets/svg/heatmap-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="./output/assets/svg/heatmap-light.svg">
    <img src="./output/assets/svg/heatmap-dark.svg" alt="Contributions" width="410" />
  </picture>
</p>

<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./output/assets/svg/charts-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="./output/assets/svg/charts-light.svg">
  <img src="./output/assets/svg/charts-dark.svg" alt="Charts" width="840" />
</picture>

</div>

<div align="center">

<br>

[![Dashboard](https://img.shields.io/badge/Dashboard-soranjiro.github.io-blue?style=for-the-badge&logo=github)](https://soranjiro.github.io/soranjiro/)

---

<sub>
  Auto-generated daily via <a href="https://github.com/${profile.login}/${profile.login}/actions">GitHub Actions</a>
  · Powered by <strong>GitHub Copilot SDK</strong> &amp; GitHub GraphQL API
  · Last updated: ${today}
</sub>

</div>
`;

writeFileSync(join(ROOT, "README.md"), readme);
console.log("README.md written to root");

writeFileSync(join(ROOT, "output/README.md"), readme);
console.log("README.md also written to output/README.md");
