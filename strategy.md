# GitHub Profile Dashboard Strategy

## 1. Data Fetching (`src/fetch-data.mjs`)
- Use GitHub GraphQL API to fetch user profile, pinned repositories, and language statistics.
- Use GitHub REST API (Search) to fetch accurate contribution counts (Commits, PRs, Issues, Reviews) to overcome GraphQL limitations.
- Fetch `README.md` content for pinned repositories.
- Use GitHub Models API (`gpt-4o-mini`) to generate:
  - A concise Japanese summary of the user's overall profile and activity.
  - Short Japanese descriptions for each pinned repository based on their READMEs.
- Save all aggregated data to `output/data.json`.

## 2. Dashboard Generation (`src/generate-dashboard.mjs`)
- Read `output/data.json`.
- Generate a static HTML file (`output/dashboard.html`) using a modern "Bento Grid" layout (CSS Grid).
- **Visualizations (Chart.js)**:
  - **Radar Chart**: Display activity metrics (Commits, PRs, Reviews, Issues, Comments). Implement a `Math.log10` transformation and custom tick callbacks to simulate a logarithmic scale (1, 10, 100, 1k, 10k) to handle vastly different metric ranges.
  - **Line Chart**: Show language evolution over time.
  - **Doughnut Chart**: Display top languages overall.
- **Sections**:
  - **Header**: Avatar, Name, and AI-generated profile summary.
  - **Bento Grid**: Charts, Organization Contributions (custom HTML bars), and AI Collaboration stats.
  - **Pinned Repositories**: Cards displaying repo name, AI-generated description, primary language, stars, and forks.
- **Styling**:
  - Use CSS variables for easy theming (Light/Dark mode support based on `prefers-color-scheme`).
  - Implement subtle entrance animations (`fadeUp`, `slideDown`) for a polished feel.
  - Ensure responsive design for smaller screens.

## 3. Automation
- (Future) Set up GitHub Actions to run the data fetching and dashboard generation scripts periodically and publish the result to GitHub Pages.