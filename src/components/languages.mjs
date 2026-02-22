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
      var fontMono = "'Geist Mono','SF Mono',monospace";
      var fontSans = "'DM Sans',-apple-system,sans-serif";

      function getChartColors() {
        var s = getComputedStyle(document.documentElement);
        return {
          grid: s.getPropertyValue('--chart-grid').trim() || 'rgba(255,255,255,0.04)',
          tick: s.getPropertyValue('--chart-tick').trim() || '#4a4742',
          label: s.getPropertyValue('--chart-label').trim() || '#8a8680',
          ttBg: s.getPropertyValue('--chart-tooltip-bg').trim() || '#1a1c22',
          ttTitle: s.getPropertyValue('--chart-tooltip-title').trim() || '#f0ede6',
          ttBody: s.getPropertyValue('--chart-tooltip-body').trim() || '#8a8680',
          ttBorder: s.getPropertyValue('--chart-tooltip-border').trim() || 'rgba(255,255,255,0.08)',
          pointBorder: s.getPropertyValue('--chart-point-border').trim() || '#08090c',
        };
      }

      var c = getChartColors();
      var langChart = new Chart(document.getElementById('langTrendChart'), {
        type: 'line',
        data: {
          labels: ${JSON.stringify(periodLabels)},
          datasets: ${JSON.stringify(datasets.map(d => ({
            label: d.name,
            data: d.data,
            borderColor: d.color,
            backgroundColor: 'transparent',
            pointBackgroundColor: d.color,
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
            legend: { position: 'bottom', labels: { boxWidth: 6, usePointStyle: true, pointStyle: 'circle', color: c.label, font: { size: 10, family: fontSans }, padding: 14 } },
            tooltip: {
              backgroundColor: c.ttBg, titleColor: c.ttTitle, bodyColor: c.ttBody,
              borderColor: c.ttBorder, borderWidth: 1, cornerRadius: 8, padding: 10,
              bodyFont: { family: fontMono, size: 11 },
              callbacks: { label: function(ctx) { return ' ' + ctx.dataset.label + ': ' + ctx.parsed.y.toFixed(1); } }
            }
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: c.label, font: { family: fontMono, size: 11 } }, border: { display: false } },
            y: { grid: { color: c.grid, lineWidth: 1 }, ticks: { color: c.tick, font: { family: fontMono, size: 10 } }, border: { display: false }, title: { display: true, text: 'Score', color: c.tick, font: { size: 10, family: fontSans } } }
          }
        }
      });

      langChart.data.datasets.forEach(function(ds) { ds.pointBorderColor = c.pointBorder; });
      langChart.update('none');

      window.addEventListener('themechange', function() {
        var c = getChartColors();
        langChart.options.scales.x.ticks.color = c.label;
        langChart.options.scales.y.grid.color = c.grid;
        langChart.options.scales.y.ticks.color = c.tick;
        langChart.options.scales.y.title.color = c.tick;
        langChart.options.plugins.legend.labels.color = c.label;
        langChart.options.plugins.tooltip.backgroundColor = c.ttBg;
        langChart.options.plugins.tooltip.titleColor = c.ttTitle;
        langChart.options.plugins.tooltip.bodyColor = c.ttBody;
        langChart.options.plugins.tooltip.borderColor = c.ttBorder;
        langChart.data.datasets.forEach(function(ds) { ds.pointBorderColor = c.pointBorder; });
        langChart.update('none');
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
        background: var(--ring-track);
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
