/**
 * Comprehensive Maharashtra State & Central Student Schemes Catalog
 * Specialized for students in Maharashtra and nationwide (Higher Ed, Professional, Technical, Scholarships, Hostels, Internships)
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 */
import { RulePredicate, Scheme, SchemeCategory } from '../types';

const VERIFIED_ON = '2026-09-20';
const CATALOG_VERSION = 'v2026.2-PS16';
const STATUTORY_NOTE = 'Verified official scheme guidelines. Citizen should apply via Aaple Sarkar MahaDBT or National Scholarship Portal.';

type SchemeDefinitionOptions = {
  id: string;
  code: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  category: SchemeCategory;
  jurisdiction: 'Central' | 'State-Specific';
  targetStates?: string[];
  ministry: string;
  officialSourceUrl: string;
  benefit: Scheme['benefit'];
  requiredDocumentIds: string[];
  rules: Omit<Scheme['rules'], 'id'>;
  conflictingSchemeIds?: string[];
  applicationSteps?: Scheme['applicationSteps'];
};

function createStudentScheme(options: SchemeDefinitionOptions): Scheme {
  return {
    ...options,
    rules: { ...options.rules, id: `rule_${options.id}` },
    lastVerifiedDate: VERIFIED_ON,
    kbVersion: CATALOG_VERSION,
    validityNote: STATUTORY_NOTE,
    applicationSteps: options.applicationSteps ?? [
      {
        sequence: 1,
        title: `Profile Registration & Document Verification on ${options.jurisdiction === 'State-Specific' ? 'MahaDBT Portal' : 'Official Portal'}`,
        instructions: `Register using your Aadhaar-linked mobile number on ${options.officialSourceUrl}, verify profile details, and upload certified documents.`,
        portalName: options.shortName,
        portalUrl: options.officialSourceUrl
      },
      {
        sequence: 2,
        title: 'College Nodal Officer & Scrutiny Verification',
        instructions: 'Submit printed application receipt with attached documents to the college scholarship desk for principal and district social welfare verification.',
        portalName: 'College Verification Desk',
        portalUrl: options.officialSourceUrl
      }
    ]
  };
}

const all = (...rules: RulePredicate[]) => ({ all: rules });
const any = (...rules: RulePredicate[]) => ({ any: rules });
const rule = (
  field: RulePredicate['field'],
  op: RulePredicate['op'],
  label: string,
  value?: unknown,
  min?: number,
  max?: number
): RulePredicate => ({ field, op, label, value, min, max });

