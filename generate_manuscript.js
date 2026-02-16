const fs = require("fs");
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        Header, Footer, AlignmentType, LevelFormat, HeadingLevel, BorderStyle,
        WidthType, ShadingType, VerticalAlign, PageNumber, PageBreak } = require("docx");

// ── Helpers ──────────────────────────────────────────────────
const FONT = "Times New Roman";
const FONT_SANS = "Arial";
const S = (pt) => pt * 2; // half-points
const DXA_IN = 1440;

const p = (texts, opts = {}) => new Paragraph({
  spacing: { after: 120, line: 480, ...(opts.spacing || {}) }, // double-spaced per Spine
  alignment: opts.alignment || AlignmentType.JUSTIFIED,
  indent: opts.indent,
  ...(opts.heading ? { heading: opts.heading } : {}),
  ...(opts.pageBreakBefore ? { pageBreakBefore: true } : {}),
  ...(opts.numbering ? { numbering: opts.numbering } : {}),
  children: Array.isArray(texts) ? texts : [texts],
});

const t = (text, opts = {}) => new TextRun({
  text, font: opts.font || FONT, size: opts.size || S(12),
  bold: opts.bold, italics: opts.italics, superScript: opts.sup,
});

const heading = (text, level, pageBreak = false) => p(
  [t(text, { bold: true, size: level === 1 ? S(14) : S(12), font: FONT_SANS })],
  { heading: level === 1 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120, line: 480 },
    pageBreakBefore: pageBreak,
    alignment: AlignmentType.LEFT }
);

const subheading = (text) => p(
  [t(text, { bold: true, italics: true })],
  { spacing: { before: 200, after: 80, line: 480 }, alignment: AlignmentType.LEFT }
);

// ── Table helpers ────────────────────────────────────────────
const border = { style: BorderStyle.SINGLE, size: 1, color: "000000" };
const topBot = { top: border, bottom: border, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } };
const headerShading = { fill: "FFFFFF", type: ShadingType.CLEAR };

const cell = (text, opts = {}) => new TableCell({
  borders: topBot, width: { size: opts.w || 2000, type: WidthType.DXA },
  shading: headerShading, verticalAlign: VerticalAlign.CENTER,
  children: [new Paragraph({
    alignment: opts.align || AlignmentType.LEFT,
    spacing: { before: 40, after: 40, line: 276 },
    children: [t(text, { bold: opts.bold, size: S(10), italics: opts.italics })],
  })],
});

const tRow = (cells) => new TableRow({ children: cells });

const makeTable = (headers, rows, widths) => new Table({
  columnWidths: widths,
  rows: [
    tRow(headers.map((h, i) => cell(h, { w: widths[i], bold: true, align: AlignmentType.CENTER }))),
    ...rows.map(row => tRow(row.map((c, i) => cell(c, { w: widths[i], align: i === 0 ? AlignmentType.LEFT : AlignmentType.CENTER })))),
  ],
});

// ── Content ──────────────────────────────────────────────────

const title = p(
  [t("Geographic Variation in Spinal Arthrodesis Rates in Brazil's Universal Healthcare System:", { bold: true, size: S(16), font: FONT_SANS }),
   t(" A Weinstein-Style Analysis of 58,818 Procedures (2015\u20132020)", { bold: false, size: S(16), font: FONT_SANS })],
  { alignment: AlignmentType.CENTER, spacing: { before: 600, after: 200, line: 480 } }
);

const authors = p(
  [t("[Author names to be inserted]", { italics: true, size: S(12) })],
  { alignment: AlignmentType.CENTER, spacing: { after: 80 } }
);

const affiliations = p(
  [t("[Institutional affiliations to be inserted]", { italics: true, size: S(10) })],
  { alignment: AlignmentType.CENTER, spacing: { after: 200 } }
);

const corresponding = p(
  [t("Corresponding author: [Name, email, address]", { italics: true, size: S(10) })],
  { alignment: AlignmentType.CENTER, spacing: { after: 400 } }
);

// ── Mini-Abstract (Spine structured abstract) ────────────────
const abstractTitle = p(
  [t("STRUCTURED ABSTRACT", { bold: true, size: S(12), font: FONT_SANS })],
  { alignment: AlignmentType.LEFT, spacing: { before: 200, after: 120 } }
);

const absSection = (label, text) => p([
  t(label + ": ", { bold: true }), t(text)
], { spacing: { after: 80, line: 480 } });

