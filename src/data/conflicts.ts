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
  }
];
