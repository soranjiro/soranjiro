export function renderStats(data) {
  const items = [
    { value: data.activity.totalCommits, label: "Commits", icon: "M", color: "var(--green)" },
    { value: data.activity.prs, label: "Pull Requests", icon: "⇅", color: "var(--blue)" },
    { value: data.activity.reviews, label: "Reviews", icon: "◎", color: "var(--purple)" },
    { value: data.activity.issues, label: "Issues", icon: "◈", color: "var(--rose)" },
    { value: data.activity.contributedTo, label: "Contributed To", icon: "⬡", color: "var(--cyan)" },
    { value: data.profile.organizations, label: "Organizations", icon: "⊞", color: "var(--accent)" },
  ];

  const cards = items.map((s, i) => {
    const formatted = s.value >= 1000 ? (s.value / 1000).toFixed(1) + 'k' : s.value.toString();
    return `
    <div class="metric anim d${i + 3}">
      <div class="metric-icon" style="color:${s.color};background:${s.color}11">${s.icon}</div>
      <div class="metric-body">
        <span class="metric-value" style="color:${s.color}">${formatted}</span>
        <span class="metric-label">${s.label}</span>
      </div>
    </div>`;
  }).join('');

  return `
    <div class="metrics-strip">${cards}</div>
    <style>
      .metrics-strip {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 12px;
        margin-bottom: 20px;
      }
      @media (max-width: 1024px) { .metrics-strip { grid-template-columns: repeat(3, 1fr); } }
      @media (max-width: 640px) { .metrics-strip { grid-template-columns: repeat(2, 1fr); } }

      .metric {
        background: var(--card-bg);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        padding: 18px 16px;
        display: flex; align-items: center; gap: 14px;
        transition: border-color 0.3s, transform 0.3s var(--ease-out);
        cursor: default;
      }
      .metric:hover {
        border-color: var(--border-hover);
        transform: translateY(-2px);
      }
      .metric-icon {
        width: 36px; height: 36px;
        border-radius: var(--radius-xs);
        display: flex; align-items: center; justify-content: center;
        font-size: 16px; font-weight: 700;
        flex-shrink: 0;
      }
      .metric-body { display: flex; flex-direction: column; }
      .metric-value {
        font-size: 22px;
        font-weight: 700;
        font-family: var(--font-mono);
        line-height: 1;
        letter-spacing: -0.5px;
      }
      .metric-label {
        font-size: 10px;
        font-weight: 500;
        color: var(--text-dim);
        letter-spacing: 0.5px;
        margin-top: 3px;
      }
    </style>`;
}
