export function renderRepos(data) {
  const pinned = data.pinnedRepos || [];

  const cards = pinned.map((r, i) => {
    const langs = (r.languages || []).slice(0, 5);
    const totalSize = langs.reduce((s, l) => s + l.size, 0) || 1;
    const langBar = langs.map(l => {
      const w = ((l.size / totalSize) * 100).toFixed(1);
      return `<div class="repo-lang-seg" style="width:${w}%;background:${l.color}"></div>`;
    }).join('');

    const langDots = langs.slice(0, 3).map(l =>
      `<span class="repo-lang-dot"><span class="lang-dot" style="background:${l.color}"></span>${l.name}</span>`
    ).join('');

    const desc = r.aiDescription || r.description || '';
    const starsHtml = r.stars > 0 ? `<span class="repo-stars">\u2605 ${r.stars}</span>` : '';

    return `<div class="repo-card glass-card anim d${3 + i}">
      <div class="repo-header">
        <a href="https://github.com/${r.nameWithOwner}" class="repo-name" target="_blank" rel="noopener">${r.name}</a>
        ${starsHtml}
      </div>
      <p class="repo-desc">${desc}</p>
      <div class="repo-lang-bar">${langBar}</div>
      <div class="repo-lang-list">${langDots}</div>
    </div>`;
  }).join('');

  return `
    <div class="project-grid">${cards}</div>
    <style>
      .project-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
      @media (max-width: 640px) { .project-grid { grid-template-columns: 1fr; } }
      .repo-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
      .repo-name {
        font-size: 14px; font-weight: 700; color: var(--accent);
        text-decoration: none; transition: color 0.2s;
        font-family: var(--font-mono);
      }
      .repo-name:hover { color: var(--text-primary); }
      .repo-stars {
        font-size: 11px; color: var(--accent); font-family: var(--font-mono);
        font-weight: 500; opacity: 0.7;
      }
      .repo-desc { font-size: 12px; color: var(--text-secondary); margin-bottom: 14px; line-height: 1.7; }
      .repo-lang-bar {
        display: flex; height: 4px; border-radius: 2px; overflow: hidden;
        margin-bottom: 10px; background: var(--ring-track);
      }
      .repo-lang-seg { height: 100%; min-width: 2px; }
      .repo-lang-list { display: flex; gap: 10px; flex-wrap: wrap; }
      .repo-lang-dot {
        display: flex; align-items: center; gap: 4px;
        font-size: 9px; color: var(--text-dim); font-weight: 500;
        font-family: var(--font-mono);
      }
    </style>`;
}