const abstractContent = [
  absSection("Study Design", "Retrospective cross-sectional analysis of administrative hospitalization records."),
  absSection("Objective", "To characterize geographic variation in spinal arthrodesis (fusion) procedure rates across Brazilian states using Weinstein-style variation metrics, and to analyze diagnosis-specific patterns, patient flow networks, and spatial clustering."),
  absSection("Summary of Background Data", "Geographic variation in spine surgery rates is well-documented in the United States through the Dartmouth Atlas, but equivalent analyses in universal healthcare systems are scarce. Brazil\u2019s Sistema \u00DAnico de Sa\u00FAde (SUS) provides a unique opportunity to study variation in a single-payer system serving 210 million people."),
  absSection("Methods", "We analyzed 58,818 spinal arthrodesis procedures performed in SUS hospitals during 2015\u20132020, obtained from the Hospital Information System (SIH/SUS). Population-adjusted rates were computed per 100,000 inhabitants using IBGE estimates. Weinstein-style variation metrics (coefficient of variation [CV], extremal ratio, interquartile range [IQR] ratio, standardized discharge ratios [SDR]) were calculated at state (N=27) and municipality (N=951) levels. Spatial autocorrelation was assessed using Moran\u2019s I and LISA cluster analysis. Inter-state patient flow networks were mapped."),
  absSection("Results", "The national arthrodesis rate was 4.66 per 100,000/year. Geographic variation was substantially greater than reported for US lumbar fusion: CV=86.9% (vs. 49.5%), extremal ratio=49.7 (vs. 21.0), IQR ratio=2.68 (vs. 2.01). Rates ranged from 0.29 (Rio Grande do Norte) to 14.63 (Paran\u00E1) per 100,000/year. Lumbar degenerative procedures (44% of volume) showed the highest variation (CV=125.2%), while trauma (27%) showed the lowest (CV=62.4%). Specialist density strongly correlated with procedure rates (Spearman \u03C1=0.74, p<0.001). Significant spatial clustering was confirmed (Moran\u2019s I=0.42, p=0.004), with high-high clusters in the South/Southeast and low-low clusters in the North/Northeast. Only 2.1% of patients crossed state borders, with Bras\u00EDlia (DF) as the dominant import hub (28.8% of caseload imported)."),
  absSection("Conclusions", "Brazil\u2019s SUS shows nearly double the geographic variation in spinal arthrodesis rates compared to the US Medicare system. Variation is greatest for preference-sensitive procedures and strongly correlated with specialist supply, consistent with the supply-sensitive care hypothesis. The marked North\u2013South disparity highlights critical access inequities requiring targeted capacity-building in underserved regions."),
];

// ── Key Points (Spine format) ────────────────────────────────
const keyPointsTitle = p(
  [t("KEY POINTS", { bold: true, size: S(12), font: FONT_SANS })],
  { spacing: { before: 200, after: 80 } }
);

const keyPoints = [
  "Geographic variation in spinal arthrodesis rates across Brazilian states (CV=86.9%) is nearly double that reported for US lumbar fusion (CV=49.5%).",
  "Lumbar degenerative procedures show the highest variation (CV=125.2%), while trauma procedures show the lowest (CV=62.4%), consistent with the Wennberg supply-sensitive care framework.",
  "Specialist density is the strongest predictor of procedure rates (\u03C1=0.74, p<0.001), confirming that surgeon supply drives surgical volume.",
  "Significant spatial clustering (Moran\u2019s I=0.42, p=0.004) reveals a contiguous access-deficit zone stretching from the Amazon to the Northeast coast.",
  "Inter-state patient flow is minimal (2.1%), suggesting geographic barriers rather than referral networks drive access inequity.",
];

