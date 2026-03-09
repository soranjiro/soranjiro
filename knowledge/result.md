# Knowledge & Results

## 2026-03-10: Initial Analysis

### System Structure
- Data pipeline: fetch-data.mjs -> data.json -> 3 generators (SVG, dashboard, README)
- 12 SVGs generated (6 types x dark/light): overview, languages, activity, copilot, repos, charts
- Dashboard uses Chart.js, Devicon, custom Japanese-aesthetic CSS (wabi-sabi theme)
- README currently shows: visitor badge, AI badge, AI summary blockquote, 3 SVG blocks

### Key Data Points Available
- 4785 total commits, 577 PRs, 171 reviews, 194 issues
- 60 repos (44 personal, 16 org), 8 stars, 4 organizations
- Copilot: 692 premium requests, 33 mentions, 8 co-authored commits
- Languages: TypeScript, Go, Ruby, Python, C++ are primary
- 3+ years on GitHub

### Design System
- Colors: Japanese-inspired (matcha, sakura, fuji, sora, hisui)
- Fonts: Shippori Mincho B1 (serif), M PLUS Rounded 1c (sans), Geist Mono
- Dark/light theme support throughout

## 2026-03-10: Implementation Results

### Changes Made
1. **fetch-data.mjs**: Added streak computation (current streak, best day, active days, total days)
2. **generate-svg.mjs**: Added 2 new SVG types (typing + hero), each with dark/light = 4 new SVGs
3. **generate-readme.mjs**: Redesigned layout - typing SVG header, hero+overview cards, pinned repos table, portfolio badge
4. **generate-dashboard.mjs**: Added contribution calendar heatmap, sticky nav bar, streak banner with animated counters, social meta tags, improved footer

### Validation
- All generators run successfully (exit code 0)
- No lint/type errors in source files
- Total SVG output: 16 files (8 types x 2 themes)
- README structure: badges -> typing SVG -> hero+overview -> charts -> projects table -> portfolio link -> footer
- Dashboard structure: nav bar -> hero header -> streak banner -> projects -> calendar + activity -> languages -> community -> footer

### Streak Data (from existing data)
- Current streak: 630 days
- Best day: 118 contributions (2025-09-11)
- Total days: 1152, Active days: 806 (70%)

## 2026-03-10: Animation Timing Adjustment

### Problem
- Typing SVG (profile text) animation takes ~15s due to long text (0.045s/char)
- Other SVGs (overview, heatmap, charts) finished in 1.4-2.3s, feeling too abrupt

### Changes (generate-svg.mjs)
| Parameter | Before | After |
|-----------|--------|-------|
| **Overview** contribBar dur/delay | 0.15s / i*0.04 | 0.3s / i*0.08 |
| **Overview** statRow dur/delays | 0.3s / 0.15-0.46 | 0.5s / 0.4-1.3 |
| **Overview** pulse line dur/begin | 2s / 0.3s | 3.5s / 0.8s |
| **Overview** badges begin | 0.5+i*0.1 | 2.0+i*0.15 |
| **Heatmap** cells dur/delay | 0.08s / wk*0.015 | 0.15s / wk*0.04 |
| **Heatmap** DOW bars dur/begin | 0.5s / 0.3+i*0.06 | 0.8s / 1.0+i*0.12 |
| **Heatmap** yearly bars dur/begin | 0.4s / 0.6+i*0.08 | 0.7s / 2.0+i*0.15 |
| **Charts** radar polygon dur/begin | 0.8s / 0.2s | 1.5s / 0.5s |
| **Charts** radar points begin | 0.8+i*0.08 | 1.8+i*0.15 |
| **Charts** monthly line dur/begin | 1.2s / 0.3s | 2.5s / 0.5s |
| **Charts** PR/review lines begin | 1.0s / 1.2s | 2.5s / 2.8s |
| **Charts** area fill dur/begin | 0.6s / 0.5s | 1.0s / 1.0s |
| **Charts** lang bars dur/cumDelay | 0.5s / 0.06 | 0.9s / 0.12 |

### Result
| SVG | Total Duration Before | Total Duration After |
|-----|----------------------|---------------------|
| Overview | ~2.3s | ~5.1s |
| Heatmap | ~1.4s | ~3.2s |
| Charts | ~1.6s | ~3.7s |
| Typing | ~15s (unchanged) | ~15s (unchanged) |
