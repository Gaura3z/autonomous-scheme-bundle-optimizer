/**
 * Kurukshetra 2.0 HACKFEST 2026 PS16: Autonomous Scheme-Bundle Optimizer
 * Core TypeScript Type Definitions
 */

export type SocialCategory = 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
/** More specific subcategories are retained for display while rules use the parent category. */
export type SocialCategoryDetail = 'PVTG' | 'DNT';
export type Gender = 'Male' | 'Female' | 'Transgender' | 'Other';
export type AreaType = 'Rural' | 'Urban' | 'Semi-Urban';
export type MaritalStatus = 'Single' | 'Married' | 'Widowed' | 'Divorced' | 'Separated';
export type EducationLevel = 'Below 10th' | '10th Pass' | '12th Pass' | 'Undergraduate' | 'Postgraduate' | 'Diploma' | 'Vocational';
export type EmploymentStatus = 'Student' | 'Unemployed' | 'Employed' | 'Self-Employed' | 'Farmer' | 'Daily Wage Worker';
export type SelfEmploymentCategory =
  | 'Farmer / Agriculture'
  | 'Business Owner'
  | 'Shop Owner'
  | 'Trader'
  | 'Freelancer'
  | 'Consultant'
  | 'Contractor'
  | 'Driver / Transport'
  | 'Artisan / Handicraft'
  | 'Skilled Worker'
  | 'Teacher / Tutor'
  | 'Professional Services'
  | 'Other Self-Employment';

export interface CitizenProfile {
  // Basic Demographics
  age: number;
  gender: Gender;
  state: string; // e.g., 'MH', 'GJ', 'RJ', 'KA', 'UP', etc.
  areaType: AreaType;
  socialCategory: SocialCategory;
  socialCategoryDetail?: SocialCategoryDetail;
  maritalStatus: MaritalStatus;

  // Education & Work
  isStudent: boolean;
  educationLevel: EducationLevel;
  employmentStatus: EmploymentStatus;
  occupation: string;
  employmentRole?: string;
  employerName?: string;
  employmentMonthlyIncome?: number;
  selfEmploymentCategory?: SelfEmploymentCategory;
  selfEmploymentDetails?: string;
  selfEmploymentMonthlyIncome?: number;

  // Financial & Household
  annualFamilyIncome: number; // in Rupees
  hasBPLCard: boolean;
  hasRationCard: boolean;

  // Conditional Fields
  isFarmer: boolean;
  landholdingHectares?: number;
  isRainfedLand?: boolean;

  hasDisability: boolean;
  disabilityPercentage?: number;
  isMinority?: boolean;

  isWomanEntrepreneur: boolean;
  hasStreetVendingActivity: boolean;
  enrolledInHigherEducation: boolean;
  pursuingApprenticeship: boolean;
  hasGirlChildUnder10: boolean;

  // Student & Academic Specific Fields (Especially Maharashtra & Central Schemes)
  isAspirant?: boolean;
  academicFocus?: 'Degree/College' | 'Aspirant' | 'Doctoral' | 'Vocational';
  isProfessionalCourse?: boolean;
  isHosteller?: boolean;
  isCapAdmitted?: boolean;
  hasQualifyingExamAbove60?: boolean;
  hasCasteValidity?: boolean;
  hasNonCreamyLayer?: boolean;
  isOrphanOrSingleParent?: boolean;
  isItiStudent?: boolean;
  hasClearedUpscOrMpscStage?: boolean;
  isPreparingForUpscOrMpsc?: boolean;
  isPreparingForEngineeringOrMedicalEntrance?: boolean;
  isFreedomFighterChild?: boolean;
  hasTenthMarksAbove75?: boolean;
  hasTwelfthMathPhysicsAbove60?: boolean;
  isEnrolledInPhd?: boolean;
  isEnrolledInVidyaniketan?: boolean;
  familyBeneficiaryCountUnderTwo?: boolean;
  attendanceAboveFiftyPercent?: boolean;
}

export type AssessmentStage = 
  | 'landing'
  | 'profile'
  | 'initial_matching'
  | 'questionnaire'
  | 'processing'
  | 'results'
  | 'conflicts'
  | 'bundle'
  | 'documents_checklist'
  | 'readiness'
  | 'dependencies'
  | 'roadmap'
  | 'explanation'
  | 'LANDING'
  | 'PROFILE'
  | 'CANDIDATE_MATCH'
  | 'QUESTIONNAIRE'
  | 'PROCESSING'
  | 'ELIGIBILITY_RESULTS'
  | 'CONFLICT_DETECTION'
  | 'OPTIMIZED_BUNDLE'
  | 'DOCUMENT_CHECKLIST'
  | 'DOCUMENT_READINESS'
  | 'DOCUMENT_DEPENDENCIES'
  | 'APPLICATION_ROADMAP'
  | 'RECOMMENDATION_SUMMARY';

export type SchemeCategory = 
  | 'Agriculture & Allied'
  | 'Education & Skill'
  | 'Business & Self-Employment'
  | 'Health & Social Security'
  | 'Housing & Living'
  | 'Women & Child Welfare';

