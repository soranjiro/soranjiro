function aggregateMonthly(data) {
  const yearly = data.yearlyContributions || [];
  const monthMap = {};
  yearly.forEach(y => {
    (y.calendar || []).forEach(day => {
      const key = day.date.slice(0, 7);
      if (!monthMap[key]) monthMap[key] = { commits: 0, prs: 0, reviews: 0 };
      monthMap[key].commits += day.count || 0;
    });
    const from = new Date(y.from);
    const to = new Date(y.to);
    const months = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth()) + 1;
    const prsPerMonth = (y.stats.prs || 0) / months;
    const reviewsPerMonth = (y.stats.reviews || 0) / months;
    for (let d = new Date(from); d <= to; d.setMonth(d.getMonth() + 1)) {
      const key = d.toISOString().slice(0, 7);
      if (!monthMap[key]) monthMap[key] = { commits: 0, prs: 0, reviews: 0 };
      monthMap[key].prs += prsPerMonth;
      monthMap[key].reviews += reviewsPerMonth;
    }
  });
  const sorted = Object.keys(monthMap).sort();
  return {
    labels: sorted,
    commits: sorted.map(m => monthMap[m].commits),
    prs: sorted.map(m => Math.round(monthMap[m].prs)),
    reviews: sorted.map(m => Math.round(monthMap[m].reviews)),
  };
}

export function renderActivityRadar(data) {
  const radarLabels = ["Commits", "PRs", "Reviews", "Issues", "Comments"];
  const radarRaw = [
    data.activity.totalCommits,
    data.activity.prs,
    data.activity.reviews,
    data.activity.issues,
    data.activity.prComments + data.activity.issueComments,
  ];
  const radarPlot = radarRaw.map(v => Math.log10(v + 1));

  return `
    <div class="activity-radar anim d5">
      <div class="sub-label">Activity Radar</div>
      <div class="chart-wrap" style="height:260px">
        <canvas id="radarChart"></canvas>
      </div>
    </div>
    <script>
    (function() {
      var fontMono = "'Geist Mono','SF Mono',monospace";
      var fontSans = "'M PLUS Rounded 1c',-apple-system,sans-serif";
      var radarRaw = ${JSON.stringify(radarRaw)};
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
          accent: s.getPropertyValue('--accent').trim(),
        };
      }
      var c = cc();
      var radarChart = new Chart(document.getElementById('radarChart'), {
        type: 'radar',
        data: {
          labels: ${JSON.stringify(radarLabels)},
          datasets: [{
            data: [0,0,0,0,0],
            backgroundColor: c.accent + '14',
            borderColor: c.accent,
            pointBackgroundColor: c.accent,
            pointBorderColor: c.pb,
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
              cornerRadius: 10, padding: 10, displayColors: false,
              bodyFont: { family: fontMono, size: 11 },
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
      var revealed = false;
      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
          if (e.isIntersecting && !revealed) {
            revealed = true;
            radarChart.data.datasets[0].data = ${JSON.stringify(radarPlot)};
            radarChart.update();
            obs.disconnect();
          }
        });
      }, { threshold: 0.3 });
      obs.observe(document.getElementById('radarChart'));
      window.addEventListener('themechange', function() {
        var c = cc();
        radarChart.options.scales.r.angleLines.color = c.grid;
        radarChart.options.scales.r.grid.color = c.grid;
        radarChart.options.scales.r.pointLabels.color = c.label;
        radarChart.options.scales.r.ticks.color = c.tick;
        radarChart.data.datasets[0].pointBorderColor = c.pb;
        radarChart.data.datasets[0].borderColor = c.accent;
        radarChart.data.datasets[0].pointBackgroundColor = c.accent;
        radarChart.data.datasets[0].backgroundColor = c.accent + '14';
        radarChart.options.plugins.tooltip.backgroundColor = c.ttBg;
        radarChart.options.plugins.tooltip.titleColor = c.ttTitle;
        radarChart.options.plugins.tooltip.bodyColor = c.ttBody;
        radarChart.options.plugins.tooltip.borderColor = c.ttBorder;
        radarChart.update('none');
      });
    })();
    </script>`;
}

