# Statistical Testing — Findings

**Project:** Arthrodesis Procedures in Brazil's SUS (2015–2020)
**Date:** 2026-02-15

---

## 1. Kruskal-Wallis Tests Across Regions (Section 16a)

Non-parametric comparison of state-level outcomes across 5 Brazilian regions (N=27 states).

| Outcome | H statistic | df | p-value | eta-squared | Significant |
|---------|:-----------:|:--:|:-------:|:-----------:|:-----------:|
| Annual rate/100k | 16.13 | 4 | **0.0028** | 0.551 | Yes |
| Mean cost (BRL) | 12.38 | 4 | **0.0148** | 0.381 | Yes |
| Mean age (years) | 17.83 | 4 | **0.0013** | 0.628 | Yes |
| Mortality (%) | 3.49 | 4 | 0.4801 | 0.000 | No |
| Mean LOS (days) | 6.27 | 4 | 0.1797 | 0.103 | No |

### Key findings:
- **Procedure rate** differs significantly across regions (p=0.003, eta²=0.55 — large effect). South has the highest rates, North the lowest.
- **Mean age** also differs significantly (p=0.001, eta²=0.63), with higher-rate regions operating on older patients (degenerative indications), while low-rate regions have younger case mix (trauma-predominant).
- **Mean cost** differs across regions (p=0.015, eta²=0.38), reflecting different procedure complexity.
- **Mortality and LOS** do NOT differ significantly across regions — suggesting that once patients access surgery, outcomes are relatively homogeneous regardless of region.

### Dunn's post-hoc (Bonferroni-corrected):
- After strict Bonferroni correction for 10 pairwise comparisons, no individual pairs reached p<0.05 — the omnibus Kruskal-Wallis is significant but the small sample sizes (n=3–9 per region) limit post-hoc power.

---

## 2. Spearman Correlation Matrix (Section 16b)

State-level correlations (N=27):

| Pair | Spearman rho | p-value | Interpretation |
|------|:------------:|:-------:|----------------|
| Rate vs Specialists/100k | **+0.74*** | <0.001 | Strong positive — more specialists = more procedures |
| Rate vs Mean Age | **+0.64*** | <0.001 | Higher-rate states operate on older (degenerative) patients |
| Specialists vs Mean Age | **+0.76*** | <0.001 | Specialist-rich states serve older, elective populations |
| Specialists vs Mean Cost | **+0.43*** | 0.025 | More specialists = higher mean procedure cost |
| Rate vs Mortality | −0.26 | 0.189 | Not significant (no volume-outcome at state level) |
| LOS vs Mortality | +0.26 | 0.189 | Not significant |

**Key insight:** The strongest predictor of arthrodesis rates is specialist density (rho=0.74, p<0.001), confirming the **supply-sensitive care** hypothesis — the availability of spine surgeons drives procedure volumes, consistent with Wennberg's theory of medical practice variation.

---

## 3. Global Moran's I — Spatial Autocorrelation (Section 16c)

| Metric | Value |
|--------|-------|
| Moran's I | **0.420** |
| Expected I | −0.038 |
| Z-score | 3.72 |
| p-value (permutation) | **0.0038** (9999 permutations) |

**Interpretation:** There is **significant positive spatial autocorrelation** of arthrodesis SDR across Brazilian states (I=0.42, p=0.004). States with high rates cluster together geographically (South/Southeast), and states with low rates also cluster (North/Northeast). This is NOT random — the geographic pattern of variation is statistically structured.

### Moran scatter plot quadrants:
- **HH (High-High):** SC, RS, SP, MS — high-rate states surrounded by high-rate neighbors
- **LL (Low-Low):** PA, PE, CE, and most Norte/Nordeste states — low-rate states surrounded by low-rate neighbors
- **HL (High-Low outlier):** GO — high-rate state surrounded by low-rate neighbors (spatial outlier driven by surgical hub effect)
- **LH (Low-High outlier):** SC in upper-left quadrant position is interesting

---

## 4. LISA Cluster Map (Section 16d)

Local Moran's I identified 6 states in significant spatial clusters (p<0.05):

| Cluster | States | Interpretation |
|---------|--------|----------------|
| **High-High** | SC, MS, SP | High-rate states surrounded by high-rate neighbors — surgical hub cluster |
| **Low-Low** | PE, CE, PA | Low-rate states surrounded by low-rate neighbors — access deficit cluster |

**21 states** were not in significant clusters (including PR and GO, which are high outliers but surrounded by mixed neighbors).

**Policy implication:** The LL cluster (PE, CE, PA) represents a geographically contiguous zone of surgical underservice stretching from the Amazon to the Northeast coast — targeted capacity-building should focus on this corridor.

---

## 5. Mann-Kendall Trend Tests (Section 16e)

Non-parametric monotonic trend analysis, 2015–2020:

