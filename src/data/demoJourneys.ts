/**
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 * Curated Demo Journeys for Judge Evaluation
 * Three complete paths demonstrating distinct algorithmic outcomes.
 */
import { Profile } from '../types/assessment';

export interface DemoJourneyConfig {
  id: string;
  name: string;
  roleBadge: string;
  headline: string;
  label: string; // "Demo Profile · Prototype Data"
  initialProfile: Profile;
  initialDeclaredDocumentIds: string[];
  expectedHighlight: {
    candidatesCount: number;
    adaptiveQuestionsCount: number;
    hasConflict: boolean;
    conflictDescription?: string;
    missingDocumentName: string;
    readySchemesCount: number;
    documentMissingSchemesCount: number;
    bundleValueDisplay: string;
    roadmapStepsCount: number;
  };
  judgeEvaluationNotes: string[];
}

export const DEMO_JOURNEYS: Record<string, DemoJourneyConfig> = {
  demo_student: {
    id: 'demo_student',
    name: 'Aarav Sharma',
    roleBadge: 'College Student (OBC)',
    headline: 'Higher Education & Scholarship Pathway',
    label: 'Demo Profile · Prototype Data',
    initialProfile: {
      age: 21,
      gender: 'Male',
      state: 'MH',
      residence: 'Urban',
      category: 'OBC',
      maritalStatus: 'Single',
      studentStatus: true,
      education: 'Undergraduate',
      employment: 'Student',
      occupation: 'Engineering Undergraduate',
      income: 180000,
      disability: false,
      farmer: false,
      isWomanEntrepreneur: false,
      hasStreetVendingActivity: false,
      hasGirlChildUnder10: false
    },
    initialDeclaredDocumentIds: [
      'aadhaar',
      'bank_passbook',
      'student_id_bonafide',
      'domicile_certificate',
      'caste_certificate',
      'educational_marksheet'
    ],
    expectedHighlight: {
      candidatesCount: 6,
      adaptiveQuestionsCount: 2,
      hasConflict: true,
      conflictDescription: 'Post-Matric Scholarship vs State Merit-cum-Means Stipend (Anti-duplication clause)',
      missingDocumentName: 'Annual Income Certificate',
      readySchemesCount: 3,
      documentMissingSchemesCount: 1,
      bundleValueDisplay: '₹56,400 / year + Tuition Reimbursement (Demo Data)',
      roadmapStepsCount: 5
    },
    judgeEvaluationNotes: [
      'Shows targeted education questions only (no irrelevant farmer or vendor questions).',
      'Highlights conflict detection between two educational scholarship windows.',
      'Demonstrates that missing Income Certificate results in Yellow "Eligible, but document missing" — never Ineligible.',
      'Roadmap sequences obtaining Income Certificate from Tahsildar (~7 days) before filing on the National Scholarship Portal.'
    ]
  },
  demo_woman_artisan: {
    id: 'demo_woman_artisan',
    name: 'Sunita Devi',
    roleBadge: 'Rural Woman Entrepreneur (SC)',
    headline: 'Micro-Enterprise & Sovereign Family Savings Pathway',
    label: 'Demo Profile · Prototype Data',
    initialProfile: {
      age: 34,
      gender: 'Female',
      state: 'RJ',
      residence: 'Rural',
      category: 'SC',
      maritalStatus: 'Married',
      studentStatus: false,
      education: '10th Pass',
      employment: 'Self-Employed',
      occupation: 'Handloom & Textile Crafts Micro-Enterprise',
      income: 140000,
      disability: false,
      farmer: false,
      isWomanEntrepreneur: true,
      hasStreetVendingActivity: false,
      hasGirlChildUnder10: true
    },
    initialDeclaredDocumentIds: [
      'aadhaar',
      'bank_passbook',
      'ration_card',
      'caste_certificate'
    ],
    expectedHighlight: {
      candidatesCount: 6,
      adaptiveQuestionsCount: 2,
      hasConflict: true,
      conflictDescription: 'Stand-Up India vs MUDRA Kishore (Dual central subsidized credit prohibition)',
      missingDocumentName: 'Udyam MSME Certificate & Child Birth Certificate',
      readySchemesCount: 3,
      documentMissingSchemesCount: 2,
      bundleValueDisplay: '₹75,00,000 Term Credit Limit + ₹5,00,000 Health Cover (Demo Data)',
      roadmapStepsCount: 6
    },
    judgeEvaluationNotes: [
      'Proves explicit exclusion: Post-Matric Scholarship is blocked with clear explanation ("Not enrolled as regular student").',
      'Evaluates woman-entrepreneur and girl-child criteria.',
      'Resolves capital allocation between high-value Stand-Up India and working-capital MUDRA.',
      'Flags missing Udyam MSME and child birth certificate as readiness gaps.'
    ]
  },
  demo_farmer: {
    id: 'demo_farmer',
    name: 'Ramesh Patel',
    roleBadge: 'Small & Marginal Farmer',
    headline: 'Agriculture Income & Crop Calamity Protection Pathway',
    label: 'Demo Profile · Prototype Data',
    initialProfile: {
      age: 48,
      gender: 'Male',
      state: 'GJ',
      residence: 'Rural',
      category: 'General',
      maritalStatus: 'Married',
      studentStatus: false,
      education: 'Below 10th',
      employment: 'Farmer',
      occupation: 'Rainfed Cotton & Pulse Cultivator',
      income: 220000,
      disability: false,
      farmer: true,
      landholding: 1.4,
      isRainfedLand: true,
      isWomanEntrepreneur: false,
      hasStreetVendingActivity: false,
      hasGirlChildUnder10: false
    },
    initialDeclaredDocumentIds: [
      'aadhaar',
      'bank_passbook',
      'ration_card'
    ],
    expectedHighlight: {
      candidatesCount: 6,
      adaptiveQuestionsCount: 2,
      hasConflict: false,
      missingDocumentName: 'Agricultural Land Title (7/12 RoR)',
      readySchemesCount: 2,
      documentMissingSchemesCount: 2,
      bundleValueDisplay: '₹27,00,000 Total Coverage & Concessional Credit + ₹6,000 Cash Support (Demo Data)',
      roadmapStepsCount: 5
    },
    judgeEvaluationNotes: [
      'Opens conditional farmer & landholding question branch (1.4 hectares rainfed).',
      'Confirms multi-scheme synergy: PM-KISAN, PMFBY, and KCC have zero mutual conflict.',
      'Explicit dependency chain: 7/12 RoR -> Crop Sowing Girdawari -> PMFBY crop insurance application.',
      'Shows digital e-Bhoomi instant download step in the roadmap.'
    ]
  }
};
