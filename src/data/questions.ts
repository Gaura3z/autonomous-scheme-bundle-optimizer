/**
 * Adaptive Questionnaire Definitions
 * Only asked when relevant candidate schemes require these exact facts.
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 */
import { AdaptiveQuestion } from '../types';

export const ADAPTIVE_QUESTIONS: AdaptiveQuestion[] = [
  {
    id: 'q_student_higher_ed',
    field: 'enrolledInHigherEducation',
    title: 'Are you currently enrolled in an undergraduate or post-graduate degree program?',
    contextExplanation: 'We ask this because higher education scholarships and merit stipends require regular enrollment in a UGC/AICTE approved college.',
    schemeJustification: 'Unlocks: Post-Matric Scholarship (SC/ST/OBC) and State Merit-cum-Means Higher Education Stipends.',
    type: 'boolean'
  },
  {
    id: 'q_street_vending',
    field: 'hasStreetVendingActivity',
    title: 'Do you operate a street vending stall, pushcart, or informal micro-retail kiosk?',
    contextExplanation: 'Specialized urban micro-credit frameworks exist exclusively for licensed and surveyed street vendors.',
    schemeJustification: 'Unlocks: PM SVANidhi collateral-free working capital loan (up to ₹50,000) with 7% interest cashback.',
    type: 'boolean'
  },
  {
    id: 'q_woman_entrepreneur',
    field: 'isWomanEntrepreneur',
    title: 'Are you planning or leading a new greenfield enterprise or micro-business as a woman entrepreneur?',
    contextExplanation: 'Certain priority sector lending mandates require female founding ownership for high-value enterprise loans up to ₹1 Crore.',
    schemeJustification: 'Unlocks: Stand-Up India Bank Loans (₹10 Lakhs - ₹1 Crore) with subsidized margin money.',
    type: 'boolean'
  },
  {
    id: 'q_apprenticeship',
    field: 'pursuingApprenticeship',
    title: 'Are you seeking or actively participating in industrial on-job apprenticeship training?',
    contextExplanation: 'Apprenticeship incentives provide direct stipend reimbursement shared with the Government of India.',
    schemeJustification: 'Unlocks: National Apprenticeship Promotion Scheme (NAPS) stipend sharing up to ₹1,500/month.',
    type: 'boolean'
  },
  {
    id: 'q_girl_child',
    field: 'hasGirlChildUnder10',
    title: 'Do you have a biological or legally adopted daughter below 10 years of age?',
    contextExplanation: 'Specialized sovereign savings schemes offer the highest risk-free interest rates (8.2%) with full tax exemption for young girls.',
    schemeJustification: 'Unlocks: Sukanya Samriddhi Yojana (SSY) sovereign small savings account.',
    type: 'boolean'
  },
  {
    id: 'q_farmer_landholding',
    field: 'landholdingHectares',
    title: 'How much cultivable agricultural land do you own or operate?',
    contextExplanation: 'Agricultural income transfers and crop calamity coverage depend on verifiable land records and parcel size.',
    schemeJustification: 'Evaluates: PM-KISAN (direct ₹6,000/yr) and PM Fasal Bima Yojana (comprehensive crop risk protection).',
    type: 'number',
    min: 0.1,
    max: 25,
    step: 0.1,
    unit: 'Hectares'
  }
];
