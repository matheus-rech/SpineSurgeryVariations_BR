# Arthrodesis Procedures in Brazil (SUS, 2015–2020)

Epidemiological analysis of spinal arthrodesis (fusion) procedures in Brazil's Universal Healthcare System (SUS), using DATASUS hospitalization records. Includes Weinstein-style geographic variation analysis, enhanced choropleths, and patient flow network mapping.

## Project Goals

1. Characterize volume, cost, and distribution of arthrodesis procedures across Brazilian states/regions
2. Compute population-adjusted procedure rates (per 100,000 inhabitants)
3. Standardize rates by age/sex using WHO world standard population
4. Adjust costs for inflation (IPCA) and convert to USD
5. Identify regional disparities and temporal trends (2015–2020)
6. **Replicate Weinstein et al. (Spine, 2006) variation metrics** (CV, extremal ratio, IQR ratio, SDR beeswarm)
7. Diagnosis-specific variation by spinal region (lumbar/cervical/trauma/deformity)
8. Enhanced choropleth maps (SDR, bivariate rate×mortality, diagnosis-specific)
9. Patient flow network analysis (inter-state corridors, micropoint density)

## Data Sources

| Source | Description |
|--------|-------------|
| DATASUS SIH/SUS | Hospital Information System — 58,818 procedure records |
| IBGE | State population estimates (mid-period) |
| WHO | World standard population (Segi/Doll age-sex weights) |
| IPCA | Brazilian consumer price index for inflation adjustment |
| CFM/CNES | Neurosurgeon and orthopedist counts by state |

**Primary dataset**: `data/artrodese_v7.xlsx` (26MB, 58,818 rows × 72 columns)

## File Structure

```
asdrubal coluna/
├── CLAUDE.md                              # This file
├── REPRODUCE.md                           # Reproducibility guide
├── requirements.txt                       # Pinned Python 3.13 dependencies
├── comprehensive_analysis.ipynb           # Main analysis notebook (source, 68 cells)
├── comprehensive_analysis_executed.ipynb  # Executed notebook with embedded outputs
├── run_section17.py                       # Standalone script for Sankey/Chord (Section 17)
├── arthrodesis_analysis_rationale.txt     # Analysis plan + R/Elasticsearch queries
├── nihms220934f9.jpg                      # Weinstein reference figure
├── data/
│   └── artrodese_v7.xlsx                  # Primary dataset (58,818 procedures)
├── output/
│   ├── findings_weinstein_variation.md    # Written findings: Weinstein metrics
│   ├── findings_choropleths_flow.md       # Written findings: Choropleths + flow
│   ├── findings_statistical_testing.md    # Written findings: All statistical tests
│   ├── table1_state_summary.csv           # State-level summary (N, rate, mortality, LOS, cost)
│   ├── table2_yearly_summary.csv          # Yearly trends (2015–2020)
│   ├── table3_weinstein_variation_metrics.csv  # Variation metrics by category + municipality
│   ├── table4_state_sdr.csv               # State SDR values with categories
│   ├── table5_diagnosis_categories.csv    # Diagnosis-specific variation metrics
│   ├── table6_weinstein_comparison.csv    # Brazil vs US (Weinstein) comparison
│   ├── table7_top_flow_corridors.csv      # Top inter-state patient flow corridors
│   ├── table8_net_flow_by_state.csv       # Net flow balance per state
│   ├── table9_kruskal_wallis.csv          # KW test results across regions
│   ├── table10_mann_kendall_trends.csv    # Mann-Kendall trend test results
│   ├── table11_spearman_correlations.csv  # Full Spearman correlation matrix
│   ├── table12_lisa_results.csv           # LISA cluster results per state
│   ├── table13_chisquare_contingency.csv  # Region × Diagnosis contingency table
│   ├── table13b_standardized_residuals.csv # Chi-square standardized residuals
│   ├── MANIFEST.sha1                     # SHA1 checksums for all output files
│   ├── age_distribution.png               # Age histogram + box by sex
│   ├── age_who_distribution.png           # WHO age group distribution
│   ├── choropleth_rates.png               # Procedure rates by state (residence + hospital)
│   ├── choropleth_quartiles.png           # Rate quartile maps
│   ├── choropleth_mortality.png           # Mortality rate map
│   ├── choropleth_sdr.png                 # SDR diverging choropleth + categorical map
│   ├── choropleth_diagnosis_specific.png  # 4-panel diagnosis rate maps
│   ├── choropleth_bivariate_rate_mortality.png  # 3×3 bivariate rate × mortality
│   ├── choropleth_patient_flow.png        # Net flow + % imported choropleths
│   ├── network_flow_arrows.png            # Top 30 corridor flow arrows
│   ├── micropoint_density_map.png         # Patient residence hexbin heatmap
│   ├── micropoint_crossborder.png         # Cross-border patient scatter
│   ├── kruskal_wallis_regions.png         # 5-panel boxplots by region
│   ├── spearman_correlation_matrix.png    # 6×6 correlation heatmap
│   ├── moran_global_sdr.png              # Moran scatter + permutation distribution
│   ├── lisa_cluster_map.png              # LISA cluster + significance map
│   ├── mann_kendall_trends.png           # 6-panel trends with Sen's slope
│   ├── chisquare_diagnosis_region.png    # Stacked bars + residuals heatmap
│   ├── forest_plot_state_rates.png        # Forest plot — annual rate by state with 95% CI
│   ├── inflation_adjustment.png           # Nominal vs adjusted cost + IPCA overlay
│   ├── monthly_trends.png                 # Monthly time series with COVID marker
│   ├── region_rates.png                   # Procedure rate by region
│   ├── region_trends.png                  # Yearly trends by region
│   ├── specialist_correlation.png         # Specialist density vs procedure rate scatter
│   ├── state_rates_barplot.png            # State rates (residence + hospital) bar plot
│   ├── temporal_trends.png                # 6-panel yearly trends (vol, age, mort, LOS, cost, ICU)
│   ├── top_diagnoses.png                  # Top 15 ICD-10 diagnoses
│   ├── weinstein_sdr_beeswarm.png         # SDR beeswarm — all states labeled
│   ├── weinstein_multipanel_beeswarm.png  # 4-category Weinstein figure replication
│   ├── weinstein_municipality_beeswarm.png # Municipality-level SDR beeswarm
│   ├── sankey_patient_flow.png            # Sankey — top 20 inter-state corridors
│   └── chord_patient_flow.png             # Chord — bidirectional flow (24 states)
└── .venv/                                 # Python 3.13 virtual environment
```

