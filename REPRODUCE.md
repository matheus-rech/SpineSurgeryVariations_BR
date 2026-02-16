# Reproducibility Guide

**Project:** Spinal Arthrodesis in Brazil's SUS (2015–2020)
**Last verified:** 2026-02-15
**Python:** 3.13.12
**Platform:** macOS Darwin 25.3.0 (Apple Silicon)

---

## Quick Start

```bash
# 1. Create virtual environment
python3.13 -m venv .venv
source .venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Execute notebook (headless)
jupyter nbconvert --to notebook --execute \
  --ExecutePreprocessor.timeout=600 \
  comprehensive_analysis.ipynb \
  --output comprehensive_analysis_executed.ipynb

# 4. Verify outputs
shasum -c output/MANIFEST.sha1
```

## Prerequisites

- **Python 3.13+** (tested on 3.13.12)
- **Data file:** `data/artrodese_v7.xlsx` (26 MB, 58,818 rows × 72 columns)
  - This file is NOT included in the repository — obtain from the principal investigator
- **Internet access** required on first run (geobr downloads IBGE shapefiles; cached after first download)

## File Structure

```
comprehensive_analysis.ipynb           ← Source notebook (edit this)
comprehensive_analysis_executed.ipynb  ← Executed notebook with embedded outputs
requirements.txt                       ← Pinned Python dependencies
REPRODUCE.md                           ← This file
CLAUDE.md                              ← Project documentation + findings
data/artrodese_v7.xlsx                 ← Primary dataset (not in git)
output/                                ← All generated outputs (49 files)
  MANIFEST.sha1                        ← SHA1 checksums for verification
  findings_*.md                        ← Written findings documents (3)
  table*.csv                           ← Data tables (14 CSVs)
  *.png                                ← Figures (30 PNGs)
```

## Notebook Sections (17)

| # | Section | Cells | Key Outputs |
|---|---------|:-----:|-------------|
| 1 | Setup & Data Loading | 3 | — |
| 2 | Descriptive Statistics | 4 | age_distribution.png, top_diagnoses.png |
| 3 | Inflation Adjustment | 1 | inflation_adjustment.png |
| 4 | Population-Adjusted Rates | 3 | state_rates_barplot.png, region_rates.png |
| 5 | Age-Sex Standardization | 1 | age_who_distribution.png |
| 6 | Temporal Trends | 4 | temporal_trends.png, monthly_trends.png, region_trends.png |
| 7 | Choropleth Maps | 4 | choropleth_rates/quartiles/mortality.png |
| 8 | Specialist Workforce | 2 | specialist_correlation.png |
| 9 | Forest Plot | 1 | forest_plot_state_rates.png |
| 10 | Summary Tables | 3 | table1, table2 CSVs |
| 11 | Weinstein Variation | 2 | weinstein_sdr_beeswarm.png, table3 |
| 12 | Diagnosis-Specific | 2 | weinstein_multipanel_beeswarm.png, table4-6 |
| 13 | Municipality Analysis | 2 | weinstein_municipality_beeswarm.png |
| 14 | Enhanced Choropleths | 3 | choropleth_sdr/diagnosis/bivariate.png |
| 15 | Patient Flow Network | 4 | network_flow_arrows.png, micropoint*.png, table7-8 |
| 16 | Statistical Testing | 7 | kruskal_wallis.png, moran.png, lisa.png, mann_kendall.png, chisquare.png, table9-13 |
| 17 | Sankey & Chord | 3 | sankey_patient_flow.png, chord_patient_flow.png |

**Total: 68 cells (50 code + 18 markdown)**

## Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| pandas | 3.0.0 | Data manipulation |
| numpy | 2.4.2 | Numerical computing |
| matplotlib | 3.10.8 | Plotting |
| seaborn | 0.13.2 | Statistical visualization |
| scipy | 1.17.0 | Statistical tests |
| geopandas | 1.1.0 | Spatial data |
| geobr | 0.2.2 | Brazilian geographic boundaries |
| libpysal | 4.14.1 | Spatial weights |
| esda | 2.8.1 | Spatial autocorrelation (Moran's I, LISA) |
| scikit-posthocs | 0.12.0 | Dunn's post-hoc tests |
| pymannkendall | 1.4.3 | Mann-Kendall trend test |
| statsmodels | 0.14.6 | Statistical modeling |
| folium | 0.20.0 | Interactive maps |
| openpyxl | 3.1.5 | Excel I/O |
| nbconvert | 7.17.0 | Notebook execution |

## Known Notes

1. **geobr downloads**: First execution downloads ~50 MB of shapefiles from IBGE servers. These are cached in `~/.cache/geobr/` for subsequent runs.
2. **Execution time**: Full notebook takes ~3–5 minutes on Apple Silicon (M-series). The geobr downloads in Sections 7, 14, 15, 16 are the bottleneck.
3. **Randomness**: Moran's I permutation tests use 9999 permutations — p-values may vary slightly between runs, but significance conclusions should be stable.
4. **Population data**: IBGE population estimates are hardcoded in the notebook (Section 4) using mid-period values. These are constants, not downloaded.
5. **COVID-19 impact**: 2020 data reflects pandemic disruption. Mann-Kendall trend results should be interpreted with this caveat.
