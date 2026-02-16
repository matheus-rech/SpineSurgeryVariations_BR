# Context Save — Arthrodesis SUS Analysis

**Saved:** 2026-02-16
**Project:** `/Users/matheusrech/Documents/asdrubal coluna/`
**Branch:** `master` (main: `main`)
**Status:** All 17 sections complete, all TODOs done

---

## Project Summary

Comprehensive epidemiological analysis of spinal arthrodesis (fusion) procedures in Brazil's SUS healthcare system (2015–2020) using DATASUS SIH/SUS data. Built as a Jupyter notebook with 68 cells (50 code + 18 markdown) across 17 sections.

## Key Files

| File | Purpose |
|------|---------|
| `comprehensive_analysis.ipynb` | Main notebook (source, 68 cells, 17 sections) |
| `comprehensive_analysis_executed.ipynb` | Executed notebook with embedded outputs (8.1 MB) |
| `run_section17.py` | Standalone script for Sankey/Chord (gitignored) |
| `requirements.txt` | Pinned Python 3.13 dependencies (47 packages) |
| `REPRODUCE.md` | Full reproducibility guide |
| `CLAUDE.md` | Project documentation + findings |
| `.gitignore` | Project-specific gitignore |
| `data/artrodese_v7.xlsx` | Primary dataset (26 MB, 58,818 rows × 72 cols, NOT in git) |
| `output/` | 50 files: 32 PNGs, 14 CSVs, 3 findings MDs, MANIFEST.sha1 |

## Analysis Sections (17)

1. Setup & Data Loading
2. Descriptive Statistics
3. Inflation Adjustment (IPCA)
4. Population-Adjusted Rates
5. Age-Sex Standardization (WHO)
6. Temporal Trends (2015–2020, COVID impact)
7. Choropleth Maps (geobr)
8. Specialist Workforce Correlation
9. Forest Plot (state rates with 95% CI)
10. Summary Tables (CSV export)
11. Weinstein Variation (SDR, CV, extremal ratio, IQR ratio)
12. Diagnosis-Specific Variation (lumbar/cervical/trauma/deformity)
13. Municipality Analysis (N=951)
14. Enhanced Choropleths (SDR, bivariate, diagnosis-specific)
15. Patient Flow Network (corridors, flow arrows, micropoint density)
16. Statistical Testing (KW, Moran's I, LISA, Mann-Kendall, Chi-square)
17. Sankey & Chord Diagrams (inter-state patient flow)

## Key Findings

- **58,818 procedures**, national rate 4.66/100k/yr
- **CV = 86.9%** (vs US 49.5%) — nearly 2× geographic variation
- **Extremal ratio = 49.7** — PR has 50× the rate of RN
- **Moran's I = 0.42** (p=0.004) — significant spatial autocorrelation
- **LISA clusters:** HH (SC, MS, SP), LL (PE, CE, PA)
- **Spearman rho = 0.74** (rate vs specialists) — supply-sensitive care confirmed
- **Mann-Kendall:** declining rate (tau=−0.87, p=0.024)
- **97.9%** patients stay in-state; GO→DF dominant corridor (241 patients)
- **DF imports 28.8%** of its caseload from neighboring states

## Technical Details

- **Python 3.13.12** (Apple Silicon)
- **Key packages:** pandas 3.0, numpy 2.4, matplotlib 3.10, geopandas 1.1, geobr 0.2.2, libpysal 4.14.1, esda 2.8.1, scikit-posthocs 0.12.0, pymannkendall 1.4.3
- **Venv:** `.venv/` (created from `python3.13 -m venv .venv`)
- **geobr** downloads IBGE shapefiles on first run (~50 MB, cached in `~/.cache/geobr/`)
- Region names in dataset are **English**: 'South', 'Southeast', 'Middle West', 'Northeast', 'North'

## Known Issues

- **Disk space:** Machine was critically full (2.4 GB / 460 GB), causing Python imports to hang. Fixed by clearing `~/.cache/uv/` (22 GB). Monitor disk space before heavy operations.
- **Venv corruption:** Disk-full condition corrupted `.pyc` caches. Rebuilt venv from `requirements.txt`.
- **geobr downloads:** Sections 7, 14, 15, 16 download shapefiles from IBGE — bottleneck for execution time (~3-5 min total).
- **Moran's I randomness:** 9999 permutations — p-values may vary slightly between runs.

## Git Status

- **Uncommitted work:** All project files (notebook, outputs, requirements, docs) are new/untracked
- **No commits yet** for this project's content (only repo-level .gitignore commits exist)
- Ready to stage and commit when user requests

## Potential Next Steps

- Commit all work to git
- Manuscript/paper writing based on findings
- Additional statistical analyses (multivariate regression, etc.)
- Interactive dashboard (Streamlit/Plotly)
- Comparison with other DATASUS procedure categories
