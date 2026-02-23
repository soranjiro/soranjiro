import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const data = JSON.parse(readFileSync(join(ROOT, "output/data.json"), "utf-8"));

const { profile, pinnedRepos, aiSummary, userProfile } = data;

const roles = (userProfile?.roles || []).map(r => `\`${r}\``).join(" · ");
const summary = aiSummary || "";

const pinned = pinnedRepos.map(r => {
  const lang = r.primaryLanguage?.name || "";
  const desc = r.aiDescription || r.description || "";
  const stars = r.stars > 0 ? ` ⭐ ${r.stars}` : "";
  return `| [**${r.name}**](https://github.com/${r.nameWithOwner}) | ${desc} | \`${lang}\`${stars} |`;
}).join("\n");

const techStack = data.config?.techStack || {};
const allSkillIds = [
  ...(techStack.languages || ['ts','js','go','py','ruby','cpp','c','rust','java','svelte','vue']),
  ...(techStack.frameworks || ['svelte','vue','tauri']),
  ...(techStack.infrastructure || ['docker','aws','terraform','linux','postgres']),
  ...(techStack.tools || ['git','github','vscode','latex','bash']),
];
const uniqueSkillIds = [...new Set(allSkillIds)];
const skillIconsUrl = `https://skillicons.dev/icons?i=${uniqueSkillIds.join(',')}&perline=${Math.min(uniqueSkillIds.length, 15)}`;

const readme = `![](https://komarev.com/ghpvc/?username=soranjiro&color=blue) <img src="./output/assets/svg/ai-badge.svg" alt="AI Generated" height="20" />

${summary || ""}

<table align="center">
  <tr>
    <td><img src="./output/assets/svg/overview.svg" alt="Overview" width="480" /></td>
    <td><img src="./output/assets/svg/copilot.svg" alt="AI Collaboration" width="480" /></td>
  </tr>
</table>

<div align="center">

<img src="./output/assets/svg/charts.svg" alt="Dashboard Charts" width="840" />

</div>

---

<div align="center">
  <sub>
    Auto-generated daily via <a href="https://github.com/${profile.login}/${profile.login}/actions">GitHub Actions</a>
    · Powered by <strong>GitHub Copilot SDK</strong> &amp; GitHub GraphQL API
    · Last updated: ${new Date().toISOString().slice(0, 10)}
  </sub>
</div>
`;

writeFileSync(join(ROOT, "README.md"), readme);
console.log("README.md written to root");

writeFileSync(join(ROOT, "output/README.md"), readme);
console.log("README.md also written to output/README.md");
