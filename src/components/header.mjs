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
          <button class="theme-toggle" id="themeToggle" aria-label="Toggle theme">☀</button>
          <div class="hero-badges">
            <div class="hero-badge"><span class="hero-badge-val">${d.joinedYearsAgo}+</span><span class="hero-badge-label">Years</span></div>
            <div class="badge-divider"></div>
            <div class="hero-badge"><span class="hero-badge-val">${data.repoStats.total}</span><span class="hero-badge-label">Repos</span></div>
            <div class="badge-divider"></div>
            <div class="hero-badge"><span class="hero-badge-val">${d.followers}</span><span class="hero-badge-label">Followers</span></div>
          </div>
          <p class="llm-note">Auto-generated from GitHub data</p>
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
      .hero { margin-bottom: 24px; padding: 0 4px; }
      .hero-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 32px;
      }
      .hero-identity { display: flex; align-items: center; gap: 20px; }
      .avatar-wrap {
        position: relative;
        width: 72px; height: 72px;
        flex-shrink: 0;
      }
      .avatar {
        width: 72px; height: 72px;
        border-radius: 50%;
        object-fit: cover;
        position: relative; z-index: 1;
      }
      .avatar-ring {
        position: absolute; inset: -4px;
        border-radius: 50%;
        border: 1.5px solid var(--accent);
        opacity: 0.3;
      }
      .status-dot {
        position: absolute; bottom: 3px; right: 3px;
        width: 10px; height: 10px;
        border-radius: 50%;
        background: var(--matcha);
        border: 2px solid var(--bg);
        z-index: 2;
        animation: pulse 3s ease-in-out infinite;
      }
      .hero-greeting {
        font-size: 11px;
        color: var(--accent);
        font-weight: 500;
        letter-spacing: 2px;
        text-transform: uppercase;
        margin-bottom: 4px;
      }
      .hero-name {
        font-family: var(--font-serif);
        font-size: 40px;
        font-weight: 400;
        line-height: 1.1;
        letter-spacing: 1px;
        color: var(--text-primary);
      }
      .hero-roles {
        display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap;
      }
      .role-tag {
        font-size: 10px;
        font-weight: 500;
        padding: 4px 14px;
        border-radius: 100px;
        background: var(--accent-soft);
        color: var(--accent);
        border: 1px solid var(--accent-glow);
        letter-spacing: 0.4px;
      }
      .hero-right {
        display: flex; flex-direction: column; align-items: flex-end; gap: 10px;
        flex-shrink: 0;
      }
      .hero-badges {
        display: flex; align-items: center;
        background: var(--card-bg-solid);
        backdrop-filter: blur(8px);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        padding: 10px 0;
      }
      .hero-badge {
        display: flex; flex-direction: column; align-items: center; gap: 2px;
        padding: 0 18px;
      }
      .hero-badge-val {
        font-size: 18px; font-weight: 700;
        font-family: var(--font-mono);
        color: var(--text-primary);
        line-height: 1;
      }
      .hero-badge-label {
        font-size: 8px; font-weight: 600;
        text-transform: uppercase; letter-spacing: 1.5px;
        color: var(--text-dim);
      }
      .badge-divider {
        width: 1px; height: 24px;
        background: var(--border);
      }
      .llm-note {
        font-size: 9px;
        color: var(--text-dim);
        letter-spacing: 0.5px;
        opacity: 0.5;
      }
      .summary-block {
        display: flex;
        background: var(--card-bg-solid);
        backdrop-filter: blur(8px);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        overflow: hidden;
        margin-bottom: 0;
        transition: border-color 0.3s;
      }
      .summary-block:hover { border-color: var(--border-hover); }
      .summary-accent {
        width: 3px; flex-shrink: 0;
        background: linear-gradient(180deg, var(--accent), transparent);
      }
      .summary-content { padding: 20px 24px; }
      .summary-label {
        font-size: 9px; font-weight: 700;
        letter-spacing: 2px; text-transform: uppercase;
        color: var(--accent);
        margin-bottom: 8px;
      }
      .summary-text {
        font-size: 13px;
        color: var(--text-secondary);
        line-height: 1.9;
      }
      @media (max-width: 768px) {
        .hero-top { flex-direction: column; gap: 20px; }
        .hero-right { align-items: flex-start; }
        .hero-name { font-size: 32px; }
      }
    </style>`;
}