export function renderActivityTimeline(data) {
  const m = aggregateMonthly(data);

  return `
    <div class="activity-timeline anim d6" style="margin-top:28px">
      <div class="sub-label">Monthly Contributions</div>
      <div class="chart-wrap" style="height:200px">
        <canvas id="monthlyChart"></canvas>
      </div>
    </div>
    <script>
    (function() {
      var fontMono = "'Geist Mono','SF Mono',monospace";
      var fontSans = "'M PLUS Rounded 1c',-apple-system,sans-serif";
      var allLabels = ${JSON.stringify(m.labels)};
      var displayLabels = allLabels.map(function(l, i) { return (i % 3 === 0) ? l.slice(2) : ''; });
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
          matcha: s.getPropertyValue('--matcha').trim(),
          sora: s.getPropertyValue('--sora').trim(),
          fuji: s.getPropertyValue('--fuji').trim(),
        };
      }
      var c = cc();
      var chart = new Chart(document.getElementById('monthlyChart'), {
        type: 'line',
        data: {
          labels: displayLabels,
          datasets: [
            {
              label: 'Commits',
              data: ${JSON.stringify(m.commits)},
              borderColor: c.matcha,
              backgroundColor: c.matcha + '12',
              pointBackgroundColor: c.matcha,
              pointBorderColor: c.pb,
              pointBorderWidth: 1.5,
              pointRadius: 0,
              pointHoverRadius: 4,
              borderWidth: 2,
              tension: 0.4,
              fill: true,
              yAxisID: 'y',
            },
            {
              label: 'PRs',
              data: ${JSON.stringify(m.prs)},
              borderColor: c.sora,
              backgroundColor: 'transparent',
              pointBackgroundColor: c.sora,
              pointBorderColor: c.pb,
              pointBorderWidth: 1.5,
              pointRadius: 0,
              pointHoverRadius: 4,
              borderWidth: 1.5,
              tension: 0.4,
              fill: false,
              yAxisID: 'y1',
              borderDash: [4, 2],
            },
            {
              label: 'Reviews',
              data: ${JSON.stringify(m.reviews)},
              borderColor: c.fuji,
              backgroundColor: 'transparent',
              pointBackgroundColor: c.fuji,
              pointBorderColor: c.pb,
              pointBorderWidth: 1.5,
              pointRadius: 0,
              pointHoverRadius: 4,
              borderWidth: 1.5,
              tension: 0.4,
              fill: false,
              yAxisID: 'y1',
              borderDash: [2, 2],
            }
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: {
              position: 'bottom',
              labels: { boxWidth: 8, usePointStyle: true, pointStyle: 'circle', color: c.label, font: { size: 10, family: fontSans }, padding: 14 }
            },
            tooltip: {
              backgroundColor: c.ttBg, titleColor: c.ttTitle, bodyColor: c.ttBody,
              borderColor: c.ttBorder, borderWidth: 1, cornerRadius: 10, padding: 10,
              bodyFont: { family: fontMono, size: 11 },
              callbacks: { title: function(items) { return allLabels[items[0].dataIndex]; } }
            }
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: c.label, font: { family: fontMono, size: 9 }, maxRotation: 0 }, border: { display: false } },
            y: {
              position: 'left',
              grid: { color: c.grid, lineWidth: 1 },
              ticks: { color: c.matcha, font: { family: fontMono, size: 9 } },
              border: { display: false },
              title: { display: true, text: 'Commits', color: c.matcha, font: { size: 9, family: fontSans } }
            },
            y1: {
              position: 'right',
              grid: { drawOnChartArea: false },
              ticks: { color: c.sora, font: { family: fontMono, size: 9 } },
              border: { display: false },
              title: { display: true, text: 'PRs / Reviews', color: c.sora, font: { size: 9, family: fontSans } }
            }
          }
        }
      });
      window.addEventListener('themechange', function() {
        var c = cc();
        chart.options.scales.x.ticks.color = c.label;
        chart.options.scales.y.grid.color = c.grid;
        chart.options.scales.y.ticks.color = c.matcha;
        chart.options.scales.y.title.color = c.matcha;
        chart.options.scales.y1.ticks.color = c.sora;
        chart.options.scales.y1.title.color = c.sora;
        chart.options.plugins.legend.labels.color = c.label;
        chart.options.plugins.tooltip.backgroundColor = c.ttBg;
        chart.options.plugins.tooltip.titleColor = c.ttTitle;
        chart.options.plugins.tooltip.bodyColor = c.ttBody;
        chart.options.plugins.tooltip.borderColor = c.ttBorder;
        chart.data.datasets[0].borderColor = c.matcha;
        chart.data.datasets[0].backgroundColor = c.matcha + '12';
        chart.data.datasets[0].pointBackgroundColor = c.matcha;
        chart.data.datasets[0].pointBorderColor = c.pb;
        chart.data.datasets[1].borderColor = c.sora;
        chart.data.datasets[1].pointBackgroundColor = c.sora;
        chart.data.datasets[1].pointBorderColor = c.pb;
        chart.data.datasets[2].borderColor = c.fuji;
        chart.data.datasets[2].pointBackgroundColor = c.fuji;
        chart.data.datasets[2].pointBorderColor = c.pb;
        chart.update('none');
      });
    })();
    </script>`;
}