| Variable | Tau | Sen's slope | p-value | Trend |
|----------|:---:|:-----------:|:-------:|:-----:|
| Procedure rate/100k | **−0.867** | −0.126/yr | **0.024** | Decreasing |
| Mean cost (BRL) | **−1.000** | −1032/yr | **0.009** | Decreasing |
| Mortality (%) | +0.333 | +0.057/yr | 0.452 | No trend |
| Mean LOS (days) | −0.467 | −0.073/yr | 0.260 | No trend |
| Mean age (years) | +0.467 | +0.331/yr | 0.260 | No trend |
| ICU use (%) | +0.600 | +46.2/yr | 0.133 | No trend |

### Key findings:
- **Procedure rate declined significantly** (tau=−0.87, p=0.024, Sen's slope=−0.13 per 100k/year) — driven largely by the COVID-19 crash in 2020
- **Mean cost declined significantly** (tau=−1.0, p=0.009) — every year was lower than the previous, reflecting tightening SUS reimbursement
- **Mortality, LOS, age, ICU** showed no significant trends over 6 years

**Caution:** The 6-year window is short and includes the 2020 COVID disruption. The procedure rate decline may partly reflect pandemic impact rather than a true secular trend.

---

## 6. Chi-Square: Diagnosis Distribution Across Regions (Section 16f)

| Metric | Value |
|--------|-------|
| Chi-square | **4557.1** |
| df | 16 |
| p-value | **<2.2e-16** |
| Cramér's V | **0.139** |

**Interpretation:** Diagnosis distribution is **highly significantly different** across regions (p<0.001), though the effect size is moderate (V=0.14).

### Standardized residuals (key over/under-representations):
| Region | Lumbar degen | Cervical degen | Trauma | Deformity |
|--------|:----------:|:----------:|:----------:|:----------:|
| **Middle West** | +27.5 | −1.4 | **−22.0** | −3.2 |
| **South** | +14.4 | −5.8 | **−16.2** | +0.2 |
| **Northeast** | −20.4 | −12.3 | **+24.4** | **+13.1** |
| **North** | −14.7 | −5.2 | **+24.5** | −2.2 |
| **Southeast** | −12.3 | **+14.5** | +5.8 | −5.1 |

### Key findings:
- **South and Middle West**: Over-represent lumbar degenerative (elective) and under-represent trauma — consistent with supply-driven elective surgery
- **North and Northeast**: Over-represent trauma and under-represent elective diagnoses — procedures in these regions are driven by acute need (fractures) rather than elective indications
- **Southeast**: Over-represents cervical degenerative — suggesting more specialized cervical surgery capability in SP/RJ/MG
- **Northeast**: Over-represents deformity — likely referral center effect for complex scoliosis cases (PE, BA)

---

## 7. Summary Table: All Statistical Tests

| Test | Result | p-value | Conclusion |
|------|--------|:-------:|------------|
| Kruskal-Wallis (rate) | H=16.1 | **0.003** | Rates differ significantly across regions |
| Kruskal-Wallis (age) | H=17.8 | **0.001** | Patient age differs across regions |
| Kruskal-Wallis (cost) | H=12.4 | **0.015** | Procedure cost differs across regions |
| Kruskal-Wallis (mortality) | H=3.5 | 0.480 | Mortality does NOT differ across regions |
| Global Moran's I | I=0.42 | **0.004** | Significant spatial clustering of SDR |
| LISA | 6 states | <0.05 | HH cluster (SC,MS,SP) + LL cluster (PE,CE,PA) |
| Mann-Kendall (rate) | tau=−0.87 | **0.024** | Significant declining trend (includes COVID) |
| Mann-Kendall (cost) | tau=−1.0 | **0.009** | Significant declining cost trend |
| Chi-square (diagnosis×region) | chi²=4557 | **<0.001** | Diagnosis mix differs significantly by region |
| Spearman (rate vs specialists) | rho=0.74 | **<0.001** | Strong supply-procedure correlation |

---

## 8. New Output Files

| File | Description |
|------|-------------|
| `kruskal_wallis_regions.png` | 5-panel boxplots by region with KW statistics |
| `spearman_correlation_matrix.png` | 6×6 heatmap with significance stars |
| `moran_global_sdr.png` | Moran scatter plot + permutation distribution |
| `lisa_cluster_map.png` | LISA cluster map + significance map |
| `mann_kendall_trends.png` | 6-panel trends with Sen's slope + COVID marker |
| `chisquare_diagnosis_region.png` | Stacked bars + standardized residuals heatmap |
| `table9_kruskal_wallis.csv` | KW test results |
| `table10_mann_kendall_trends.csv` | MK trend results |
| `table11_spearman_correlations.csv` | Full correlation matrix |
| `table12_lisa_results.csv` | LISA results per state |
| `table13_chisquare_contingency.csv` | Contingency table |
| `table13b_standardized_residuals.csv` | Standardized residuals |