## Key Dataset Variables (72 columns)

| Column | Description |
|--------|-------------|
| `dt_inter` | Date of admission |
| `Year`, `Month` | Derived temporal fields |
| `Age`, `Sex`, `def_race_color` | Demographics |
| `Main_diagnosis` | ICD-10 primary diagnosis code |
| `def_diag_princ_subcat` | Diagnosis subcategory label |
| `Procedure_performed` | SUS procedure code |
| `res_SIGLA_UF`, `int_SIGLA_UF` | State (patient residence / hospital) |
| `res_region`, `int_region` | Region (Norte/Nordeste/Sudeste/Sul/Centro-Oeste) |
| `res_city_name`, `int_MUNNOMEX` | Municipality name |
| `res_LATITUDE`, `res_LONGITUDE` | Geocoordinates (residence) |
| `Length_of_stay` | Days in hospital |
| `death` | In-hospital mortality (0/1) |
| `UCI_use` | ICU admission (0/1) |
| `Total_value` | Nominal cost (BRL) |
| `Adj_VAL_TOTAL` | Inflation-adjusted cost (BRL, IPCA) |
| `US_Adj_VAL_TOT` | Inflation-adjusted cost (USD) |
| `age_groups` | Original age group variable |

## Analysis Sections (Notebook)

| Section | Content | Status |
|---------|---------|--------|
| 1. Setup & Data Loading | Import xlsx, filter 2015–2020 | Done |
| 2. Descriptive Statistics | Demographics, diagnoses, outcomes, costs | Done |
| 3. Inflation Adjustment | IPCA verification, nominal vs adjusted plot | Done |
| 4. Population-Adjusted Rates | State + region rates per 100k | Done |
| 5. Age-Sex Standardization | WHO standard population weights | Done |
| 6. Temporal Trends | Yearly + monthly time series, COVID impact | Done |
| 7. Choropleth Maps | Rates, quartiles, mortality (geobr) | Done |
| 8. Specialist Workforce | Neuro/ortho density correlations | Done |
| 9. Forest Plot | State rates with 95% CI | Done |
| 10. Summary Tables | Export CSV tables 1-2 | Done |
| 11. Weinstein Variation | SDR, CV, extremal ratio, IQR ratio, beeswarm | Done |
| 12. Diagnosis-Specific | Lumbar/cervical/trauma/deformity variation | Done |
| 13. Municipality Analysis | Small area variation (N=951 municipalities) | Done |
| 14. Enhanced Choropleths | SDR diverging, diagnosis-specific, bivariate rate×mortality | Done |
| 15. Patient Flow Network | Inter-state flow, net flow maps, flow arrows, micropoint density | Done |
| 16. Statistical Testing | Kruskal-Wallis, Moran's I, LISA, Mann-Kendall, Chi-square | Done |
| 17. Sankey & Chord | Inter-state patient flow Sankey + chord diagrams | Done |