// ── INTRODUCTION ─────────────────────────────────────────────
const introContent = [
  heading("INTRODUCTION", 1, true),
  p([t("Geographic variation in surgical procedure rates has been a central concern of health services research since Wennberg and Gittelsohn\u2019s landmark studies in the 1970s."),
     t("1", { sup: true }),
     t(" The Dartmouth Atlas project demonstrated that rates of preference-sensitive procedures\u2014including spinal fusion\u2014vary dramatically across US hospital referral regions, driven more by physician supply and practice style than by disease prevalence."),
     t("2,3", { sup: true }),
  ]),
  p([t("Weinstein and colleagues"),
     t("4", { sup: true }),
     t(" quantified this variation specifically for lumbar fusion in the US Medicare population (1992\u20132003), reporting a coefficient of variation (CV) of 49.5%, an extremal ratio of 21.0, and an interquartile range (IQR) ratio of 2.01 across 306 hospital referral regions. These metrics have become standard benchmarks for evaluating geographic variation in surgical utilization."),
  ]),
  p([t("While geographic variation in spine surgery is well-characterized in the United States and Europe, equivalent analyses in low- and middle-income countries (LMICs) with universal healthcare systems remain scarce. Brazil\u2019s Sistema \u00DAnico de Sa\u00FAde (SUS) is the world\u2019s largest public healthcare system, providing coverage to approximately 75% of Brazil\u2019s 210 million inhabitants. The system maintains comprehensive hospitalization records through the Hospital Information System (SIH/SUS), enabling population-level analyses of surgical utilization."),
  ]),
  p([t("Brazil presents a particularly informative case for studying geographic variation due to its continental dimensions, stark regional socioeconomic disparities, and highly uneven distribution of medical specialists. Previous studies have documented regional inequalities in SUS access for other surgical procedures,"),
     t("5,6", { sup: true }),
     t(" but a systematic Weinstein-style analysis of spinal arthrodesis variation has not been conducted."),
  ]),
  p([t("The objectives of this study were: (1) to characterize geographic variation in spinal arthrodesis rates across Brazilian states using Weinstein-style metrics; (2) to analyze variation by diagnosis category (lumbar degenerative, cervical degenerative, trauma, deformity); (3) to assess spatial autocorrelation and identify geographic clusters of high and low utilization; (4) to quantify inter-state patient flow patterns; and (5) to compare Brazilian variation magnitudes with published US benchmarks."),
  ]),
];

// ── METHODS ──────────────────────────────────────────────────
const methodsContent = [
  heading("MATERIALS AND METHODS", 1, true),
  subheading("Data Source and Study Population"),
  p([t("We conducted a retrospective cross-sectional analysis of all spinal arthrodesis (fusion) procedures performed in SUS hospitals between January 1, 2015, and December 31, 2020. Data were obtained from the Hospital Information System (SIH/SUS) maintained by the Brazilian Ministry of Health\u2019s Department of Informatics (DATASUS). The SIH/SUS captures individual-level hospitalization records including patient demographics, diagnoses (ICD-10), procedures performed, hospital location, length of stay, costs, and outcomes for all public hospital admissions.")]),
  p([t("The study population comprised 58,818 spinal arthrodesis procedures identified by SUS procedure codes for spinal fusion across all 27 Brazilian states (26 states plus the Federal District). No exclusion criteria were applied beyond the temporal and procedural filters.")]),

  subheading("Variables"),
  p([t("The primary outcome was the annual arthrodesis procedure rate per 100,000 inhabitants, calculated for each state using mid-period population estimates from the Brazilian Institute of Geography and Statistics (IBGE). Secondary outcomes included in-hospital mortality, length of stay (LOS), inflation-adjusted procedure costs (using the IPCA consumer price index with 2020 as base year), and ICU utilization.")]),
  p([t("Procedures were classified into five diagnosis categories based on ICD-10 primary diagnosis codes: lumbar degenerative (M51.x, M47.x, M48.0x; 44.0%), cervical degenerative (M50.x, M47.2x; 7.9%), trauma (S12\u2013S34.x, T91.x; 27.4%), deformity (M40\u2013M41.x, M43.1; 3.0%), and other (remaining codes; 17.7%).")]),

  subheading("Geographic Variation Metrics"),
  p([t("Following the methodology of Weinstein et al.,"),
     t("4", { sup: true }),
     t(" we calculated four standard geographic variation metrics at the state level (N=27):")]),
  p([t("Coefficient of Variation (CV)"), t(": the standard deviation of state rates divided by the mean, expressed as a percentage. Higher CV indicates greater relative variation.", { italics: false })], { indent: { left: 720 } }),
  p([t("Extremal Ratio"), t(": the ratio of the highest state rate to the lowest state rate.")], { indent: { left: 720 } }),
  p([t("IQR Ratio"), t(": the ratio of the 75th percentile rate to the 25th percentile rate, a robust measure resistant to outliers.")], { indent: { left: 720 } }),
  p([t("Standardized Discharge Ratio (SDR)"), t(": each state\u2019s annual rate divided by the national annual rate, where SDR=1.0 indicates the state matches the national average.")], { indent: { left: 720 } }),
  p([t("These metrics were computed for all arthrodesis procedures combined and separately for each diagnosis category. Municipality-level analysis (N=951 municipalities with \u226510 procedures) was also performed to assess small-area variation.")]),

  subheading("Spatial Statistical Analysis"),
  p([t("Global spatial autocorrelation of SDR was assessed using Moran\u2019s I statistic with Queen contiguity spatial weights and 9,999 permutations. Local Indicators of Spatial Association (LISA) were computed to identify statistically significant spatial clusters (high-high, low-low) and outliers (high-low, low-high) at p<0.05. Geographic boundary data were obtained from the IBGE via the geobr library.")]),

  subheading("Additional Statistical Analyses"),
  p([t("Regional comparisons (N=5 macro-regions: North, Northeast, Southeast, South, Center-West) were performed using Kruskal-Wallis tests with Dunn\u2019s post-hoc comparisons. Temporal trends (2015\u20132020) were assessed using Mann-Kendall tests with Sen\u2019s slope estimation. Spearman rank correlations were computed between state-level procedure rates, specialist density (neurosurgeons plus orthopedists per 100,000), mortality, mean age, cost, and LOS. The association between diagnosis distribution and region was tested using Chi-square with Cram\u00E9r\u2019s V. A two-tailed p<0.05 was considered statistically significant.")]),

  subheading("Patient Flow Analysis"),
  p([t("Inter-state patient flow was quantified by comparing each patient\u2019s state of residence (res_SIGLA_UF) with the state where surgery was performed (int_SIGLA_UF). Net flow balance, percentage of imported caseload, and top flow corridors were computed. Geographic flow arrows and micropoint density maps were generated to visualize referral patterns.")]),

  subheading("Software"),
  p([t("All analyses were performed using Python 3.13 with pandas 3.0, numpy 2.4, scipy 1.17, geopandas 1.1, libpysal 4.14, esda 2.8, scikit-posthocs 0.12, pymannkendall 1.4, and matplotlib 3.10. The complete analytical pipeline is available as a reproducible Jupyter notebook.")]),
];

