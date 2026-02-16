# Choropleth Maps & Patient Flow Network — Findings

**Project:** Arthrodesis Procedures in Brazil's SUS (2015–2020)
**Date:** 2026-02-15

---

## 1. Enhanced SDR Choropleth (Section 14a)

The SDR (Standardized Discharge Ratio) choropleth uses a diverging RdYlGn colormap centered at SDR = 1.0, revealing the sharp North–South gradient:

- **Hot spots (SDR > 1.5):** Paraná (2.87), Goiás (2.19), Rio Grande do Sul (1.80) — all in Sul/Centro-Oeste
- **Cold spots (SDR < 0.4):** Rio Grande do Norte (0.06), Paraíba (0.11), Alagoas (0.11), Amapá (0.12), Roraima (0.21) — all in Norte/Nordeste
- The companion categorical map confirms that 7 states (26%) fall in the "Low" category (SDR < 0.4), while only 3 states (11%) are "High" (SDR > 1.5)

---

## 2. Diagnosis-Specific Rate Maps (Section 14b)

Four-panel choropleth showing annual rates per 100,000 for each diagnosis category:

| Category | Pattern |
|----------|---------|
| **Lumbar degenerative** | Strongest concentration in PR, GO, RS — mirrors overall SDR pattern. Norte/Nordeste states have near-zero rates. |
| **Cervical degenerative** | Similar spatial pattern but lower magnitude (max ~2.5/100k vs ~8/100k for lumbar) |
| **Trauma** | More geographically distributed — even low-SDR states have non-trivial trauma rates, suggesting supply-insensitive demand |
| **Deformity** | Highly concentrated in a few states (PR, SP, MG) — consistent with need for specialized surgical centers |

**Key finding:** Trauma shows the most even geographic distribution, reinforcing that it is need-driven (fractures happen everywhere), while elective categories (lumbar/cervical degenerative) are heavily concentrated in high-resource states.

---

## 3. Bivariate Choropleth: Rate × Mortality (Section 14c)

A 3×3 bivariate color scheme crossing procedure rate terciles with in-hospital mortality terciles:

- **High rate + Low mortality:** PR, RS, SC, GO — these surgical hubs have both high volume and favorable outcomes, suggesting mature spine surgery programs
- **Low rate + High mortality:** Several Norte/Nordeste states — limited access combined with adverse outcomes, possibly reflecting case complexity when patients do access surgery, or resource limitations
- **High rate + High mortality:** A few states warrant further investigation — high surgical volume does not always ensure good outcomes

**Interpretation:** This bivariate map identifies states where access expansion should be prioritized (low rate + high mortality) and validates that high-volume centers tend to have better outcomes.

---

## 4. Patient Flow Analysis (Section 15a)

### Overall flow statistics
- **97.9%** of patients receive surgery in their state of residence
- **2.1% (1,353 patients)** cross state borders for surgery
- This relatively low cross-border rate suggests either adequate local capacity in most states OR significant barriers to inter-state referral

### Top 10 patient flow corridors

| Rank | Origin → Destination | N | % of cross-state |
|------|---------------------|--:|:-----------------:|
| 1 | GO → DF | 241 | 17.8% |
| 2 | SC → PR | 174 | 12.9% |
| 3 | MG → DF | 86 | 6.4% |
| 4 | MA → PI | 52 | 3.8% |
| 5 | MG → SP | 49 | 3.6% |
| 6 | SP → MG | 48 | 3.5% |
| 7 | BA → PE | 48 | 3.5% |
| 8 | BA → SE | 22 | 1.6% |
| 9 | PR → SP | 19 | 1.4% |
| 10 | BA → MG | 19 | 1.4% |

The top 3 corridors alone account for **37.1%** of all cross-state flow, and are concentrated around Brasília (DF) and Paraná.

### Net flow by state

| State | Role | Net Flow | % Imported |
|-------|------|:--------:|:----------:|
| **DF** | Major importer | **+422** | 28.8% |
| **PR** | Major importer | +164 | 2.0% |
| **PI** | Regional importer | +61 | 8.3% |
| **PE** | Regional importer | +52 | 4.7% |
| **GO** | Major exporter | **−230** | — |
| **MG** | Net exporter | −92 | — |
| **BA** | Net exporter | −76 | — |
| **SC** | Net exporter | −153 | — |

