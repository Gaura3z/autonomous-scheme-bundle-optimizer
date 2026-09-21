/**
 * Master Verified Scheme Conflicts Knowledge Base
 * Undirected incompatibility relations based on official scheme rules and circulars.
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 */
import { SchemeConflict } from '../types';

export const MASTER_CONFLICTS: SchemeConflict[] = [
  {
    id: 'conflict_pmegp_vs_mudra',
    schemeIdA: 'pm_egp',
    schemeIdB: 'pmmy_shishu',
    schemeAName: "Prime Minister's Employment Generation Programme (PMEGP)",
    schemeBName: 'Pradhan Mantri Mudra Yojana (PMMY - Shishu/Kishore)',
    reason: 'Subsidized Capital Conflict: A citizen starting or expanding an enterprise cannot avail government margin money / capital subsidy under PMEGP simultaneously with Mudra subsidized working credit for the identical project cost.',
    officialCircularReference: 'Ministry of MSME Operational Guidelines §4.2 (Dual Capital Subsidy Restriction)',
    consequence: 'Availing both causes bank sanction rejection or subsidy clawback with penal interest.',
    resolutionAdvice: 'For capital project subsidy (up to 35% government grant), choose PMEGP. For fast, collateral-free credit without margin money procedures, choose Mudra.'
  },
  {
    id: 'conflict_scholarship_central_vs_state',
    schemeIdA: 'post_matric_scholarship',
    schemeIdB: 'state_higher_ed_stipend',
    schemeAName: 'Post-Matric Scholarship for OBC/SC/ST Students (GoI)',
    schemeBName: 'State Merit-cum-Means Higher Education Stipend',
    reason: 'Dual Maintenance Allowance Prohibition: Central and State higher education frameworks forbid claiming multiple simultaneous maintenance allowances or tuition fee reimbursements for the same academic degree program.',
    officialCircularReference: 'National Scholarship Portal (NSP) Unified Guideline §7.1 & State Social Justice Dept Order',
    consequence: 'Simultaneous application triggers portal deduplication debarment on the National Scholarship Portal.',
    resolutionAdvice: 'The optimizer automatically selects the higher-value grant (Post-Matric Central) which offers complete tuition waiver plus ₹12,000 annual maintenance.'
  },
  {
    id: 'conflict_svanidhi_vs_mudra',
    schemeIdA: 'pm_svanidhi',
    schemeIdB: 'pmmy_shishu',
    schemeAName: "PM SVANidhi (Street Vendor's AtmaNirbhar Nidhi)",
    schemeBName: 'Pradhan Mantri Mudra Yojana (PMMY - Shishu)',
    reason: 'Micro-Vendor Scale Conflict: PM SVANidhi is specially tailored for urban street vendors (Tranche 1: ₹10,000 at 7% interest subsidy). Micro-enterprises availing standard Mudra commercial loans are expected to graduate rather than simultaneously holding vendor emergency credit.',
    officialCircularReference: 'MoHUA SVANidhi Advisory Ref 2023-B/Credit-Overlap',
    consequence: 'Credit score / CIBIL deduplication flags multiple unsecured micro-facilities for the same micro-unit.',
    resolutionAdvice: 'If vending in urban street markets, start with SVANidhi for rapid collateral-free working capital and 7% interest cashback.'
  },
  {
    id: 'conflict_ddugky_vs_naps',
    schemeIdA: 'deendayal_upadhyaya_gky',
    schemeIdB: 'national_apprenticeship',
    schemeAName: 'Deen Dayal Upadhyaya Grameen Kaushalya Yojana (DDU-GKY)',
    schemeBName: 'National Apprenticeship Promotion Scheme (NAPS)',
    reason: 'Full-time Residential Training vs Industry Apprenticeship Overlap: DDU-GKY requires mandatory full-time residential classroom/lab training, which physically and legally prevents simultaneous full-time industrial apprenticeship under NAPS.',
    officialCircularReference: 'Ministry of Rural Development Skills Division Norms §8.4',
    consequence: 'Candidate biometric attendance failure in either programme triggers stipend forfeiture.',
    resolutionAdvice: 'Complete DDU-GKY skilling first; NAPS apprenticeship can be pursued immediately upon certification.'
  },
  {
    id: 'conflict_standup_vs_mudra',
    schemeIdA: 'standup_india',
    schemeIdB: 'pmmy_shishu',
    schemeAName: 'Stand-Up India Scheme',
    schemeBName: 'Pradhan Mantri Mudra Yojana (PMMY - Shishu/Kishore)',
    reason: 'Dual Central Subsidized Credit Prohibition: Department of Financial Services (DFS) statutory guidelines forbid availing subsidized greenfield enterprise credit under Stand-Up India (₹10 Lakh - ₹1 Crore) while simultaneously drawing Mudra refinance micro-credit for the same business unit.',
    officialCircularReference: 'Ministry of Finance (DFS) Credit Directive Ref. DFS/SUI-PMMY/2022 §3',
    consequence: 'Simultaneous application causes duplicate sanction alerts on the RBI CRILC/CIBIL commercial registry, leading to loan cancellation.',
    resolutionAdvice: 'For substantial greenfield enterprise setup with capital equipment (up to ₹1 Crore), select Stand-Up India. For immediate small working capital without extensive project reports, select Mudra.'
  },
  {
    id: 'conflict_post_matric_vs_csss',
    schemeIdA: 'post_matric_scholarship',
    schemeIdB: 'central_sector_scholarship',
    schemeAName: 'Post-Matric Scholarship for SC/ST/OBC Students',
    schemeBName: 'Central Sector Scheme of Scholarship (CSSS)',
    reason: 'Single Central Scholarship Directive: National Scholarship Portal (NSP) strictly restricts students from availing more than one scholarship from Central Ministries simultaneously.',
    officialCircularReference: 'Ministry of Education & MoSJE Joint NSP Directive §4',
    consequence: 'Duplicate scholarship application causes portal rejection during institute or state nodal officer verification.',
    resolutionAdvice: 'The optimizer automatically selects the scholarship yielding higher financial benefit.'
  },
  {
    id: 'conflict_post_matric_vs_yasasvi',
    schemeIdA: 'post_matric_scholarship',
    schemeIdB: 'pm_yasasvi',
    schemeAName: 'Post-Matric Scholarship for SC/ST/OBC Students',
    schemeBName: 'PM YASASVI Scholarship',
    reason: 'Dual Beneficiary Restriction: Students cannot claim concurrent maintenance allowances from both PM-YASASVI and the standard Post-Matric scheme.',
    officialCircularReference: 'MoSJE YASASVI Scheme Guidelines Clause 5.3',
    consequence: 'NSP biometric de-duplication flags multiple disbursements to same Aadhaar-linked bank account.',
    resolutionAdvice: 'Choose PM YASASVI if enrolled in top-class notified institutions; otherwise apply for regular Post-Matric.'
  },
  {
    id: 'conflict_ebc_vs_post_matric_sc',
    schemeIdA: 'ebc_rajarshi_shahu',
    schemeIdB: 'post_matric_sc_mahadbt',
    schemeAName: 'Rajarshi Chhatrapati Shahu Maharaj EBC Concession',
    schemeBName: 'Post-Matric Scholarship for SC Students (MahaDBT)',
    reason: 'Departmental Scheme Exclusivity: SC students are entitled to 100% full fee waiver under Social Welfare Dept Post-Matric, whereas EBC concession provides 50% for General category. MahaDBT system prevents cross-departmental duplicate application.',
    officialCircularReference: 'Maharashtra Govt GR No. TEM-2018/CR-136/TE-4 & MahaDBT Portal Rule §3',
    consequence: 'System rejects secondary scheme application during Aadhaar-seeded profile validation on MahaDBT.',
    resolutionAdvice: 'The engine prioritizes Post-Matric SC which provides 100% full tuition waiver plus maintenance allowance.'
  },
  {
    id: 'conflict_ebc_vs_obc_pms',
    schemeIdA: 'ebc_rajarshi_shahu',
    schemeIdB: 'obc_post_matric_mahadbt',
    schemeAName: 'Rajarshi Chhatrapati Shahu Maharaj EBC Concession',
    schemeBName: 'Post-Matric Scholarship for OBC Students (MahaDBT)',
    reason: 'Category Quota Conflict: OBC students must apply under the VJNT, OBC & SBC Welfare Department rather than the General EBC scheme.',
    officialCircularReference: 'MahaDBT Higher & Technical Education Guidelines §8',
    consequence: 'Application returned with deficiency query by College Scrutiny Officer.',
    resolutionAdvice: 'The engine selects OBC Post-Matric scholarship for eligible OBC candidates.'
  },
  {
    id: 'conflict_sc_pms_vs_sc_freeship',
    schemeIdA: 'post_matric_sc_mahadbt',
    schemeIdB: 'sc_freeship_mahadbt',
    schemeAName: 'Post-Matric Scholarship for SC Students (MahaDBT)',
    schemeBName: 'Tuition and Examination Fees for SC Students (SC Freeship)',
    reason: 'Income Tier Mutual Exclusivity: SC students with family income ≤ ₹2.5 Lakhs qualify for GoI Post-Matric with maintenance, while students with income between ₹2.5L and ₹8.0L qualify for State Freeship without maintenance.',
    officialCircularReference: 'Ministry of Social Justice & Empowerment Post-Matric Guidelines & Maharashtra Social Justice Order',
    consequence: 'Selecting both results in automatic rejection on MahaDBT due to income ceiling mismatch.',
    resolutionAdvice: 'The engine evaluates exact parental income and selects the correct tier automatically.'
  },
  {
    id: 'conflict_obc_pms_vs_obc_freeship',
    schemeIdA: 'obc_post_matric_mahadbt',
    schemeIdB: 'obc_freeship_mahadbt',
    schemeAName: 'Post-Matric Scholarship for OBC Students (MahaDBT)',
    schemeBName: 'Tuition Fees and Examination Fees for OBC Students (OBC Freeship)',
    reason: 'Income Tier Mutual Exclusivity: Income under ₹1.5 Lakhs receives Post-Matric Scholarship + Maintenance; income between ₹1.5L and ₹8.0L receives 50% Freeship.',
    officialCircularReference: 'VJNT, OBC & SBC Welfare Department Circular Ref. OBC-2021/Scheme-Rules',
    consequence: 'Income certificate scrutiny mismatch triggers rejection by District Welfare Officer.',
    resolutionAdvice: 'The engine auto-routes the student to the appropriate tier based on annual income.'
  },
  {
    id: 'conflict_ebc_vs_minority_mh',
    schemeIdA: 'ebc_rajarshi_shahu',
    schemeIdB: 'state_minority_scholarship_mh',
    schemeAName: 'Rajarshi Chhatrapati Shahu Maharaj EBC Concession',
    schemeBName: 'State Minority Scholarship for Technical & Professional Courses (MH)',
    reason: 'Dual Tuition Benefit Prohibition: A student cannot claim both General EBC tuition reimbursement and State Minority technical scholarship for the same academic year.',
    officialCircularReference: 'Minority Development Department Maharashtra Resolution §5',
    consequence: 'Second disbursement blocked during treasury bill preparation.',
    resolutionAdvice: 'The engine compares course fee reimbursement under EBC vs flat ₹50,000 under Minority Scholarship to choose the maximum benefit.'
  },
  {
    id: 'conflict_aicte_pragati_vs_csss',
    schemeIdA: 'aicte_pragati',
    schemeIdB: 'central_sector_scholarship',
    schemeAName: 'AICTE Pragati Scholarship for Girls',
    schemeBName: 'Central Sector Scheme of Scholarship (CSSS)',
    reason: 'Single Central Scholarship Mandate: Ministry of Education guidelines restrict female technical students from drawing concurrent central scholarship awards via the National Scholarship Portal.',
    officialCircularReference: 'NSP Unified Standard Operating Procedure §11',
    consequence: 'NSP deduplication system blocks disbursement to the student\'s Aadhaar-linked bank account.',
    resolutionAdvice: 'The engine recommends AICTE Pragati (₹50,000/yr) over CSSS (₹12,000/yr) for female technical students.'
  }
];