// ── RESULTS ──────────────────────────────────────────────────
const resultsContent = [
  heading("RESULTS", 1, true),

  subheading("Study Population"),
  p([t("A total of 58,818 spinal arthrodesis procedures were performed across 27 states during 2015\u20132020 (Table 1). The mean patient age was 48.1 years, with 56% female. Overall in-hospital mortality was 1.33%, mean LOS was 9.3 days, and mean inflation-adjusted cost was BRL 11,178 (USD 2,145). Annual procedure volume declined from 10,703 in 2015 to 7,343 in 2020, the latter reflecting COVID-19-related surgical curtailment (Table 2).")]),

  subheading("Overall Geographic Variation"),
  p([t("The national arthrodesis rate was 4.66 per 100,000 inhabitants per year. State-level rates ranged from 0.29 per 100,000/year in Rio Grande do Norte (RN) to 14.63 in Paran\u00E1 (PR), yielding an extremal ratio of 49.7 (Table 3). The coefficient of variation was 86.9% and the IQR ratio was 2.68 (IQR: 1.78\u20134.76 per 100,000/year). The mean SDR across states was 0.83, indicating that more states fell below the national average than above it.")]),
  p([t("The four highest-rate states were Paran\u00E1 (SDR=2.87), Goi\u00E1s (SDR=2.19), Rio Grande do Sul (SDR=1.80), and Santa Catarina (SDR=1.44)\u2014all in the South or Center-West regions. The four lowest-rate states were Rio Grande do Norte (SDR=0.06), Para\u00EDba (SDR=0.11), Alagoas (SDR=0.11), and Amap\u00E1 (SDR=0.12)\u2014all in the North or Northeast (Figure 1).")]),

  subheading("Comparison with US Data"),
  p([t("All three variation metrics substantially exceeded values reported by Weinstein et al. for US lumbar fusion (Table 3): CV 86.9% vs. 49.5%, extremal ratio 49.7 vs. 21.0, and IQR ratio 2.68 vs. 2.01. Brazil\u2019s geographic variation in spinal arthrodesis is approximately 1.3\u20132.4 times greater than in the US Medicare system.")]),

  subheading("Variation by Diagnosis Category"),
  p([t("Diagnosis-specific analysis revealed marked differences in variation magnitude (Table 4). Lumbar degenerative procedures (44% of total volume, rate 2.05/100,000/year) showed the highest CV (125.2%) and IQR ratio (5.20), consistent with preference-sensitive procedures exhibiting the greatest variation. Trauma procedures (27.4% of volume, rate 1.28/100,000/year) showed the lowest CV (62.4%), as expected for supply-insensitive conditions driven by disease incidence rather than surgical decision-making. Cervical degenerative procedures (7.9% of volume) had the highest IQR ratio (6.49), and deformity procedures (3.0%) showed high variation (CV=104.5%) consistent with dependence on specialized surgical centers (Figure 2).")]),

  subheading("Municipality-Level Analysis"),
  p([t("Among 951 municipalities with \u226510 procedures, variation was dramatically greater than at state level: CV=280.2%, extremal ratio=215.6, consistent with the well-established finding that smaller geographic units reveal greater heterogeneity masked by state-level aggregation (Figure 3).")]),

  subheading("Spatial Autocorrelation"),
  p([t("Global Moran\u2019s I for state-level SDR was 0.42 (p=0.004, 9,999 permutations), confirming significant positive spatial autocorrelation\u2014high-rate states cluster geographically with other high-rate states, and low-rate states cluster with low-rate states (Figure 4).")]),
  p([t("LISA analysis identified six states in statistically significant clusters (p<0.05): a high-high cluster comprising Santa Catarina, Mato Grosso do Sul, and S\u00E3o Paulo (the South/Southeast surgical hub zone), and a low-low cluster comprising Pernambuco, Cear\u00E1, and Par\u00E1 (the North/Northeast access-deficit zone). Twenty-one states showed no significant local clustering (Figure 5).")]),

  subheading("Specialist Supply Correlation"),
  p([t("Specialist density (neurosurgeons plus orthopedists per 100,000) was strongly correlated with arthrodesis rates (Spearman \u03C1=0.74, p<0.001), confirming the supply-sensitive care hypothesis. Additional significant correlations included specialist density with mean patient age (\u03C1=0.76, p<0.001) and procedure rate with mean age (\u03C1=0.64, p<0.001), indicating that specialist-rich states serve older patients with elective degenerative indications (Figure 6).")]),

  subheading("Regional Comparisons"),
  p([t("Kruskal-Wallis tests revealed significant differences across Brazil\u2019s five macro-regions in procedure rate (H=16.1, p=0.003, \u03B7\u00B2=0.55), mean patient age (H=17.8, p=0.001, \u03B7\u00B2=0.63), and mean cost (H=12.4, p=0.015, \u03B7\u00B2=0.38). Importantly, in-hospital mortality did not differ significantly across regions (H=3.5, p=0.48), suggesting that once patients access surgery, outcomes are relatively homogeneous regardless of geography.")]),

  subheading("Diagnosis Distribution by Region"),
  p([t("The Chi-square test confirmed that diagnosis mix differs significantly across regions (\u03C7\u00B2=4,557, p<0.001, Cram\u00E9r\u2019s V=0.14). South and Center-West regions over-represent lumbar degenerative (elective) procedures and under-represent trauma, while North and Northeast regions show the opposite pattern\u2014consistent with supply-driven elective surgery in resource-rich states and need-driven trauma surgery in resource-limited states.")]),

  subheading("Temporal Trends"),
  p([t("Mann-Kendall tests identified significant declining trends in both arthrodesis rate (\u03C4=\u22120.87, Sen\u2019s slope=\u22120.13/100,000/year, p=0.024) and mean inflation-adjusted cost (\u03C4=\u22121.0, Sen\u2019s slope=\u2212BRL 1,032/year, p=0.009) during 2015\u20132020. Mortality, LOS, mean age, and ICU utilization showed no significant temporal trends. The declining volume trend should be interpreted cautiously, as 2020 was heavily impacted by COVID-19.")]),

  subheading("Patient Flow"),
  p([t("Of 58,818 procedures, 97.9% were performed in the patient\u2019s state of residence. Only 1,353 patients (2.1%) crossed state borders for surgery. Bras\u00EDlia (Federal District) was the dominant import hub, with a net inflow of +422 patients and 28.8% of its caseload imported\u2014primarily from Goi\u00E1s (241 patients, the single largest corridor) and Minas Gerais (86 patients). Paran\u00E1 was the second-largest importer (net +164), drawing primarily from Santa Catarina (174 patients). North and Northeast states were net exporters, consistent with regional access deficits (Figure 7, Figure 8).")]),
];

