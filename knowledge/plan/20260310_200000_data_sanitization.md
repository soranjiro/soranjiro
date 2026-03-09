# Plan: data.json Security Sanitization

Date: 2026-03-10

## Objective

Prevent leakage of private/org repository names from data.json while maintaining identical SVG/Dashboard/README output.

## Success Criteria

| Metric | Target |
|--------|--------|
| Org repo names in data.json | 0 |
| Private repo names in data.json | 0 |
| `orgRepoPerPeriod` field in data.json | absent |
| `repoTimeline` field in data.json | absent |
| SVG generation | pass (8 files) |
| Dashboard generation | pass |
| README generation | pass |
| Language trends data | intact |

## Steps

### Phase 0: git tracking removal
1. `git rm --cached output/data.json output/full_history_data.json`
2. Commit removal

### Phase 1: fetch-data.mjs sanitization
3. Remove from `result` object:
   - `orgRepoPerPeriod` field
   - `repoTimeline` field
   - `topReposByCommits`, `topReposByPRs`, `topReposByReviews` in `yearlyContributions` mapping
4. In-memory variables remain used by `computeLanguageTrends()`, `computeOverallLanguages()`, `computeContextBreakdown()`
5. Commit changes

### Phase 2: Verification
6. Run `node src/fetch-data.mjs` and grep for sensitive strings
7. Run all 3 generators and verify output
8. Compare with pre-change backup

### Phase 3: Post-merge (on main)
9. `git filter-repo` to purge data.json from entire git history
10. `git push --force`

## Status: Phase 0-2 Complete
