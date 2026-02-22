export function renderCopilot(data) {
  const cop = data.copilot || {};
  const mentions = cop.copilotMentions || 0;
  const coauthored = cop.coauthoredCommits || 0;
  const total = data.activity.totalCommits || 1;
  const aiPct = ((coauthored / total) * 100).toFixed(2);

  const ringPct = Math.min((mentions / total) * 100 * 20, 100);
  const circumference = 2 * Math.PI * 40;
  const dashOffset = circumference * (1 - ringPct / 100);

  return `
    <div class="card span-4 anim d7">
      <div class="card-label">AI Collaboration</div>
      <div class="copilot-layout">
        <div class="copilot-ring-wrap">
          <svg class="copilot-ring" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--ring-track)" stroke-width="4"/>
            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--purple)" stroke-width="4"
              stroke-linecap="round" stroke-dasharray="${circumference.toFixed(1)}"
              stroke-dashoffset="${dashOffset.toFixed(1)}"
              transform="rotate(-90 50 50)" style="transition: stroke-dashoffset 1.2s var(--ease-out)"/>
          </svg>
          <div class="copilot-ring-center">
            <span class="copilot-ring-val">${mentions}</span>
            <span class="copilot-ring-sub">mentions</span>
          </div>
        </div>
        <div class="copilot-details">
          <div class="copilot-stat">
            <span class="copilot-stat-val">${coauthored}</span>
            <span class="copilot-stat-label">Co-authored commits</span>
          </div>
          <div class="copilot-divider"></div>
          <div class="copilot-stat">
            <span class="copilot-stat-val">${aiPct}%</span>
            <span class="copilot-stat-label">AI co-authored rate</span>
          </div>
        </div>
      </div>
    </div>
    <style>
      .copilot-layout { display: flex; align-items: center; gap: 24px; }
      .copilot-ring-wrap {
        position: relative; width: 100px; height: 100px; flex-shrink: 0;
      }
      .copilot-ring { width: 100%; height: 100%; }
      .copilot-ring-center {
        position: absolute; inset: 0;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
      }
      .copilot-ring-val {
        font-size: 24px; font-weight: 700;
        font-family: var(--font-mono);
        color: var(--purple); line-height: 1;
      }
      .copilot-ring-sub { font-size: 9px; color: var(--text-dim); margin-top: 2px; letter-spacing: 0.5px; }
      .copilot-details { flex: 1; display: flex; flex-direction: column; gap: 10px; }
      .copilot-stat { }
      .copilot-stat-val {
        font-size: 18px; font-weight: 700;
        font-family: var(--font-mono); color: var(--text-primary);
        display: block; line-height: 1;
      }
      .copilot-stat-label { font-size: 11px; color: var(--text-dim); margin-top: 2px; display: block; }
      .copilot-divider { height: 1px; background: var(--border); }
    </style>`;
}
