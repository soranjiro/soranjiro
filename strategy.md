# GitHub Profile Strategy

## Core Objective

Build a GitHub profile that is **visually striking at first glance**, data-driven, and updated daily.

## Principles

1. **Simplicity**: Remove duplication. One clear narrative. No information overload.
2. **Visual Impact**: Animated SVG hero with daily contribution streak counter. Eye-catching metrics.
3. **Data Freshness**: All data updated daily via GitHub Actions. Show "today's date" prominently.
4. **Novelty**: Typing animation for AI summary. Contribution streak counter. Dynamic greeting based on time.
5. **Portfolio Link**: Direct link to interactive dashboard at https://soranjiro.github.io/soranjiro/

## Architecture

```
fetch-data.mjs -> data.json
  -> generate-svg.mjs    -> SVG cards (overview, charts, ai-badge)
  -> generate-readme.mjs -> README.md (GitHub profile)
  -> generate-dashboard.mjs -> index.html (Portfolio / GitHub Pages)
```

## Current State (2026-03-10)

- README: Shows 3 SVG cards (overview, copilot, charts). Minimal text.
- Dashboard: Full interactive page with Chart.js, dark/light toggle.
- SVGs: 12 files (6 types x 2 themes). Detailed but dense.

## Target State

- README: Clean hero section, animated typing SVG, streak counter, key metrics, portfolio link.
- Dashboard: Polished portfolio with smooth animations, better layout, contribution heatmap.
- SVGs: Consolidated. Fewer but more impactful cards.
