export function renderOrgs(data) {
  const perOrg = data.activity.perOrg || {};
  const orgNames = data.profile.orgNames || [];

  const orgData = orgNames.map(o => {
    const stats = perOrg[o.login] || {};
    const total = (stats.prs || 0) + (stats.reviews || 0) + (stats.issues || 0);
    return { login: o.login, name: o.name || o.login, prs: stats.prs || 0, reviews: stats.reviews || 0, issues: stats.issues || 0, total };
  }).filter(o => o.total > 0).sort((a, b) => b.total - a.total);

  const maxTotal = Math.max(...orgData.map(o => o.total), 1);

  const rows = orgData.map((o, i) => {
    const prW = (o.prs / maxTotal * 100).toFixed(1);
    const rvW = (o.reviews / maxTotal * 100).toFixed(1);
    const isW = (o.issues / maxTotal * 100).toFixed(1);
    return `<div class="org-row anim" style="animation-delay:${0.7 + i * 0.08}s">
      <div class="org-meta">
        <div class="org-name">${o.name}</div>
        <div class="org-total">${o.total}</div>
      </div>
      <div class="org-bar-wrap">
        <div class="org-bar-segment" style="width:${prW}%;background:var(--accent)"></div>
        <div class="org-bar-segment" style="width:${rvW}%;background:var(--purple)"></div>
        <div class="org-bar-segment" style="width:${isW}%;background:var(--cyan)"></div>
      </div>
      <div class="org-breakdown">
        <span>${o.prs} PRs</span><span>${o.reviews} Reviews</span><span>${o.issues} Issues</span>
      </div>
    </div>`;
  }).join('');

  return `
    <div class="card span-8 anim d7">
      <div class="card-label">Organizations</div>
      <div class="org-legend">
        <span class="org-legend-item"><span class="org-legend-dot" style="background:var(--accent)"></span>PRs</span>
        <span class="org-legend-item"><span class="org-legend-dot" style="background:var(--purple)"></span>Reviews</span>
        <span class="org-legend-item"><span class="org-legend-dot" style="background:var(--cyan)"></span>Issues</span>
      </div>
      <div class="org-chart">${rows}</div>
    </div>
    <style>
      .org-legend { display: flex; gap: 16px; margin-bottom: 20px; }
      .org-legend-item { font-size: 10px; color: var(--text-dim); display: flex; align-items: center; gap: 5px; letter-spacing: 0.3px; }
      .org-legend-dot { width: 6px; height: 6px; border-radius: 1px; }
      .org-chart { display: flex; flex-direction: column; gap: 18px; }
      .org-row { display: flex; flex-direction: column; gap: 6px; }
      .org-meta { display: flex; justify-content: space-between; align-items: baseline; }
      .org-name {
        font-size: 13px; font-weight: 600;
        color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .org-total {
        font-size: 14px; font-family: var(--font-mono); font-weight: 700;
        color: var(--text-secondary);
      }
      .org-bar-wrap {
        height: 6px; display: flex; border-radius: 3px; overflow: hidden;
        background: var(--ring-track);
      }
      .org-bar-segment { height: 100%; }
      .org-breakdown {
        display: flex; gap: 12px;
        font-size: 10px; color: var(--text-dim); font-family: var(--font-mono);
      }
    </style>`;
}
