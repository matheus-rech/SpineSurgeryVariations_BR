# Weinstein-Style Variation Analysis — Findings

**Project:** Arthrodesis Procedures in Brazil's SUS (2015–2020)
**Methodology:** Replication of Weinstein et al. (Spine, 2006) geographic variation metrics
**Date:** 2026-02-15

---

## 1. Overall Geographic Variation (State-Level)

Across 27 Brazilian states, spinal arthrodesis procedures showed **marked geographic variation** during 2015–2020:

| Metric | Value |
|--------|-------|
| Total procedures | 58,818 |
| National annual rate | 4.66 per 100,000/year |
| Mean state annual rate | 4.05 per 100,000/year |
| **Coefficient of Variation (CV)** | **86.9%** |
| **Extremal Ratio (max/min)** | **49.7** |
| **IQR Ratio (Q3/Q1)** | **2.68** |
| Mean SDR | 0.83 |
| Rate range | 0.29 – 14.63 per 100,000/year |
| IQR | 1.78 – 4.76 per 100,000/year |

### Highest-rate states (SDR > 1.5):
- **Parana (PR)**: SDR = 2.87 (87.8/100k cumulative)
- **Goias (GO)**: SDR = 2.19 (67.1/100k cumulative)
- **Rio Grande do Sul (RS)**: SDR = 1.80 (55.0/100k cumulative)
- **Santa Catarina (SC)**: SDR = 1.44 (43.9/100k cumulative)

### Lowest-rate states (SDR < 0.15):
- **Rio Grande do Norte (RN)**: SDR = 0.06 (1.8/100k cumulative)
- **Paraiba (PB)**: SDR = 0.11 (3.3/100k cumulative)
- **Alagoas (AL)**: SDR = 0.11 (3.4/100k cumulative)
- **Amapa (AP)**: SDR = 0.12 (3.5/100k cumulative)

---

## 2. Comparison with Weinstein's US Data

| Metric | Brazil SUS (2015–2020) | US Lumbar Fusion (Weinstein, 1992–2003) |
|--------|:----------------------:|:---------------------------------------:|
| CV (%) | **86.9** | 49.5 |
| Extremal Ratio | **49.7** | 21.0 |
| IQR Ratio | **2.68** | 2.01 |

**Interpretation:** Brazil's SUS shows substantially **greater** geographic variation than the US Medicare system for lumbar fusion. The CV is nearly double Weinstein's value (86.9% vs 49.5%), and the extremal ratio (49.7 vs 21.0) indicates a ~50-fold difference between the highest and lowest rate states in Brazil, compared to ~21-fold in the US.

This likely reflects:
1. **Structural inequalities** in SUS infrastructure (Sul/Sudeste vs Norte/Nordeste)
2. **Specialist workforce maldistribution** — neurosurgeons and orthopedists are concentrated in southern states
3. **Access barriers** — referral pathways, wait times, and geographic distance to tertiary spine centers
4. **State-level healthcare policy differences** in procedure authorization

---

## 3. Variation by Diagnosis Category

| Category | N | Rate/100k/yr | CV (%) | Extremal Ratio | IQR Ratio |
|----------|--:|:------------:|:------:|:--------------:|:---------:|
| **Lumbar degenerative** | 25,880 | 2.05 | **125.2** | 100.4 | **5.20** |
| **Cervical degenerative** | 4,642 | 0.37 | 94.1 | 76.4 | **6.49** |
| **Trauma** | 16,114 | 1.28 | **62.4** | 269.0 | 2.64 |
| **Deformity** | 1,752 | 0.14 | 104.5 | 41.3 | 5.07 |

### Key findings by category:

- **Lumbar degenerative** has the highest CV (125.2%) and IQR ratio (5.20), consistent with Weinstein's finding that **preference-sensitive/elective procedures** exhibit the most variation
- **Trauma** has the lowest CV (62.4%), as expected — fracture rates are driven by disease incidence rather than surgical supply/preferences. However, its extremal ratio is paradoxically the highest (269.0), likely due to very small case numbers in some states
- **Cervical degenerative** shows very high IQR ratio (6.49), suggesting that the middle 50% of states have a ~6.5-fold range in cervical fusion rates
- **Deformity** (scoliosis/kyphosis) shows high variation (CV=104.5%), consistent with complex surgical cases that require specialized centers

### Diagnosis distribution:
- Lumbar degenerative: 44.0% of all procedures
- Trauma: 27.4%
- Cervical degenerative: 7.9%
- Deformity: 3.0%
- Other: 17.8%

---

## 4. Municipality-Level Small Area Analysis

Analyzing 951 municipalities with >=10 arthrodesis procedures (2015–2020):

| Metric | Value |
|--------|-------|
| Municipalities analyzed | 951 |
| CV (%) | **280.2** |
| Extremal Ratio | **215.6** |
| IQR Ratio | **2.77** |
| Mean procedures/municipality | 50.4 |
| Median procedures/municipality | 24 |
| Range | 10 – 2,156 |

The municipality-level analysis reveals **dramatically greater variation** than state-level (CV=280% vs 87%), consistent with the Dartmouth Atlas finding that smaller geographic units show more variation because state-level analyses mask within-state heterogeneity.

---

## 5. Figures Generated

| File | Description |
|------|-------------|
| `weinstein_sdr_beeswarm.png` | Single-panel SDR plot with all 27 states labeled on log scale |
| `weinstein_multipanel_beeswarm.png` | 4-panel figure by diagnosis category (replicates Weinstein Figure 9) |
| `weinstein_municipality_beeswarm.png` | Municipality-level SDR beeswarm (N=951) |

---

## 6. Methodological Notes

- **Standardized Discharge Ratio (SDR)** = State annual rate / National annual rate. SDR=1.0 means the state matches the national average.
- **Population denominators**: IBGE mid-period population estimates (single year used as denominator for 6-year aggregate)
- **Diagnosis classification**: ICD-10 primary diagnosis mapped to 5 categories (Lumbar degenerative, Cervical degenerative, Trauma, Deformity, Other)
- **Municipality analysis**: Uses raw procedure counts as proxy since municipality-level population data was not linked. SDR computed relative to the mean across municipalities with >=10 cases.
- **Log scale**: All beeswarm plots use log10 y-axis so that SDR=2.0 and SDR=0.5 are equidistant from 1.0

### Limitations:
1. State-level analysis (N=27 areas) has lower statistical power than Weinstein's HRR-level analysis (N=306 areas)
2. Municipality-level analysis lacks population denominators, so variation metrics reflect case volume rather than true population rates
3. Single population estimate used for 6-year period (no year-specific denominators)
4. ICD-10 classification of spinal level is imperfect — some codes map ambiguously between lumbar and cervical
