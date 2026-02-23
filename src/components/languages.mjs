export function renderLanguages(data) {
  const trends = data.languageTrends || [];
  const langTotals = {};
  const langColorMap = {};
  trends.forEach(t => t.languages.forEach(l => {
    langTotals[l.name] = (langTotals[l.name] || 0) + l.score;
    langColorMap[l.name] = l.color;
  }));
  const sortedLangs = Object.entries(langTotals).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const monthlyData = [];
  for (let i = 0; i < trends.length; i++) {
    const startDate = new Date(trends[i].from);
    const endDate = i < trends.length - 1 ? new Date(trends[i + 1].from) : new Date(trends[i].to);
    const current = trends[i];
    const next = i < trends.length - 1 ? trends[i + 1] : null;
    const tempDate = new Date(startDate);
    while (tempDate < endDate) {
      const monthKey = tempDate.toISOString().slice(0, 7);
      const totalMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
      const elapsed = (tempDate.getFullYear() - startDate.getFullYear()) * 12 + (tempDate.getMonth() - startDate.getMonth());
      const t = totalMonths > 0 ? elapsed / totalMonths : 0;
      const langScores = {};
      sortedLangs.forEach(([name]) => {
        const currScore = (current.languages.find(l => l.name === name) || {}).score || 0;
        const nextScore = next ? ((next.languages.find(l => l.name === name) || {}).score || 0) : currScore;
        langScores[name] = currScore + (nextScore - currScore) * t;
      });
      monthlyData.push({ month: monthKey, scores: langScores });
      tempDate.setMonth(tempDate.getMonth() + 1);
    }
  }

  const monthLabels = monthlyData.map(d => d.month);
  const datasets = sortedLangs.map(([name]) => ({
    name,
    color: langColorMap[name] || '#888',
    data: monthlyData.map(d => parseFloat((d.scores[name] || 0).toFixed(1)))
  }));

  const overall = (data.overallLanguages || []).slice(0, 7);
  const totalBytes = overall.reduce((s, l) => s + l.bytes, 0);
  const maxPct = Math.max(...overall.map(l => l.bytes / totalBytes * 100));

  const langItems = overall.map((l, i) => {
    const pct = ((l.bytes / totalBytes) * 100).toFixed(1);
    const barW = (parseFloat(pct) / maxPct * 100).toFixed(1);
    return `<div class="lang-row" style="animation: slideRight 0.4s var(--ease-out) ${0.06 * i}s both">
      <span class="lang-indicator" style="background:${l.color}"></span>
      <span class="lang-name">${l.name}</span>
      <span class="lang-bar-track" title="${l.name}: ${pct}% of total code">
        <span class="lang-bar-fill" style="width:${barW}%;background:${l.color}"></span>
      </span>
      <span class="lang-pct">${pct}%</span>
    </div>`;
  }).join('');

  return `
    <div class="lang-card glass-card anim d6">
      <div class="lang-card-inner">
        <div class="lang-chart-main">
          <div class="sub-label">Language Evolution</div>
          <div class="chart-wrap" style="height:220px">
            <canvas id="langTrendChart"></canvas>
          </div>
        </div>
        <div class="lang-dist-panel">
          <div class="sub-label" style="margin-bottom:12px">Distribution</div>
          <div class="lang-list">${langItems}</div>
        </div>
      </div>
    </div>
    <script>
    (function() {
      var fontMono = "'Geist Mono','SF Mono',monospace";
      var fontSans = "'M PLUS Rounded 1c',-apple-system,sans-serif";
      var allLabels = ${JSON.stringify(monthLabels)};
      var displayLabels = allLabels.map(function(l, i) {
        return (i % 4 === 0) ? l.slice(2) : '';
      });
      function cc() {
        var s = getComputedStyle(document.documentElement);
        return {
          grid: s.getPropertyValue('--chart-grid').trim(),
          tick: s.getPropertyValue('--chart-tick').trim(),
          label: s.getPropertyValue('--chart-label').trim(),
          ttBg: s.getPropertyValue('--chart-tooltip-bg').trim(),
          ttTitle: s.getPropertyValue('--chart-tooltip-title').trim(),
          ttBody: s.getPropertyValue('--chart-tooltip-body').trim(),
          ttBorder: s.getPropertyValue('--chart-tooltip-border').trim(),
          pb: s.getPropertyValue('--chart-point-border').trim(),
        };
      }
      var c = cc();
      var langChart = new Chart(document.getElementById('langTrendChart'), {
        type: 'line',
        data: {
          labels: displayLabels,
          datasets: ${JSON.stringify(datasets.map(d => ({
            label: d.name,
            data: d.data,
            borderColor: d.color,
            backgroundColor: 'transparent',
            pointBackgroundColor: d.color,
            pointBorderWidth: 1.5,
            pointRadius: 0,
            pointHoverRadius: 4,
            borderWidth: 1.5,
            tension: 0.4,
            fill: false,
          })))}
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          animation: { duration: 1400, easing: 'easeInOutQuart', delay: 300 },
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 6, usePointStyle: true, pointStyle: 'circle', color: c.label, font: { size: 9, family: fontSans }, padding: 12 } },
            tooltip: {
              backgroundColor: c.ttBg, titleColor: c.ttTitle, bodyColor: c.ttBody,
              borderColor: c.ttBorder, borderWidth: 1, cornerRadius: 10, padding: 10,
              bodyFont: { family: fontMono, size: 10 },
              callbacks: {
                title: function(items) { return allLabels[items[0].dataIndex]; },
                label: function(ctx) { return ' ' + ctx.dataset.label + ': ' + ctx.parsed.y.toFixed(1); }
              }
            }
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: c.label, font: { family: fontMono, size: 9 }, maxRotation: 0 }, border: { display: false } },
            y: { grid: { color: c.grid, lineWidth: 1 }, ticks: { color: c.tick, font: { family: fontMono, size: 9 } }, border: { display: false } }
          }
        }
      });
      langChart.data.datasets.forEach(function(ds) { ds.pointBorderColor = c.pb; });
      langChart.update('none');
      window.addEventListener('themechange', function() {
        var c = cc();
        langChart.options.scales.x.ticks.color = c.label;
        langChart.options.scales.y.grid.color = c.grid;
        langChart.options.scales.y.ticks.color = c.tick;
        langChart.options.plugins.legend.labels.color = c.label;
        langChart.options.plugins.tooltip.backgroundColor = c.ttBg;
        langChart.options.plugins.tooltip.titleColor = c.ttTitle;
        langChart.options.plugins.tooltip.bodyColor = c.ttBody;
        langChart.options.plugins.tooltip.borderColor = c.ttBorder;
        langChart.data.datasets.forEach(function(ds) { ds.pointBorderColor = c.pb; });
        langChart.update('none');
      });
    })();
    </script>
    <style>
      .lang-card-inner { display: flex; gap: 24px; }
      .lang-chart-main { flex: 2.5; min-width: 0; }
      .lang-dist-panel { flex: 1.5; min-width: 0; display: flex; flex-direction: column; }
      @media (max-width: 880px) {
        .lang-card-inner { flex-direction: column; }
      }
      .lang-list { display: flex; flex-direction: column; gap: 10px; flex: 1; }
      .lang-row { display: flex; align-items: center; gap: 10px; font-size: 11px; }
      .lang-indicator { width: 3px; height: 14px; border-radius: 2px; flex-shrink: 0; }
      .lang-name { width: 90px; font-weight: 500; color: var(--text-primary); white-space: nowrap; font-size: 11px; overflow: hidden; text-overflow: ellipsis; }
      .lang-bar-track { flex: 1; height: 2px; background: var(--ring-track); border-radius: 2px; overflow: hidden; }
      .lang-bar-fill { height: 100%; border-radius: 2px; transition: width 1s var(--ease-out); }
      .lang-pct { width: 40px; text-align: right; font-family: var(--font-mono); color: var(--text-secondary); font-weight: 500; font-size: 10px; }
    </style>`;
}