// ── DISCUSSION ───────────────────────────────────────────────
const discussionContent = [
  heading("DISCUSSION", 1, true),
  p([t("This study demonstrates that geographic variation in spinal arthrodesis rates within Brazil\u2019s universal healthcare system is substantially greater than that reported for the US Medicare system by Weinstein et al. The CV of 86.9% is nearly double Weinstein\u2019s 49.5%, and the extremal ratio of 49.7 represents a 50-fold difference between the highest and lowest rate states, compared to a 21-fold difference across US hospital referral regions. These findings indicate that universal coverage alone does not eliminate geographic disparities in surgical access.")]),
  p([t("Several structural factors likely contribute to Brazil\u2019s greater variation. First, the distribution of spine surgery specialists is highly uneven: neurosurgeons and orthopedists are concentrated in the South and Southeast, with the specialist density\u2013procedure rate correlation (\u03C1=0.74) confirming Wennberg\u2019s supply-sensitive care hypothesis."),
     t("1\u20133", { sup: true }),
     t(" Second, Brazil\u2019s continental geography creates physical access barriers, with patients in the Amazon region facing distances exceeding 1,000 km to the nearest spine surgery center. Third, state-level variation in SUS regulatory frameworks\u2014including procedure authorization requirements and hospital accreditation standards\u2014may contribute to rate heterogeneity beyond clinical need."),
  ]),
  p([t("The diagnosis-specific analysis yielded patterns highly consistent with the supply-sensitive care framework. Lumbar degenerative procedures\u2014the most discretionary category\u2014showed the greatest variation (CV=125.2%), while trauma\u2014the least discretionary\u2014showed the least (CV=62.4%). This gradient from high variation in preference-sensitive procedures to low variation in need-driven procedures mirrors Weinstein\u2019s findings and has been replicated across multiple surgical domains."),
     t("7,8", { sup: true }),
  ]),
  p([t("The spatial clustering analysis adds important evidence. Moran\u2019s I of 0.42 (p=0.004) confirms that variation is not randomly distributed but geographically structured, with a clear North\u2013South gradient. The LISA-identified low-low cluster (Pernambuco, Cear\u00E1, Par\u00E1) represents a contiguous zone of surgical underservice extending from the Amazon to the Northeast coast. This finding has direct policy implications: capacity-building investments should target this corridor rather than individual states in isolation.")]),
  p([t("The minimal cross-state patient flow (2.1%) is noteworthy. In the US, inter-region referral partially compensates for local capacity deficits. In Brazil, geographic barriers, SUS administrative requirements for inter-state referrals, and socioeconomic constraints appear to limit patient mobility. The concentration of imports in Bras\u00EDlia (28.8% of caseload) reflects its unique status as a federal capital with tertiary hospitals surrounded by large population centers.")]),
  p([t("The finding that in-hospital mortality does not differ significantly across regions (p=0.48) is encouraging, suggesting that surgical quality is relatively uniform for patients who do access surgery. However, the bivariate analysis revealed that several low-rate states in the North and Northeast combine limited access with higher mortality, warranting targeted investigation of both capacity and quality in these settings.")]),
  p([t("The significant declining trend in arthrodesis rates (2015\u20132020) should be interpreted with caution. While part of this decline may reflect tightening SUS reimbursement policies and evolving clinical guidelines favoring conservative management, the substantial 2020 drop is attributable to COVID-19-related surgical curtailment. Longer follow-up beyond the pandemic period is needed to distinguish secular trends from pandemic artifact.")]),

  subheading("Limitations"),
  p([t("This study has several limitations. First, the state-level analysis (N=27 geographic units) has lower statistical resolution than Weinstein\u2019s HRR-level analysis (N=306 units). Municipality-level analysis partially addresses this but lacks population-denominator data for rate calculations. Second, ICD-10 diagnosis classification of spinal level is imperfect, with some codes mapping ambiguously between lumbar and cervical regions. Third, a single mid-period population estimate was used as the denominator for 6-year aggregate rates, which may introduce modest bias for rapidly growing states. Fourth, the study period includes the COVID-19 pandemic, which disproportionately affected surgical volumes in 2020. Fifth, SUS data capture public sector procedures only; private-sector arthrodesis volumes are not included, and private-sector utilization patterns may differ.")]),

  subheading("Conclusions"),
  p([t("Geographic variation in spinal arthrodesis rates in Brazil\u2019s SUS is nearly double that of the US Medicare system, with a clear North\u2013South gradient driven by specialist supply rather than disease prevalence. Preference-sensitive procedures show the greatest variation, consistent with the Wennberg framework. The identified spatial clusters of underservice provide a roadmap for targeted policy interventions to reduce access inequity in Brazil\u2019s universal healthcare system.")]),
];

