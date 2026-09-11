/**
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 * Official Assessment Data Types & API Contracts Specification
 */

export type Step =
  | 'landing'
  | 'profile'
  | 'candidates'
  | 'questions'
  | 'analysis'
  | 'results'
  | 'conflicts'
  | 'bundle'
  | 'documents'
  | 'readiness'
  | 'dependencies'
  | 'roadmap'
  | 'summary';

export interface Profile {
  age: number;
  gender: 'Male' | 'Female' | 'Transgender' | 'Other';
  state: string;
  residence: 'Rural' | 'Urban' | 'Semi-Urban';
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
  maritalStatus: 'Single' | 'Married' | 'Widowed' | 'Divorced' | 'Separated';
  studentStatus: boolean;
  education: 'Below 10th' | '10th Pass' | '12th Pass' | 'Undergraduate' | 'Postgraduate' | 'Diploma' | 'Vocational';
  employment: 'Student' | 'Unemployed' | 'Employed' | 'Self-Employed' | 'Farmer' | 'Daily Wage Worker';
  occupation: string;
  income: number;
  disability: boolean;
  disabilityPercentage?: number;
  farmer: boolean;
  landholding?: number;
  isRainfedLand?: boolean;
  isWomanEntrepreneur?: boolean;
  hasStreetVendingActivity?: boolean;
  hasGirlChildUnder10?: boolean;
}

export interface CandidateScheme {
  id: string;
  name: string;
  code?: string;
  category: string;
  description: string;
  demoBenefit: string;
  relevance: string;
  status: 'Potentially Relevant' | 'More information needed';
  relevanceReason: string;
  requiredDocuments: string[];
}

export interface SchemeRuleTrace {
  ruleId: string;
  predicateLabel: string;
  satisfied: boolean;
  fieldUsed: string;
  actualValue: unknown;
  expectedCondition: string;
}

export interface EvaluatedSchemeResult {
  schemeId: string;
  schemeName: string;
  shortName: string;
  category: string;
  classification: 'ELIGIBLE' | 'POSSIBLY_ELIGIBLE' | 'INELIGIBLE' | 'BLOCKED_BY_EXCLUSION';
  benefitDisplay: string;
  benefitType: 'Monetary' | 'Non-Monetary' | 'Hybrid';
  monetaryValueAnnualPaise: number;
  reasons: string[];
  conditions: string[];
  ruleTraces: SchemeRuleTrace[];
  requiredDocumentIds: string[];
  officialSourceUrl: string;
  lastVerifiedDate: string;
  kbVersion: string;
  sourceMode: 'Demo Data';
}

export interface EligibilityResult {
  eligible: EvaluatedSchemeResult[];
  possiblyEligible: EvaluatedSchemeResult[];
  ineligible: EvaluatedSchemeResult[];
  excluded: EvaluatedSchemeResult[];
  totalEvaluated: number;
  evaluatedAt: string;
  kbVersion: string;
  sourceMode: 'Demo Data';
}

export interface ConflictPair {
  schemeIdA: string;
  schemeIdB: string;
  schemeNameA: string;
  schemeNameB: string;
  reason: string;
  statutoryBasis: string;
  gazetteReference: string;
  validAlternatives: string[];
}

export interface ConflictResult {
  hasConflicts: boolean;
  activeConflicts: ConflictPair[];
  evaluatedPairsCount: number;
  sourceMode: 'Demo Data';
}

export interface BundleResult {
  selectedSchemeIds: string[];
  selectedSchemes: EvaluatedSchemeResult[];
  rejectedAlternatives: {
    schemeId: string;
    schemeName: string;
    rejectionReason: string;
    conflictedWithSchemeName?: string;
  }[];
  totalMonetaryAnnual: number;
  displayTotalMonetary: string;
  nonMonetaryBenefits: string[];
  conflictsResolvedCount: number;
  solverStatus: 'Optimal' | 'Feasible' | 'Optimization Unavailable';
  objectiveExplanation: string;
  sourceMode: 'Demo Data';
}

export interface DemoDocument {
  id: string;
  name: string;
  group: 'Identity' | 'Income' | 'Education' | 'Residence' | 'Agriculture' | 'Banking';
  description: string;
  issuingAuthority: string;
  typicalProcessingDays: number;
  isImmediateDigital: boolean;
  prerequisites: string[];
  relevantSchemeIds: string[];
  portalUrl?: string;
}

export interface ReadinessResult {
  requiredDocumentIds: string[];
  declaredDocumentIds: string[];
  missingDocumentIds: string[];
  readySchemes: EvaluatedSchemeResult[];
  documentMissingSchemes: {
    scheme: EvaluatedSchemeResult;
    missingDocuments: DemoDocument[];
  }[];
  readinessPercentage: number;
  sourceMode: 'Demo Data';
}

export interface Dependency {
  from: string;
  to: string;
  fromName: string;
  toName: string;
  note: string;
  relevantSchemeId?: string;
  relevantSchemeName?: string;
}

export interface RoadmapStep {
  number: number;
  title: string;
  detail: string;
  phase: 'Prerequisite' | 'Document Acquisition' | 'Scheme Application';
  documents: string[];
  status: 'Pending' | 'Completed';
  linkPlaceholder: string;
  estimatedTimeline: string;
  criticalDependency?: string;
}

export interface ExplanationResult {
  summary: string;
  nextSteps: string[];
  caveat: string;
  conflictsAvoidedNote: string;
  sourceFreshness: string;
  generationMode: 'Deterministic Template' | 'Demo Provider';
}

export interface Question {
  id: string;
  field: keyof Profile;
  label: string;
  hint: string;
  options?: { label: string; value: unknown; description?: string }[];
  type: 'select' | 'boolean' | 'number' | 'radio';
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  reason: string;
  relevantWhen: string;
}

export interface AssessmentState {
  step: Step;
  profile: Profile;
  answers: Record<string, unknown>;
  candidates: CandidateScheme[];
  eligibility: EligibilityResult | null;
  conflicts: ConflictResult | null;
  bundle: BundleResult | null;
  availableDocuments: string[];
  readiness: ReadinessResult | null;
  dependencies: Dependency[];
  roadmap: RoadmapStep[];
  demoMode: boolean;
  activeDemoId?: string;
}
