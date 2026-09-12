/**
 * Additional source-backed central schemes for the PS16 prototype catalog.
 *
 * These records intentionally use conservative rules and benefit descriptions.
 * Current eligibility windows, state implementation details, and deadlines must
 * always be verified on the linked official portal before a citizen applies.
 */
import { RulePredicate, Scheme, SchemeCategory } from '../types';

const VERIFIED_ON = '2026-09-12';
const CATALOG_VERSION = 'v2026.2-PS16';
const DEMO_NOTE = 'Prototype catalog record. Verify current rules and the application window on the official portal before filing.';

type AdditionalSchemeOptions = {
  id: string;
  code: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  category: SchemeCategory;
  ministry: string;
  officialSourceUrl: string;
  benefit: Scheme['benefit'];
  requiredDocumentIds: string[];
  rules: Omit<Scheme['rules'], 'id'>;
  conflictingSchemeIds?: string[];
};

function centralScheme(options: AdditionalSchemeOptions): Scheme {
  return {
    ...options,
    rules: { ...options.rules, id: `rule_${options.id}` },
    jurisdiction: 'Central',
    lastVerifiedDate: VERIFIED_ON,
    kbVersion: CATALOG_VERSION,
    validityNote: DEMO_NOTE,
    applicationSteps: [
      {
        sequence: 1,
        title: `Review ${options.shortName} eligibility and application window`,
        instructions: 'Use the official portal to confirm the current guidelines, documents, state implementation, and application window before submitting.',
        portalName: options.shortName,
        portalUrl: options.officialSourceUrl
      }
    ]
  };
}

const all = (...rules: RulePredicate[]) => ({ all: rules });
const any = (...rules: RulePredicate[]) => ({ any: rules });
const rule = (field: RulePredicate['field'], op: RulePredicate['op'], label: string, value?: unknown, min?: number, max?: number): RulePredicate => ({ field, op, label, value, min, max });