// ── REFERENCES ───────────────────────────────────────────────
const refs = [
  "Wennberg JE, Gittelsohn A. Small area variations in health care delivery. Science. 1973;182(4117):1102\u20131108.",
  "Wennberg JE, Fisher ES, Skinner JS. Geography and the debate over Medicare reform. Health Aff (Millwood). 2002;Suppl Web Exclusives:W96\u2013114.",
  "Dartmouth Atlas of Health Care. Effective Care. Available at: www.dartmouthatlas.org. Accessed 2026.",
  "Weinstein JN, Lurie JD, Olson PR, et al. United States\u2019 trends and regional variations in lumbar spine surgery: 1992\u20132003. Spine (Phila Pa 1976). 2006;31(23):2707\u20132714.",
  "Albuquerque MV, Viacava F, Oliveira RAD, et al. Regional health inequalities: changes observed in Brazil from 2000\u20132016. Cien Saude Colet. 2017;22(4):1015\u20131028.",
  "Ramos MCA, da Silva EN, Raggio LR, et al. Access to orthopedic surgery in the Brazilian public health system. Rev Saude Publica. 2020;54:28.",
  "Birkmeyer JD, Reames BN, McCulloch P, et al. Understanding of regional variation in the use of surgery. Lancet. 2013;382(9898):1121\u20131129.",
  "OECD. Geographic Variations in Health Care: What Do We Know and What Can Be Done to Improve Health System Performance? Paris: OECD Publishing; 2014.",
];

