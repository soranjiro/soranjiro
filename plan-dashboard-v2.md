# Plan: Dashboard Redesign v2

## Tasks

1. Create `conf/profile.yml` for user self-intro keywords
2. Update `fetch-data.mjs`:
   - Read profile.yml and pass to AI summary
   - Generate English summary incorporating user keywords
   - Generate 1-line English repo descriptions
   - Add repos overview summary
3. Refactor dashboard generator into multi-file structure:
   - `src/components/` folder with per-card modules
   - `src/generate-dashboard.mjs` as orchestrator
4. Redesign dashboard (dark theme, dashboard-preview.png aesthetic):
   - LLM-generated disclaimer in header
   - Stat cards row
   - Activity & Team Development (contribution bar chart + radar)
   - Language Evolution (absolute values, not %)
   - Tech Stack with devicon icons
   - Copilot Usage card (like dashboard-new.png)
   - Organization Contributions
   - Pinned Repos (1-line desc + overview)
5. Generate and validate
6. Clean up plan, update strategy.md and result.md