export const ADDITIONAL_SCHEMES: Scheme[] = [
  centralScheme({
    id: 'pm_kusum', code: 'PM-KUSUM', name: 'PM-KUSUM', shortName: 'PM-KUSUM',
    tagline: 'Solar energy support for agricultural pumps and farm land',
    description: 'Supports selected solarisation and renewable-energy components for farmers through designated state implementing agencies.',
    category: 'Agriculture & Allied', ministry: 'Ministry of New and Renewable Energy',
    officialSourceUrl: 'https://pmkusum.mnre.gov.in/',
    benefit: { type: 'Hybrid', monetaryValueAnnualPaise: 0, displayAmount: 'Component-based subsidy and solar support', frequency: 'Coverage', nonMonetaryDescription: 'Solar pump or farm-energy support varies by component and state.' },
    requiredDocumentIds: ['aadhaar', 'land_records_7_12', 'bank_passbook'],
    rules: all(rule('isFarmer', 'eq', 'Applicant must identify as a farmer', true), rule('landholdingHectares', 'gte', 'Agricultural land information must be available', 0.1, 0.1))
  }),
  centralScheme({
    id: 'pm_surya_ghar', code: 'PM-SURYA-GHAR', name: 'PM Surya Ghar: Muft Bijli Yojana', shortName: 'PM Surya Ghar',
    tagline: 'Residential rooftop solar support with central financial assistance',
    description: 'Supports residential households installing rooftop solar through the national portal and approved vendors.',
    category: 'Housing & Living', ministry: 'Ministry of New and Renewable Energy',
    officialSourceUrl: 'https://pmsuryaghar.gov.in/',
    benefit: { type: 'Hybrid', monetaryValueAnnualPaise: 7800000, displayAmount: 'Up to ₹78,000 rooftop solar subsidy', frequency: 'One-Time', nonMonetaryDescription: 'Household electricity support varies by sanctioned system capacity.' },
    requiredDocumentIds: ['aadhaar', 'bank_passbook'],
    rules: all(rule('areaType', 'in', 'Applicant must provide a residential area profile', ['Urban', 'Semi-Urban', 'Rural']))
  }),
  centralScheme({
    id: 'kisan_credit_card', code: 'KCC', name: 'Kisan Credit Card', shortName: 'KCC',
    tagline: 'Institutional credit support for eligible agricultural activities',
    description: 'Provides a formal credit route for eligible farmers and agricultural activities through participating banks.',
    category: 'Agriculture & Allied', ministry: 'Ministry of Finance',
    officialSourceUrl: 'https://www.myscheme.gov.in/schemes/kcc',
    benefit: { type: 'Hybrid', monetaryValueAnnualPaise: 0, displayAmount: 'Agricultural credit limit assessed by bank', frequency: 'Coverage', nonMonetaryDescription: 'Credit limit and interest support depend on bank assessment and applicable guidelines.' },
    requiredDocumentIds: ['aadhaar', 'land_records_7_12', 'bank_passbook'],
    rules: any(rule('isFarmer', 'eq', 'Applicant must identify as a farmer', true), rule('employmentStatus', 'eq', 'Applicant works in agriculture', 'Farmer'), rule('selfEmploymentCategory', 'eq', 'Self-employment category is agriculture', 'Farmer / Agriculture'))
  }),
  centralScheme({
    id: 'soil_health_card', code: 'SHC', name: 'Soil Health Card Scheme', shortName: 'Soil Health Card',
    tagline: 'Soil testing and nutrient recommendations for farmers',
    description: 'Provides soil health information and nutrient-management recommendations through the agriculture system.',
    category: 'Agriculture & Allied', ministry: 'Ministry of Agriculture and Farmers Welfare',
    officialSourceUrl: 'https://soilhealth.dac.gov.in/',
    benefit: { type: 'Non-Monetary', monetaryValueAnnualPaise: 0, displayAmount: 'Soil testing and farm advisory', frequency: 'Coverage' },
    requiredDocumentIds: ['aadhaar', 'land_records_7_12'],
    rules: all(rule('isFarmer', 'eq', 'Applicant must identify as a farmer', true))
  }),
  centralScheme({
    id: 'pm_vishwakarma', code: 'PM-VISHWAKARMA', name: 'PM Vishwakarma', shortName: 'PM Vishwakarma',
    tagline: 'Recognition, skills, toolkit and credit support for traditional artisans',
    description: 'Provides support for eligible artisans and craftspeople working with traditional tools and trades.',
    category: 'Business & Self-Employment', ministry: 'Ministry of Micro, Small and Medium Enterprises',
    officialSourceUrl: 'https://pmvishwakarma.gov.in/',
    benefit: { type: 'Hybrid', monetaryValueAnnualPaise: 1500000, displayAmount: 'Toolkit incentive up to ₹15,000 plus applicable support', frequency: 'One-Time', nonMonetaryDescription: 'Training, digital transaction and marketing support may apply.' },
    requiredDocumentIds: ['aadhaar', 'bank_passbook', 'msme_udyam_registration'],
    rules: all(rule('selfEmploymentCategory', 'in', 'Applicant must select an artisan or skilled-work category', ['Artisan / Handicraft', 'Skilled Worker']))
  }),
  centralScheme({
    id: 'pmkvy', code: 'PMKVY', name: 'Pradhan Mantri Kaushal Vikas Yojana', shortName: 'PMKVY',
    tagline: 'Skill training and certification for eligible candidates',
    description: 'Supports skill training and certification aligned with approved job roles and training providers.',
    category: 'Education & Skill', ministry: 'Ministry of Skill Development and Entrepreneurship',
    officialSourceUrl: 'https://www.skillindiadigital.gov.in/',
    benefit: { type: 'Non-Monetary', monetaryValueAnnualPaise: 0, displayAmount: 'Training and certification support', frequency: 'Coverage' },
    requiredDocumentIds: ['aadhaar'],
    rules: any(rule('employmentStatus', 'eq', 'Applicant is seeking employment', 'Unemployed'), rule('employmentStatus', 'eq', 'Applicant is a daily-wage worker', 'Daily Wage Worker'), rule('pursuingApprenticeship', 'eq', 'Applicant is pursuing skill development', true))
  }),
  centralScheme({
    id: 'pmay_urban', code: 'PMAY-U', name: 'Pradhan Mantri Awas Yojana - Urban', shortName: 'PMAY-Urban',
    tagline: 'Housing assistance for eligible urban households',
    description: 'Provides housing assistance through urban mission components implemented with States, UTs and urban local bodies.',
    category: 'Housing & Living', ministry: 'Ministry of Housing and Urban Affairs',
    officialSourceUrl: 'https://pmaymis.gov.in/',
    benefit: { type: 'Hybrid', monetaryValueAnnualPaise: 0, displayAmount: 'Housing assistance varies by mission component', frequency: 'Coverage' },
    requiredDocumentIds: ['aadhaar', 'bank_passbook', 'income_certificate'],
    rules: all(rule('areaType', 'in', 'Applicant must live in an urban or semi-urban area', ['Urban', 'Semi-Urban']), rule('annualFamilyIncome', 'lte', 'Family income must be within the applicable housing category', undefined, undefined, 1200000))
  }),
  centralScheme({
    id: 'pm_ujjwala', code: 'PMUY', name: 'Pradhan Mantri Ujjwala Yojana', shortName: 'PM Ujjwala',
    tagline: 'Clean cooking connection support for eligible women from poor households',
    description: 'Supports eligible adult women from poor households with a clean cooking connection through participating distributors.',
    category: 'Women & Child Welfare', ministry: 'Ministry of Petroleum and Natural Gas',
    officialSourceUrl: 'https://www.pmuy.gov.in/',
    benefit: { type: 'Hybrid', monetaryValueAnnualPaise: 0, displayAmount: 'LPG connection support; verify current assistance', frequency: 'One-Time' },
    requiredDocumentIds: ['aadhaar', 'ration_card', 'bank_passbook'],
    rules: all(rule('gender', 'eq', 'Applicant must be a woman', 'Female'), rule('hasBPLCard', 'eq', 'Household must meet the applicable poor-household condition', true))
  }),
  centralScheme({
    id: 'pm_jan_dhan', code: 'PMJDY', name: 'Pradhan Mantri Jan-Dhan Yojana', shortName: 'PM Jan-Dhan',
    tagline: 'Basic banking access and financial inclusion services',
    description: 'Provides access to basic bank accounts and linked financial inclusion services through participating banks.',
    category: 'Health & Social Security', ministry: 'Ministry of Finance',
    officialSourceUrl: 'https://www.pmjdy.gov.in/',
    benefit: { type: 'Non-Monetary', monetaryValueAnnualPaise: 0, displayAmount: 'Banking access and financial inclusion', frequency: 'Coverage' },
    requiredDocumentIds: ['aadhaar'],
    rules: all(rule('age', 'gte', 'Applicant must be at least 10 years old', undefined, 10))
  }),
  centralScheme({
    id: 'pmjjby', code: 'PMJJBY', name: 'Pradhan Mantri Jeevan Jyoti Bima Yojana', shortName: 'PMJJBY',
    tagline: 'Renewable life insurance cover through a participating bank account',
    description: 'Offers renewable life insurance cover for eligible participating bank account holders.',
    category: 'Health & Social Security', ministry: 'Ministry of Finance',
    officialSourceUrl: 'https://www.jansuraksha.gov.in/',
    benefit: { type: 'Non-Monetary', monetaryValueAnnualPaise: 0, displayAmount: 'Life insurance cover; verify current premium', frequency: 'Annual' },
    requiredDocumentIds: ['aadhaar', 'bank_passbook'],
    rules: all(rule('age', 'between', 'Entry age must be within the scheme band', undefined, 18, 50))
  }),
  centralScheme({
    id: 'pmsby', code: 'PMSBY', name: 'Pradhan Mantri Suraksha Bima Yojana', shortName: 'PMSBY',
    tagline: 'Renewable accident insurance cover through a participating bank account',
    description: 'Offers renewable accident insurance cover for eligible participating bank account holders.',
    category: 'Health & Social Security', ministry: 'Ministry of Finance',
    officialSourceUrl: 'https://www.jansuraksha.gov.in/',
    benefit: { type: 'Non-Monetary', monetaryValueAnnualPaise: 0, displayAmount: 'Accident insurance cover; verify current premium', frequency: 'Annual' },
    requiredDocumentIds: ['aadhaar', 'bank_passbook'],
    rules: all(rule('age', 'between', 'Entry age must be within the scheme band', undefined, 18, 70))
  }),
  centralScheme({
    id: 'nsap', code: 'NSAP', name: 'National Social Assistance Programme', shortName: 'NSAP',
    tagline: 'Social assistance pensions for eligible vulnerable households',
    description: 'Provides social assistance support through pension and family-benefit components implemented with States and UTs.',
    category: 'Health & Social Security', ministry: 'Ministry of Rural Development',
    officialSourceUrl: 'https://nsap.nic.in/',
    benefit: { type: 'Monetary', monetaryValueAnnualPaise: 0, displayAmount: 'Pension or assistance varies by component and state', frequency: 'Monthly' },
    requiredDocumentIds: ['aadhaar', 'ration_card', 'bank_passbook'],
    rules: all(rule('age', 'gte', 'Applicant must meet the applicable senior-citizen condition', undefined, 60), rule('hasBPLCard', 'eq', 'Household must meet the applicable BPL condition', true))
  }),
  centralScheme({
    id: 'pm_matru_vandana', code: 'PMMVY', name: 'Pradhan Mantri Matru Vandana Yojana', shortName: 'PMMVY',
    tagline: 'Maternity benefit support for eligible women',
    description: 'Provides maternity benefit support through the women and child development system, subject to current scheme conditions.',
    category: 'Women & Child Welfare', ministry: 'Ministry of Women and Child Development',
    officialSourceUrl: 'https://wcd.gov.in/schemes/pradhan-mantri-matru-vandana-yojana',
    benefit: { type: 'Monetary', monetaryValueAnnualPaise: 0, displayAmount: 'Maternity benefit varies by current guidelines', frequency: 'One-Time' },
    requiredDocumentIds: ['aadhaar', 'bank_passbook'],
    rules: all(rule('gender', 'eq', 'Applicant must be a woman', 'Female'), rule('age', 'between', 'Applicant age must be within the adult benefit band', undefined, 18, 55))
  }),
  centralScheme({
    id: 'eshram', code: 'E-SHRAM', name: 'e-Shram Registration', shortName: 'e-Shram',
    tagline: 'Registration and social-security linkage for unorganised workers',
    description: 'Creates a national worker record to help connect eligible unorganised workers with social-security services.',
    category: 'Education & Skill', ministry: 'Ministry of Labour and Employment',
    officialSourceUrl: 'https://eshram.gov.in/',
    benefit: { type: 'Non-Monetary', monetaryValueAnnualPaise: 0, displayAmount: 'Worker registration and scheme linkage', frequency: 'Coverage' },
    requiredDocumentIds: ['aadhaar', 'bank_passbook'],
    rules: any(rule('employmentStatus', 'eq', 'Applicant is a daily-wage worker', 'Daily Wage Worker'), rule('employmentStatus', 'eq', 'Applicant is self-employed', 'Self-Employed'), rule('employmentStatus', 'eq', 'Applicant is unemployed', 'Unemployed'))
  }),
  centralScheme({
    id: 'nrlm', code: 'DAY-NRLM', name: 'Deendayal Antyodaya Yojana - National Rural Livelihoods Mission', shortName: 'DAY-NRLM',
    tagline: 'Rural women’s self-help groups and livelihood support',
    description: 'Supports rural women’s self-help groups, financial inclusion and livelihood activities through state missions.',
    category: 'Business & Self-Employment', ministry: 'Ministry of Rural Development',
    officialSourceUrl: 'https://aajeevika.gov.in/',
    benefit: { type: 'Hybrid', monetaryValueAnnualPaise: 0, displayAmount: 'Self-help group and livelihood support', frequency: 'Coverage' },
    requiredDocumentIds: ['aadhaar', 'bank_passbook'],
    rules: all(rule('gender', 'eq', 'Applicant must be a woman', 'Female'), rule('areaType', 'eq', 'Applicant must live in a rural area', 'Rural'))
  }),
  centralScheme({
    id: 'pmfme', code: 'PMFME', name: 'PM Formalisation of Micro Food Processing Enterprises', shortName: 'PMFME',
    tagline: 'Credit-linked support for eligible micro food-processing enterprises',
    description: 'Supports formalisation, training and credit-linked assistance for eligible micro food-processing enterprises.',
    category: 'Business & Self-Employment', ministry: 'Ministry of Food Processing Industries',
    officialSourceUrl: 'https://pmfme.mofpi.gov.in/',
    benefit: { type: 'Hybrid', monetaryValueAnnualPaise: 0, displayAmount: 'Credit-linked enterprise support varies by project', frequency: 'Coverage' },
    requiredDocumentIds: ['aadhaar', 'bank_passbook', 'msme_udyam_registration'],
    rules: any(rule('selfEmploymentCategory', 'in', 'Applicant must operate a business or food enterprise', ['Business Owner', 'Shop Owner', 'Trader']), rule('selfEmploymentDetails', 'exists', 'Self-employment work details must be provided'))
  }),
  centralScheme({
    id: 'central_sector_scholarship', code: 'CSSS', name: 'Central Sector Scheme of Scholarship for College and University Students', shortName: 'CSSS Scholarship',
    tagline: 'Merit-based scholarship support for eligible college students',
    description: 'Supports eligible college and university students under the Central Sector scholarship route through NSP.',
    category: 'Education & Skill', ministry: 'Ministry of Education',
    officialSourceUrl: 'https://scholarships.gov.in/',
    benefit: { type: 'Monetary', monetaryValueAnnualPaise: 1200000, displayAmount: 'Scholarship amount varies by course and year', frequency: 'Annual' },
    requiredDocumentIds: ['aadhaar', 'student_id_bonafide', 'bank_passbook', 'income_certificate'],
    rules: all(rule('isStudent', 'eq', 'Applicant must be an active student', true), rule('enrolledInHigherEducation', 'eq', 'Applicant must be enrolled in higher education', true)),
    conflictingSchemeIds: ['post_matric_scholarship', 'state_higher_ed_stipend']
  }),
  centralScheme({
    id: 'top_class_education_sc', code: 'TOP-CLASS-SC', name: 'Top Class Education for Scheduled Caste Students', shortName: 'Top Class SC Education',
    tagline: 'Higher-education support for eligible Scheduled Caste students',
    description: 'Provides higher-education support through the applicable central scholarship guidelines and participating institutions.',
    category: 'Education & Skill', ministry: 'Ministry of Social Justice and Empowerment',
    officialSourceUrl: 'https://scholarships.gov.in/',
    benefit: { type: 'Hybrid', monetaryValueAnnualPaise: 0, displayAmount: 'Tuition and maintenance support varies by guideline', frequency: 'Annual' },
    requiredDocumentIds: ['aadhaar', 'caste_certificate', 'student_id_bonafide', 'income_certificate', 'bank_passbook'],
    rules: all(rule('socialCategory', 'eq', 'Applicant must belong to Scheduled Caste', 'SC'), rule('isStudent', 'eq', 'Applicant must be an active student', true), rule('enrolledInHigherEducation', 'eq', 'Applicant must be enrolled in higher education', true)),
    conflictingSchemeIds: ['post_matric_scholarship', 'central_sector_scholarship']
  }),
  centralScheme({
    id: 'post_matric_obc', code: 'PMS-OBC', name: 'Post-Matric Scholarship for OBC, EBC and DNT Students', shortName: 'Post-Matric OBC/EBC/DNT',
    tagline: 'Post-matric education support for eligible social-category students',
    description: 'Supports eligible students through the applicable post-matric scholarship guidelines and state or central implementation channel.',
    category: 'Education & Skill', ministry: 'Ministry of Social Justice and Empowerment',
    officialSourceUrl: 'https://scholarships.gov.in/',
    benefit: { type: 'Hybrid', monetaryValueAnnualPaise: 0, displayAmount: 'Fee and maintenance support varies by course and guideline', frequency: 'Annual' },
    requiredDocumentIds: ['aadhaar', 'caste_certificate', 'student_id_bonafide', 'income_certificate', 'bank_passbook'],
    rules: all(rule('socialCategory', 'eq', 'Applicant must belong to OBC category in this prototype flow', 'OBC'), rule('isStudent', 'eq', 'Applicant must be an active student', true)),
    conflictingSchemeIds: ['post_matric_scholarship', 'central_sector_scholarship']
  }),
  centralScheme({
    id: 'national_overseas_scholarship', code: 'NOS', name: 'National Overseas Scholarship', shortName: 'National Overseas Scholarship',
    tagline: 'Overseas higher-education support for eligible social-category students',
    description: 'Supports eligible students pursuing approved higher education abroad under current ministry guidelines.',
    category: 'Education & Skill', ministry: 'Ministry of Social Justice and Empowerment',
    officialSourceUrl: 'https://socialjustice.gov.in/schemes',
    benefit: { type: 'Hybrid', monetaryValueAnnualPaise: 0, displayAmount: 'Overseas education support varies by country and course', frequency: 'Annual' },
    requiredDocumentIds: ['aadhaar', 'caste_certificate', 'income_certificate', 'bank_passbook'],
    rules: all(rule('socialCategory', 'in', 'Applicant must belong to an eligible social category', ['SC', 'ST']), rule('isStudent', 'eq', 'Applicant must be pursuing education', true))
  }),
  centralScheme({
    id: 'pm_daksh', code: 'PM-DAKSH', name: 'PM-DAKSH', shortName: 'PM-DAKSH',
    tagline: 'Skill development support for eligible disadvantaged groups',
    description: 'Provides skill development and training support through the Ministry of Social Justice and Empowerment ecosystem.',
    category: 'Education & Skill', ministry: 'Ministry of Social Justice and Empowerment',
    officialSourceUrl: 'https://pmdaksh.dosje.gov.in/',
    benefit: { type: 'Non-Monetary', monetaryValueAnnualPaise: 0, displayAmount: 'Skill training and support as applicable', frequency: 'Coverage' },
    requiredDocumentIds: ['aadhaar', 'caste_certificate', 'income_certificate'],
    rules: any(rule('socialCategory', 'in', 'Applicant belongs to an eligible social category', ['SC', 'OBC', 'EWS']), rule('hasDisability', 'eq', 'Applicant identifies as a person with a disability', true))
  }),
  centralScheme({
    id: 'pm_krishi_sinchayee', code: 'PMKSY', name: 'Pradhan Mantri Krishi Sinchayee Yojana', shortName: 'PMKSY',
    tagline: 'Water-use efficiency and irrigation support for agriculture',
    description: 'Supports irrigation and water-use efficiency through components implemented by relevant departments and states.',
    category: 'Agriculture & Allied', ministry: 'Ministry of Agriculture and Farmers Welfare',
    officialSourceUrl: 'https://pmksy.gov.in/',
    benefit: { type: 'Hybrid', monetaryValueAnnualPaise: 0, displayAmount: 'Irrigation support varies by component and state', frequency: 'Coverage' },
    requiredDocumentIds: ['aadhaar', 'land_records_7_12', 'bank_passbook'],
    rules: all(rule('isFarmer', 'eq', 'Applicant must identify as a farmer', true), rule('landholdingHectares', 'gte', 'Agricultural land information must be available', 0.1, 0.1))
  })
];
