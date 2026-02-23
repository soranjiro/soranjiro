export function renderStyles() {
  return `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Shippori+Mincho+B1:wght@400;500;600;700&family=M+PLUS+Rounded+1c:wght@300;400;500;700&family=Geist+Mono:wght@400;500;600;700&display=swap');

    :root {
      --bg: #17140f;
      --bg-elevated: #1f1b16;
      --card-bg-solid: rgba(35,30,24,0.5);
      --text-primary: #ede6d9;
      --text-secondary: #a69882;
      --text-dim: #6b5e4f;
      --border: rgba(237,230,217,0.07);
      --border-hover: rgba(237,230,217,0.14);
      --accent: #b58a68;
      --accent-soft: rgba(181,138,104,0.12);
      --accent-glow: rgba(181,138,104,0.06);
      --matcha: #759672;
      --matcha-soft: rgba(117,150,114,0.12);
      --sakura: #c28289;
      --sakura-soft: rgba(194,130,137,0.12);
      --fuji: #a386a8;
      --fuji-soft: rgba(163,134,168,0.12);
      --sora: #7698b8;
      --sora-soft: rgba(118,152,184,0.12);
      --hisui: #76aba6;
      --hisui-soft: rgba(118,171,166,0.12);
      --ring-track: rgba(237,230,217,0.06);
      --chart-grid: rgba(237,230,217,0.05);
      --chart-tick: #6b5e4f;
      --chart-label: #a69882;
      --chart-tooltip-bg: rgba(35,30,24,0.95);
      --chart-tooltip-title: #ede6d9;
      --chart-tooltip-body: #a69882;
      --chart-tooltip-border: rgba(237,230,217,0.1);
      --chart-point-border: #17140f;
      --noise-opacity: 0.5;
      --radius: 24px;
      --radius-sm: 16px;
      --radius-xs: 10px;
      --font-serif: 'Shippori Mincho B1', Georgia, serif;
      --font-sans: 'M PLUS Rounded 1c', -apple-system, sans-serif;
      --font-mono: 'Geist Mono', 'SF Mono', monospace;
      --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
      --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    [data-theme="light"] {
      --bg: #f7f2ea;
      --bg-elevated: #ffffff;
      --card-bg-solid: rgba(255,255,255,0.55);
      --text-primary: #2c241d;
      --text-secondary: #6b5e4f;
      --text-dim: #a89882;
      --border: rgba(44,36,29,0.08);
      --border-hover: rgba(44,36,29,0.15);
      --accent: #a67246;
      --accent-soft: rgba(166,114,70,0.10);
      --accent-glow: rgba(166,114,70,0.05);
      --matcha: #547d50;
      --matcha-soft: rgba(84,125,80,0.10);
      --sakura: #b5656c;
      --sakura-soft: rgba(181,101,108,0.10);
      --fuji: #7d6382;
      --fuji-soft: rgba(125,99,130,0.10);
      --sora: #547a99;
      --sora-soft: rgba(84,122,153,0.10);
      --hisui: #548f8a;
      --hisui-soft: rgba(84,143,138,0.10);
      --ring-track: rgba(44,36,29,0.06);
      --chart-grid: rgba(44,36,29,0.06);
      --chart-tick: #a89882;
      --chart-label: #6b5e4f;
      --chart-tooltip-bg: rgba(255,255,255,0.95);
      --chart-tooltip-title: #2c241d;
      --chart-tooltip-body: #6b5e4f;
      --chart-tooltip-border: rgba(44,36,29,0.1);
      --chart-point-border: #f7f2ea;
      --noise-opacity: 0.18;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }

    body {
      font-family: var(--font-sans);
      background: var(--bg);
      color: var(--text-primary);
      line-height: 1.7;
      min-height: 100vh;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
      transition: background 0.4s, color 0.4s;
      font-weight: 400;
    }

    .page-bg {
      position: fixed; inset: 0; z-index: -1; pointer-events: none;
      background:
        radial-gradient(ellipse 50% 40% at 12% 8%, rgba(126,168,122,0.07) 0%, transparent 70%),
        radial-gradient(ellipse 35% 30% at 78% 42%, rgba(212,134,142,0.05) 0%, transparent 60%),
        radial-gradient(ellipse 45% 35% at 55% 88%, rgba(199,149,109,0.04) 0%, transparent 65%),
        var(--bg);
      transition: background 0.4s;
    }
    [data-theme="light"] .page-bg {
      background:
        radial-gradient(ellipse 50% 40% at 12% 8%, rgba(90,138,86,0.08) 0%, transparent 70%),
        radial-gradient(ellipse 35% 30% at 78% 42%, rgba(199,107,115,0.06) 0%, transparent 60%),
        radial-gradient(ellipse 45% 35% at 55% 88%, rgba(184,120,74,0.05) 0%, transparent 65%),
        var(--bg);
    }

    .page-bg::before {
      content: '';
      position: absolute; inset: 0;
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='28' viewBox='0 0 56 28'%3E%3Cg fill='none' stroke='%23c7956d' stroke-width='0.4'%3E%3Ccircle cx='28' cy='28' r='24'/%3E%3Ccircle cx='28' cy='28' r='18'/%3E%3Ccircle cx='28' cy='28' r='12'/%3E%3Ccircle cx='0' cy='28' r='24'/%3E%3Ccircle cx='0' cy='28' r='18'/%3E%3Ccircle cx='0' cy='28' r='12'/%3E%3Ccircle cx='56' cy='28' r='24'/%3E%3Ccircle cx='56' cy='28' r='18'/%3E%3Ccircle cx='56' cy='28' r='12'/%3E%3C/g%3E%3C/svg%3E") repeat;
      background-size: 112px 56px;
      opacity: 0.02;
    }
    [data-theme="light"] .page-bg::before { opacity: 0.04; }

    .page-bg::after {
      content: '';
      position: absolute; inset: 0;
      background: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.02'/%3E%3C/svg%3E");
      background-size: 200px;
      opacity: var(--noise-opacity);
    }

    .container {
      max-width: 1060px;
      margin: 0 auto;
      padding: 48px 32px 64px;
    }

    .page-section { margin-bottom: 0; }

    .section-title {
      font-family: var(--font-serif);
      font-size: 20px;
      font-weight: 500;
      color: var(--text-primary);
      letter-spacing: 0.5px;
      margin-bottom: 18px;
      position: relative;
      padding-bottom: 10px;
    }
    .section-title::after {
      content: '';
      position: absolute;
      left: 0; bottom: 0;
      width: 40px; height: 1.5px;
      background: linear-gradient(90deg, var(--accent), transparent);
      border-radius: 1px;
    }
    .section-jp {
      font-size: 12px;
      font-weight: 400;
      color: var(--text-dim);
      letter-spacing: 2px;
      margin-left: 4px;
    }

    .section-divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--border), transparent);
      margin: 36px 0;
      position: relative;
    }
    .section-divider::after {
      content: '';
      position: absolute;
      left: 50%; top: 50%;
      transform: translate(-50%, -50%);
      width: 5px; height: 5px;
      border-radius: 50%;
      background: var(--accent);
      opacity: 0.25;
    }

    .flow-row {
      display: flex;
      gap: 32px;
      align-items: flex-start;
    }
    .flow-col-main { flex: 3; min-width: 0; }
    .flow-col-side { flex: 2; min-width: 0; }
    @media (max-width: 768px) {
      .flow-row { flex-direction: column; gap: 24px; }
    }

    .glass-card {
      background: var(--card-bg-solid);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 24px;
      transition: border-color 0.3s, transform 0.35s var(--ease-out), box-shadow 0.35s;
    }
    .glass-card:hover {
      border-color: var(--border-hover);
      transform: translateY(-3px);
      box-shadow: 0 16px 48px rgba(0,0,0,0.12);
    }
    [data-theme="light"] .glass-card:hover {
      box-shadow: 0 16px 48px rgba(0,0,0,0.06);
    }

    .sub-label {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--text-dim);
      margin-bottom: 14px;
    }

    .theme-toggle {
      width: 36px; height: 36px;
      border-radius: 50%;
      border: 1px solid var(--border);
      background: var(--card-bg-solid);
      backdrop-filter: blur(8px);
      color: var(--text-secondary);
      font-size: 15px;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: border-color 0.3s, transform 0.25s var(--ease-out);
      flex-shrink: 0;
    }
    .theme-toggle:hover {
      border-color: var(--accent);
      transform: scale(1.1);
    }

    .chart-wrap {
      position: relative;
      width: 100%;
    }

    @keyframes reveal {
      from { opacity: 0; transform: translateY(18px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideRight {
      from { opacity: 0; transform: translateX(-10px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.35; }
    }

    .anim { animation: reveal 0.8s var(--ease-out) both; }
    .d1 { animation-delay: 0.05s; }
    .d2 { animation-delay: 0.12s; }
    .d3 { animation-delay: 0.20s; }
    .d4 { animation-delay: 0.28s; }
    .d5 { animation-delay: 0.36s; }
    .d6 { animation-delay: 0.44s; }
    .d7 { animation-delay: 0.52s; }
    .d8 { animation-delay: 0.60s; }

    ::selection {
      background: var(--accent);
      color: var(--bg);
    }

    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--text-dim); border-radius: 3px; }
    [data-theme="light"] ::-webkit-scrollbar-thumb { background: #ccc; }

    .activity-inner {
      display: flex; gap: 28px; align-items: center; justify-content: space-between;
    }
    .radar-wrap {
      width: 260px; height: 260px; flex-shrink: 0;
      position: relative;
      animation: radarBloom 1s var(--ease-spring) 0.6s both;
    }
    @keyframes radarBloom {
      from { opacity: 0; transform: scale(0.35); }
      to { opacity: 1; transform: scale(1); }
    }
    .activity-stats-container { flex: 1; display: flex; gap: 24px; align-items: center; }
    .activity-stats-panel { flex: 1; min-width: 0; }
    .activity-ai-panel { flex: 1; min-width: 0; padding-left: 24px; border-left: 1px solid var(--border); }
    .stats-group { display: flex; flex-direction: column; gap: 10px; }
    .stats-divider {
      height: 1px; margin: 14px 0;
      background: linear-gradient(90deg, var(--border), transparent 70%);
    }
    .stats-group-label {
      font-size: 8px; font-weight: 700; letter-spacing: 1.5px;
      text-transform: uppercase; color: var(--sakura); margin-bottom: 2px;
    }
    .act-stat { display: flex; align-items: center; gap: 10px; }
    .act-stat-dot {
      width: 4px; height: 14px; border-radius: 2px; flex-shrink: 0;
    }
    .act-stat-val {
      font-size: 16px; font-family: var(--font-mono);
      font-weight: 600; color: var(--text-primary);
      min-width: 52px; line-height: 1;
    }
    .act-stat-label { font-size: 11px; color: var(--text-dim); }

    .ai-badge {
      font-size: 7px; font-weight: 600; padding: 2px 8px;
      border-radius: 100px; background: var(--fuji-soft);
      color: var(--fuji); letter-spacing: 0.5px;
      margin-left: 8px; vertical-align: middle;
      text-transform: none;
    }
    .summary-research {
      font-size: 12px; color: var(--accent);
      margin-top: 10px; line-height: 1.9;
      opacity: 0.85;
    }

    .scroll-progress {
      position: fixed; left: 0; top: 0;
      width: 2px; height: 0%;
      background: linear-gradient(180deg, var(--accent), var(--sakura));
      z-index: 100; opacity: 0.35;
      border-radius: 0 0 2px 0;
      transition: height 0.15s linear;
    }

    @media (max-width: 640px) {
      .container { padding: 32px 20px 60px; }
      .glass-card { padding: 18px; border-radius: 18px; }
      .section-title { font-size: 18px; }
      .activity-inner { flex-direction: column; }
      .activity-stats-container { flex-direction: column; gap: 16px; align-items: stretch; }
      .activity-ai-panel { padding-left: 0; border-left: none; padding-top: 16px; border-top: 1px solid var(--border); }
      .radar-wrap { width: 200px; height: 200px; margin: 0 auto; }
    }
  </style>`;
}
