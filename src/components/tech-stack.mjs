export function renderTechStack(data) {
  const langMap = {};
  (data.overallLanguages || []).forEach(l => { langMap[l.name] = true; });

  const iconMap = {
    'Ruby':       { icon: 'ruby-plain', label: 'Ruby', cat: 'Languages' },
    'Python':     { icon: 'python-plain', label: 'Python', cat: 'Languages' },
    'Go':         { icon: 'go-original-wordmark', label: 'Go', cat: 'Languages' },
    'TypeScript': { icon: 'typescript-plain', label: 'TypeScript', cat: 'Languages' },
    'JavaScript': { icon: 'javascript-plain', label: 'JavaScript', cat: 'Languages' },
    'Rust':       { icon: 'rust-original', label: 'Rust', cat: 'Languages' },
    'C++':        { icon: 'cplusplus-plain', label: 'C++', cat: 'Languages' },
    'Java':       { icon: 'java-plain', label: 'Java', cat: 'Languages' },
    'C':          { icon: 'c-plain', label: 'C', cat: 'Languages' },
    'C#':         { icon: 'csharp-plain', label: 'C#', cat: 'Languages' },
    'PHP':        { icon: 'php-plain', label: 'PHP', cat: 'Languages' },
    'Swift':      { icon: 'swift-plain', label: 'Swift', cat: 'Languages' },
    'Kotlin':     { icon: 'kotlin-plain', label: 'Kotlin', cat: 'Languages' },
    'Dart':       { icon: 'dart-plain', label: 'Dart', cat: 'Languages' },
    'Svelte':     { icon: 'svelte-plain', label: 'Svelte', cat: 'Frameworks' },
    'Vue':        { icon: 'vuejs-plain', label: 'Vue', cat: 'Frameworks' },
    'HCL':        { icon: 'terraform-plain', label: 'Terraform', cat: 'DevOps' },
    'Dockerfile': { icon: 'docker-plain', label: 'Docker', cat: 'DevOps' },
    'Shell':      { icon: 'bash-plain', label: 'Shell', cat: 'Tools' },
  };

  const extraTools = [
    { icon: 'react-original', label: 'React', cat: 'Frameworks' },
    { icon: 'nextjs-plain', label: 'Next.js', cat: 'Frameworks' },
    { icon: 'rails-plain', label: 'Rails', cat: 'Frameworks' },
    { icon: 'amazonwebservices-plain-wordmark', label: 'AWS', cat: 'DevOps' },
    { icon: 'github-original', label: 'GitHub', cat: 'Tools' },
    { icon: 'postgresql-plain', label: 'PostgreSQL', cat: 'Tools' },
    { icon: 'linux-plain', label: 'Linux', cat: 'Tools' },
    { icon: 'kaggle-original', label: 'Kaggle', cat: 'ML/Data', link: 'https://www.kaggle.com/magixe' },
  ];

  const allIcons = [];
  Object.entries(iconMap).forEach(([lang, info]) => {
    if (langMap[lang]) allIcons.push(info);
  });
  extraTools.forEach(t => allIcons.push(t));

  const categories = {};
  allIcons.forEach(t => {
    if (!categories[t.cat]) categories[t.cat] = [];
    categories[t.cat].push(t);
  });

  const sections = Object.entries(categories).map(([cat, tools]) => {
    const icons = tools.map(t => {
      const inner = `<i class="devicon-${t.icon} colored"></i><span>${t.label}</span>`;
      if (t.link) {
        return `<a href="${t.link}" target="_blank" rel="noopener" class="tech-item">${inner}</a>`;
      }
      return `<div class="tech-item">${inner}</div>`;
    }).join('');
    return `<div class="tech-category">
      <div class="tech-cat-label">${cat}</div>
      <div class="tech-icons">${icons}</div>
    </div>`;
  }).join('');

  return `
    <div class="tech-area anim d8">
      <div class="tech-grid">${sections}</div>
    </div>
    <style>
      .tech-grid { display: flex; gap: 32px; flex-wrap: wrap; }
      .tech-category { min-width: 120px; }
      .tech-cat-label {
        font-size: 8px; font-weight: 700; letter-spacing: 1.5px;
        text-transform: uppercase; color: var(--text-dim); margin-bottom: 10px;
      }
      .tech-icons { display: flex; flex-wrap: wrap; gap: 8px; }
      .tech-item {
        display: flex; flex-direction: column; align-items: center; gap: 4px;
        width: 52px; padding: 8px 2px;
        border-radius: var(--radius-xs);
        background: var(--card-bg-solid);
        backdrop-filter: blur(4px);
        border: 1px solid var(--border);
        transition: border-color 0.25s, transform 0.3s var(--ease-out);
        cursor: default;
        text-decoration: none;
      }
      a.tech-item { cursor: pointer; }
      .tech-item:hover {
        border-color: var(--accent);
        transform: translateY(-3px);
      }
      .tech-item i { font-size: 20px; }
      .tech-item span {
        font-size: 7px; font-weight: 600;
        color: var(--text-secondary); text-align: center;
        font-family: var(--font-mono);
      }
    </style>`;
}
