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
  const barLabels = yearly.map(y => y.yearLabel);
  const barCommits = yearly.map(y => y.stats.commits);
  const barPrs = yearly.map(y => y.stats.prs);
  const barReviews = yearly.map(y => y.stats.reviews);
  const barRestricted = yearly.map(y => y.stats.restricted || 0);

  return `
    <div class="card span-5 anim d3">
      <div class="card-label">Activity Radar</div>
      <div class="chart-wrap" style="height:280px">
        <canvas id="radarChart"></canvas>
      </div>
    </div>
    <div class="card span-7 anim d4">
      <div class="card-label">Yearly Contributions</div>
      <div class="chart-wrap" style="height:280px">
        <canvas id="yearlyChart"></canvas>
      </div>
    </div>
    <script>
    (function() {
      const fontMono = "'Geist Mono','SF Mono',monospace";
      const fontSans = "'DM Sans',-apple-system,sans-serif";
      const tc = '#4a4742', gc = 'rgba(255,255,255,0.04)';
      const radarRaw = ${JSON.stringify(radarRaw)};

      Chart.defaults.font.family = fontSans;

      new Chart(document.getElementById('radarChart'), {
        type: 'radar',
        data: {
          labels: ${JSON.stringify(radarLabels)},
          datasets: [{
            data: ${JSON.stringify(radarPlot)},
            backgroundColor: 'rgba(232,168,73,0.08)',
            borderColor: '#e8a849',
            pointBackgroundColor: '#e8a849',
            pointBorderColor: '#08090c',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            borderWidth: 1.5,
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false },
            tooltip: {
              backgroundColor: '#1a1c22', titleColor: '#f0ede6', bodyColor: '#8a8680',
              borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1,
              cornerRadius: 8, padding: 10, displayColors: false,
              bodyFont: { family: fontMono, size: 12 },
              callbacks: { label: ctx => radarRaw[ctx.dataIndex].toLocaleString() }
            }
          },
          scales: {
            r: {
              angleLines: { color: gc },
              grid: { color: gc, lineWidth: 1 },
              pointLabels: { color: '#8a8680', font: { size: 11, weight: '500', family: fontSans } },
              ticks: {
                display: true, color: '#3a3835', backdropColor: 'transparent', stepSize: 1,
                font: { size: 8, family: fontMono },
                callback: v => v===0?'1':v===1?'10':v===2?'100':v===3?'1k':v===4?'10k':''
              },
              min: 0, max: 4
            }
          }
        }
      });

      new Chart(document.getElementById('yearlyChart'), {
        type: 'bar',
        data: {
          labels: ${JSON.stringify(barLabels)},
          datasets: [
            { label: 'Private', data: ${JSON.stringify(barRestricted)}, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: { topLeft: 0, topRight: 0, bottomLeft: 4, bottomRight: 4 }, borderSkipped: false },
            { label: 'Commits', data: ${JSON.stringify(barCommits)}, backgroundColor: '#4ade8066', borderRadius: 4, borderSkipped: false },
            { label: 'PRs', data: ${JSON.stringify(barPrs)}, backgroundColor: '#60a5fa66', borderRadius: 4, borderSkipped: false },
            { label: 'Reviews', data: ${JSON.stringify(barReviews)}, backgroundColor: '#c084fc66', borderRadius: { topLeft: 4, topRight: 4, bottomLeft: 0, bottomRight: 0 }, borderSkipped: false },
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { boxWidth: 8, usePointStyle: true, pointStyle: 'circle', color: '#8a8680', font: { size: 10, family: fontSans }, padding: 16 }
            },
            tooltip: {
              backgroundColor: '#1a1c22', titleColor: '#f0ede6', bodyColor: '#8a8680',
              borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1, cornerRadius: 8, padding: 10,
              bodyFont: { family: fontMono, size: 11 },
            }
          },
          scales: {
            x: { stacked: true, grid: { display: false }, ticks: { color: '#8a8680', font: { family: fontMono, size: 11 } }, border: { display: false } },
            y: { stacked: true, grid: { color: gc, lineWidth: 1 }, ticks: { color: '#4a4742', font: { family: fontMono, size: 10 } }, border: { display: false } }
          }
        }
      });
    })();
    </script>`;
}
