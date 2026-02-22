export function renderCopilot(data) {
  const cop = data.copilot || {};
  const mentions = cop.copilotMentions || 0;
  const coauthored = cop.coauthoredCommits || 0;
  const total = data.activity.totalCommits || 1;
  const aiPct = ((coauthored / total) * 100).toFixed(2);

  const outerR = 44;
  const innerR = 36;
  const outerC = 2 * Math.PI * outerR;
  const innerC = 2 * Math.PI * innerR;
  const outerPct = Math.min((mentions / total) * 100 * 20, 100);
  const innerPct = Math.min((coauthored / total) * 100, 100);

  return `
    <div class="ai-area">
      <div class="sub-label">AI Collaboration</div>
      <div class="ai-layout">
        <div class="ai-ring-wrap">
          <svg class="ai-ring" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="${outerR}" fill="none" stroke="var(--ring-track)" stroke-width="3"/>
            <circle cx="50" cy="50" r="${outerR}" fill="none" stroke="var(--fuji)" stroke-width="3"
              stroke-linecap="round" stroke-dasharray="${outerC.toFixed(1)}"
              stroke-dashoffset="${(outerC * (1 - outerPct / 100)).toFixed(1)}"
              transform="rotate(-90 50 50)" style="transition: stroke-dashoffset 1.2s var(--ease-out)"/>
            <circle cx="50" cy="50" r="${innerR}" fill="none" stroke="var(--ring-track)" stroke-width="2"/>
            <circle cx="50" cy="50" r="${innerR}" fill="none" stroke="var(--sora)" stroke-width="2"
              stroke-linecap="round" stroke-dasharray="${innerC.toFixed(1)}"
              stroke-dashoffset="${(innerC * (1 - innerPct / 100)).toFixed(1)}"
              transform="rotate(-90 50 50)" style="transition: stroke-dashoffset 1.2s var(--ease-out) 0.3s"/>
          </svg>
          <div class="ai-ring-label">
            <span class="ai-ring-val">${mentions}</span>
            <span class="ai-ring-sub">AI mentions</span>
          </div>
        </div>
        <div class="ai-stats">
          <div class="ai-stat-item">
            <span class="ai-stat-num">${coauthored}</span>
            <span class="ai-stat-text">co-authored commits</span>
          </div>
          <div class="ai-stat-item">
            <span class="ai-stat-num">${aiPct}%</span>
            <span class="ai-stat-text">AI collaboration rate</span>
          </div>
          <div class="ai-stat-item">
            <span class="ai-stat-num">${total.toLocaleString()}</span>
            <span class="ai-stat-text">total commits</span>
          </div>
        </div>
      </div>
    </div>
    <style>
      .ai-layout { display: flex; align-items: center; gap: 28px; }
      .ai-ring-wrap { position: relative; width: 120px; height: 120px; flex-shrink: 0; }
      .ai-ring { width: 100%; height: 100%; }
      .ai-ring-label {
        position: absolute; inset: 0;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
      }
      .ai-ring-val {
        font-size: 26px; font-weight: 700;
        font-family: var(--font-mono);
        color: var(--fuji); line-height: 1;
      }
      .ai-ring-sub { font-size: 8px; color: var(--text-dim); margin-top: 3px; letter-spacing: 0.5px; font-weight: 500; }
      .ai-stats { display: flex; flex-direction: column; gap: 14px; }
      .ai-stat-num {
        font-size: 20px; font-weight: 700;
        font-family: var(--font-mono); color: var(--text-primary);
        display: block; line-height: 1;
      }
      .ai-stat-text { font-size: 10px; color: var(--text-dim); margin-top: 2px; display: block; letter-spacing: 0.3px; }
      @media (max-width: 640px) {
        .ai-layout { flex-direction: column; text-align: center; }
        .ai-stats { align-items: center; }
      }
    </style>`;
}
