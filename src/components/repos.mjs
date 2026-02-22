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
    const starsHtml = r.stars > 0 ? `<span class="repo-stars">&#9733; ${r.stars}</span>` : '';

    return `<div class="repo-card card anim d${3 + i}">
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
    <div class="repos-section">
      <div class="repos-section-title anim d3">
        <div class="card-label">Featured Projects</div>
      </div>
      <div class="repos-grid">${cards}</div>
    </div>
    <style>
      .repos-section { grid-column: span 12; }
      .repos-section-title { margin-bottom: 6px; padding: 0 4px; }
      .repos-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
      @media (max-width: 640px) { .repos-grid { grid-template-columns: 1fr; } }
      .repo-card {
        padding: 22px;
        border-left: 3px solid transparent;
        transition: border-color 0.3s, border-left-color 0.3s, transform 0.4s var(--ease-out), box-shadow 0.4s;
      }
      .repo-card:hover {
        border-left-color: var(--accent);
      }
      .repo-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
      .repo-name {
        font-size: 15px; font-weight: 700; color: var(--accent);
        text-decoration: none; transition: color 0.2s;
        font-family: var(--font-mono);
      }
      .repo-name:hover { color: var(--text-primary); }
      .repo-stars {
        font-size: 11px; color: var(--accent); font-family: var(--font-mono);
        font-weight: 600; opacity: 0.8;
      }
      .repo-desc { font-size: 12px; color: var(--text-secondary); margin-bottom: 14px; line-height: 1.6; }
      .repo-lang-bar {
        display: flex; height: 5px; border-radius: 3px; overflow: hidden;
        margin-bottom: 10px; background: var(--ring-track);
      }
      .repo-lang-seg { height: 100%; min-width: 2px; }
      .repo-lang-list { display: flex; gap: 10px; flex-wrap: wrap; }
      .repo-lang-dot {
        display: flex; align-items: center; gap: 4px;
        font-size: 10px; color: var(--text-dim); font-weight: 500;
        font-family: var(--font-mono);
      }
    </style>`;
}
