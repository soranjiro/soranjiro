export function renderLanguages(data) {
  const trends = data.languageTrends || [];
  const langTotals = {};
  const langColorMap = {};
  trends.forEach(t => t.languages.forEach(l => {
    langTotals[l.name] = (langTotals[l.name] || 0) + l.score;
    langColorMap[l.name] = l.color;
  }));
  const sortedLangs = Object.entries(langTotals).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const periodLabels = trends.map(t => new Date(t.from).getFullYear().toString());

  const datasets = sortedLangs.map(([name]) => ({
    name,
    color: langColorMap[name] || '#888',
    data: trends.map(t => {
      const found = t.languages.find(l => l.name === name);
      return found ? found.score : 0;
    })
  }));

  const overall = (data.overallLanguages || []).slice(0, 7);
  const totalBytes = overall.reduce((s, l) => s + l.bytes, 0);
  const maxPct = Math.max(...overall.map(l => l.bytes / totalBytes * 100));

  const langItems = overall.map((l, i) => {
    const pct = ((l.bytes / totalBytes) * 100).toFixed(1);
    const barW = (parseFloat(pct) / maxPct * 100).toFixed(1);
    const sizeStr = l.bytes > 1e6 ? (l.bytes / 1e6).toFixed(1) + ' MB' : (l.bytes / 1e3).toFixed(0) + ' KB';
    return `<div class="lang-row" style="animation: slideRight 0.4s var(--ease-out) ${0.06 * i}s both">
      <span class="lang-indicator" style="background:${l.color}"></span>
      <span class="lang-name">${l.name}</span>
      <span class="lang-bar-track"><span class="lang-bar-fill" style="width:${barW}%;background:${l.color}"></span></span>
      <span class="lang-pct">${pct}%</span>
    </div>`;
  }).join('');

  return `
    <div class="card span-7 anim d5">
      <div class="card-label">Language Evolution</div>
      <div class="chart-wrap" style="height:260px">
        <canvas id="langTrendChart"></canvas>
      </div>
    </div>
    <div class="card span-5 anim d6">
      <div class="card-label">Language Distribution</div>
      <div class="lang-list">${langItems}</div>
    </div>
    <script>
    (function() {
      const fontMono = "'Geist Mono','SF Mono',monospace";
      const fontSans = "'DM Sans',-apple-system,sans-serif";
      const tc = '#4a4742', gc = 'rgba(255,255,255,0.04)';
      new Chart(document.getElementById('langTrendChart'), {
        type: 'line',
        data: {
          labels: ${JSON.stringify(periodLabels)},
          datasets: ${JSON.stringify(datasets.map(d => ({
            label: d.name,
            data: d.data,
            borderColor: d.color,
            backgroundColor: 'transparent',
            pointBackgroundColor: d.color,
            pointBorderColor: '#08090c',
            pointBorderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5,
            borderWidth: 1.5,
            tension: 0.4,
            fill: false,
          })))}
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 6, usePointStyle: true, pointStyle: 'circle', color: '#8a8680', font: { size: 10, family: fontSans }, padding: 14 } },
            tooltip: {
              backgroundColor: '#1a1c22', titleColor: '#f0ede6', bodyColor: '#8a8680',
              borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1, cornerRadius: 8, padding: 10,
              bodyFont: { family: fontMono, size: 11 },
              callbacks: { label: ctx => ' ' + ctx.dataset.label + ': ' + ctx.parsed.y.toFixed(1) }
            }
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#8a8680', font: { family: fontMono, size: 11 } }, border: { display: false } },
            y: { grid: { color: gc, lineWidth: 1 }, ticks: { color: '#4a4742', font: { family: fontMono, size: 10 } }, border: { display: false }, title: { display: true, text: 'Score', color: '#4a4742', font: { size: 10, family: fontSans } } }
          }
        }
      });
    })();
    </script>
    <style>
      .lang-list { display: flex; flex-direction: column; gap: 11px; }
      .lang-row {
        display: flex; align-items: center; gap: 10px; font-size: 12px;
      }
      .lang-indicator {
        width: 3px; height: 18px; border-radius: 2px; flex-shrink: 0;
      }
      .lang-name {
        width: 110px; font-weight: 500; color: var(--text-primary);
        white-space: nowrap; font-size: 12px;
      }
      .lang-bar-track {
        flex: 1; height: 4px;
        background: rgba(255,255,255,0.04);
        border-radius: 2px; overflow: hidden;
      }
      .lang-bar-fill {
        height: 100%; border-radius: 2px;
        transition: width 0.8s var(--ease-out);
      }
      .lang-pct {
        width: 42px; text-align: right;
        font-family: var(--font-mono);
        color: var(--text-secondary);
        font-weight: 500; font-size: 11px;
      }
    </style>`;
}