## Key Findings

### Overall
- **58,818 procedures** across 27 states, 2015–2020
- National rate: **4.66 per 100,000/year**
- Mean age 48.1 years, 56% female
- In-hospital mortality: 1.33%
- Mean LOS: 9.3 days

### Geographic Variation (Weinstein metrics)
- **CV = 86.9%** (vs Weinstein US: 49.5%) — nearly double the US variation
- **Extremal ratio = 49.7** (vs US: 21.0) — PR has 50x the rate of RN
- **IQR ratio = 2.68** (vs US: 2.01)
- Highest: PR (14.6/100k/yr), GO (11.2), RS (9.2)
- Lowest: RN (0.3), PB (0.5), AL (0.6)

### By Diagnosis
- Lumbar degenerative (44%): highest CV = 125.2%, IQR = 5.20
- Trauma (27%): lowest CV = 62.4% (supply-independent)
- Cervical (8%): highest IQR ratio = 6.49

### Patient Flow
- **97.9%** of patients receive surgery in-state
- **Brasília (DF)** is the dominant import hub: net +422, 28.8% of caseload imported
- **GO → DF** is the top corridor (241 patients, 17.8% of cross-state flow)
- **Paraná (PR)** is the second hub: net +164 (draws from SC)
- Norte/Nordeste states are net exporters with access deficits
- **Sankey diagram** shows Middle West dominates outflows, Southeast/South dominate destinations
- **Chord diagram** visualizes bidirectional flow among 24 active states (≥20 cross-state patients)

### Bivariate Rate × Mortality
- High-volume states (PR, RS, SC, GO) tend to have lower mortality
- Low-rate + high-mortality states in Norte/Nordeste warrant priority access expansion

### Statistical Testing
- **Moran's I = 0.42** (p=0.004) — significant spatial autocorrelation of SDR
- **LISA clusters:** HH (SC, MS, SP), LL (PE, CE, PA) — geographic access clusters
- **Kruskal-Wallis:** Rate (p=0.003), age (p=0.001), cost (p=0.015) differ across regions; mortality does NOT (p=0.48)
- **Spearman:** Rate vs specialists rho=0.74 (p<0.001) — supply-sensitive care confirmed
- **Mann-Kendall:** Declining rate (tau=−0.87, p=0.024) and cost (tau=−1.0, p=0.009) 2015–2020
- **Chi-square:** Diagnosis mix differs by region (chi²=4557, p<0.001) — South/MW over-represent elective, North/NE over-represent trauma

## Tech Stack

- **Python 3.13** with pandas 3.0, numpy 2.4, matplotlib 3.10, seaborn, scipy, geopandas, geobr, libpysal, esda, scikit-posthocs, pymannkendall
- **Jupyter notebooks** via nbconvert for headless execution
- Virtual environment: `.venv/` (created from `python3.13 -m venv`)
- Geographic data: `geobr` library (downloads IBGE boundaries on-the-fly)

## Conventions

- Language: code in English, clinical context may reference Portuguese terms
- Rates: always per 100,000 inhabitants unless stated otherwise
- CI: 95% confidence intervals throughout
- Inflation base year: 2020 (most recent in dataset)
- Age groups: WHO standard bins (0-4, 5-9, ..., 80-84, 85+)
- Diagnosis categories: Lumbar degenerative, Cervical degenerative, Trauma, Deformity, Other

## TODO

- [x] Import original dataset (artrodese_v7.xlsx)
- [x] Rebuild comprehensive_analysis.ipynb with executable code
- [x] Generate choropleth maps by state/region
- [x] Generate temporal trend plots (2015–2020)
- [x] Generate forest plots for regional rate comparisons
- [x] Weinstein variation metrics (CV, extremal ratio, IQR ratio)
- [x] Standardized discharge ratio beeswarm plot
- [x] Diagnosis-specific variation analysis
- [x] Municipality-level small area analysis
- [x] Written findings document with tables
- [x] Enhanced choropleth maps (SDR, diagnosis-specific, bivariate rate×mortality)
- [x] Patient flow / referral network maps (origin-destination, flow arrows)
- [x] Micropoint density maps using geocoordinates
- [x] Statistical testing (Kruskal-Wallis, Moran's I, LISA, Mann-Kendall, Chi-square)
- [x] Sankey or chord diagram for inter-state patient flow
