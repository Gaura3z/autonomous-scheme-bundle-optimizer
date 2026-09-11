/**
 * Curated Demo Personas for Judge Demonstration
 * Pre-configured profiles that highlight distinct paths through the deterministic optimizer.
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 */
import { DemoCitizenProfile, CitizenProfile } from '../types';

export const DEMO_PROFILES: DemoCitizenProfile[] = [
  {
    id: 'demo_student',
    name: 'Aarav Sharma',
    roleTitle: 'College Student (OBC)',
    avatarInitials: 'AS',
    badge: 'Education & Scholarship Focus',
    shortSummary: '21-year-old undergraduate college student in Pune, Maharashtra from an OBC household with ₹1.8L annual family income.',
    profile: {
      age: 21,
      gender: 'Male',
      state: 'MH',
      areaType: 'Urban',
      socialCategory: 'OBC',
      maritalStatus: 'Single',
      isStudent: true,
      educationLevel: 'Undergraduate',
      employmentStatus: 'Student',
      occupation: 'Engineering Undergrad Student',
      annualFamilyIncome: 180000,
      hasBPLCard: false,
      hasRationCard: true,
      isFarmer: false,
      hasDisability: false,
      isWomanEntrepreneur: false,
      hasStreetVendingActivity: false,
      enrolledInHigherEducation: true,
      pursuingApprenticeship: false,
      hasGirlChildUnder10: false
    },
    // Has Aadhaar, Bank passbook, Bonafide, Domicile, Caste, Marksheet; but missing Income Certificate!
    initialDeclaredDocuments: [
      'aadhaar',
      'bank_passbook',
      'student_id_bonafide',
      'domicile_certificate',
      'caste_certificate',
      'educational_marksheet'
    ]
  },
  {
    id: 'demo_woman_artisan',
    name: 'Sunita Devi',
    roleTitle: 'Rural Woman Entrepreneur (SC)',
    avatarInitials: 'SD',
    badge: 'Self-Employment & Enterprise Focus',
    shortSummary: '34-year-old artisan & self-help group entrepreneur from rural Alwar, Rajasthan from an SC family with a 6-year-old daughter.',
    profile: {
      age: 34,
      gender: 'Female',
      state: 'RJ',
      areaType: 'Rural',
      socialCategory: 'SC',
      maritalStatus: 'Married',
      isStudent: false,
      educationLevel: '10th Pass',
      employmentStatus: 'Self-Employed',
      occupation: 'Handloom & Textile Crafts Micro-Enterprise',
      annualFamilyIncome: 140000,
      hasBPLCard: true,
      hasRationCard: true,
      isFarmer: false,
      hasDisability: false,
      isWomanEntrepreneur: true,
      hasStreetVendingActivity: false,
      enrolledInHigherEducation: false,
      pursuingApprenticeship: false,
      hasGirlChildUnder10: true
    },
    // Has Aadhaar, Ration Card, Caste certificate, Bank Passbook; Missing Udyam MSME certificate and Income Certificate!
    initialDeclaredDocuments: [
      'aadhaar',
      'bank_passbook',
      'ration_card',
      'caste_certificate'
    ]
  },
  {
    id: 'demo_farmer',
    name: 'Ramesh Patel',
    roleTitle: 'Small & Marginal Farmer',
    avatarInitials: 'RP',
    badge: 'Agriculture & Livelihood Focus',
    shortSummary: '48-year-old farmer in Anand, Gujarat cultivating 1.4 hectares of rainfed cotton and pulses, supporting a rural family.',
    profile: {
      age: 48,
      gender: 'Male',
      state: 'GJ',
      areaType: 'Rural',
      socialCategory: 'General',
      maritalStatus: 'Married',
      isStudent: false,
      educationLevel: 'Below 10th',
      employmentStatus: 'Farmer',
      occupation: 'Smallholder Agriculture & Dairy',
      annualFamilyIncome: 195000,
      hasBPLCard: false,
      hasRationCard: true,
      isFarmer: true,
      landholdingHectares: 1.4,
      isRainfedLand: true,
      hasDisability: false,
      isWomanEntrepreneur: false,
      hasStreetVendingActivity: false,
      enrolledInHigherEducation: false,
      pursuingApprenticeship: false,
      hasGirlChildUnder10: false
    },
    // Has Aadhaar, Bank Passbook, Ration Card; Missing Agricultural Land 7/12 extract
    initialDeclaredDocuments: [
      'aadhaar',
      'bank_passbook',
      'ration_card'
    ]
  }
];

export const INITIAL_EMPTY_PROFILE: CitizenProfile = {
  age: 24,
  gender: 'Male',
  state: 'MH',
  areaType: 'Rural',
  socialCategory: 'General',
  maritalStatus: 'Single',
  isStudent: false,
  educationLevel: '12th Pass',
  employmentStatus: 'Self-Employed',
  occupation: '',
  annualFamilyIncome: 200000,
  hasBPLCard: false,
  hasRationCard: true,
  isFarmer: false,
  hasDisability: false,
  isWomanEntrepreneur: false,
  hasStreetVendingActivity: false,
  enrolledInHigherEducation: false,
  pursuingApprenticeship: false,
  hasGirlChildUnder10: false
};
