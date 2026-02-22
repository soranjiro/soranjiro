export function renderHeader(data) {
  const d = data.profile;
  const roles = data.userProfile?.roles || [];
  const rolesHtml = roles.map(r => `<span class="role-tag">${r}</span>`).join('');

  return `
    <header class="hero anim d1">
      <div class="hero-top">
        <div class="hero-identity">
          <div class="avatar-wrap">
            <img src="${d.avatarUrl}" alt="${d.login}" class="avatar" />
            <div class="avatar-ring"></div>
            <span class="status-dot"></span>
          </div>
          <div class="hero-meta">
            <p class="hero-greeting">Hello, I'm</p>
            <h1 class="hero-name">${d.login}</h1>
            <div class="hero-roles">${rolesHtml}</div>
          </div>
        </div>
        <div class="hero-right">
          <div class="hero-badges">
            <div class="hero-badge"><span class="hero-badge-val">${d.joinedYearsAgo}+</span><span class="hero-badge-label">Years</span></div>
            <div class="badge-divider"></div>
            <div class="hero-badge"><span class="hero-badge-val">${data.repoStats.total}</span><span class="hero-badge-label">Repos</span></div>
            <div class="badge-divider"></div>
            <div class="hero-badge"><span class="hero-badge-val">${d.followers}</span><span class="hero-badge-label">Followers</span></div>
          </div>
          <p class="llm-note">This portfolio is auto-generated from GitHub data using LLM</p>
        </div>
      </div>
    </header>

    <div class="summary-block anim d2">
      <div class="summary-accent"></div>
      <div class="summary-content">
        <p class="summary-label">Profile</p>
        <p class="summary-text">${data.aiSummary || d.bio || ''}</p>
      </div>
    </div>

    <style>
      .hero {
        margin-bottom: 20px;
        padding: 0 4px;
      }
      .hero-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 32px;
      }
      .hero-identity { display: flex; align-items: center; gap: 24px; }
      .avatar-wrap {
        position: relative;
        width: 80px; height: 80px;
        flex-shrink: 0;
      }
      .avatar {
        width: 80px; height: 80px;
        border-radius: 50%;
        object-fit: cover;
        position: relative; z-index: 1;
      }
      .avatar-ring {
        position: absolute; inset: -3px;
        border-radius: 50%;
        border: 1.5px solid var(--accent);
        opacity: 0.4;
      }
      .status-dot {
        position: absolute; bottom: 4px; right: 4px;
        width: 12px; height: 12px;
        border-radius: 50%;
        background: var(--green);
        border: 2.5px solid var(--bg);
        z-index: 2;
        animation: pulse 2.5s ease-in-out infinite;
      }
      .hero-greeting {
        font-size: 12px;
        color: var(--accent);
        font-weight: 500;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        margin-bottom: 2px;
      }
      .hero-name {
        font-family: var(--font-serif);
        font-size: 44px;
        font-weight: 400;
        line-height: 1.1;
        letter-spacing: -0.5px;
        color: var(--text-primary);
      }
      .hero-roles {
        display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap;
      }
      .role-tag {
        font-size: 11px;
        font-weight: 500;
        padding: 4px 12px;
        border-radius: 100px;
        background: var(--accent-soft);
        color: var(--accent);
        border: 1px solid rgba(232,168,73,0.15);
        letter-spacing: 0.3px;
      }
      .hero-right {
        display: flex; flex-direction: column; align-items: flex-end; gap: 12px;
        flex-shrink: 0;
      }
      .hero-badges {
        display: flex; align-items: center; gap: 0;
        background: var(--card-bg);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        padding: 12px 0;
      }
      .hero-badge {
        display: flex; flex-direction: column; align-items: center; gap: 1px;
        padding: 0 20px;
      }
      .hero-badge-val {
        font-size: 20px; font-weight: 700;
        font-family: var(--font-mono);
        color: var(--text-primary);
        line-height: 1;
      }
      .hero-badge-label {
        font-size: 9px; font-weight: 600;
        text-transform: uppercase; letter-spacing: 1.5px;
        color: var(--text-dim);
      }
      .badge-divider {
        width: 1px; height: 28px;
        background: var(--border);
      }
      .llm-note {
        font-size: 9px;
        color: var(--text-dim);
        letter-spacing: 0.5px;
        text-align: right;
        opacity: 0.6;
        max-width: 200px;
      }
      .summary-block {
        display: flex;
        background: var(--card-bg);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        overflow: hidden;
        margin-bottom: 20px;
        transition: border-color 0.3s;
      }
      .summary-block:hover { border-color: var(--border-hover); }
      .summary-accent {
        width: 3px; flex-shrink: 0;
        background: linear-gradient(180deg, var(--accent), var(--accent-soft));
      }
      .summary-content { padding: 24px 28px; }
      .summary-label {
        font-size: 10px; font-weight: 600;
        letter-spacing: 2px; text-transform: uppercase;
        color: var(--accent);
        margin-bottom: 8px;
      }
      .summary-text {
        font-size: 14px;
        color: var(--text-secondary);
        line-height: 1.8;
      }
      @media (max-width: 768px) {
        .hero-top { flex-direction: column; gap: 20px; }
        .hero-right { align-items: flex-start; }
        .hero-name { font-size: 36px; }
      }
    </style>`;
}
