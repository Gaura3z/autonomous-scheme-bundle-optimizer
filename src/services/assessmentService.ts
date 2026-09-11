/**
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 * Typed Assessment Service Layer
 * Stable async API interfaces that can be cleanly swapped with FastAPI backend calls.
 */
import {
  Profile,
  CandidateScheme,
  Question,
  EligibilityResult,
  ConflictResult,
  BundleResult,
  DemoDocument,
  ReadinessResult,
  Dependency,
  RoadmapStep,
  ExplanationResult
} from '../types/assessment';
import {
  mockInitialMatching,
  mockNextQuestion,
  mockEligibility,
  mockConflicts,
  mockBundle,
  mockRequiredDocuments,
  mockReadiness,
  mockDependencies,
  mockRoadmap,
  mockExplanation
} from '../engine/demoEngine';

export interface AssessmentSession {
  assessmentId: string;
  kbVersion: string;
  sourceMode: 'Demo Data';
  profile: Profile;
  answers: Record<string, unknown>;
  createdAt: string;
}

// In-memory simulation session
let activeSession: AssessmentSession | null = null;

/**
 * POST /api/assessments
 * Starts an ephemeral assessment session.
 */
export async function startAssessment(profile: Profile): Promise<{
  session: AssessmentSession;
  candidates: CandidateScheme[];
}> {
  activeSession = {
    assessmentId: `demo_sess_${Date.now()}`,
    kbVersion: 'v2026.1-PS16',
    sourceMode: 'Demo Data',
    profile: { ...profile },
    answers: {},
    createdAt: new Date().toISOString()
  };

  const candidates = mockInitialMatching(profile);
  return { session: activeSession, candidates };
}

/**
 * GET /api/assessments/{id}/next-question
 * Retrieves the next relevant question for the current assessment state.
 */
export async function getNextQuestion(
  profile?: Profile,
  answers?: Record<string, unknown>
): Promise<Question | null> {
  const p = profile || activeSession?.profile;
  if (!p) throw new Error('No active assessment profile found.');
  const ans = answers || activeSession?.answers || {};
  return mockNextQuestion(p, ans);
}

/**
 * POST /api/assessments/{id}/answers
 * Submits validated answers and updates assessment state.
 */
export async function submitAnswer(
  field: string,
  value: unknown
): Promise<{
  answers: Record<string, unknown>;
  nextQuestion: Question | null;
}> {
  if (!activeSession) {
    throw new Error('No active assessment session.');
  }
  activeSession.answers[field] = value;
  const nextQ = mockNextQuestion(activeSession.profile, activeSession.answers);
  return { answers: activeSession.answers, nextQuestion: nextQ };
}

/**
 * GET /api/assessments/{id}/eligibility
 * Evaluates deterministic eligibility & statutory exclusions.
 */
export async function getEligibilityResults(
  profile?: Profile,
  answers?: Record<string, unknown>
): Promise<EligibilityResult> {
  const p = profile || activeSession?.profile;
  if (!p) throw new Error('No profile provided.');
  const ans = answers || activeSession?.answers || {};
  return mockEligibility(p, ans);
}

/**
 * GET /api/assessments/{id}/conflicts
 * Identifies statutory mutual exclusion edges across eligible schemes.
 */
export async function getConflicts(
  eligibility: EligibilityResult
): Promise<ConflictResult> {
  const eligibleSchemes = [...eligibility.eligible, ...eligibility.possiblyEligible];
  return mockConflicts(eligibleSchemes);
}

/**
 * POST /api/assessments/{id}/optimize
 * Runs PuLP/CBC lexicographic optimizer to select optimal bundle.
 */
export async function getBundle(
  eligibility: EligibilityResult,
  conflicts: ConflictResult
): Promise<BundleResult> {
  const eligibleSchemes = [...eligibility.eligible, ...eligibility.possiblyEligible];
  return mockBundle(eligibleSchemes, conflicts);
}

/**
 * GET /api/assessments/{id}/required-documents
 * Retrieves unique documents required by the selected bundle.
 */
export async function getRequiredDocuments(
  bundle: BundleResult
): Promise<DemoDocument[]> {
  return mockRequiredDocuments(bundle);
}

/**
 * POST /api/assessments/{id}/documents
 * Submits citizen declared document availability and evaluates readiness.
 */
export async function submitDocumentInventory(
  bundle: BundleResult,
  declaredDocumentIds: string[]
): Promise<ReadinessResult> {
  return mockReadiness(bundle, declaredDocumentIds);
}

/**
 * GET /api/assessments/{id}/dependencies
 * Retrieves prerequisite dependency edges for missing documents.
 */
export async function getDependencies(
  readiness: ReadinessResult
): Promise<Dependency[]> {
  return mockDependencies(readiness);
}

/**
 * GET /api/assessments/{id}/roadmap
 * Generates topological, sequenced application roadmap.
 */
export async function getRoadmap(
  readiness: ReadinessResult,
  dependencies: Dependency[]
): Promise<RoadmapStep[]> {
  return mockRoadmap(readiness, dependencies);
}

/**
 * POST /api/assessments/{id}/explanation
 * Generates natural language explanation conforming to LLM contract.
 */
export async function getExplanation(
  bundle: BundleResult,
  readiness: ReadinessResult
): Promise<ExplanationResult> {
  return mockExplanation(bundle, readiness);
}
