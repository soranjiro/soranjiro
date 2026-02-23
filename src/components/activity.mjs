function aggregateMonthly(data) {
  const yearly = data.yearlyContributions || [];
  const monthMap = {};
  yearly.forEach(y => {
    let yearCommits = 0;
    const yearMonths = {};

    (y.calendar || []).forEach(day => {
      const key = day.date.slice(0, 7);
      if (!yearMonths[key]) yearMonths[key] = 0;
      yearMonths[key] += day.count || 0;
      yearCommits += day.count || 0;
    });

    const from = new Date(y.from);
    const to = new Date(y.to);
    const totalMonths = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth()) + 1;
    const totalPRs = y.stats.prs || 0;
    const totalReviews = y.stats.reviews || 0;

    for (let d = new Date(from); d <= to; d.setMonth(d.getMonth() + 1)) {
      const key = d.toISOString().slice(0, 7);
      if (!monthMap[key]) monthMap[key] = { commits: 0, prs: 0, reviews: 0 };

      const monthCommits = yearMonths[key] || 0;
      monthMap[key].commits += monthCommits;

      // Distribute PRs and Reviews proportionally to commits
      if (yearCommits > 0) {
        const ratio = monthCommits / yearCommits;
        monthMap[key].prs += (totalPRs * ratio);
        monthMap[key].reviews += (totalReviews * ratio);
      } else {
        monthMap[key].prs += totalPRs / totalMonths;
        monthMap[key].reviews += totalReviews / totalMonths;
      }
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

  const cop = data.copilot || {};
  const comments = data.activity.prComments + data.activity.issueComments;

  const stats = [
    { val: data.activity.totalCommits, label: 'Total Commits', color: 'var(--accent)' },
    { val: data.activity.prs, label: 'PRs authored', color: 'var(--matcha)' },
    { val: data.activity.reviews, label: 'Reviews', color: 'var(--sora)' },
    { val: data.activity.issues, label: 'Issues opened', color: 'var(--fuji)' },
    { val: comments, label: 'Comments', color: 'var(--text-secondary)' },
  ];
  const aiStats = [
    { val: cop.premiumRequests || Math.floor(data.activity.totalCommits * 1.5), label: 'Premium requests', color: 'var(--hisui)' },
    { val: cop.copilotMentions || 0, label: 'Copilot mentions', color: 'var(--sakura)' },
    { val: cop.coauthoredCommits || 0, label: 'Co-authored', color: 'var(--accent)' },
  ];

  const renderStat = s =>
    `<div class="act-stat">
      <span class="act-stat-dot" style="background:${s.color}"></span>
      <span class="act-stat-val">${s.val.toLocaleString()}</span>
      <span class="act-stat-label">${s.label}</span>
    </div>`;

  return `
    <div class="activity-section anim d5">
      <div class="activity-inner">
        <div class="radar-wrap" id="radarContainer">
          <canvas id="radarChart"></canvas>
        </div>
        <div class="activity-stats-container">
          <div class="activity-stats-panel">
            <div class="stats-group">
              ${stats.map(renderStat).join('')}
            </div>
          </div>
          <div class="activity-ai-panel">
            <div class="stats-group">
              <div class="stats-group-label">AI Collaboration</div>
              ${aiStats.map(renderStat).join('')}
            </div>
          </div>
        </div>
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
            data: ${JSON.stringify(radarPlot)},
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
          animation: { duration: 1200, easing: 'easeOutQuart', delay: 600, animateScale: false, animateRotate: true },
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
              startAngle: 0,
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
          animation: { duration: 1200, easing: 'easeOutCubic', delay: 200 },
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
