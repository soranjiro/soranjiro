export function renderStyles() {
  return `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist+Mono:wght@400;500;600;700&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');

    :root {
      --bg: #08090c;
      --bg-elevated: #0e1015;
      --card-bg: #12141a;
      --card-bg-hover: #181b23;
      --card-inner: #0c0d11;
      --text-primary: #f0ede6;
      --text-secondary: #8a8680;
      --text-dim: #4a4742;
      --border: rgba(255,255,255,0.06);
      --border-hover: rgba(255,255,255,0.12);
      --accent: #e8a849;
      --accent-soft: rgba(232,168,73,0.12);
      --accent-glow: rgba(232,168,73,0.06);
      --green: #4ade80;
      --green-soft: rgba(74,222,128,0.12);
      --blue: #60a5fa;
      --blue-soft: rgba(96,165,250,0.12);
      --purple: #c084fc;
      --purple-soft: rgba(192,132,252,0.12);
      --rose: #fb7185;
      --rose-soft: rgba(251,113,133,0.12);
      --cyan: #22d3ee;
      --cyan-soft: rgba(34,211,238,0.12);
      --noise-opacity: 0.6;
      --ring-track: rgba(255,255,255,0.04);
      --chart-grid: rgba(255,255,255,0.04);
      --chart-tick: #4a4742;
      --chart-label: #8a8680;
      --chart-tooltip-bg: #1a1c22;
      --chart-tooltip-title: #f0ede6;
      --chart-tooltip-body: #8a8680;
      --chart-tooltip-border: rgba(255,255,255,0.08);
      --chart-point-border: #08090c;
      --radius: 20px;
      --radius-sm: 12px;
      --radius-xs: 8px;
      --font-serif: 'Instrument Serif', Georgia, serif;
      --font-sans: 'DM Sans', -apple-system, sans-serif;
      --font-mono: 'Geist Mono', 'SF Mono', monospace;
      --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
      --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    [data-theme="light"] {
      --bg: #f8f7f4;
      --bg-elevated: #ffffff;
      --card-bg: #ffffff;
      --card-bg-hover: #f5f4f1;
      --card-inner: #f0efec;
      --text-primary: #1a1a1a;
      --text-secondary: #5a5a5a;
      --text-dim: #9a9a9a;
      --border: rgba(0,0,0,0.08);
      --border-hover: rgba(0,0,0,0.16);
      --accent: #c98b2f;
      --accent-soft: rgba(201,139,47,0.10);
      --accent-glow: rgba(201,139,47,0.06);
      --green: #22c55e;
      --green-soft: rgba(34,197,94,0.10);
      --blue: #3b82f6;
      --blue-soft: rgba(59,130,246,0.10);
      --purple: #a855f7;
      --purple-soft: rgba(168,85,247,0.10);
      --rose: #f43f5e;
      --rose-soft: rgba(244,63,94,0.10);
      --cyan: #06b6d4;
      --cyan-soft: rgba(6,182,212,0.10);
      --noise-opacity: 0.15;
      --ring-track: rgba(0,0,0,0.05);
      --chart-grid: rgba(0,0,0,0.06);
      --chart-tick: #9a9a9a;
      --chart-label: #5a5a5a;
      --chart-tooltip-bg: #ffffff;
      --chart-tooltip-title: #1a1a1a;
      --chart-tooltip-body: #5a5a5a;
      --chart-tooltip-border: rgba(0,0,0,0.1);
      --chart-point-border: #ffffff;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    html { scroll-behavior: smooth; }

    body {
      font-family: var(--font-sans);
      background: var(--bg);
      color: var(--text-primary);
      line-height: 1.6;
      min-height: 100vh;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      overflow-x: hidden;
      transition: background 0.3s, color 0.3s;
    }

    .page-bg {
      position: fixed; inset: 0; z-index: -1; pointer-events: none;
      background:
        radial-gradient(ellipse 60% 50% at 20% 0%, rgba(232,168,73,0.04) 0%, transparent 60%),
        radial-gradient(ellipse 40% 50% at 80% 100%, rgba(96,165,250,0.03) 0%, transparent 50%),
        var(--bg);
      transition: background 0.3s;
    }

    [data-theme="light"] .page-bg {
      background:
        radial-gradient(ellipse 60% 50% at 20% 0%, rgba(201,139,47,0.06) 0%, transparent 60%),
        radial-gradient(ellipse 40% 50% at 80% 100%, rgba(59,130,246,0.04) 0%, transparent 50%),
        var(--bg);
    }

    .page-bg::after {
      content: '';
      position: absolute; inset: 0;
      background: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.015'/%3E%3C/svg%3E");
      background-size: 200px;
      opacity: var(--noise-opacity);
    }

    .theme-toggle {
      width: 40px; height: 40px;
      border-radius: 50%;
      border: 1px solid var(--border);
      background: var(--card-bg);
      color: var(--text-secondary);
      font-size: 18px;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: border-color 0.3s, background 0.3s, transform 0.25s var(--ease-out);
      flex-shrink: 0;
    }
    .theme-toggle:hover {
      border-color: var(--accent);
      transform: scale(1.08);
    }

    .container {
      max-width: 1120px;
      margin: 0 auto;
      padding: 56px 28px 80px;
    }

    /* ── Cards ── */
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 28px;
      position: relative;
      overflow: hidden;
      transition: border-color 0.4s, transform 0.4s var(--ease-out), box-shadow 0.4s;
    }
    .card:hover {
      border-color: var(--border-hover);
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgba(0,0,0,0.3);
    }
    [data-theme="light"] .card:hover {
      box-shadow: 0 12px 40px rgba(0,0,0,0.08);
    }
    [data-theme="light"] .card {
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }

    .card-label {
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--text-dim);
      margin-bottom: 18px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .card-label::before {
      content: '';
      width: 4px; height: 4px;
      border-radius: 50%;
      background: var(--accent);
      box-shadow: 0 0 8px var(--accent);
    }

    /* ── Bento Grid ── */
    .bento {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: 16px;
    }
    .span-3 { grid-column: span 3; }
    .span-4 { grid-column: span 4; }
    .span-5 { grid-column: span 5; }
    .span-6 { grid-column: span 6; }
    .span-7 { grid-column: span 7; }
    .span-8 { grid-column: span 8; }
    .span-12 { grid-column: span 12; }

    @media (max-width: 1024px) {
      .container { padding: 32px 20px 60px; }
      .span-3, .span-4, .span-5 { grid-column: span 6; }
      .span-7, .span-8 { grid-column: span 12; }
    }
    @media (max-width: 640px) {
      .bento { gap: 12px; }
      .span-3, .span-4, .span-5, .span-6, .span-7, .span-8, .span-12 { grid-column: span 12; }
      .card { padding: 20px; border-radius: 16px; }
    }

    /* ── Animations ── */
    @keyframes reveal {
      from { opacity: 0; transform: translateY(24px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideRight {
      from { opacity: 0; transform: translateX(-12px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .anim { animation: reveal 0.7s var(--ease-out) both; }
    .d1 { animation-delay: 0.05s; }
    .d2 { animation-delay: 0.12s; }
    .d3 { animation-delay: 0.18s; }
    .d4 { animation-delay: 0.24s; }
    .d5 { animation-delay: 0.30s; }
    .d6 { animation-delay: 0.36s; }
    .d7 { animation-delay: 0.42s; }
    .d8 { animation-delay: 0.48s; }
    .d9 { animation-delay: 0.54s; }
    .d10 { animation-delay: 0.60s; }
    .d11 { animation-delay: 0.66s; }
    .d12 { animation-delay: 0.72s; }

    /* ── Chart canvas ── */
    .chart-wrap {
      position: relative;
      width: 100%;
    }

    /* ── Section divider ── */
    .section-gap { margin-top: 16px; }

    /* ── Selection color ── */
    ::selection {
      background: var(--accent);
      color: var(--bg);
    }

    /* ── Scrollbar ── */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--text-dim); border-radius: 3px; }

    [data-theme="light"] ::-webkit-scrollbar-thumb { background: #ccc; }
  </style>`;
}