**Key finding:** Brasília (DF) is the dominant surgical hub, importing 28.8% of its caseload from neighboring states (primarily Goiás and Minas Gerais). This reflects DF's concentration of tertiary spine centers and federal hospitals within a geographically small territory surrounded by large population centers.

---

## 5. Flow Arrow Network (Section 15c)

The geographic flow map shows the top 30 inter-state corridors as arrows proportional to patient volume:

- **Dominant axis:** The GO → DF corridor is by far the thickest arrow, representing the massive flow of Goiás residents to Brasília's hospitals
- **Southern cluster:** SC → PR flow reflects the attraction of Paraná's high-volume spine centers
- **Northeastern corridors:** BA → PE and MA → PI show regional referral patterns within the Nordeste
- **Long-distance flows are rare:** Most corridors connect adjacent or near-adjacent states, suggesting geographic proximity is a major determinant of flow

---

## 6. Micropoint Density Map (Section 15d)

Using patient-level latitude/longitude coordinates (residence municipality centroids):

- **Hexbin heatmap** reveals concentration clusters in São Paulo metropolitan area, Curitiba, Porto Alegre, and Goiânia
- **Cross-border scatter** highlights patients who traveled out of state, with DF appearing as a major destination cluster
- The Amazon region (Norte) shows extremely sparse point density, confirming the access desert for spine surgery

---

## 7. Summary: Sections 14–15

| Output File | Description |
|-------------|-------------|
| `choropleth_sdr.png` | SDR diverging choropleth + categorical map |
| `choropleth_diagnosis_specific.png` | 4-panel diagnosis rate maps |
| `choropleth_bivariate_rate_mortality.png` | 3×3 bivariate rate × mortality |
| `choropleth_patient_flow.png` | Net flow + % imported choropleths |
| `network_flow_arrows.png` | Top 30 corridor flow arrows |
| `micropoint_density_map.png` | Patient residence hexbin heatmap |
| `micropoint_crossborder.png` | Cross-border patient scatter |
| `table7_top_flow_corridors.csv` | All 201 inter-state corridors |
| `table8_net_flow_by_state.csv` | Net flow balance per state |

### Clinical Implications:
1. **DF as surgical hub:** Nearly 1 in 3 spine fusions performed in Brasília are for patients from other states — resource planning must account for this imported demand
2. **Access deserts:** Norte and Nordeste states have both low rates AND export patients, suggesting critical need for local capacity building
3. **Elective vs. trauma disparity:** Geographic variation is highest for preference-sensitive procedures (lumbar degenerative), suggesting that expanding spine surgery access should focus on elective/degenerative indications
4. **Volume–outcome correlation:** The bivariate map suggests high-volume states tend to have lower mortality, supporting centralization policies — but access equity demands balancing centralization with local availability

---

## 8. Sankey Diagram — Inter-State Patient Flow (Section 17a)

Alluvial-style Sankey visualization of the top 20 patient flow corridors:

- **GO → DF dominates:** 261 patients flow from Goiás to Brasília, the single largest corridor
- **Middle West outflows:** GO, MT, MS all export patients; green (Middle West) bands are the largest
- **Southeast/South destinations:** SP, PR, and DF receive the most cross-state patients
- **Regional pattern:** Patients generally flow from interior/frontier states toward capital/high-resource states
- Flow labels shown for corridors ≥40 patients

---

## 9. Chord Diagram — Bidirectional Flow (Section 17b)

Polar chord diagram showing bidirectional inter-state flow among 24 states with ≥20 cross-state patients:

- **24 states** have sufficient cross-state flow (≥20 patients combined in/out)
- **Arc sizes** proportional to total involvement (inflows + outflows)
- **GO** has the largest arc (highest total cross-state volume), followed by **SP**, **SC**, **MG**
- **Thickest chords:** GO↔DF, SC↔PR, MG↔SP — the three dominant bilateral corridors
- States from all 5 regions are represented, but Norte (orange) states have notably thinner arcs

### Output Files (Section 17):

| File | Description |
|------|-------------|
| `sankey_patient_flow.png` | Alluvial Sankey — top 20 corridors, color-coded by origin region |
| `chord_patient_flow.png` | Polar chord diagram — 24 states, bidirectional flows ≥5 patients |
