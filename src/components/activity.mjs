export function renderActivity(data) {
  const radarLabels = ["Commits", "PRs", "Reviews", "Issues", "Comments"];
  const radarRaw = [
    data.activity.totalCommits,
    data.activity.prs,
    data.activity.reviews,
    data.activity.issues,
    data.activity.prComments + data.activity.issueComments,
  ];
  const radarPlot = radarRaw.map(v => Math.log10(v + 1));

  const yearly = data.yearlyContributions || [];
  const monthMap = {};
  yearly.forEach(y => {
    (y.calendar || []).forEach(day => {
      const key = day.date.slice(0, 7);
      if (!monthMap[key]) monthMap[key] = { commits: 0, prs: 0, reviews: 0, restricted: 0 };
      monthMap[key].commits += day.count || 0;
    });
    const from = new Date(y.from);
    const to = new Date(y.to);
    const months = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth()) + 1;
    const prsPerMonth = (y.stats.prs || 0) / months;
    const reviewsPerMonth = (y.stats.reviews || 0) / months;
    const restrictedPerMonth = (y.stats.restricted || 0) / months;
    for (let d = new Date(from); d <= to; d.setMonth(d.getMonth() + 1)) {
      const key = d.toISOString().slice(0, 7);
      if (!monthMap[key]) monthMap[key] = { commits: 0, prs: 0, reviews: 0, restricted: 0 };
      monthMap[key].prs += prsPerMonth;
      monthMap[key].reviews += reviewsPerMonth;
      monthMap[key].restricted += restrictedPerMonth;
    }
  });

  const sortedMonths = Object.keys(monthMap).sort();
  const monthLabels = sortedMonths.map(m => {
    const [y, mo] = m.split('-');
    return `${y}-${mo}`;
  });
  const monthCommits = sortedMonths.map(m => monthMap[m].commits);
  const monthPrs = sortedMonths.map(m => Math.round(monthMap[m].prs));
  const monthReviews = sortedMonths.map(m => Math.round(monthMap[m].reviews));

  return `
    <div class="card span-5 anim d5">
      <div class="card-label">Activity Radar</div>
      <div class="chart-wrap" style="height:280px">
        <canvas id="radarChart"></canvas>
      </div>
    </div>
    <div class="card span-7 anim d6">
      <div class="card-label">Monthly Contributions</div>
      <div class="chart-wrap" style="height:280px">
        <canvas id="monthlyChart"></canvas>
      </div>
    </div>
    <script>
    (function() {
      var fontMono = "'Geist Mono','SF Mono',monospace";
      var fontSans = "'DM Sans',-apple-system,sans-serif";
      var radarRaw = ${JSON.stringify(radarRaw)};

      Chart.defaults.font.family = fontSans;

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

      var radarCanvas = document.getElementById('radarChart');
      var radarChart = null;
      var radarRevealed = false;

      function createRadar() {
        var c = getChartColors();
        radarChart = new Chart(radarCanvas, {
          type: 'radar',
          data: {
            labels: ${JSON.stringify(radarLabels)},
            datasets: [{
              data: [0,0,0,0,0],
              backgroundColor: 'rgba(232,168,73,0.08)',
              borderColor: '#e8a849',
              pointBackgroundColor: '#e8a849',
              pointBorderColor: c.pointBorder,
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6,
              borderWidth: 1.5,
            }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            animation: { duration: 1500, easing: 'easeOutQuart' },
            plugins: { legend: { display: false },
              tooltip: {
                backgroundColor: c.ttBg, titleColor: c.ttTitle, bodyColor: c.ttBody,
                borderColor: c.ttBorder, borderWidth: 1,
                cornerRadius: 8, padding: 10, displayColors: false,
                bodyFont: { family: fontMono, size: 12 },
                callbacks: { label: function(ctx) { return radarRaw[ctx.dataIndex].toLocaleString(); } }
              }
            },
            scales: {
              r: {
                angleLines: { color: c.grid },
                grid: { color: c.grid, lineWidth: 1 },
                pointLabels: { color: c.label, font: { size: 11, weight: '500', family: fontSans } },
                ticks: {
                  display: true, color: c.tick, backdropColor: 'transparent', stepSize: 1,
                  font: { size: 8, family: fontMono },
                  callback: function(v) { return v===0?'1':v===1?'10':v===2?'100':v===3?'1k':v===4?'10k':''; }
                },
                min: 0, max: 4
              }
            }
          }
        });
      }

      createRadar();

      var radarObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting && !radarRevealed) {
            radarRevealed = true;
            radarChart.data.datasets[0].data = ${JSON.stringify(radarPlot)};
            radarChart.update();
            radarObserver.disconnect();
          }
        });
      }, { threshold: 0.3 });
      radarObserver.observe(radarCanvas);

      var monthlyCanvas = document.getElementById('monthlyChart');
      var monthlyLabels = ${JSON.stringify(monthLabels)};
      var displayLabels = monthlyLabels.map(function(l, i) {
        return (i % 3 === 0) ? l : '';
      });

      function createMonthly() {
        var c = getChartColors();
        return new Chart(monthlyCanvas, {
          type: 'line',
          data: {
            labels: displayLabels,
            datasets: [
              {
                label: 'Commits',
                data: ${JSON.stringify(monthCommits)},
                borderColor: '#4ade80',
                backgroundColor: 'rgba(74,222,128,0.08)',
                pointBackgroundColor: '#4ade80',
                pointBorderColor: c.pointBorder,
                pointBorderWidth: 2,
                pointRadius: 2,
                pointHoverRadius: 5,
                borderWidth: 2,
                tension: 0.35,
                fill: true,
              },
              {
                label: 'PRs',
                data: ${JSON.stringify(monthPrs)},
                borderColor: '#60a5fa',
                backgroundColor: 'transparent',
                pointBackgroundColor: '#60a5fa',
                pointBorderColor: c.pointBorder,
                pointBorderWidth: 2,
                pointRadius: 2,
                pointHoverRadius: 5,
                borderWidth: 1.5,
                tension: 0.35,
                fill: false,
              },
              {
                label: 'Reviews',
                data: ${JSON.stringify(monthReviews)},
                borderColor: '#c084fc',
                backgroundColor: 'transparent',
                pointBackgroundColor: '#c084fc',
                pointBorderColor: c.pointBorder,
                pointBorderWidth: 2,
                pointRadius: 2,
                pointHoverRadius: 5,
                borderWidth: 1.5,
                tension: 0.35,
                fill: false,
              }
            ]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
              legend: {
                position: 'bottom',
                labels: { boxWidth: 8, usePointStyle: true, pointStyle: 'circle', color: c.label, font: { size: 10, family: fontSans }, padding: 16 }
              },
              tooltip: {
                backgroundColor: c.ttBg, titleColor: c.ttTitle, bodyColor: c.ttBody,
                borderColor: c.ttBorder, borderWidth: 1, cornerRadius: 8, padding: 10,
                bodyFont: { family: fontMono, size: 11 },
                callbacks: { title: function(items) { return monthlyLabels[items[0].dataIndex]; } }
              }
            },
            scales: {
              x: { grid: { display: false }, ticks: { color: c.label, font: { family: fontMono, size: 10 }, maxRotation: 45 }, border: { display: false } },
              y: { grid: { color: c.grid, lineWidth: 1 }, ticks: { color: c.tick, font: { family: fontMono, size: 10 } }, border: { display: false } }
            }
          }
        });
      }

      var monthlyChart = createMonthly();

      window.addEventListener('themechange', function() {
        var c = getChartColors();
        if (radarChart) {
          radarChart.options.scales.r.angleLines.color = c.grid;
          radarChart.options.scales.r.grid.color = c.grid;
          radarChart.options.scales.r.pointLabels.color = c.label;
          radarChart.options.scales.r.ticks.color = c.tick;
          radarChart.data.datasets[0].pointBorderColor = c.pointBorder;
          radarChart.options.plugins.tooltip.backgroundColor = c.ttBg;
          radarChart.options.plugins.tooltip.titleColor = c.ttTitle;
          radarChart.options.plugins.tooltip.bodyColor = c.ttBody;
          radarChart.options.plugins.tooltip.borderColor = c.ttBorder;
          radarChart.update('none');
        }
        if (monthlyChart) {
          monthlyChart.options.scales.x.ticks.color = c.label;
          monthlyChart.options.scales.y.grid.color = c.grid;
          monthlyChart.options.scales.y.ticks.color = c.tick;
          monthlyChart.options.plugins.legend.labels.color = c.label;
          monthlyChart.options.plugins.tooltip.backgroundColor = c.ttBg;
          monthlyChart.options.plugins.tooltip.titleColor = c.ttTitle;
          monthlyChart.options.plugins.tooltip.bodyColor = c.ttBody;
          monthlyChart.options.plugins.tooltip.borderColor = c.ttBorder;
          monthlyChart.data.datasets.forEach(function(ds) { ds.pointBorderColor = c.pointBorder; });
          monthlyChart.update('none');
        }
      });
    })();
    </script>`;
}