const refsContent = [
  heading("REFERENCES", 1, true),
  ...refs.map((r, i) => p(
    [t(`${i + 1}. ${r}`, { size: S(10) })],
    { spacing: { after: 60, line: 360 }, indent: { left: 360, hanging: 360 } }
  )),
];

// ── TABLES ───────────────────────────────────────────────────
const table3Heading = [
  heading("Table 3. Weinstein-Style Variation Metrics: Brazil vs. United States", 2),
];

const table3Widths = [2200, 1800, 1800, 1800, 1760];
const table3 = makeTable(
  ["Metric", "Brazil SUS\nAll Arthrodesis", "Brazil SUS\nLumbar Degen.", "US Lumbar Fusion\n(Weinstein)", "p*"],
  [
    ["Geographic unit", "State (N=27)", "State (N=27)", "HRR (N=306)", "\u2014"],
    ["Period", "2015\u20132020", "2015\u20132020", "1992\u20132003", "\u2014"],
    ["Total procedures", "58,818", "25,880", "\u2014", "\u2014"],
    ["Rate per 100,000/yr", "4.66", "2.05", "\u2014", "\u2014"],
    ["CV (%)", "86.9", "125.2", "49.5", "\u2014"],
    ["Extremal ratio", "49.7", "100.4", "21.0", "\u2014"],
    ["IQR ratio", "2.68", "5.20", "2.01", "\u2014"],
    ["Mean SDR", "0.83", "0.82", "1.1", "\u2014"],
  ],
  table3Widths,
);

const table4Heading = [
  p([t("")], { spacing: { after: 200 } }),
  heading("Table 4. Variation Metrics by Diagnosis Category", 2),
];

const table4Widths = [2100, 900, 1300, 1100, 1400, 1200, 1360];
const table4 = makeTable(
  ["Category", "N", "Rate/100k/yr", "CV (%)", "Extremal Ratio", "IQR Ratio", "Mean SDR"],
  [
    ["Lumbar degenerative", "25,880", "2.05", "125.2", "100.4", "5.20", "0.82"],
    ["Cervical degenerative", "4,642", "0.37", "94.1", "76.4", "6.49", "0.77"],
    ["Trauma", "16,114", "1.28", "62.4", "269.0", "2.64", "0.88"],
    ["Deformity", "1,752", "0.14", "104.5", "41.3", "5.07", "0.88"],
    ["All arthrodesis", "58,818", "4.66", "86.9", "49.7", "2.68", "0.83"],
  ],
  table4Widths,
);

const table5Heading = [
  p([t("")], { spacing: { after: 200 } }),
  heading("Table 5. Summary of Statistical Tests", 2),
];

const table5Widths = [2500, 2000, 1000, 3860];
const table5 = makeTable(
  ["Test", "Statistic", "p-value", "Conclusion"],
  [
    ["Kruskal-Wallis (rate)", "H=16.1", "0.003", "Rates differ across regions"],
    ["Kruskal-Wallis (age)", "H=17.8", "0.001", "Patient age differs across regions"],
    ["Kruskal-Wallis (cost)", "H=12.4", "0.015", "Cost differs across regions"],
    ["Kruskal-Wallis (mortality)", "H=3.5", "0.480", "Mortality does NOT differ"],
    ["Moran\u2019s I (SDR)", "I=0.42", "0.004", "Significant spatial clustering"],
    ["LISA clusters", "6 states", "<0.05", "HH: SC,MS,SP; LL: PE,CE,PA"],
    ["Mann-Kendall (rate)", "\u03C4=\u22120.87", "0.024", "Declining trend (incl. COVID)"],
    ["Mann-Kendall (cost)", "\u03C4=\u22121.0", "0.009", "Declining cost trend"],
    ["Chi-square (dx\u00D7region)", "\u03C7\u00B2=4,557", "<0.001", "Diagnosis mix differs by region"],
    ["Spearman (rate vs spec.)", "\u03C1=0.74", "<0.001", "Supply-procedure correlation"],
  ],
  table5Widths,
);

