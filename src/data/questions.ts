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
  },
  {
    id: 'q_rainfed_land',
    field: 'isRainfedLand',
    title: 'Is your operational agricultural land predominantly rainfed (un-irrigated)?',
    contextExplanation: 'PM Fasal Bima Yojana provides tailored actuarial premium caps and prioritized localized drought and mid-season calamity coverage for rainfed plots.',
    schemeJustification: 'Evaluates: PMFBY localized risk assessment and calamity protection tier.',
    type: 'boolean'
  },
  {
    id: 'q_professional_course',
    field: 'isProfessionalCourse',
    title: 'Are you enrolled in a professional or technical course (Engineering, Medical, Pharmacy, MBA, Polytechnic, Architecture)?',
    contextExplanation: 'Technical and professional degrees have distinct fee reimbursement rules and higher scholarship tiers under Maharashtra DTE/DHE and AICTE.',
    schemeJustification: 'Unlocks: Rajarshi Chhatrapati Shahu Maharaj EBC 50% Fee Concession, AICTE Pragati, and Professional Freeship.',
    type: 'boolean'
  },
  {
    id: 'q_hosteller_status',
    field: 'isHosteller',
    title: 'Do you reside in a college hostel or rented room/PG away from your home district?',
    contextExplanation: 'Hostel residents and students living in rented rooms away from home qualify for substantial monthly food, accommodation, and book allowances.',
    schemeJustification: 'Unlocks: Dr. Panjabrao Deshmukh Vastigruh Nirvah Bhatta (₹30,000/yr) and Dr. Ambedkar Swadhar Yojana (₹51,000/yr).',
    type: 'boolean'
  },
  {
    id: 'q_cap_admission',
    field: 'isCapAdmitted',
    title: 'Were you admitted to your course through the Centralized Admission Process (CAP Round) via CET / NEET / JEE?',
    contextExplanation: 'Government tuition fee waivers and scholarship schemes in Maharashtra mandate merit admission through State CET Cell CAP rounds.',
    schemeJustification: 'Mandatory for: MahaDBT Fee Reimbursement, EBC Scholarship, and Caste Tuition Freeships.',
    type: 'boolean'
  },
  {
    id: 'q_qualifying_marks_60',
    field: 'hasQualifyingExamAbove60',
    title: 'Did you secure 60% or higher aggregate marks (or top 20th percentile) in your previous qualifying exam?',
    contextExplanation: 'Merit-based scholarships require verifiable academic performance in previous Class 10/12 or semester exams.',
    schemeJustification: 'Unlocks: Central Sector Scheme of Scholarship (CSSS), INSPIRE SHE Scholarship, and CM Fellowship.',
    type: 'boolean'
  },
  {
    id: 'q_caste_validity',
    field: 'hasCasteValidity',
    title: 'Do you possess a Caste Validity Certificate issued by the Divisional Caste Scrutiny Committee?',
    contextExplanation: 'For professional degree admissions in Maharashtra, social category fee benefits require scrutiny validation by the competent Caste Scrutiny Committee.',
    schemeJustification: 'Mandatory for: MahaDBT Post-Matric SC/ST/OBC/VJNT/SBC Fee Reimbursement.',
    type: 'boolean'
  },
  {
    id: 'q_non_creamy_layer',
    field: 'hasNonCreamyLayer',
    title: 'Do you hold a valid Non-Creamy Layer (NCL) Certificate (for OBC, VJNT, or SBC categories)?',
    contextExplanation: 'OBC, VJNT, and SBC candidates must possess a valid Tahsildar-issued Non-Creamy Layer certificate to claim affirmative fee concessions.',
    schemeJustification: 'Unlocks: OBC/VJNT/SBC Tuition & Exam Fee Waivers on MahaDBT.',
    type: 'boolean'
  },
  {
    id: 'q_orphan_single_parent',
    field: 'isOrphanOrSingleParent',
    title: 'Are you an orphan, child of parents lost to COVID-19, or ward of martyred armed forces personnel?',
    contextExplanation: 'Special national welfare schemes provide complete educational funding, contingency grants, and maintenance allowances for vulnerable students.',
    schemeJustification: 'Unlocks: AICTE Swanath Scholarship (₹50,000/yr) and PM CARES for Children assistance.',
    type: 'boolean'
  },
  {
    id: 'q_iti_student',
    field: 'isItiStudent',
    title: 'Are you currently enrolled in a Government Industrial Training Institute (ITI) under the Craftsman Training Scheme?',
    contextExplanation: 'The Skill Development & Entrepreneurship Department provides dedicated monthly training allowances for Government ITI trainees.',
    schemeJustification: 'Unlocks: ITI Craftsman Training Stipend (₹500/month for 10 months via MahaDBT).',
    type: 'boolean'
  },
  {
    id: 'q_upsc_mpsc_cleared',
    field: 'hasClearedUpscOrMpscStage',
    title: 'Have you cleared UPSC Civil Services Prelims, MPSC State Services Prelims, or are you appearing for Mains/Interview?',
    contextExplanation: 'Mahajyoti, BARTI, and SARTHI offer direct cash awards and preparatory grants for candidates who clear competitive exam stages.',
    schemeJustification: 'Unlocks: Mahajyoti MPSC/UPSC Financial Assistance (₹10,000 to ₹50,000 one-time stage reward).',
    type: 'boolean'
  },
  {
    id: 'q_freedom_fighter_child',
    field: 'isFreedomFighterChild',
    title: 'Are you a recognized dependent child or grandchild of a recognized freedom fighter?',
    contextExplanation: 'The Directorate of Higher Education Maharashtra provides affirmative educational concessions for families of recognized freedom fighters.',
    schemeJustification: 'Unlocks: DHE Education Concession for Freedom Fighter Children (50% fee waiver in aided/unaided colleges).',
    type: 'boolean'
  },
  {
    id: 'q_tenth_marks_75',
    field: 'hasTenthMarksAbove75',
    title: 'Did you score 75% or higher aggregate marks in your 10th standard (SSC/CBSE/ICSE) board exams?',
    contextExplanation: 'The Social Justice Department rewards Scheduled Caste toppers continuing into 11th and 12th higher secondary education.',
    schemeJustification: 'Unlocks: Rajarshi Chhatrapati Shahu Maharaj Merit Scholarship for SC Students (₹300/month for 10 months).',
    type: 'boolean'
  },
  {
    id: 'q_twelfth_math_physics_60',
    field: 'hasTwelfthMathPhysicsAbove60',
    title: 'Did you score 60% or higher in Mathematics or Physics in your 12th standard Science board exams?',
    contextExplanation: 'The Directorate of Higher Education supports top undergraduate science talent pursuing foundational Mathematics and Physics.',
    schemeJustification: 'Unlocks: DHE Scholarship to Meritorious Students in Mathematics and Physics (Top 100 students).',
    type: 'boolean'
  },
  {
    id: 'q_family_beneficiary_limit',
    field: 'familyBeneficiaryCountUnderTwo',
    title: 'Are there 2 or fewer children in your family availing this government scholarship/fee concession?',
    contextExplanation: 'MahaDBT guidelines stipulate a maximum ceiling of 2 beneficiaries per family for fee reimbursement schemes.',
    schemeJustification: 'Mandatory verification for: Rajarshi Shahu EBC and ITI Craftsman Stipend.',
    type: 'boolean'
  },
  {
    id: 'q_attendance_50',
    field: 'attendanceAboveFiftyPercent',
    title: 'Do you maintain at least 50% classroom attendance (or 80% for ITI vocational training)?',
    contextExplanation: 'Government Resolutions mandate regular institutional attendance to release tuition disbursements and maintenance allowances.',
    schemeJustification: 'Mandatory verification for: MahaDBT EBC, Freeship, and ITI training allowances.',
    type: 'boolean'
  },
  {
    id: 'q_upsc_mpsc_preparing',
    field: 'isPreparingForUpscOrMpsc',
    title: 'Are you actively preparing for UPSC Civil Services or MPSC State Services competitive exams?',
    contextExplanation: 'BARTI, SARTHI, MAHAJYOTI, and TRTI provide ₹10,000/month living stipends and fully funded coaching exclusively for civil services aspirants.',
    schemeJustification: 'Unlocks: BARTI/SARTHI/MAHAJYOTI Competitive Exam Preparation Fellowship (₹10,000/month).',
    type: 'boolean'
  },
  {
    id: 'q_enrolled_phd',
    field: 'isEnrolledInPhd',
    title: 'Are you currently registered or enrolled in a full-time Ph.D. or doctoral research program?',
    contextExplanation: 'Doctoral research fellowships (PMRF, UGC JRF, NFSC, BANRF, CSRF) are strictly reserved for post-graduate scholars pursuing research.',
    schemeJustification: 'Unlocks: Prime Minister\'s Research Fellowship (₹70,000/mo) and State Ph.D. Fellowships (₹37,000/mo).',
    type: 'boolean'
  },
  {
    id: 'q_jee_neet_aspirant',
    field: 'isPreparingForEngineeringOrMedicalEntrance',
    title: 'Are you preparing for or admitted through technical/medical entrance exams (IIT-JEE / NEET / MHT-CET)?',
    contextExplanation: 'Helps prioritize state and central technical fee concessions, AICTE Pragati, and hostel maintenance schemes.',
    schemeJustification: 'Unlocks: Free Coaching Scheme for SC/OBC (MSJE) and AICTE Technical Scholarships.',
    type: 'boolean'
  }
];
