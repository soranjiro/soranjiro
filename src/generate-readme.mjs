import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const data = JSON.parse(readFileSync(join(ROOT, "output/data.json"), "utf-8"));

const { profile, activity, repoStats, overallLanguages, pinnedRepos } = data;

const topLangs = overallLanguages
  .slice(0, 5)
  .map(l => l.name)
  .join(" · ");

const pinned = pinnedRepos.map(r => {
  const lang = r.primaryLanguage?.name || "";
  const desc = r.description ? ` - ${r.description}` : "";
  return `- [**${r.name}**](https://github.com/${r.nameWithOwner})${desc} \`${lang}\``;
}).join("\n");

const readme = `### Hi, I'm ${profile.login} 👋

<table>
  <tr>
    <td><img src="./output/overview.svg" alt="Overview" /></td>
    <td><img src="./output/activity.svg" alt="Activity" /></td>
  </tr>
</table>

<img src="./output/languages.svg" alt="Languages" />

#### Pinned

${pinned}

---

<sub>Generated with GitHub API · ${new Date().toISOString().slice(0, 10)}</sub>
`;

writeFileSync(join(ROOT, "output/README.md"), readme);
console.log("README.md written to output/README.md");