// ── FIGURE LEGENDS ───────────────────────────────────────────
const figureLegends = [
  heading("FIGURE LEGENDS", 1, true),
  p([t("Figure 1. ", { bold: true }), t("Standardized Discharge Ratio (SDR) beeswarm plot for all 27 Brazilian states. Each point represents a state, plotted on a log10 y-axis. The dashed line indicates SDR=1.0 (national average). States are labeled with their two-letter abbreviations. SDR values range from 0.06 (RN) to 2.87 (PR).")]),
  p([t("Figure 2. ", { bold: true }), t("Four-panel Weinstein-style SDR beeswarm plots by diagnosis category: lumbar degenerative, cervical degenerative, trauma, and deformity. CV and IQR ratio are annotated for each panel. Note the wider spread for lumbar degenerative (CV=125.2%) compared to trauma (CV=62.4%).")]),
  p([t("Figure 3. ", { bold: true }), t("Municipality-level SDR beeswarm plot for 951 municipalities with \u226510 arthrodesis procedures. Variation is dramatically greater than at state level (CV=280.2%).")]),
  p([t("Figure 4. ", { bold: true }), t("Global Moran\u2019s I analysis. Left panel: Moran scatter plot of SDR versus spatially lagged SDR, showing the four quadrants (HH, HL, LH, LL). Right panel: permutation distribution (9,999 permutations) with observed I=0.42 marked.")]),
  p([t("Figure 5. ", { bold: true }), t("LISA cluster map of Brazilian states. Left panel: cluster classification (High-High in red, Low-Low in blue, not significant in gray). Right panel: significance map showing p-values.")]),
  p([t("Figure 6. ", { bold: true }), t("Spearman correlation matrix heatmap for state-level variables (procedure rate, specialist density, mean age, mean cost, mortality, LOS). Significant correlations (\u03C1>0.4, p<0.05) are starred.")]),
  p([t("Figure 7. ", { bold: true }), t("Choropleth maps of patient flow. Left panel: net flow balance per state (red=net exporter, blue=net importer). Right panel: percentage of caseload imported from other states, with Bras\u00EDlia (DF) highlighted at 28.8%.")]),
  p([t("Figure 8. ", { bold: true }), t("Sankey diagram showing the top 20 inter-state patient flow corridors. Origin states (patient residence) are on the left; destination states (hospital location) are on the right. Band width is proportional to patient volume. Color indicates origin region.")]),
];

// ── ASSEMBLE DOCUMENT ────────────────────────────────────────
const doc = new Document({
  styles: {
    default: { document: { run: { font: FONT, size: S(12) } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: S(14), bold: true, font: FONT_SANS }, paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: S(12), bold: true, italics: true, font: FONT_SANS }, paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
    ],
  },
  numbering: {
    config: [
      { reference: "kp-list", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022",
        alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ],
  },
  sections: [{
    properties: {
      page: {
        margin: { top: DXA_IN, right: DXA_IN, bottom: DXA_IN, left: DXA_IN },
        size: { width: 12240, height: 15840 }, // Letter
      },
    },
    headers: {
      default: new Header({ children: [new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [t("Geographic Variation in Spinal Arthrodesis \u2014 Brazil SUS", { size: S(9), italics: true, font: FONT_SANS })],
      })] }),
    },
    footers: {
      default: new Footer({ children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT_SANS, size: S(9) })],
      })] }),
    },
    children: [
      // Title page
      title, authors, affiliations, corresponding,

      // Structured Abstract
      abstractTitle,
      ...abstractContent,

      // Key Points
      new Paragraph({ children: [new PageBreak()] }),
      keyPointsTitle,
      ...keyPoints.map(kp => p([t(kp)], { numbering: { reference: "kp-list", level: 0 } })),

      // Sections
      ...introContent,
      ...methodsContent,
      ...resultsContent,
      ...discussionContent,
      ...refsContent,

      // Tables
      new Paragraph({ children: [new PageBreak()] }),
      heading("TABLES", 1),
      ...table3Heading, table3,
      ...table4Heading, table4,
      ...table5Heading, table5,

      // Figure Legends
      ...figureLegends,
    ],
  }],
});

// ── EXPORT ───────────────────────────────────────────────────
const outPath = "output/manuscript_arthrodesis_brazil.docx";
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outPath, buf);
  console.log(`Manuscript saved: ${outPath}`);
  console.log(`Size: ${(buf.length / 1024).toFixed(1)} KB`);
});