export const MAHARASHTRA_STUDENT_SCHEMES: Scheme[] = [
  // 1. Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna (EBC)
  createStudentScheme({
    id: 'ebc_rajarshi_shahu',
    code: 'MH-EBC-SHAHU',
    name: 'Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna (EBC Concession)',
    shortName: 'Rajarshi Shahu Maharaj EBC',
    tagline: '50% (Male) / 100% (Female) Tuition & Exam Fee waiver for Higher & Technical Education (CAP Admissions)',
    description: 'Premier Maharashtra Government higher education concession for students admitted through State CET CAP rounds with annual family income ≤ ₹8,00,000. Provides 50% tuition & exam fee reimbursement for male students and 100% fee waiver for female students in two installments (GR dated 08 July 2024 & 07 Oct 2017). Max 2 beneficiaries per family, min 50% attendance.',
    category: 'Education & Skill',
    jurisdiction: 'State-Specific',
    targetStates: ['MH'],
    ministry: 'Higher & Technical Education Department, Government of Maharashtra (DTE)',
    officialSourceUrl: 'https://mahadbt.maharashtra.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 6500000,
      displayAmount: '50% (Male) / 100% (Female) Tuition & Exam Fee Waiver (~₹65,000 / year)',
      frequency: 'Annual'
    },
    requiredDocumentIds: [
      'aadhaar',
      'domicile_certificate',
      'income_certificate',
      'cap_allotment_letter',
      'educational_marksheet',
      'fee_receipt',
      'attendance_undertaking',
      'bank_passbook'
    ],
    rules: all(
      rule('state', 'eq', 'Must be a domicile of Maharashtra', 'MH'),
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('enrolledInHigherEducation', 'eq', 'Enrolled in higher / technical education course', true),
      rule('annualFamilyIncome', 'lte', 'Family annual income must not exceed ₹8,00,000', undefined, undefined, 800000)
    ),
    conflictingSchemeIds: ['post_matric_sc_mahadbt', 'obc_post_matric_mahadbt', 'state_minority_scholarship_mh']
  }),

  // 2. Dr. Panjabrao Deshmukh Vastigruh Nirvah Bhatta Yojna (Hostel Maintenance Allowance)
  createStudentScheme({
    id: 'panjabrao_deshmukh_hostel',
    code: 'MH-PANJABRAO-HOSTEL',
    name: 'Dr. Panjabrao Deshmukh Vastigruh Nirvah Bhatta Yojna (Hostel Allowance)',
    shortName: 'Panjabrao Deshmukh Hostel Stipend',
    tagline: 'Up to ₹30,000/year direct cash maintenance allowance for college students in hostels/rented rooms',
    description: 'Direct Benefit Transfer (DBT) maintenance allowance for children of registered marginal farmers (Alpabhudharak) or families with income up to ₹8 Lakhs pursuing professional courses and residing in college hostels or rented rooms.',
    category: 'Education & Skill',
    jurisdiction: 'State-Specific',
    targetStates: ['MH'],
    ministry: 'Directorate of Technical Education (DTE), Government of Maharashtra',
    officialSourceUrl: 'https://mahadbt.maharashtra.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 3000000,
      displayAmount: '₹30,000 / year (₹3,000 / month direct hostel allowance)',
      frequency: 'Annual'
    },
    requiredDocumentIds: [
      'aadhaar',
      'domicile_certificate',
      'income_certificate',
      'hostel_certificate',
      'student_id_bonafide',
      'bank_passbook'
    ],
    rules: all(
      rule('state', 'eq', 'Must be a domicile of Maharashtra', 'MH'),
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('annualFamilyIncome', 'lte', 'Family annual income must not exceed ₹8,00,000', undefined, undefined, 800000)
    )
  }),

  // 3. Dr. Babasaheb Ambedkar Swadhar Yojana (for SC/Navbouddha Students)
  createStudentScheme({
    id: 'swadhar_yojana_mh',
    code: 'MH-SWADHAR-SC',
    name: 'Dr. Babasaheb Ambedkar Swadhar Yojana for SC & Navbouddha Students',
    shortName: 'Dr. Ambedkar Swadhar Yojana',
    tagline: 'Up to ₹51,000/year direct stipend for food, accommodation & books for SC college students',
    description: 'Special social justice stipend for meritorious Scheduled Caste students admitted to colleges away from hometown who could not secure admission into government social welfare hostels. Provides direct cash transfer for room rent, meal charges, and study expenses.',
    category: 'Education & Skill',
    jurisdiction: 'State-Specific',
    targetStates: ['MH'],
    ministry: 'Social Justice and Special Assistance Department, Government of Maharashtra',
    officialSourceUrl: 'https://sjsa.maharashtra.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 5100000,
      displayAmount: '₹51,000 / year Direct Lodging & Boarding DBT',
      frequency: 'Annual'
    },
    requiredDocumentIds: [
      'aadhaar',
      'domicile_certificate',
      'caste_certificate',
      'caste_validity',
      'income_certificate',
      'hostel_certificate',
      'educational_marksheet',
      'bank_passbook'
    ],
    rules: all(
      rule('state', 'eq', 'Must be a resident of Maharashtra', 'MH'),
      rule('socialCategory', 'eq', 'Must belong to Scheduled Caste (SC) or Navbouddha', 'SC'),
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('annualFamilyIncome', 'lte', 'Family annual income must not exceed ₹2,50,000', undefined, undefined, 250000)
    )
  }),

  // 4. Pandit Deendayal Upadhyay Swayam Yojana (for ST Students)
  createStudentScheme({
    id: 'swayam_yojana_st_mh',
    code: 'MH-SWAYAM-ST',
    name: 'Pandit Deendayal Upadhyay Swayam Yojana for Tribal (ST) Students',
    shortName: 'Pandit Deendayal Swayam Yojana',
    tagline: '₹43,000 - ₹51,000/year direct cash allowance for lodging, boarding & educational materials',
    description: 'Tribal Development Department initiative providing direct bank financial assistance to tribal higher education students admitted to colleges who could not be accommodated in government tribal hostels.',
    category: 'Education & Skill',
    jurisdiction: 'State-Specific',
    targetStates: ['MH'],
    ministry: 'Tribal Development Department, Government of Maharashtra',
    officialSourceUrl: 'https://tribal.maharashtra.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 5100000,
      displayAmount: '₹51,000 / year Direct Cash Lodging & Boarding Allowance',
      frequency: 'Annual'
    },
    requiredDocumentIds: [
      'aadhaar',
      'domicile_certificate',
      'caste_certificate',
      'caste_validity',
      'income_certificate',
      'hostel_certificate',
      'bank_passbook'
    ],
    rules: all(
      rule('state', 'eq', 'Must be a domicile of Maharashtra', 'MH'),
      rule('socialCategory', 'eq', 'Applicant must belong to Scheduled Tribe (ST)', 'ST'),
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('annualFamilyIncome', 'lte', 'Family annual income under ₹2.5 Lakhs', undefined, undefined, 250000)
    )
  }),

  // 5. Post-Matric Scholarship for SC Students (MahaDBT)
  createStudentScheme({
    id: 'post_matric_sc_mahadbt',
    code: 'MH-MAHADBT-SC-PMS',
    name: 'Government of India Post-Matric Scholarship for SC Students (Maharashtra MahaDBT)',
    shortName: 'Post-Matric Scholarship (SC - MahaDBT)',
    tagline: '100% Tuition & Exam Fee waiver + up to ₹13,500/year maintenance allowance',
    description: 'Centrally sponsored flagship scholarship administered by Maharashtra Social Welfare Department covering 100% mandatory non-refundable college fees and monthly maintenance allowance.',
    category: 'Education & Skill',
    jurisdiction: 'State-Specific',
    targetStates: ['MH'],
    ministry: 'Social Justice and Special Assistance Department, Maharashtra',
    officialSourceUrl: 'https://mahadbt.maharashtra.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 8000000,
      displayAmount: '100% Full Tuition + Exam Fee Waiver + ₹13,500 Maintenance Allowance',
      frequency: 'Annual'
    },
    requiredDocumentIds: [
      'aadhaar',
      'domicile_certificate',
      'caste_certificate',
      'caste_validity',
      'income_certificate',
      'cap_allotment_letter',
      'educational_marksheet',
      'fee_receipt',
      'bank_passbook'
    ],
    rules: all(
      rule('state', 'eq', 'Must reside in Maharashtra', 'MH'),
      rule('socialCategory', 'eq', 'Must belong to Scheduled Caste (SC)', 'SC'),
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('annualFamilyIncome', 'lte', 'Annual family income must not exceed ₹2,50,000', undefined, undefined, 250000)
    ),
    conflictingSchemeIds: ['ebc_rajarshi_shahu', 'sc_freeship_mahadbt', 'central_sector_scholarship']
  }),

  // 6. Tuition Fees and Examination Fees for SC Students (SC Freeship)
  createStudentScheme({
    id: 'sc_freeship_mahadbt',
    code: 'MH-SC-FREESHIP',
    name: 'Post-Matric Tuition Fee and Examination Fee for SC Students (SC Freeship)',
    shortName: 'SC Tuition Freeship (MahaDBT)',
    tagline: '100% Tuition & Examination Fee waiver for SC students with family income above ₹2.5 Lakhs',
    description: 'State government funded freeship scheme ensuring no Scheduled Caste student is deprived of higher technical/professional education due to parental income exceeding the GoI ₹2.5 Lakh scholarship cap.',
    category: 'Education & Skill',
    jurisdiction: 'State-Specific',
    targetStates: ['MH'],
    ministry: 'Social Justice and Special Assistance Department, Maharashtra',
    officialSourceUrl: 'https://mahadbt.maharashtra.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 7000000,
      displayAmount: '100% College Tuition & Exam Fee Paid Directly to Institute',
      frequency: 'Annual'
    },
    requiredDocumentIds: [
      'aadhaar',
      'domicile_certificate',
      'caste_certificate',
      'caste_validity',
      'income_certificate',
      'cap_allotment_letter',
      'educational_marksheet',
      'fee_receipt'
    ],
    rules: all(
      rule('state', 'eq', 'Must reside in Maharashtra', 'MH'),
      rule('socialCategory', 'eq', 'Must belong to Scheduled Caste (SC)', 'SC'),
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('annualFamilyIncome', 'gte', 'Family income above ₹2,50,000', undefined, 250001),
      rule('annualFamilyIncome', 'lte', 'Family income within ₹8,00,000', undefined, undefined, 800000)
    ),
    conflictingSchemeIds: ['post_matric_sc_mahadbt', 'ebc_rajarshi_shahu']
  }),

  // 7. Post-Matric Scholarship for OBC Students (MahaDBT)
  createStudentScheme({
    id: 'obc_post_matric_mahadbt',
    code: 'MH-OBC-PMS',
    name: 'Post-Matric Scholarship for OBC Students (Maharashtra MahaDBT)',
    shortName: 'OBC Post-Matric Scholarship',
    tagline: '50% to 100% Tuition & Exam Fee Waiver + Maintenance Allowance for OBC Students',
    description: 'Welfare department scheme for Other Backward Class students studying in post-matriculation courses whose annual family income is under ₹1,50,000.',
    category: 'Education & Skill',
    jurisdiction: 'State-Specific',
    targetStates: ['MH'],
    ministry: 'VJNT, OBC and SBC Welfare Department, Maharashtra',
    officialSourceUrl: 'https://mahadbt.maharashtra.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 4500000,
      displayAmount: '50% - 100% Tuition Fee Waiver + Maintenance Allowance',
      frequency: 'Annual'
    },
    requiredDocumentIds: [
      'aadhaar',
      'domicile_certificate',
      'caste_certificate',
      'non_creamy_layer',
      'income_certificate',
      'educational_marksheet',
      'cap_allotment_letter',
      'fee_receipt',
      'bank_passbook'
    ],
    rules: all(
      rule('state', 'eq', 'Must reside in Maharashtra', 'MH'),
      rule('socialCategory', 'eq', 'Must belong to Other Backward Classes (OBC)', 'OBC'),
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('annualFamilyIncome', 'lte', 'Annual family income must not exceed ₹1,50,000', undefined, undefined, 150000)
    ),
    conflictingSchemeIds: ['ebc_rajarshi_shahu', 'obc_freeship_mahadbt', 'central_sector_scholarship']
  }),

  // 8. Tuition Fees and Examination Fees for OBC Students (OBC Freeship)
  createStudentScheme({
    id: 'obc_freeship_mahadbt',
    code: 'MH-OBC-FREESHIP',
    name: 'Tuition Fees and Examination Fees for OBC Students (OBC Freeship)',
    shortName: 'OBC Tuition Freeship (MahaDBT)',
    tagline: '50% (Male) / 100% (Female in Professional Courses) Tuition & Exam Fee Reimbursement',
    description: 'Rajarshi Shahu Maharaj Fee Reimbursement by VJNT/OBC/SBC Welfare Dept for non-creamy layer OBC students (income ₹1.5L - ₹8.0L) admitted via CAP rounds in government/aided/private colleges. As per GR dated 08 July 2024 & 31 July 2008, female students receive 100% tuition + exam fee waiver in professional courses, and other students receive 50% reimbursement.',
    category: 'Education & Skill',
    jurisdiction: 'State-Specific',
    targetStates: ['MH'],
    ministry: 'VJNT, OBC and SBC Welfare Department, Maharashtra',
    officialSourceUrl: 'https://mahadbt.maharashtra.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 5500000,
      displayAmount: '50% (Male) / 100% (Female) Tuition & Exam Fee Waiver (~₹55,000 / year)',
      frequency: 'Annual'
    },
    requiredDocumentIds: [
      'aadhaar',
      'domicile_certificate',
      'caste_certificate',
      'non_creamy_layer',
      'income_certificate',
      'cap_allotment_letter',
      'educational_marksheet',
      'fee_receipt'
    ],
    rules: all(
      rule('state', 'eq', 'Must reside in Maharashtra', 'MH'),
      rule('socialCategory', 'eq', 'Must belong to Other Backward Classes (OBC)', 'OBC'),
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('annualFamilyIncome', 'gte', 'Family income above ₹1,50,000', undefined, 150001),
      rule('annualFamilyIncome', 'lte', 'Family income within ₹8,00,000', undefined, undefined, 800000)
    ),
    conflictingSchemeIds: ['obc_post_matric_mahadbt', 'ebc_rajarshi_shahu']
  }),

  // 9. State Minority Scholarship for Technical & Professional Courses (Maharashtra)
  createStudentScheme({
    id: 'state_minority_scholarship_mh',
    code: 'MH-MINORITY-SCHOLARSHIP',
    name: 'State Minority Scholarship for Higher and Professional Courses (Maharashtra)',
    shortName: 'Maharashtra State Minority Scholarship',
    tagline: 'Up to ₹50,000/year direct scholarship for notified minority students in Maharashtra',
    description: 'Scholarship for Muslim, Buddhist, Christian, Sikh, Parsi, Jain, and Jewish students pursuing professional/technical courses (Engineering, Pharmacy, Medical, Architecture, Polytechnic) in Maharashtra with family income under ₹8 Lakhs.',
    category: 'Education & Skill',
    jurisdiction: 'State-Specific',
    targetStates: ['MH'],
    ministry: 'Minority Development Department, Government of Maharashtra',
    officialSourceUrl: 'https://mahadbt.maharashtra.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 5000000,
      displayAmount: '₹50,000 / year Direct Account Transfer',
      frequency: 'Annual'
    },
    requiredDocumentIds: [
      'aadhaar',
      'domicile_certificate',
      'income_certificate',
      'student_id_bonafide',
      'cap_allotment_letter',
      'educational_marksheet',
      'bank_passbook'
    ],
    rules: all(
      rule('state', 'eq', 'Must reside in Maharashtra', 'MH'),
      rule('isMinority', 'eq', 'Must belong to a notified religious minority community', true),
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('enrolledInHigherEducation', 'eq', 'Enrolled in higher / technical education', true),
      rule('annualFamilyIncome', 'lte', 'Family annual income must not exceed ₹8,00,000', undefined, undefined, 800000)
    ),
    conflictingSchemeIds: ['ebc_rajarshi_shahu', 'post_matric_sc_mahadbt', 'obc_post_matric_mahadbt']
  }),

  // 10. Mukhyamantri Yuva Karya Prashikshan Yojana (Maharashtra Youth Internship Scheme)
  createStudentScheme({
    id: 'cm_yuva_karya_prashikshan_mh',
    code: 'MH-CM-YKP',
    name: 'Mukhyamantri Yuva Karya Prashikshan Yojana (Maharashtra Youth Internship)',
    shortName: 'CM Yuva Karya Prashikshan',
    tagline: '₹6,000 to ₹10,000/month government-paid on-job internship stipend for 6 months',
    description: 'Flagship youth employment mission by Maharashtra Government providing 6 months hands-on practical industrial training with direct monthly stipend paid by Government: ₹6,000 for 12th pass, ₹8,000 for ITI/Diploma, and ₹10,000 for Degree/Post-graduates.',
    category: 'Business & Self-Employment',
    jurisdiction: 'State-Specific',
    targetStates: ['MH'],
    ministry: 'Skill Development, Employment, Entrepreneurship & Innovation Dept, Maharashtra',
    officialSourceUrl: 'https://rojgar.mahaswayam.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 6000000,
      displayAmount: '₹10,000 / month for 6 Months (₹60,000 Direct Stipend)',
      frequency: 'One-Time'
    },
    requiredDocumentIds: [
      'aadhaar',
      'domicile_certificate',
      'educational_marksheet',
      'bank_passbook'
    ],
    rules: all(
      rule('state', 'eq', 'Must be a resident of Maharashtra', 'MH'),
      rule('age', 'between', 'Age must be between 18 and 35 years', undefined, 18, 35)
    )
  }),

  // 11. Maharashtra Girls 100% Fee Waiver in Higher Professional Education
  createStudentScheme({
    id: 'mh_girls_free_higher_ed',
    code: 'MH-GIRLS-FREE-HE',
    name: 'Maharashtra Girls 100% Fee Waiver in Higher Professional Education',
    shortName: 'Maharashtra Girls 100% Free Higher Ed',
    tagline: '100% Tuition and Exam Fee Waiver for girls in Engineering, Medicine, Pharmacy & Tech',
    description: 'Pioneering Maharashtra Government empowerment initiative granting full 100% tuition and examination fee waiver to girl students from families with annual income up to ₹8 Lakhs pursuing government-recognized professional courses.',
    category: 'Education & Skill',
    jurisdiction: 'State-Specific',
    targetStates: ['MH'],
    ministry: 'Higher & Technical Education Department, Government of Maharashtra',
    officialSourceUrl: 'https://mahadbt.maharashtra.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 8500000,
      displayAmount: '100% Full Tuition & Exam Fee Waived (~₹85,000 / year)',
      frequency: 'Annual'
    },
    requiredDocumentIds: [
      'aadhaar',
      'domicile_certificate',
      'income_certificate',
      'cap_allotment_letter',
      'educational_marksheet',
      'fee_receipt'
    ],
    rules: all(
      rule('state', 'eq', 'Must be a resident of Maharashtra', 'MH'),
      rule('gender', 'eq', 'Eligible exclusively for female students', 'Female'),
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('enrolledInHigherEducation', 'eq', 'Enrolled in approved higher professional degree/diploma', true),
      rule('annualFamilyIncome', 'lte', 'Annual family income must not exceed ₹8,00,000', undefined, undefined, 800000)
    )
  }),

  // 12. Chief Minister Fellowship Program (Maharashtra)
  createStudentScheme({
    id: 'cm_fellowship_mh',
    code: 'MH-CM-FELLOWSHIP',
    name: 'Maharashtra Chief Minister Fellowship Program',
    shortName: 'Maharashtra CM Fellowship',
    tagline: '₹75,000/month prestigious governance fellowship with District Collectors & Secretaries',
    description: 'Highly prestigious 1-year governance leadership fellowship for dynamic young graduates and post-graduates (age 21 to 26) with first-class marks to work alongside senior administrative leaders on strategic public projects across Maharashtra.',
    category: 'Education & Skill',
    jurisdiction: 'State-Specific',
    targetStates: ['MH'],
    ministry: 'Planning Department / Directorate of Economics & Statistics, Maharashtra',
    officialSourceUrl: 'https://mahades.maharashtra.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 90000000,
      displayAmount: '₹75,000 / month (₹9,00,000 Annual Stipend + ₹5,000 Travel)',
      frequency: 'Annual'
    },
    requiredDocumentIds: [
      'aadhaar',
      'domicile_certificate',
      'educational_marksheet',
      'bank_passbook'
    ],
    rules: all(
      rule('state', 'eq', 'Must be a resident of Maharashtra', 'MH'),
      rule('educationLevel', 'in', 'Must have completed Bachelor\'s or Master\'s degree', ['Undergraduate', 'Postgraduate']),
      rule('hasQualifyingExamAbove60', 'eq', 'Must have secured minimum 60% aggregate marks in degree', true),
      rule('age', 'between', 'Age must be between 21 and 26 years', undefined, 21, 26)
    )
  }),

  // 13. BARTI / SARTHI / MAHAJYOTI Competitive Exam Fellowship
  createStudentScheme({
    id: 'barti_sarthi_competitive_stipend',
    code: 'MH-COMPETITIVE-STIPEND',
    name: 'BARTI / SARTHI / MAHAJYOTI / TRTI UPSC & MPSC Preparation Fellowship',
    shortName: 'Maha Competitive Exam Fellowship',
    tagline: '₹10,000/month stipend + 100% free coaching for UPSC Civil Services & MPSC exams',
    description: 'Sponsored by Dr. Babasaheb Ambedkar Research & Training Institute (BARTI - SC), Chhatrapati Shahu Maharaj Research Training and Human Development Institute (SARTHI - Maratha/EWS), MAHAJYOTI (OBC), and TRTI (ST) to support civil services aspirants with monthly stipends and books grant.',
    category: 'Education & Skill',
    jurisdiction: 'State-Specific',
    targetStates: ['MH'],
    ministry: 'Social Welfare & Other Backward Class Welfare Departments, Maharashtra',
    officialSourceUrl: 'https://barti.maharashtra.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 12000000,
      displayAmount: '₹10,000 / month (₹1,20,000 / year + Free Coaching & Books)',
      frequency: 'Annual'
    },
    requiredDocumentIds: [
      'aadhaar',
      'domicile_certificate',
      'caste_certificate',
      'caste_validity',
      'income_certificate',
      'educational_marksheet',
      'bank_passbook'
    ],
    rules: all(
      rule('state', 'eq', 'Must reside in Maharashtra', 'MH'),
      rule('isPreparingForUpscOrMpsc', 'eq', 'Must be actively preparing for UPSC/MPSC competitive exams', true),
      rule('age', 'between', 'Candidate age between 20 and 35 years', undefined, 20, 35),
      rule('annualFamilyIncome', 'lte', 'Annual family income under ₹8 Lakhs', undefined, undefined, 800000)
    )
  }),

  // 14. AICTE Pragati Scholarship for Girl Students (Degree & Diploma)
  createStudentScheme({
    id: 'aicte_pragati',
    code: 'AICTE-PRAGATI',
    name: 'AICTE Pragati Scholarship Scheme for Girl Students',
    shortName: 'AICTE Pragati Scholarship',
    tagline: '₹50,000/year contingency award throughout technical degree/diploma for female students',
    description: 'Ministry of Education and AICTE flagship initiative supporting female students admitted to 1st year of technical degree or diploma courses with an annual award of ₹50,000 to cover college fees, books, computer equipment, and stationery.',
    category: 'Education & Skill',
    jurisdiction: 'Central',
    ministry: 'All India Council for Technical Education (AICTE) / Ministry of Education',
    officialSourceUrl: 'https://scholarships.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 5000000,
      displayAmount: '₹50,000 / year throughout course duration',
      frequency: 'Annual'
    },
    requiredDocumentIds: [
      'aadhaar',
      'student_id_bonafide',
      'income_certificate',
      'educational_marksheet',
      'bank_passbook'
    ],
    rules: all(
      rule('gender', 'eq', 'Available exclusively for female students', 'Female'),
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('enrolledInHigherEducation', 'eq', 'Enrolled in technical degree or diploma course', true),
      rule('annualFamilyIncome', 'lte', 'Family income must not exceed ₹8,00,000', undefined, undefined, 800000)
    )
  }),

  // 15. AICTE Saksham Scholarship for Specially-Abled Students
  createStudentScheme({
    id: 'aicte_saksham',
    code: 'AICTE-SAKSHAM',
    name: 'AICTE Saksham Scholarship for Specially-Abled Students',
    shortName: 'AICTE Saksham Scholarship',
    tagline: '₹50,000/year assistance for differently-abled students pursuing technical education',
    description: 'Support by AICTE for students with benchmark disability (≥ 40%) admitted to technical degree or diploma programs to empower higher education pursuit.',
    category: 'Education & Skill',
    jurisdiction: 'Central',
    ministry: 'All India Council for Technical Education (AICTE)',
    officialSourceUrl: 'https://scholarships.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 5000000,
      displayAmount: '₹50,000 / year Educational Allowance',
      frequency: 'Annual'
    },
    requiredDocumentIds: [
      'aadhaar',
      'disability_udid',
      'student_id_bonafide',
      'income_certificate',
      'bank_passbook'
    ],
    rules: all(
      rule('hasDisability', 'eq', 'Must have certified disability', true),
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('annualFamilyIncome', 'lte', 'Annual family income under ₹8,00,000', undefined, undefined, 800000)
    )
  }),

  // 16. AICTE Swanath Scholarship Scheme
  createStudentScheme({
    id: 'aicte_swanath',
    code: 'AICTE-SWANATH',
    name: 'AICTE Swanath Scholarship Scheme for Orphans & Wards of Martyrs',
    shortName: 'AICTE Swanath Scholarship',
    tagline: '₹50,000/year financial award for orphaned students and wards of Armed Forces martyrs',
    description: 'Providing financial support to orphan students, students whose both parents died due to COVID-19, and children of martyred Armed Forces/Central Paramilitary personnel pursuing technical education.',
    category: 'Education & Skill',
    jurisdiction: 'Central',
    ministry: 'All India Council for Technical Education (AICTE)',
    officialSourceUrl: 'https://scholarships.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 5000000,
      displayAmount: '₹50,000 / year Financial Assistance',
      frequency: 'Annual'
    },
    requiredDocumentIds: [
      'aadhaar',
      'student_id_bonafide',
      'income_certificate',
      'bank_passbook'
    ],
    rules: all(
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('enrolledInHigherEducation', 'eq', 'Enrolled in AICTE approved institution', true),
      rule('annualFamilyIncome', 'lte', 'Family annual income under ₹8,00,000', undefined, undefined, 800000)
    )
  }),

  // 17. Central Sector Scheme of Scholarship for College and University Students (CSSS)
  createStudentScheme({
    id: 'central_sector_scholarship',
    code: 'CSSS-MOE',
    name: 'Central Sector Scheme of Scholarship for College and University Students (CSSS)',
    shortName: 'Central Sector Scholarship (CSSS)',
    tagline: '₹12,000/year for UG and ₹20,000/year for PG for meritorious 12th board toppers',
    description: 'Prestigious scholarship by Department of Higher Education, Ministry of Education for students who score above 80th percentile in Class 12 board examinations with family income under ₹4.5 Lakhs.',
    category: 'Education & Skill',
    jurisdiction: 'Central',
    ministry: 'Department of Higher Education, Ministry of Education',
    officialSourceUrl: 'https://scholarships.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 1200000,
      displayAmount: '₹12,000 / year (UG) to ₹20,000 / year (PG)',
      frequency: 'Annual'
    },
    requiredDocumentIds: [
      'aadhaar',
      'educational_marksheet',
      'student_id_bonafide',
      'income_certificate',
      'bank_passbook'
    ],
    rules: all(
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('enrolledInHigherEducation', 'eq', 'Enrolled in regular undergraduate or postgraduate degree', true),
      rule('annualFamilyIncome', 'lte', 'Annual family income must not exceed ₹4,50,000', undefined, undefined, 450000)
    ),
    conflictingSchemeIds: ['post_matric_scholarship', 'post_matric_sc_mahadbt', 'obc_post_matric_mahadbt', 'nmms_scholarship', 'pm_yasasvi']
  }),

  // 18. INSPIRE Scholarship for Higher Education (SHE)
  createStudentScheme({
    id: 'inspire_she_scholarship',
    code: 'DST-INSPIRE-SHE',
    name: 'INSPIRE Scholarship for Higher Education (SHE)',
    shortName: 'INSPIRE SHE Scholarship',
    tagline: '₹80,000/year for meritorious students pursuing Natural and Basic Sciences (B.Sc., M.Sc.)',
    description: 'Flagship Department of Science & Technology (DST) scholarship for students who rank in the top 1% of their Class 12 board examinations and enroll in natural, basic, or experimental science degrees (B.Sc., B.S., Int. M.Sc.).',
    category: 'Education & Skill',
    jurisdiction: 'Central',
    ministry: 'Department of Science and Technology (DST), Ministry of Science & Technology',
    officialSourceUrl: 'https://online-inspire.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 8000000,
      displayAmount: '₹80,000 / year (₹60,000 Scholarship + ₹20,000 Mentorship Project)',
      frequency: 'Annual'
    },
    requiredDocumentIds: [
      'aadhaar',
      'educational_marksheet',
      'student_id_bonafide',
      'bank_passbook'
    ],
    rules: all(
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('enrolledInHigherEducation', 'eq', 'Enrolled in Natural / Basic Sciences degree', true)
    )
  }),

  // 19. Prime Minister\'s Research Fellowship (PMRF)
  createStudentScheme({
    id: 'pm_research_fellowship',
    code: 'MOE-PMRF',
    name: "Prime Minister's Research Fellowship (PMRF)",
    shortName: "Prime Minister's Research Fellowship",
    tagline: '₹70,000 - ₹80,000/month + ₹2 Lakh/year research contingency grant for Ph.D. scholars',
    description: 'Premier national doctoral fellowship scheme to attract the best talent for doctoral (Ph.D.) programs at IITs, IISc, IISERs, and Central Universities with high stipends and international conference funding.',
    category: 'Education & Skill',
    jurisdiction: 'Central',
    ministry: 'Ministry of Education',
    officialSourceUrl: 'https://www.pmrf.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 96000000,
      displayAmount: '₹70,000 - ₹80,000 / month + ₹2,00,000 Annual Research Grant',
      frequency: 'Annual'
    },
    requiredDocumentIds: [
      'aadhaar',
      'educational_marksheet',
      'student_id_bonafide',
      'bank_passbook'
    ],
    rules: all(
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('isEnrolledInPhd', 'eq', 'Must be enrolled in full-time Ph.D. or doctoral research', true),
      rule('age', 'between', 'Age must be between 20 and 35 years', undefined, 20, 35)
    )
  }),

  // 20. UGC Junior Research Fellowship (JRF)
  createStudentScheme({
    id: 'ugc_jrf_fellowship',
    code: 'UGC-NET-JRF',
    name: 'UGC / CSIR Junior Research Fellowship (JRF)',
    shortName: 'UGC-NET Junior Research Fellowship',
    tagline: '₹37,000/month + HRA + contingency grant for research scholars qualifying NET',
    description: 'National fellowship awarded to candidates who qualify the UGC-NET or CSIR-NET examinations and enroll in full-time M.Phil./Ph.D. degree courses across Indian universities.',
    category: 'Education & Skill',
    jurisdiction: 'Central',
    ministry: 'University Grants Commission (UGC) / Ministry of Education',
    officialSourceUrl: 'https://ugcnet.nta.ac.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 44400000,
      displayAmount: '₹37,000 / month + HRA + Contingency Grant',
      frequency: 'Annual'
    },
    requiredDocumentIds: [
      'aadhaar',
      'educational_marksheet',
      'student_id_bonafide',
      'bank_passbook'
    ],
    rules: all(
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('isEnrolledInPhd', 'eq', 'Must be enrolled in full-time M.Phil./Ph.D. research program', true),
      rule('age', 'between', 'Age between 21 and 35 years', undefined, 21, 35)
    )
  }),

  // 21. National Apprenticeship Training Scheme (NATS)
  createStudentScheme({
    id: 'nats_apprenticeship',
    code: 'NATS-BOAT',
    name: 'National Apprenticeship Training Scheme (NATS)',
    shortName: 'NATS Graduate / Diploma Apprenticeship',
    tagline: '₹9,000/month stipend for engineering & general graduates undergoing 1-year industrial training',
    description: 'Instituted by the Ministry of Education (Board of Practical Training) to provide fresh engineering, general degree, and diploma holders with 1 year of paid structured on-job industrial apprenticeship.',
    category: 'Business & Self-Employment',
    jurisdiction: 'Central',
    ministry: 'Ministry of Education (Board of Apprenticeship Training)',
    officialSourceUrl: 'https://nats.education.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 10800000,
      displayAmount: '₹9,000 / month (₹1,08,000 / year direct bank stipend)',
      frequency: 'Annual'
    },
    requiredDocumentIds: [
      'aadhaar',
      'educational_marksheet',
      'bank_passbook'
    ],
    rules: all(
      rule('age', 'between', 'Age between 18 and 30 years', undefined, 18, 30)
    )
  }),

  // 22. Free Coaching Scheme for SC and OBC Students
  createStudentScheme({
    id: 'free_coaching_sc_obc',
    code: 'MOSJE-FREE-COACHING',
    name: 'Free Coaching Scheme for SC and OBC Students',
    shortName: 'Central Free Coaching Scheme (SC/OBC)',
    tagline: '100% free coaching for UPSC, MPSC, NEET, JEE + ₹4,000/month outstation living stipend',
    description: 'Ministry of Social Justice & Empowerment scheme providing fully sponsored coaching in reputed institutes for competitive examinations (UPSC, State PSCs, IIT-JEE, NEET, CAT) along with a monthly maintenance allowance.',
    category: 'Education & Skill',
    jurisdiction: 'Central',
    ministry: 'Ministry of Social Justice and Empowerment',
    officialSourceUrl: 'https://coaching.dosje.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 4800000,
      displayAmount: '100% Free Coaching + ₹4,000 / month Outstation Stipend',
      frequency: 'Annual'
    },
    requiredDocumentIds: [
      'aadhaar',
      'caste_certificate',
      'income_certificate',
      'educational_marksheet',
      'bank_passbook'
    ],
    rules: all(
      rule('socialCategory', 'in', 'Must belong to SC or OBC category', ['SC', 'OBC']),
      rule('isPreparingForEngineeringOrMedicalEntrance', 'eq', 'Must be preparing for competitive entrance exams (JEE/NEET/CET)', true),
      rule('age', 'between', 'Candidate age between 16 and 35 years', undefined, 16, 35),
      rule('annualFamilyIncome', 'lte', 'Family annual income must not exceed ₹8,00,000', undefined, undefined, 800000)
    )
  }),

  // 23. National Overseas Scholarship for SC Candidates
  createStudentScheme({
    id: 'national_overseas_scholarship_sc',
    code: 'NOS-SC',
    name: 'National Overseas Scholarship for Scheduled Caste (SC) Candidates',
    shortName: 'National Overseas Scholarship (SC)',
    tagline: '100% full tuition + $15,400/year living allowance for Master\'s & Ph.D. abroad in top 500 QS universities',
    description: 'Sovereign fellowship funding international higher studies (Master\'s degrees and Ph.D.) in foreign universities for meritorious low-income Scheduled Caste students, covering full tuition fees, medical insurance, visa fees, and living allowance.',
    category: 'Education & Skill',
    jurisdiction: 'Central',
    ministry: 'Ministry of Social Justice and Empowerment',
    officialSourceUrl: 'https://nosmsje.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 350000000,
      displayAmount: 'Full Foreign Tuition + $15,400 / yr (~₹35 Lakhs/yr)',
      frequency: 'Annual'
    },
    requiredDocumentIds: [
      'aadhaar',
      'caste_certificate',
      'income_certificate',
      'educational_marksheet',
      'bank_passbook'
    ],
    rules: all(
      rule('socialCategory', 'eq', 'Must belong to Scheduled Caste (SC)', 'SC'),
      rule('age', 'between', 'Candidate age between 21 and 35 years', undefined, 21, 35),
      rule('annualFamilyIncome', 'lte', 'Family annual income must not exceed ₹8,00,000', undefined, undefined, 800000)
    )
  }),

  // 24. Begum Hazrat Mahal National Scholarship for Minority Girls
  createStudentScheme({
    id: 'begum_hazrat_mahal',
    code: 'BHM-SCHOLARSHIP',
    name: 'Begum Hazrat Mahal National Scholarship for Meritorious Minority Girl Students',
    shortName: 'Begum Hazrat Mahal Scholarship',
    tagline: '₹5,000 to ₹6,000/year direct financial scholarship for secondary & higher secondary girl students',
    description: 'Maulana Azad Education Foundation and Ministry of Minority Affairs scholarship providing direct financial assistance to meritorious minority girl students in classes 9 to 12.',
    category: 'Education & Skill',
    jurisdiction: 'Central',
    ministry: 'Ministry of Minority Affairs',
    officialSourceUrl: 'https://scholarships.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 600000,
      displayAmount: '₹6,000 / year Direct Transfer',
      frequency: 'Annual'
    },
    requiredDocumentIds: [
      'aadhaar',
      'student_id_bonafide',
      'income_certificate',
      'bank_passbook'
    ],
    rules: all(
      rule('gender', 'eq', 'Eligible exclusively for female students', 'Female'),
      rule('isMinority', 'eq', 'Must belong to a notified minority community', true),
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('annualFamilyIncome', 'lte', 'Annual family income must not exceed ₹2,00,000', undefined, undefined, 200000)
    )
  }),

  // 25. Savitribai Phule Scholarship for VJNT & SBC Girl Students (Maharashtra)
  createStudentScheme({
    id: 'savitribai_phule_vjnt_girls',
    code: 'MH-SAVITRIBAI-PHULE',
    name: 'Savitribai Phule Scholarship for VJNT & SBC Girl Students',
    shortName: 'Savitribai Phule Girls Scholarship',
    tagline: 'Annual educational cash incentive to promote education of VJNT & SBC girls (No income limit)',
    description: 'Maharashtra Government social welfare scheme to curb school dropout rates among Vimukta Jatis, Nomadic Tribes, and Special Backward Class girls studying in recognized schools.',
    category: 'Education & Skill',
    jurisdiction: 'State-Specific',
    targetStates: ['MH'],
    ministry: 'VJNT, OBC and SBC Welfare Department, Maharashtra',
    officialSourceUrl: 'https://mahadbt.maharashtra.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 150000,
      displayAmount: '₹1,500 / year Educational Incentive (No Income Limit)',
      frequency: 'Annual'
    },
    requiredDocumentIds: [
      'aadhaar',
      'caste_certificate',
      'student_id_bonafide',
      'bank_passbook'
    ],
    rules: all(
      rule('state', 'eq', 'Must reside in Maharashtra', 'MH'),
      rule('gender', 'eq', 'Eligible for female students', 'Female'),
      rule('isStudent', 'eq', 'Applicant must be an active student', true)
    )
  }),

  // 26. Central Minority Post-Matric Scholarship (MoMA)
  createStudentScheme({
    id: 'central_minority_post_matric',
    code: 'MOMA-PMS',
    name: 'Post-Matric Scholarship Schemes for Minorities (Ministry of Minority Affairs)',
    shortName: 'Central Minority Post-Matric',
    tagline: 'Full admission & tuition fee reimbursement + maintenance allowance for minority students (Class 11 to Ph.D.)',
    description: 'Central sector scheme for meritorious minority students (Muslim, Christian, Sikh, Buddhist, Jain, Parsi) enrolled in government or recognized private higher secondary and degree colleges.',
    category: 'Education & Skill',
    jurisdiction: 'Central',
    ministry: 'Ministry of Minority Affairs',
    officialSourceUrl: 'https://scholarships.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 2000000,
      displayAmount: '₹20,000 / year (Fee Waiver + Maintenance)',
      frequency: 'Annual'
    },
    requiredDocumentIds: ['aadhaar', 'student_id_bonafide', 'income_certificate', 'educational_marksheet', 'bank_passbook'],
    rules: all(
      rule('isMinority', 'eq', 'Must belong to a notified religious minority', true),
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('annualFamilyIncome', 'lte', 'Annual family income under ₹2.0 Lakhs', undefined, undefined, 200000)
    )
  }),

  // 27. Central Minority Merit-cum-Means Scholarship (Technical/Professional)
  createStudentScheme({
    id: 'central_minority_mcm',
    code: 'MOMA-MCM',
    name: 'Merit-cum-Means Scholarship for Professional and Technical Courses CS (Minorities)',
    shortName: 'Minority Merit-cum-Means Professional',
    tagline: '₹20,000/year course fee + ₹10,000 maintenance for professional technical degrees',
    description: 'National scholarship support for minority students admitted to undergraduate and postgraduate technical or professional courses with family income under ₹2.5 Lakhs.',
    category: 'Education & Skill',
    jurisdiction: 'Central',
    ministry: 'Ministry of Minority Affairs',
    officialSourceUrl: 'https://scholarships.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 3000000,
      displayAmount: '₹30,000 / year (Tuition Grant + Maintenance)',
      frequency: 'Annual'
    },
    requiredDocumentIds: ['aadhaar', 'student_id_bonafide', 'income_certificate', 'educational_marksheet', 'bank_passbook'],
    rules: all(
      rule('isMinority', 'eq', 'Must belong to notified minority', true),
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('enrolledInHigherEducation', 'eq', 'Enrolled in technical/professional course', true),
      rule('annualFamilyIncome', 'lte', 'Income under ₹2.5 Lakhs', undefined, undefined, 250000)
    )
  }),

  // 28. Pradhan Mantri Kaushal Vikas Yojana 4.0 (PMKVY)
  createStudentScheme({
    id: 'pmkvy_skill_development',
    code: 'MSDE-PMKVY4',
    name: 'Pradhan Mantri Kaushal Vikas Yojana 4.0 (PMKVY 4.0)',
    shortName: 'PMKVY 4.0 Skill Training & Certification',
    tagline: '100% free industry-aligned skill certification in AI, Drones, Robotics, Coding & Healthcare + ₹8,000 reward',
    description: 'Ministry of Skill Development and Entrepreneurship flagship skilling program offering free training courses aligned with Industry 4.0 standards with government assessment and monetary certification award.',
    category: 'Education & Skill',
    jurisdiction: 'Central',
    ministry: 'Ministry of Skill Development and Entrepreneurship',
    officialSourceUrl: 'https://www.pmkvyofficial.org/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 800000,
      displayAmount: '100% Free Training + ₹8,000 Certification Award',
      frequency: 'One-Time'
    },
    requiredDocumentIds: ['aadhaar', 'educational_marksheet', 'bank_passbook'],
    rules: all(
      rule('age', 'between', 'Candidate age between 15 and 45 years', undefined, 15, 45)
    )
  }),

  // 29. Scheme for Higher Education Youth in Apprenticeship and Skills (SHREYAS)
  createStudentScheme({
    id: 'shreyas_apprenticeship',
    code: 'MOE-SHREYAS',
    name: 'Scheme for Higher Education Youth in Apprenticeship and Skills (SHREYAS)',
    shortName: 'SHREYAS Apprenticeship Embedded Degrees',
    tagline: '₹6,000 to ₹10,000/month stipend embedded in general degree education (BA/BSc/BCom)',
    description: 'Ministry of Education initiative linking general stream undergraduate students with industry apprenticeships to enhance job readiness with monthly stipend shared between Government and employers.',
    category: 'Education & Skill',
    jurisdiction: 'Central',
    ministry: 'Ministry of Education',
    officialSourceUrl: 'https://shreyas.ac.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 7200000,
      displayAmount: '₹6,000 - ₹10,000 / month Apprenticeship Stipend',
      frequency: 'Annual'
    },
    requiredDocumentIds: ['aadhaar', 'student_id_bonafide', 'educational_marksheet', 'bank_passbook'],
    rules: all(
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('enrolledInHigherEducation', 'eq', 'Enrolled in higher education degree', true)
    )
  }),

  // 30. National Fellowship for Scheduled Caste Students (NFSC)
  createStudentScheme({
    id: 'nfsc_fellowship',
    code: 'MOSJE-NFSC',
    name: 'National Fellowship for Scheduled Caste Students (NFSC / RGNF)',
    shortName: 'NFSC Doctoral Fellowship (SC)',
    tagline: '₹37,000/month JRF / ₹42,000/month SRF + HRA + contingency for Ph.D. scholars',
    description: 'Ministry of Social Justice & Empowerment fellowship providing 2,000 annual fellowships for Scheduled Caste scholars pursuing full-time regular Ph.D. programs in Sciences, Humanities, and Engineering.',
    category: 'Education & Skill',
    jurisdiction: 'Central',
    ministry: 'Ministry of Social Justice and Empowerment',
    officialSourceUrl: 'https://fellowship.dosje.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 44400000,
      displayAmount: '₹37,000 / month + HRA + ₹12,000 Contingency',
      frequency: 'Annual'
    },
    requiredDocumentIds: ['aadhaar', 'caste_certificate', 'educational_marksheet', 'student_id_bonafide', 'bank_passbook'],
    rules: all(
      rule('socialCategory', 'eq', 'Must belong to Scheduled Caste (SC)', 'SC'),
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('isEnrolledInPhd', 'eq', 'Must be enrolled in regular full-time doctoral research', true)
    )
  }),

  // 31. National Fellowship for Higher Education of ST Students (NFST)
  createStudentScheme({
    id: 'nfst_tribal_fellowship',
    code: 'MOTA-NFST',
    name: 'National Fellowship for Higher Education of ST Students (NFST)',
    shortName: 'NFST Tribal Doctoral Fellowship',
    tagline: '₹37,000/month + HRA + contingency grant for tribal Ph.D. research scholars',
    description: 'Ministry of Tribal Affairs fellowship for Scheduled Tribe students admitted to regular full-time M.Phil./Ph.D. degree courses in Universities and Research Institutions.',
    category: 'Education & Skill',
    jurisdiction: 'Central',
    ministry: 'Ministry of Tribal Affairs',
    officialSourceUrl: 'https://fellowship.tribal.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 44400000,
      displayAmount: '₹37,000 / month + HRA + Contingency Grant',
      frequency: 'Annual'
    },
    requiredDocumentIds: ['aadhaar', 'caste_certificate', 'educational_marksheet', 'student_id_bonafide', 'bank_passbook'],
    rules: all(
      rule('socialCategory', 'eq', 'Must belong to Scheduled Tribe (ST)', 'ST'),
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('isEnrolledInPhd', 'eq', 'Must be enrolled in regular full-time doctoral research', true)
    )
  }),

  // 32. National Fellowship for OBC Students (NFOBC)
  createStudentScheme({
    id: 'nfobc_fellowship',
    code: 'MOSJE-NFOBC',
    name: 'National Fellowship for Other Backward Classes (NFOBC)',
    shortName: 'NFOBC Doctoral Research Fellowship',
    tagline: '₹37,000/month + HRA for OBC students pursuing regular full-time Ph.D. programs',
    description: 'Centrally funded fellowship scheme for non-creamy layer OBC scholars admitted to regular M.Phil. and Ph.D. research in Central and State Universities.',
    category: 'Education & Skill',
    jurisdiction: 'Central',
    ministry: 'Ministry of Social Justice and Empowerment',
    officialSourceUrl: 'https://fellowship.dosje.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 44400000,
      displayAmount: '₹37,000 / month + HRA + Contingency',
      frequency: 'Annual'
    },
    requiredDocumentIds: ['aadhaar', 'caste_certificate', 'non_creamy_layer', 'educational_marksheet', 'student_id_bonafide', 'bank_passbook'],
    rules: all(
      rule('socialCategory', 'eq', 'Must belong to Other Backward Classes (OBC)', 'OBC'),
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('isEnrolledInPhd', 'eq', 'Must be enrolled in regular M.Phil./Ph.D. program', true),
      rule('annualFamilyIncome', 'lte', 'Family annual income under ₹8 Lakhs', undefined, undefined, 800000)
    )
  }),

  // 33. ANRF / SERB National Post-Doctoral Fellowship (N-PDF)
  createStudentScheme({
    id: 'serb_npdf_fellowship',
    code: 'ANRF-NPDF',
    name: 'Anusandhan National Research Foundation (ANRF / SERB) National Post-Doctoral Fellowship',
    shortName: 'National Post-Doctoral Fellowship (N-PDF)',
    tagline: '₹55,000/month fellowship + ₹2,00,000/year research contingency grant for Ph.D. holders',
    description: 'Premier Indian science post-doctoral award empowering young doctoral researchers in frontiers of science, engineering, and technology for 2 years in top academic research laboratories.',
    category: 'Education & Skill',
    jurisdiction: 'Central',
    ministry: 'Department of Science and Technology / ANRF',
    officialSourceUrl: 'https://serbonline.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 86000000,
      displayAmount: '₹55,000 / month + ₹2,00,000 Annual Research Grant',
      frequency: 'Annual'
    },
    requiredDocumentIds: ['aadhaar', 'educational_marksheet', 'bank_passbook'],
    rules: all(
      rule('age', 'between', 'Age must be 35 years or below', undefined, 24, 35)
    )
  }),

  // 34. ICMR Junior Research Fellowship (Biomedical Sciences)
  createStudentScheme({
    id: 'icmr_jrf_fellowship',
    code: 'ICMR-JRF',
    name: 'Indian Council of Medical Research (ICMR) Junior Research Fellowship',
    shortName: 'ICMR Junior Research Fellowship',
    tagline: '₹37,000/month + ₹20,000/year contingency for research in biomedical and clinical sciences',
    description: 'Prestigious fellowship by Indian Council of Medical Research for post-graduates in Life Sciences and Social Sciences working towards a Ph.D. in medical, clinical, or public health sciences.',
    category: 'Education & Skill',
    jurisdiction: 'Central',
    ministry: 'Indian Council of Medical Research / Ministry of Health & Family Welfare',
    officialSourceUrl: 'https://main.icmr.nic.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 46400000,
      displayAmount: '₹37,000 / month + ₹20,000 Research Contingency',
      frequency: 'Annual'
    },
    requiredDocumentIds: ['aadhaar', 'educational_marksheet', 'student_id_bonafide', 'bank_passbook'],
    rules: all(
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('age', 'between', 'Age 28 years or below', undefined, 21, 28)
    )
  }),

  // 35. DBT Junior Research Fellowship (BET - Biotechnology)
  createStudentScheme({
    id: 'dbt_jrf_biotech',
    code: 'DBT-JRF-BET',
    name: 'Department of Biotechnology (DBT) Junior Research Fellowship (BET)',
    shortName: 'DBT-JRF Biotechnology Fellowship',
    tagline: '₹37,000/month + HRA + ₹30,000/year contingency for Ph.D. scholars in Biotechnology',
    description: 'Awarded to top performers of the Biotechnology Eligibility Test (BET) pursuing doctoral research in biotechnology, bioinformatics, genomics, and agricultural biological sciences across India.',
    category: 'Education & Skill',
    jurisdiction: 'Central',
    ministry: 'Department of Biotechnology, Ministry of Science and Technology',
    officialSourceUrl: 'https://dbtindia.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 47400000,
      displayAmount: '₹37,000 / month + HRA + ₹30,000 Contingency',
      frequency: 'Annual'
    },
    requiredDocumentIds: ['aadhaar', 'educational_marksheet', 'student_id_bonafide', 'bank_passbook'],
    rules: all(
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('age', 'between', 'Age 28 years or below', undefined, 21, 28)
    )
  }),

  // 36. CSIR Innovation Award for School Children (CIASC)
  createStudentScheme({
    id: 'csir_innovation_school',
    code: 'CSIR-CIASC',
    name: 'CSIR Innovation Award for School Children (CIASC)',
    shortName: 'CSIR School Innovation Award',
    tagline: 'Cash awards up to ₹1,00,000 + training at CSIR laboratories for novel science inventions',
    description: 'National competition by Council of Scientific & Industrial Research (CSIR) recognizing school students below 18 years for original technological inventions, computer software, and scientific devices.',
    category: 'Education & Skill',
    jurisdiction: 'Central',
    ministry: 'Council of Scientific & Industrial Research (CSIR)',
    officialSourceUrl: 'https://www.csir.res.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 10000000,
      displayAmount: 'Up to ₹1,00,000 Cash Award + Mentorship',
      frequency: 'One-Time'
    },
    requiredDocumentIds: ['aadhaar', 'student_id_bonafide'],
    rules: all(
      rule('age', 'between', 'School student below 18 years', undefined, 10, 18),
      rule('isStudent', 'eq', 'Applicant must be an active student', true)
    )
  }),

  // 37. Government of Maharashtra Open Merit Scholarship (DHE)
  createStudentScheme({
    id: 'dhe_open_merit_mh',
    code: 'MH-DHE-OPEN-MERIT',
    name: 'Government of Maharashtra Open Merit Scholarship (Higher Education)',
    shortName: 'Maharashtra Open Merit Scholarship',
    tagline: 'Merit scholarship for undergraduate students in Arts, Science & Commerce colleges in Maharashtra',
    description: 'Directorate of Higher Education (DHE) scholarship awarded strictly on merit basis to students securing top marks in higher secondary (12th) examinations entering general degree colleges.',
    category: 'Education & Skill',
    jurisdiction: 'State-Specific',
    targetStates: ['MH'],
    ministry: 'Directorate of Higher Education (DHE), Maharashtra',
    officialSourceUrl: 'https://mahadbt.maharashtra.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 120000,
      displayAmount: '₹1,200 / year Merit Award',
      frequency: 'Annual'
    },
    requiredDocumentIds: ['aadhaar', 'domicile_certificate', 'educational_marksheet', 'student_id_bonafide', 'bank_passbook'],
    rules: all(
      rule('state', 'eq', 'Must reside in Maharashtra', 'MH'),
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('enrolledInHigherEducation', 'eq', 'Enrolled in degree college in Maharashtra', true)
    )
  }),

  // 38. Eklavya Scholarship for Post-Graduate Students (Maharashtra)
  createStudentScheme({
    id: 'eklavya_scholarship_mh',
    code: 'MH-DHE-EKLAVYA',
    name: 'Eklavya Scholarship for Post-Graduate Students (Maharashtra DHE)',
    shortName: 'Maharashtra Eklavya PG Scholarship',
    tagline: '₹5,000/year financial award for post-graduate students in Arts, Science, Law & Commerce with ≥60% marks',
    description: 'State scholarship for meritorious graduates who secured ≥60% marks in Arts/Commerce or ≥70% in Science pursuing regular postgraduate courses in Maharashtra universities.',
    category: 'Education & Skill',
    jurisdiction: 'State-Specific',
    targetStates: ['MH'],
    ministry: 'Directorate of Higher Education (DHE), Maharashtra',
    officialSourceUrl: 'https://mahadbt.maharashtra.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 500000,
      displayAmount: '₹5,000 / year Direct Account Transfer',
      frequency: 'Annual'
    },
    requiredDocumentIds: ['aadhaar', 'domicile_certificate', 'educational_marksheet', 'student_id_bonafide', 'income_certificate', 'bank_passbook'],
    rules: all(
      rule('state', 'eq', 'Must reside in Maharashtra', 'MH'),
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('annualFamilyIncome', 'lte', 'Family annual income under ₹75,000', undefined, undefined, 75000)
    )
  }),

  // 39. Scholarship to Meritorious Students Possessing Mathematics or Physics (Maharashtra)
  createStudentScheme({
    id: 'maths_physics_scholarship_mh',
    code: 'MH-DHE-MATH-PHYSICS',
    name: 'Scholarship to Meritorious Students in Mathematics and Physics (Maharashtra)',
    shortName: 'Maharashtra Math & Physics Merit Scholarship',
    tagline: 'Special state scholarship for undergraduate B.Sc. students scoring ≥60% in Mathematics or Physics',
    description: 'State government incentive to promote foundational research and pure mathematics and physics careers among college students across Maharashtra.',
    category: 'Education & Skill',
    jurisdiction: 'State-Specific',
    targetStates: ['MH'],
    ministry: 'Directorate of Higher Education (DHE), Maharashtra',
    officialSourceUrl: 'https://mahadbt.maharashtra.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 150000,
      displayAmount: '₹1,500 / year Dedicated Subject Stipend',
      frequency: 'Annual'
    },
    requiredDocumentIds: ['aadhaar', 'domicile_certificate', 'educational_marksheet', 'student_id_bonafide', 'bank_passbook'],
    rules: all(
      rule('state', 'eq', 'Must reside in Maharashtra', 'MH'),
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('enrolledInHigherEducation', 'eq', 'Enrolled in B.Sc. program with Math/Physics', true)
    )
  }),

  // 40. Dr. Babasaheb Ambedkar National Research Fellowship (BANRF - BARTI)
  createStudentScheme({
    id: 'barti_banrf_fellowship_mh',
    code: 'MH-BARTI-BANRF',
    name: 'Dr. Babasaheb Ambedkar National Research Fellowship (BANRF - BARTI Maharashtra)',
    shortName: 'BARTI BANRF Ph.D. Fellowship',
    tagline: '₹31,000 to ₹35,000/month + HRA + contingency for Scheduled Caste Ph.D. scholars in Maharashtra',
    description: 'Prestigious fellowship by BARTI Pune for Scheduled Caste candidates registered for regular full-time Ph.D. degrees in Maharashtra State Universities.',
    category: 'Education & Skill',
    jurisdiction: 'State-Specific',
    targetStates: ['MH'],
    ministry: 'Dr. Babasaheb Ambedkar Research and Training Institute (BARTI), Maharashtra',
    officialSourceUrl: 'https://barti.maharashtra.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 42000000,
      displayAmount: '₹31,000 - ₹35,000 / month + HRA + Contingency',
      frequency: 'Annual'
    },
    requiredDocumentIds: ['aadhaar', 'domicile_certificate', 'caste_certificate', 'caste_validity', 'educational_marksheet', 'bank_passbook'],
    rules: all(
      rule('state', 'eq', 'Must reside in Maharashtra', 'MH'),
      rule('socialCategory', 'eq', 'Must belong to Scheduled Caste (SC)', 'SC'),
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('isEnrolledInPhd', 'eq', 'Must be enrolled in regular full-time Ph.D. research', true)
    )
  }),

  // 41. Chhatrapati Shahu Maharaj Research Fellowship (SARTHI CSRF)
  createStudentScheme({
    id: 'sarthi_csrf_fellowship_mh',
    code: 'MH-SARTHI-CSRF',
    name: 'Chhatrapati Shahu Maharaj Research Fellowship (CSRF - SARTHI Maharashtra)',
    shortName: 'SARTHI CSRF Ph.D. Fellowship',
    tagline: '₹31,000 to ₹35,000/month + HRA + contingency for Maratha / Kunbi / EWS Ph.D. scholars',
    description: 'Fellowship by SARTHI Pune supporting Maratha, Kunbi, and Economically Weaker Section (EWS) candidates enrolled in full-time regular Ph.D. research.',
    category: 'Education & Skill',
    jurisdiction: 'State-Specific',
    targetStates: ['MH'],
    ministry: 'Chhatrapati Shahu Maharaj Research, Training and Human Development Institute (SARTHI)',
    officialSourceUrl: 'https://sarthi-maharashtragov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 42000000,
      displayAmount: '₹31,000 - ₹35,000 / month + HRA + Contingency',
      frequency: 'Annual'
    },
    requiredDocumentIds: ['aadhaar', 'domicile_certificate', 'income_certificate', 'educational_marksheet', 'bank_passbook'],
    rules: all(
      rule('state', 'eq', 'Must reside in Maharashtra', 'MH'),
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('isEnrolledInPhd', 'eq', 'Must be enrolled in regular full-time Ph.D. research', true),
      rule('annualFamilyIncome', 'lte', 'Family annual income under ₹8 Lakhs', undefined, undefined, 800000)
    )
  }),

  // 42. Mahajyoti Research Fellowship for OBC / VJNT / SBC Scholars (MJRF)
  createStudentScheme({
    id: 'mahajyoti_fellowship_mh',
    code: 'MH-MAHAJYOTI-MJRF',
    name: 'Mahatma Jyotiba Phule Research Fellowship (MJRF - Mahajyoti Maharashtra)',
    shortName: 'Mahajyoti MJRF Ph.D. Fellowship',
    tagline: '₹31,000 to ₹35,000/month + HRA for OBC, VJNT, and SBC Ph.D. scholars in Maharashtra',
    description: 'Autonomous state fellowship by Mahajyoti Nagpur empowering research scholars from Other Backward Classes, Vimukta Jatis, Nomadic Tribes, and Special Backward Classes in Maharashtra universities.',
    category: 'Education & Skill',
    jurisdiction: 'State-Specific',
    targetStates: ['MH'],
    ministry: 'Mahatma Jyotiba Phule Research & Training Institute (Mahajyoti), Maharashtra',
    officialSourceUrl: 'https://mahajyoti.org.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 42000000,
      displayAmount: '₹31,000 - ₹35,000 / month + HRA + Contingency',
      frequency: 'Annual'
    },
    requiredDocumentIds: ['aadhaar', 'domicile_certificate', 'caste_certificate', 'non_creamy_layer', 'educational_marksheet', 'bank_passbook'],
    rules: all(
      rule('state', 'eq', 'Must reside in Maharashtra', 'MH'),
      rule('socialCategory', 'eq', 'Must belong to Other Backward Classes (OBC)', 'OBC'),
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('isEnrolledInPhd', 'eq', 'Must be enrolled in regular full-time Ph.D. research', true),
      rule('annualFamilyIncome', 'lte', 'Family annual income under ₹8 Lakhs', undefined, undefined, 800000)
    )
  }),

  // 43. TRTI Tribal Research Fellowship (TRF Maharashtra)
  createStudentScheme({
    id: 'trti_trf_fellowship_mh',
    code: 'MH-TRTI-TRF',
    name: 'Tribal Research and Training Institute Fellowship (TRF - TRTI Pune)',
    shortName: 'TRTI TRF Tribal Ph.D. Fellowship',
    tagline: '₹31,000 to ₹35,000/month stipend + contingency for Scheduled Tribe doctoral research in Maharashtra',
    description: 'Fellowship for Scheduled Tribe candidates admitted to regular full-time Ph.D. in recognized Maharashtra universities granted by TRTI Pune.',
    category: 'Education & Skill',
    jurisdiction: 'State-Specific',
    targetStates: ['MH'],
    ministry: 'Tribal Research and Training Institute (TRTI), Maharashtra',
    officialSourceUrl: 'https://trti.maharashtra.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 42000000,
      displayAmount: '₹31,000 - ₹35,000 / month + HRA + Contingency',
      frequency: 'Annual'
    },
    requiredDocumentIds: ['aadhaar', 'domicile_certificate', 'caste_certificate', 'caste_validity', 'educational_marksheet', 'bank_passbook'],
    rules: all(
      rule('state', 'eq', 'Must reside in Maharashtra', 'MH'),
      rule('socialCategory', 'eq', 'Must belong to Scheduled Tribe (ST)', 'ST'),
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('isEnrolledInPhd', 'eq', 'Must be enrolled in regular full-time Ph.D. research', true)
    )
  }),

  // 44. BARTI Banking Foundation Coaching & Monthly Stipend
  createStudentScheme({
    id: 'barti_banking_coaching_mh',
    code: 'MH-BARTI-BANKING',
    name: 'BARTI Banking, IBPS & SSC Foundation Coaching with Monthly Stipend',
    shortName: 'BARTI Banking & SSC Coaching Stipend',
    tagline: '100% free coaching + ₹6,000/month stipend for Banking (IBPS/SBI) and Staff Selection Commission exams',
    description: 'Sponsored by BARTI Pune for eligible Maharashtra youth preparing for probationary officer, clerk, and junior engineer recruitments.',
    category: 'Education & Skill',
    jurisdiction: 'State-Specific',
    targetStates: ['MH'],
    ministry: 'BARTI, Government of Maharashtra',
    officialSourceUrl: 'https://barti.maharashtra.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 7200000,
      displayAmount: '₹6,000 / month (₹72,000 / year + Free Coaching & Study Material)',
      frequency: 'Annual'
    },
    requiredDocumentIds: ['aadhaar', 'domicile_certificate', 'caste_certificate', 'caste_validity', 'educational_marksheet', 'bank_passbook'],
    rules: all(
      rule('state', 'eq', 'Must reside in Maharashtra', 'MH'),
      rule('socialCategory', 'eq', 'Must belong to Scheduled Caste (SC)', 'SC'),
      rule('age', 'between', 'Age between 18 and 32 years', undefined, 18, 32)
    )
  }),

  // 45. SARTHI MPSC Gazetted Services Coaching & Stipend
  createStudentScheme({
    id: 'sarthi_mpsc_coaching_mh',
    code: 'MH-SARTHI-MPSC',
    name: 'SARTHI MPSC Gazetted Civil Services Foundation Coaching & Stipend',
    shortName: 'SARTHI MPSC Coaching Stipend',
    tagline: 'Free top-tier civil service coaching + ₹10,000/month stipend for Maharashtra students',
    description: 'Comprehensive residential and classroom MPSC preparation stipend funded by SARTHI Pune for Maratha and EWS youth.',
    category: 'Education & Skill',
    jurisdiction: 'State-Specific',
    targetStates: ['MH'],
    ministry: 'SARTHI, Government of Maharashtra',
    officialSourceUrl: 'https://sarthi-maharashtragov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 12000000,
      displayAmount: '₹10,000 / month + Free Coaching & Books',
      frequency: 'Annual'
    },
    requiredDocumentIds: ['aadhaar', 'domicile_certificate', 'income_certificate', 'educational_marksheet', 'bank_passbook'],
    rules: all(
      rule('state', 'eq', 'Must reside in Maharashtra', 'MH'),
      rule('age', 'between', 'Age between 19 and 35 years', undefined, 19, 35),
      rule('annualFamilyIncome', 'lte', 'Family income under ₹8 Lakhs', undefined, undefined, 800000)
    )
  }),

  // 46. Dr. Panjabrao Deshmukh Agricultural Education Stipend (MCAER)
  createStudentScheme({
    id: 'krishi_shishyavrutti_mh',
    code: 'MH-MCAER-KRISHI',
    name: 'Dr. Panjabrao Deshmukh Agricultural University Merit & Need Stipend',
    shortName: 'Maharashtra Krishi University Stipend',
    tagline: 'Direct monthly education stipend for students in B.Sc. Agriculture, Horticulture, Forestry & Agril Engineering',
    description: 'Administered under Maharashtra Council of Agricultural Education and Research (MCAER) for students studying in agricultural colleges across Maharashtra.',
    category: 'Agriculture & Allied',
    jurisdiction: 'State-Specific',
    targetStates: ['MH'],
    ministry: 'Department of Agriculture, Government of Maharashtra / MCAER',
    officialSourceUrl: 'https://mcaer.org/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 2400000,
      displayAmount: '₹24,000 / year Agricultural Education Stipend',
      frequency: 'Annual'
    },
    requiredDocumentIds: ['aadhaar', 'domicile_certificate', 'income_certificate', 'cap_allotment_letter', 'educational_marksheet', 'bank_passbook'],
    rules: all(
      rule('state', 'eq', 'Must reside in Maharashtra', 'MH'),
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('annualFamilyIncome', 'lte', 'Income under ₹8 Lakhs', undefined, undefined, 800000)
    )
  }),

  // 47. Tata Trusts Medical and Healthcare Scholarship
  createStudentScheme({
    id: 'tata_trusts_medical_scholarship',
    code: 'TATA-TRUSTS-MED',
    name: 'Tata Trusts Medical & Healthcare Higher Education Scholarship',
    shortName: 'Tata Trusts Medical Scholarship',
    tagline: 'Up to 80% tuition fee grant for MBBS, BDS & Postgraduate medical students in government colleges',
    description: 'Flagship philanthropic initiative of Tata Trusts providing direct fee coverage for meritorious students enrolled in medical and dental colleges across India.',
    category: 'Education & Skill',
    jurisdiction: 'Central',
    ministry: 'Tata Trusts / Medical Council',
    officialSourceUrl: 'https://www.tatatrusts.org/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 7500000,
      displayAmount: 'Up to ₹75,000 / year Tuition Grant',
      frequency: 'Annual'
    },
    requiredDocumentIds: ['aadhaar', 'educational_marksheet', 'student_id_bonafide', 'income_certificate', 'fee_receipt', 'bank_passbook'],
    rules: all(
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('enrolledInHigherEducation', 'eq', 'Enrolled in recognized MBBS/BDS/Medical course', true)
    )
  }),

  // 48. Sitaram Jindal Foundation Educational Scholarship
  createStudentScheme({
    id: 'sitaram_jindal_scholarship',
    code: 'SJF-SCHOLARSHIP',
    name: 'Sitaram Jindal Foundation Educational Scholarship',
    shortName: 'Sitaram Jindal Scholarship',
    tagline: 'Annual stipend for Class 11, ITI, Diploma, Undergraduate & Engineering students',
    description: 'Charitable foundation scholarship supporting economically disadvantaged meritorious students pursuing higher studies in government/aided institutes across India.',
    category: 'Education & Skill',
    jurisdiction: 'Central',
    ministry: 'Sitaram Jindal Foundation',
    officialSourceUrl: 'https://www.sitaramjindalfoundation.org/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 3000000,
      displayAmount: '₹30,000 / year Direct Scholarship',
      frequency: 'Annual'
    },
    requiredDocumentIds: ['aadhaar', 'educational_marksheet', 'student_id_bonafide', 'income_certificate', 'bank_passbook'],
    rules: all(
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('annualFamilyIncome', 'lte', 'Family annual income under ₹4,00,000', undefined, undefined, 400000)
    )
  }),

  // 49. HDFC Bank Parivartan's ECSS Programme
  createStudentScheme({
    id: 'hdfc_parivartan_ecss',
    code: 'HDFC-PARIVARTAN-ECSS',
    name: "HDFC Bank Parivartan's Educational Crisis Support Scholarship (ECSS)",
    shortName: "HDFC Parivartan's ECSS Scholarship",
    tagline: 'Up to ₹75,000/year grant for students facing financial crises or bereavement in family',
    description: 'CSR initiative by HDFC Bank providing financial assistance to students in school, undergraduate, postgraduate, and professional courses experiencing family financial hardship.',
    category: 'Education & Skill',
    jurisdiction: 'Central',
    ministry: 'HDFC Bank CSR Parivartan',
    officialSourceUrl: 'https://www.hdfcbank.com/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 7500000,
      displayAmount: 'Up to ₹75,000 / year Educational Grant',
      frequency: 'Annual'
    },
    requiredDocumentIds: ['aadhaar', 'educational_marksheet', 'student_id_bonafide', 'income_certificate', 'fee_receipt', 'bank_passbook'],
    rules: all(
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('annualFamilyIncome', 'lte', 'Annual family income under ₹6,00,000', undefined, undefined, 600000)
    )
  }),

  // 50. Kotak Kanya Scholarship for Meritorious Girls
  createStudentScheme({
    id: 'kotak_kanya_scholarship',
    code: 'KOTAK-KANYA',
    name: 'Kotak Kanya Scholarship for Meritorious Girls in Higher Education',
    shortName: 'Kotak Kanya Scholarship',
    tagline: '₹1,50,000/year comprehensive scholarship for meritorious girls pursuing professional degrees',
    description: 'Kotak Education Foundation initiative supporting meritorious girl students from low-income families admitted to 1st year of professional undergraduate courses (Engineering, MBBS, Architecture, Law).',
    category: 'Education & Skill',
    jurisdiction: 'Central',
    ministry: 'Kotak Education Foundation',
    officialSourceUrl: 'https://kotakeducation.org/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 15000000,
      displayAmount: '₹1,50,000 / year throughout degree',
      frequency: 'Annual'
    },
    requiredDocumentIds: ['aadhaar', 'educational_marksheet', 'student_id_bonafide', 'income_certificate', 'cap_allotment_letter', 'bank_passbook'],
    rules: all(
      rule('gender', 'eq', 'Eligible exclusively for female students', 'Female'),
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('enrolledInHigherEducation', 'eq', 'Enrolled in professional degree', true),
      rule('annualFamilyIncome', 'lte', 'Annual family income under ₹6,00,000', undefined, undefined, 600000)
    )
  }),

  // 51. Reliance Foundation Undergraduate Scholarship (STEM)
  createStudentScheme({
    id: 'reliance_foundation_undergrad',
    code: 'RF-UG-SCHOLARSHIP',
    name: 'Reliance Foundation Undergraduate Scholarship in STEM',
    shortName: 'Reliance Foundation STEM Scholarship',
    tagline: 'Up to ₹2,00,000 over course duration for meritorious students in undergraduate degree programs',
    description: 'Merit-cum-means scholarship by Reliance Foundation selecting 5,000 undergraduate students across India to support future innovators and leaders in science, technology, and engineering.',
    category: 'Education & Skill',
    jurisdiction: 'Central',
    ministry: 'Reliance Foundation',
    officialSourceUrl: 'https://www.reliancefoundation.org/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 20000000,
      displayAmount: 'Up to ₹2,00,000 over course duration',
      frequency: 'One-Time'
    },
    requiredDocumentIds: ['aadhaar', 'educational_marksheet', 'student_id_bonafide', 'income_certificate', 'bank_passbook'],
    rules: all(
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('enrolledInHigherEducation', 'eq', 'Enrolled in 1st year regular UG degree', true),
      rule('annualFamilyIncome', 'lte', 'Family annual income under ₹15,00,000', undefined, undefined, 1500000)
    )
  }),

  // 52. Government Vidyaniketan Rural Talent Scholarship (Maharashtra)
  createStudentScheme({
    id: 'vidyaniketan_rural_scholarship_mh',
    code: 'MH-VIDYANIKETAN',
    name: 'Government Vidyaniketan Rural Talent Secondary Scholarship (Maharashtra)',
    shortName: 'Maharashtra Vidyaniketan Rural Scholarship',
    tagline: 'State merit scholarship for rural students passing 10th from Government Vidyaniketan schools',
    description: 'Directorate of Higher Education scholarship for rural students who passed SSC from Government Vidyaniketan schools pursuing higher secondary and college education in Maharashtra.',
    category: 'Education & Skill',
    jurisdiction: 'State-Specific',
    targetStates: ['MH'],
    ministry: 'Directorate of Higher Education, Maharashtra',
    officialSourceUrl: 'https://mahadbt.maharashtra.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 120000,
      displayAmount: '₹1,200 / year Rural Talent Award',
      frequency: 'Annual'
    },
    requiredDocumentIds: ['aadhaar', 'domicile_certificate', 'educational_marksheet', 'student_id_bonafide', 'bank_passbook'],
    rules: all(
      rule('state', 'eq', 'Must reside in Maharashtra', 'MH'),
      rule('areaType', 'eq', 'Must be from rural domicile', 'Rural'),
      rule('isStudent', 'eq', 'Applicant must be an active student', true)
    )
  }),

  // 53. Swachhta Saarthi Fellowship (Waste to Wealth Mission)
  createStudentScheme({
    id: 'swachhta_sarathi_fellowship',
    code: 'PSA-SSF',
    name: 'Swachhta Saarthi Fellowship (Waste to Wealth Mission - Office of PSA)',
    shortName: 'Swachhta Saarthi Fellowship',
    tagline: '₹1,000 to ₹4,000/month fellowship for school and college students working on waste management & sustainability',
    description: 'National fellowship by the Office of the Principal Scientific Adviser to the Government of India supporting young students as cleanliness ambassadors executing community recycling and ecological initiatives.',
    category: 'Education & Skill',
    jurisdiction: 'Central',
    ministry: 'Office of the Principal Scientific Adviser (PSA) to GoI',
    officialSourceUrl: 'https://www.wastetowealth.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 480000,
      displayAmount: '₹4,000 / month (₹48,000 / year Action Grant)',
      frequency: 'Annual'
    },
    requiredDocumentIds: ['aadhaar', 'student_id_bonafide', 'bank_passbook'],
    rules: all(
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('age', 'between', 'Age between 12 and 30 years', undefined, 12, 30)
    )
  }),

  // 54. UGC Indira Gandhi PG Scholarship for Single Girl Child
  createStudentScheme({
    id: 'ugc_single_girl_child_pg',
    code: 'UGC-SGC-PG',
    name: 'Indira Gandhi Post-Graduate Scholarship for Single Girl Child (UGC)',
    shortName: 'UGC Single Girl Child PG Scholarship',
    tagline: '₹36,200/year for 2 years for only daughters pursuing regular master\'s degrees',
    description: 'University Grants Commission affirmative scheme empowering single girl child in a family to pursue higher master\'s level education in recognized universities across India.',
    category: 'Education & Skill',
    jurisdiction: 'Central',
    ministry: 'University Grants Commission (UGC) / Ministry of Education',
    officialSourceUrl: 'https://scholarships.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 3620000,
      displayAmount: '₹36,200 / year for 2 Years (₹72,400 Total)',
      frequency: 'Annual'
    },
    requiredDocumentIds: ['aadhaar', 'student_id_bonafide', 'educational_marksheet', 'bank_passbook'],
    rules: all(
      rule('gender', 'eq', 'Eligible exclusively for female students', 'Female'),
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('enrolledInHigherEducation', 'eq', 'Enrolled in 1st year master degree program', true),
      rule('age', 'between', 'Age up to 30 years at time of admission', undefined, 20, 30)
    )
  }),

  // 55. UGC Post-Graduate Merit Scholarship for University Rank Holders
  createStudentScheme({
    id: 'ugc_rank_holder_pg',
    code: 'UGC-PG-RANK',
    name: 'Post-Graduate Merit Scholarship for University Rank Holders (UGC)',
    shortName: 'UGC PG Rank Holder Scholarship',
    tagline: '₹3,100/month for 2 years for 1st and 2nd university rank holders in undergraduate degrees',
    description: 'Promoting excellence and rewarding rank-holding university students pursuing post-graduate study in basic life sciences, physical sciences, chemical sciences, and social sciences.',
    category: 'Education & Skill',
    jurisdiction: 'Central',
    ministry: 'University Grants Commission (UGC)',
    officialSourceUrl: 'https://scholarships.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 3720000,
      displayAmount: '₹3,100 / month (₹37,200 / year for 2 Years)',
      frequency: 'Annual'
    },
    requiredDocumentIds: ['aadhaar', 'student_id_bonafide', 'educational_marksheet', 'bank_passbook'],
    rules: all(
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('enrolledInHigherEducation', 'eq', 'Enrolled in regular postgraduate course', true),
      rule('age', 'between', 'Age up to 30 years', undefined, 20, 30)
    )
  }),

  // 56. AICTE National Doctoral Fellowship (NDF)
  createStudentScheme({
    id: 'aicte_ndf_doctoral',
    code: 'AICTE-NDF',
    name: 'AICTE National Doctoral Fellowship (NDF)',
    shortName: 'AICTE National Doctoral Fellowship',
    tagline: '₹35,000/month + contingency grant for Ph.D. scholars in engineering & technical research',
    description: 'Promoting collaborative and cutting-edge engineering research by funding meritorious doctoral scholars admitted to AICTE-recognized research centers across the country.',
    category: 'Education & Skill',
    jurisdiction: 'Central',
    ministry: 'All India Council for Technical Education (AICTE)',
    officialSourceUrl: 'https://www.aicte-india.org/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 42000000,
      displayAmount: '₹35,000 / month + ₹15,000 Annual Contingency',
      frequency: 'Annual'
    },
    requiredDocumentIds: ['aadhaar', 'student_id_bonafide', 'educational_marksheet', 'bank_passbook'],
    rules: all(
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('enrolledInHigherEducation', 'eq', 'Enrolled in doctoral research program', true),
      rule('age', 'between', 'Age below 30 years', undefined, 21, 30)
    )
  }),

  // 57. L\'Oréal India For Young Women in Science Scholarship
  createStudentScheme({
    id: 'loreal_women_in_science',
    code: 'LOREAL-FWIS',
    name: "L'Oréal India For Young Women in Science Scholarship",
    shortName: "L'Oréal Women in Science Grant",
    tagline: '₹2,50,000 total grant over graduation for promising young women scientists in India',
    description: 'Promoting representation of women in scientific disciplines by aiding young women who completed Class 12 with ≥85% in PCM/PCB enrolling in science and biotechnology degree programs.',
    category: 'Education & Skill',
    jurisdiction: 'Central',
    ministry: "L'Oréal India CSR",
    officialSourceUrl: 'https://www.loreal.com/en/india/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 6250000,
      displayAmount: '₹2,50,000 Total (~₹62,500 / year for 4 Years)',
      frequency: 'Annual'
    },
    requiredDocumentIds: ['aadhaar', 'student_id_bonafide', 'educational_marksheet', 'income_certificate', 'bank_passbook'],
    rules: all(
      rule('gender', 'eq', 'Eligible exclusively for female students', 'Female'),
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('enrolledInHigherEducation', 'eq', 'Enrolled in science/engineering graduation', true),
      rule('annualFamilyIncome', 'lte', 'Family annual income under ₹6,00,000', undefined, undefined, 600000)
    )
  }),

  // 58. National Sports Talent Contest Scholarship (SAI)
  createStudentScheme({
    id: 'sai_sports_scholarship',
    code: 'SAI-NSTC',
    name: 'Sports Authority of India National Sports Talent Contest (NSTC) Scholarship',
    shortName: 'SAI Sports Talent Scholarship',
    tagline: 'Full boarding, lodging, coaching, sports kits + ₹10,000/year stipend for student athletes',
    description: 'Ministry of Youth Affairs and Sports initiative identifying and nurturing school and college student athletes with international medal potential.',
    category: 'Education & Skill',
    jurisdiction: 'Central',
    ministry: 'Ministry of Youth Affairs and Sports / Sports Authority of India',
    officialSourceUrl: 'https://sportsauthorityofindia.nic.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 1000000,
      displayAmount: '100% Free Elite Sports Training + ₹10,000 Stipend',
      frequency: 'Annual'
    },
    requiredDocumentIds: ['aadhaar', 'student_id_bonafide', 'bank_passbook'],
    rules: all(
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('age', 'between', 'Age between 8 and 25 years', undefined, 8, 25)
    )
  }),

  // 59. ITI Craftsman Training Scheme Stipend (MahaDBT)
  createStudentScheme({
    id: 'iti_craftsman_stipend',
    code: 'MH-ITI-CTS',
    name: 'ITI Craftsman Training Scheme Stipend (Skill Development Dept, MahaDBT)',
    shortName: 'ITI Craftsman Training Stipend',
    tagline: '₹500/month (₹5,000/year) stipend for trainees in Government ITIs across Maharashtra',
    description: 'Skill Development, Employment and Entrepreneurship Dept stipend for trainees admitted to Government ITIs under Craftsman Training Scheme (CTS). Family income ≤ ₹8 Lakhs, maximum 2 siblings, minimum 80% attendance. SC/ST trainees eligible concurrently with PM scholarship (GR dated 13/09/2023).',
    category: 'Education & Skill',
    jurisdiction: 'State-Specific',
    targetStates: ['MH'],
    ministry: 'Skill Development, Employment and Entrepreneurship Department, Maharashtra',
    officialSourceUrl: 'https://mahadbt.maharashtra.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 500000,
      displayAmount: '₹5,000 / year (₹500 / month for 10 months)',
      frequency: 'Annual'
    },
    requiredDocumentIds: ['aadhaar', 'domicile_certificate', 'income_certificate', 'iti_admission_receipt', 'educational_marksheet', 'bank_passbook'],
    rules: all(
      rule('state', 'eq', 'Must reside in Maharashtra', 'MH'),
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('annualFamilyIncome', 'lte', 'Family annual income under ₹8,00,000', undefined, undefined, 800000)
    )
  }),

  // 60. Mahajyoti Competitive Examination Financial Assistance (UPSC / MPSC Stages)
  createStudentScheme({
    id: 'mahajyoti_upsc_mpsc_assistance',
    code: 'MH-MAHAJYOTI-EXAM-AID',
    name: 'Mahajyoti Financial Assistance for Qualifying UPSC & MPSC Stages',
    shortName: 'Mahajyoti UPSC/MPSC Stage Aid',
    tagline: '₹10,000 to ₹50,000 direct cash assistance upon qualifying UPSC or MPSC preliminary/mains stages',
    description: 'Mahatma Jyotiba Phule Research & Training Institute (Mahajyoti) one-time financial reward for OBC, VJNT, and SBC candidates of Maharashtra who qualify UPSC Civil Services Prelims (₹50,000), MPSC State Services Prelims/Mains (₹15,000), or CAPF/technical stages to prepare for Mains & Interview.',
    category: 'Education & Skill',
    jurisdiction: 'State-Specific',
    targetStates: ['MH'],
    ministry: 'Mahajyoti, Government of Maharashtra',
    officialSourceUrl: 'https://mahajyoti.org.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 5000000,
      displayAmount: 'Up to ₹50,000 One-Time Stage Clearance Cash Assistance',
      frequency: 'One-Time'
    },
    requiredDocumentIds: ['aadhaar', 'domicile_certificate', 'caste_certificate', 'non_creamy_layer', 'upsc_mpsc_admit_card_proof', 'bank_passbook'],
    rules: all(
      rule('state', 'eq', 'Must reside in Maharashtra', 'MH'),
      rule('socialCategory', 'eq', 'Must belong to OBC / VJNT / SBC categories', 'OBC'),
      rule('hasClearedUpscOrMpscStage', 'eq', 'Must have cleared UPSC Prelims or MPSC Prelims/Mains stage', true),
      rule('age', 'between', 'Candidate age between 19 and 38 years', undefined, 19, 38)
    )
  }),

  // 61. Rajarshi Chhatrapati Shahu Maharaj Merit Scholarship for SC Students (10th ≥75%)
  createStudentScheme({
    id: 'rajarshi_shahu_merit_sc',
    code: 'MH-SC-SHAHU-MERIT',
    name: 'Rajarshi Chhatrapati Shahu Maharaj Merit Scholarship for SC Students (Social Justice Dept)',
    shortName: 'Rajarshi Shahu SC Merit Scholarship',
    tagline: '₹300/month (₹3,000/year for 2 years) for Scheduled Caste students securing ≥75% in 10th standard',
    description: 'State special incentive scheme by Social Justice & Special Assistance Dept rewarding meritorious SC students scoring 75% or above in SSC entering 11th and 12th standard. Disbursed alongside GoI Post-Matric Scholarship.',
    category: 'Education & Skill',
    jurisdiction: 'State-Specific',
    targetStates: ['MH'],
    ministry: 'Social Justice and Special Assistance Department, Maharashtra',
    officialSourceUrl: 'https://mahadbt.maharashtra.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 300000,
      displayAmount: '₹3,000 / year (₹300 / month for 10 months)',
      frequency: 'Annual'
    },
    requiredDocumentIds: ['aadhaar', 'domicile_certificate', 'caste_certificate', 'student_id_bonafide', 'educational_marksheet', 'bank_passbook'],
    rules: all(
      rule('state', 'eq', 'Must reside in Maharashtra', 'MH'),
      rule('socialCategory', 'eq', 'Must belong to Scheduled Caste (SC)', 'SC'),
      rule('isStudent', 'eq', 'Applicant must be an active student', true)
    )
  }),

  // 62. Education Concession to Children of Freedom Fighters (DHE Maharashtra)
  createStudentScheme({
    id: 'dhe_freedom_fighter_concession',
    code: 'MH-DHE-FREEDOM-FIGHTER',
    name: 'Education Concession to Children & Grandchildren of Freedom Fighters (DHE Maharashtra)',
    shortName: 'Freedom Fighter Children Concession',
    tagline: '50% tuition and exam fee waiver in aided/unaided degree & postgraduate colleges in Maharashtra',
    description: 'Directorate of Higher Education fee concession granted to children and grandchildren of recognized freedom fighters pursuing undergraduate and postgraduate higher education in Maharashtra.',
    category: 'Education & Skill',
    jurisdiction: 'State-Specific',
    targetStates: ['MH'],
    ministry: 'Directorate of Higher Education (DHE), Maharashtra',
    officialSourceUrl: 'https://mahadbt.maharashtra.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 3500000,
      displayAmount: '50% Tuition Fee Waiver (~₹35,000 / year)',
      frequency: 'Annual'
    },
    requiredDocumentIds: ['aadhaar', 'domicile_certificate', 'freedom_fighter_certificate', 'student_id_bonafide', 'fee_receipt', 'bank_passbook'],
    rules: all(
      rule('state', 'eq', 'Must reside in Maharashtra', 'MH'),
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('enrolledInHigherEducation', 'eq', 'Enrolled in degree college in Maharashtra', true)
    )
  }),

  // 63. Daxshina Adhichatra State Merit Scholarship (DHE Maharashtra)
  createStudentScheme({
    id: 'dhe_daxshina_adhichatra',
    code: 'MH-DHE-DAXSHINA',
    name: 'Daxshina Adhichatra State Merit Scholarship (DHE Maharashtra)',
    shortName: 'Daxshina Adhichatra Scholarship',
    tagline: 'Prestigious state merit honor and annual stipend for top 50 state rankers in Class 12 Science',
    description: 'Directorate of Higher Education scholarship awarded to top 50 rank-holders in Maharashtra State Board Higher Secondary Science examination pursuing college degrees in Maharashtra.',
    category: 'Education & Skill',
    jurisdiction: 'State-Specific',
    targetStates: ['MH'],
    ministry: 'Directorate of Higher Education (DHE), Maharashtra',
    officialSourceUrl: 'https://mahadbt.maharashtra.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 1000000,
      displayAmount: '₹10,000 / year State Merit Honorarium',
      frequency: 'Annual'
    },
    requiredDocumentIds: ['aadhaar', 'domicile_certificate', 'educational_marksheet', 'student_id_bonafide', 'bank_passbook'],
    rules: all(
      rule('state', 'eq', 'Must reside in Maharashtra', 'MH'),
      rule('isStudent', 'eq', 'Applicant must be an active student', true)
    )
  }),

  // 64. Assistance to Meritorious Students at Senior Level (DHE Maharashtra)
  createStudentScheme({
    id: 'dhe_senior_merit_assistance',
    code: 'MH-DHE-SENIOR-MERIT',
    name: 'Assistance to Meritorious Students at Senior Level (DHE Maharashtra)',
    shortName: 'DHE Senior Level Merit Assistance',
    tagline: '₹5,000 to ₹10,000/year merit scholarship for top rankers in University UG/PG degree exams',
    description: 'Directorate of Higher Education merit award recognizing the top 50 first-rankers across Maharashtra state universities in undergraduate and postgraduate final examinations.',
    category: 'Education & Skill',
    jurisdiction: 'State-Specific',
    targetStates: ['MH'],
    ministry: 'Directorate of Higher Education (DHE), Maharashtra',
    officialSourceUrl: 'https://mahadbt.maharashtra.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 1000000,
      displayAmount: '₹10,000 / year University Topper Award',
      frequency: 'Annual'
    },
    requiredDocumentIds: ['aadhaar', 'domicile_certificate', 'educational_marksheet', 'student_id_bonafide', 'bank_passbook'],
    rules: all(
      rule('state', 'eq', 'Must reside in Maharashtra', 'MH'),
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('enrolledInHigherEducation', 'eq', 'Enrolled in higher education in Maharashtra', true)
    )
  }),

  // 65. National Board for Higher Mathematics (NBHM) Research Scholarship
  createStudentScheme({
    id: 'nbhm_math_fellowship',
    code: 'DAE-NBHM-FELLOWSHIP',
    name: 'National Board for Higher Mathematics (NBHM) Research Fellowship (DAE)',
    shortName: 'NBHM Mathematics Research Fellowship',
    tagline: '₹35,000/month fellowship + ₹15,000/year contingency for doctoral scholars in Mathematics',
    description: 'Department of Atomic Energy (DAE) NBHM national fellowship for research scholars pursuing M.Phil. and Ph.D. degrees in pure and applied mathematics.',
    category: 'Education & Skill',
    jurisdiction: 'Central',
    ministry: 'Department of Atomic Energy (DAE) / NBHM',
    officialSourceUrl: 'https://www.nbhm.dae.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 43500000,
      displayAmount: '₹35,000 / month + ₹15,000 Annual Contingency',
      frequency: 'Annual'
    },
    requiredDocumentIds: ['aadhaar', 'student_id_bonafide', 'educational_marksheet', 'bank_passbook'],
    rules: all(
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('isEnrolledInPhd', 'eq', 'Must be enrolled in regular Ph.D. research in Mathematics', true),
      rule('age', 'between', 'Age below 35 years', undefined, 21, 35)
    )
  }),

  // 66. Maulana Azad PG Scholarship for Minority Girls
  createStudentScheme({
    id: 'maulana_azad_pg_minority_girls',
    code: 'MOMA-MAULANA-PG',
    name: 'Begum Hazrat Mahal / Maulana Azad PG Scholarship for Minority Girls (MoMA)',
    shortName: 'Maulana Azad Minority Girls PG Scholarship',
    tagline: '₹3,100/month for 24 months for meritorious minority girl students pursuing Postgraduate degrees',
    description: 'Ministry of Minority Affairs national incentive supporting young women from minority communities (Muslim, Christian, Sikh, Buddhist, Jain, Parsi) enrolled in regular postgraduate degree courses. Family income < ₹6 Lakhs.',
    category: 'Education & Skill',
    jurisdiction: 'Central',
    ministry: 'Ministry of Minority Affairs',
    officialSourceUrl: 'https://scholarships.gov.in/',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 3720000,
      displayAmount: '₹3,100 / month (₹37,200 / year for 2 Years)',
      frequency: 'Annual'
    },
    requiredDocumentIds: ['aadhaar', 'student_id_bonafide', 'income_certificate', 'educational_marksheet', 'bank_passbook'],
    rules: all(
      rule('gender', 'eq', 'Eligible exclusively for female students', 'Female'),
      rule('isMinority', 'eq', 'Must belong to notified religious minority', true),
      rule('isStudent', 'eq', 'Applicant must be an active student', true),
      rule('educationLevel', 'eq', 'Must be enrolled in Postgraduate degree program', 'Postgraduate'),
      rule('enrolledInHigherEducation', 'eq', 'Enrolled in post-graduate degree', true),
      rule('annualFamilyIncome', 'lte', 'Annual family income under ₹6,00,000', undefined, undefined, 600000)
    )
  })
];