export type BenefitType = 'Monetary' | 'Non-Monetary' | 'Hybrid';

export interface SchemeBenefit {
  type: BenefitType;
  monetaryValueAnnualPaise: number; // Annual amount in paise for precise computation
  displayAmount: string; // e.g. "₹6,000 / year"
  frequency: 'Annual' | 'Monthly' | 'One-Time' | 'Coverage';
  nonMonetaryDescription?: string; // e.g., "Secondary & tertiary health coverage up to ₹5 Lakhs"
}

export type RuleOperator = 'eq' | 'in' | 'between' | 'lte' | 'gte' | 'exists';

export interface RulePredicate {
  field: keyof CitizenProfile;
  op: RuleOperator;
  value?: unknown;
  min?: number;
  max?: number;
  label: string;
}

export interface SchemeRule {
  id: string;
  all?: RulePredicate[];
  any?: RulePredicate[];
  none?: RulePredicate[];
  exclusionRules?: RulePredicate[];
}

export interface Scheme {
  id: string;
  code: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  category: SchemeCategory;
  jurisdiction: 'Central' | 'State-Specific';
  targetStates?: string[]; // Empty means Pan-India
  ministry: string;
  officialSourceUrl: string;
  lastVerifiedDate: string;
  kbVersion: string;
  /** Optional official start date for the current scheme window. */
  validityStartDate?: string;
  /** Optional last date on which an application may be filed. */
  applicationDeadline?: string;
  /** Plain-language note, especially useful for rolling or demo-only dates. */
  validityNote?: string;

  benefit: SchemeBenefit;
  requiredDocumentIds: string[];
  rules: SchemeRule;
  applicationSteps: {
    sequence: number;
    title: string;
    instructions: string;
    portalName: string;
    portalUrl: string;
  }[];
}

export type EligibilityStatus = 
  | 'ELIGIBLE' 
  | 'POSSIBLY_ELIGIBLE' 
  | 'INELIGIBLE' 
  | 'BLOCKED_BY_EXCLUSION';

export interface SchemeEvaluation {
  scheme: Scheme;
  status: EligibilityStatus;
  matchedPositiveReasons: string[];
  unmetReasons: string[];
  exclusionReasons: string[];
  unknownPredicates: string[];
  confidence: 'High' | 'Partial' | 'Blocked';
}

export interface SchemeConflict {
  id: string;
  schemeIdA: string;
  schemeIdB: string;
  schemeAName: string;
  schemeBName: string;
  reason: string;
  officialCircularReference: string;
  consequence: string;
  resolutionAdvice: string;
}

export interface OptimizedBundle {
  selectedSchemes: Scheme[];
  rejectedAlternatives: {
    scheme: Scheme;
    rejectionReason: string;
    conflictedWith?: Scheme;
  }[];
  totalMonetaryAnnual: number;
  nonMonetaryBenefits: string[];
  conflictsResolvedCount: number;
  solverStatus: 'Optimal' | 'Feasible_Fallback';
  optimalityMetric: string;
  /** Schemes that would be selected if all eligible documents were available. */
  potentialSelectedSchemes?: Scheme[];
  potentialTotalMonetaryAnnual?: number;
  /** Potential winners that are blocked from immediate filing by missing documents. */
  documentBlockedSchemes?: { scheme: Scheme; missingDocumentIds: string[] }[];
}

export interface DocumentInfo {
  id: string;
  name: string;
  category: 'Identity' | 'Income' | 'Education' | 'Caste & Category' | 'Livelihood & Land' | 'Banking & Health';
  issuingAuthority: string;
  description: string;
  typicalProcessingDays: number;
  isImmediateDigital: boolean;
  prerequisites: string[]; // IDs of documents needed first
  applicationPortal?: string;
}

export interface DocumentReadiness {
  requiredDocumentIds: string[];
  declaredDocumentIds: string[];
  missingDocumentIds: string[];
  readySchemes: Scheme[];
  documentMissingSchemes: {
    scheme: Scheme;
    missingDocuments: DocumentInfo[];
  }[];
}

export interface RoadmapStep {
  id: string;
  stepNumber: number;
  phase: 'Prerequisite' | 'Document Acquisition' | 'Scheme Application';
  title: string;
  description: string;
  targetDocument?: DocumentInfo;
  targetScheme?: Scheme;
  applicationDeadline?: string;
  validityNote?: string;
  estimatedTimeline: string;
  actionUrl?: string;
  isCompleted: boolean;
  criticalDependency?: string;
}

export interface AdaptiveQuestion {
  id: string;
  field: keyof CitizenProfile;
  title: string;
  titleMr?: string;
  contextExplanation: string;
  contextExplanationMr?: string;
  schemeJustification: string;
  type: 'select' | 'boolean' | 'number' | 'radio';
  options?: { label: string; value: unknown; description?: string }[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export interface DemoCitizenProfile {
  id: string;
  name: string;
  roleTitle: string;
  avatarInitials: string;
  badge: string;
  shortSummary: string;
  profile: CitizenProfile;
  initialDeclaredDocuments: string[];
}
