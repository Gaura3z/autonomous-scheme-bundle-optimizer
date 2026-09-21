/**
 * Autonomous Scheme-Bundle Optimizer for Citizens
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 * Main Application Orchestrator & State Machine
 */
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AssessmentStage, CitizenProfile, DemoCitizenProfile } from './types';
import { DEMO_PROFILES } from './data/demoProfiles';
import { evaluateAllSchemes, getCandidateSchemes } from './engine/eligibility';
import { detectSchemeConflicts } from './engine/conflicts';
import { optimizeSchemeBundle } from './engine/optimizer';
import { evaluateDocumentReadiness, buildDocumentDependencyGraph } from './engine/documents';
import { generateApplicationRoadmap } from './engine/roadmap';
import { MASTER_SCHEMES } from './data/schemes';
import { BackendAuditResponse, verifyWithBackend } from './services/backendApi';

// Layout Components
import { Navbar } from './components/layout/Navbar';
import { DemoBanner } from './components/layout/DemoBanner';
import { Footer } from './components/layout/Footer';
import { ProgressBar } from './components/layout/ProgressBar';
import { HowItWorksModal } from './components/layout/HowItWorksModal';
import { DemoProfileModal } from './components/layout/DemoProfileModal';
import { ArchitectureModal } from './components/layout/ArchitectureModal';
import { SystematicTestPlanModal } from './components/common/SystematicTestPlanModal';

// Stage Components
import { LandingPage } from './components/stages/LandingPage';
import { ProfileForm } from './components/stages/ProfileForm';
import { InitialMatching } from './components/stages/InitialMatching';
import { AdaptiveQuestionnaire } from './components/stages/AdaptiveQuestionnaire';
import { ProcessingState } from './components/stages/ProcessingState';
import { EligibilityResults } from './components/stages/EligibilityResults';
import { ConflictDetection } from './components/stages/ConflictDetection';
import { OptimizedBundleView } from './components/stages/OptimizedBundle';
import { DocumentChecklist } from './components/stages/DocumentChecklist';
import { DocumentReadinessView } from './components/stages/DocumentReadiness';
import { DocumentDependencies } from './components/stages/DocumentDependencies';
import { ApplicationRoadmap } from './components/stages/ApplicationRoadmap';
import { RecommendationSummary } from './components/stages/RecommendationSummary';
import { AdminPortal } from './components/admin/AdminPortal';
import { IssueResolverModal } from './components/common/IssueResolverModal';
import { HelpCircle } from 'lucide-react';

const DEFAULT_PROFILE: CitizenProfile = {
  age: 22,
  gender: 'Female',
  state: 'MH',
  areaType: 'Urban',
  socialCategory: 'OBC',
  maritalStatus: 'Single',
  isStudent: true,
  educationLevel: 'Undergraduate',
  employmentStatus: 'Student',
  occupation: 'Computer Science Undergraduate',
  annualFamilyIncome: 180000,
  hasRationCard: true,
  hasBPLCard: false,
  hasDisability: false,
  isFarmer: false,
  landholdingHectares: 0,
  isRainfedLand: false,
  isWomanEntrepreneur: false,
  hasStreetVendingActivity: false,
  pursuingApprenticeship: false,
  hasGirlChildUnder10: false,
  enrolledInHigherEducation: true,
};

const DRAFT_STORAGE_KEY = 'ps16-citizen-assessment-draft-v1';
type SavedAssessmentDraft = { profile: CitizenProfile; declaredDocumentIds: string[]; stage: AssessmentStage; savedAt: string };
const readSavedDraft = (): SavedAssessmentDraft | null => {
  try { const raw = localStorage.getItem(DRAFT_STORAGE_KEY); return raw ? JSON.parse(raw) as SavedAssessmentDraft : null; } catch { return null; }
};

export default function App() {
  const [stage, setStage] = useState<AssessmentStage>('LANDING');
  const [activeDemoId, setActiveDemoId] = useState<string | null>(null);
  const [profile, setProfile] = useState<CitizenProfile>(() => readSavedDraft()?.profile ?? DEFAULT_PROFILE);
  const [declaredDocumentIds, setDeclaredDocumentIds] = useState<string[]>(() => readSavedDraft()?.declaredDocumentIds ?? ['aadhaar', 'ration_card', 'bank_passbook']);
  const [resumeStage, setResumeStage] = useState<AssessmentStage>(() => readSavedDraft()?.stage ?? 'PROFILE');
  const [hasSavedDraft, setHasSavedDraft] = useState(() => Boolean(readSavedDraft()));

  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isDemoSelectorOpen, setIsDemoSelectorOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isTestPlanOpen, setIsTestPlanOpen] = useState(false);
  const [isIssueResolverOpen, setIsIssueResolverOpen] = useState(false);
  const [issueResolverCategory, setIssueResolverCategory] = useState<string>('all');

  const handleOpenIssueResolver = (category?: string) => {
    setIssueResolverCategory(category || 'all');
    setIsIssueResolverOpen(true);
  };

  // Global listener to trigger architecture, test plan, and issue resolver modals from anywhere
  useEffect(() => {
    const archHandler = () => setIsArchitectureOpen(true);
    const testPlanHandler = () => setIsTestPlanOpen(true);
    const issueResolverHandler = (e: Event) => {
      const customEvent = e as CustomEvent<{ category?: string }>;
      handleOpenIssueResolver(customEvent.detail?.category);
    };

    window.addEventListener('open-architecture-modal', archHandler);
    window.addEventListener('open-test-plan-modal', testPlanHandler);
    window.addEventListener('open-issue-resolver', issueResolverHandler);
    return () => {
      window.removeEventListener('open-architecture-modal', archHandler);
      window.removeEventListener('open-test-plan-modal', testPlanHandler);
      window.removeEventListener('open-issue-resolver', issueResolverHandler);
    };
  }, []);

  // Smooth scroll to top whenever the stage changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [stage]);

  useEffect(() => {
    if (stage !== 'LANDING') {
      try {
        const draft: SavedAssessmentDraft = { profile, declaredDocumentIds, stage, savedAt: new Date().toISOString() };
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
        setResumeStage(stage);
        setHasSavedDraft(true);
      } catch {
        // Storage may be restricted in sandboxed iframes
      }
    }
  }, [profile, declaredDocumentIds, stage]);

  const normalizedStage = String(stage).toUpperCase();

  const isAdminPortal = typeof window !== 'undefined' && (window.location.pathname === '/admin' || new URLSearchParams(window.location.search).get('admin') === '1');
  if (isAdminPortal) {
    return <AdminPortal onExit={() => { window.location.href = '/'; }} />;
  }

  // Profile update handler
  const handleUpdateProfile = (partial: Partial<CitizenProfile>) => {
    setProfile((prev) => ({ ...prev, ...partial }));
  };

  // Demo Profile loader
  const handleSelectDemoProfile = (demo: DemoCitizenProfile) => {
    setActiveDemoId(demo.id);
    setProfile(demo.profile);
    setDeclaredDocumentIds(demo.initialDeclaredDocuments);
    setStage('CANDIDATE_MATCH');
  };

  // Reset entire assessment
  const handleReset = () => {
    setActiveDemoId(null);
    setProfile(DEFAULT_PROFILE);
    setDeclaredDocumentIds(['aadhaar', 'ration_card', 'bank_passbook']);
    setStage('LANDING');
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // Storage may be restricted in sandboxed iframes
    }
    setHasSavedDraft(false);
  };

  const handleContinueDraft = () => setStage(resumeStage === 'LANDING' ? 'PROFILE' : resumeStage);

  // ==========================================
  // DETERMINISTIC ENGINES PIPELINE
  // ==========================================

  // 1. Candidate scheme matching for early stage
  const candidateSchemes = useMemo(() => {
    return getCandidateSchemes(profile);
  }, [profile]);

  // 2. Full deterministic eligibility evaluations
  const evaluations = useMemo(() => {
    return evaluateAllSchemes(profile);
  }, [profile]);

  // 3. Eligible schemes extracted for conflict analysis
  const eligibleSchemes = useMemo(() => {
    return evaluations
      .filter((ev) => ev.status === 'ELIGIBLE' || ev.status === 'POSSIBLY_ELIGIBLE')
      .map((ev) => ev.scheme);
  }, [evaluations]);

  // 4. Scheme conflict detection
  const conflicts = useMemo(() => {
    return detectSchemeConflicts(eligibleSchemes);
  }, [eligibleSchemes]);

  // 5. PuLP/CBC Mathematical Optimizer Bundle
  const bundle = useMemo(() => {
    const readinessBeforeOptimization = evaluateDocumentReadiness(eligibleSchemes, declaredDocumentIds);
    return optimizeSchemeBundle(eligibleSchemes, declaredDocumentIds, readinessBeforeOptimization.readySchemes.map((scheme) => scheme.id));
  }, [eligibleSchemes, declaredDocumentIds]);

  // The backend is authoritative when its selected IDs can be represented by
  // the local catalog; otherwise the local result remains a safe fallback and
  // the audit card exposes the catalog mismatch.
  const [backendDecision, setBackendDecision] = useState<BackendAuditResponse | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    verifyWithBackend(profile, declaredDocumentIds, controller.signal)
      .then(setBackendDecision)
      .catch((error: unknown) => { if ((error as Error)?.name !== 'AbortError') setBackendDecision(null); });
    return () => controller.abort();
  }, [profile, declaredDocumentIds]);

  const authoritativeBundle = useMemo(() => {
    if (!backendDecision) return bundle;
    const selectedIds = backendDecision.bundle.selected_scheme_ids;
    const potentialIds = backendDecision.bundle.potential_selected_scheme_ids;
    const selectedSchemes = selectedIds.map((id) => MASTER_SCHEMES.find((scheme) => scheme.id === id)).filter(Boolean);
    const potentialSelectedSchemes = potentialIds.map((id) => MASTER_SCHEMES.find((scheme) => scheme.id === id)).filter(Boolean);
    if (selectedSchemes.length !== selectedIds.length || potentialSelectedSchemes.length !== potentialIds.length) return bundle;
    const selected = selectedSchemes as typeof bundle.selectedSchemes;
    const potential = potentialSelectedSchemes as typeof bundle.selectedSchemes;
    const total = selected.reduce((sum, scheme) => sum + scheme.benefit.monetaryValueAnnualPaise / 100, 0);
    return {
      ...bundle,
      selectedSchemes: selected,
      potentialSelectedSchemes: potential,
      totalMonetaryAnnual: total,
      potentialTotalMonetaryAnnual: potential.reduce((sum, scheme) => sum + scheme.benefit.monetaryValueAnnualPaise / 100, 0),
      documentBlockedSchemes: potential.filter((scheme) => !selected.some((ready) => ready.id === scheme.id)).map((scheme) => ({
        scheme,
        missingDocumentIds: scheme.requiredDocumentIds.filter((id) => !declaredDocumentIds.includes(id))
      })),
      optimalityMetric: `Backend-authoritative PuLP/CBC selection from catalog ${backendDecision.audit.catalog_version}.`
    };
  }, [backendDecision, bundle, declaredDocumentIds]);

  // 6. Document readiness categorization (Ready vs Missing)
  const readiness = useMemo(() => {
    return evaluateDocumentReadiness(authoritativeBundle.potentialSelectedSchemes ?? authoritativeBundle.selectedSchemes, declaredDocumentIds);
  }, [authoritativeBundle, declaredDocumentIds]);

  // 7. Document dependency graph
  const documentDependencyNodes = useMemo(() => {
    return buildDocumentDependencyGraph(authoritativeBundle.potentialSelectedSchemes ?? authoritativeBundle.selectedSchemes, declaredDocumentIds);
  }, [authoritativeBundle, declaredDocumentIds]);

  // 8. Actionable Application Roadmap
  const roadmapSteps = useMemo(() => {
    return generateApplicationRoadmap(readiness, authoritativeBundle.potentialSelectedSchemes ?? authoritativeBundle.selectedSchemes);
  }, [readiness, authoritativeBundle]);

  // Document checklist toggling
  const handleToggleDocument = (docId: string) => {
    setDeclaredDocumentIds((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  const handleSelectAllDocuments = () => {
    const allRequired = Array.from(
      new Set(eligibleSchemes.flatMap((s) => s.requiredDocumentIds))
    );
    setDeclaredDocumentIds(allRequired);
  };

  const handleClearAllDocuments = () => {
    setDeclaredDocumentIds([]);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
      {/* Universal Civic Navbar */}
      <Navbar
        currentStage={stage}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenDemoSelector={() => setIsDemoSelectorOpen(true)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onOpenTestPlan={() => setIsTestPlanOpen(true)}
        onReset={handleReset}
        onGoHome={() => setStage('LANDING')}
        onOpenIssueResolver={handleOpenIssueResolver}
      />

      {/* Demo Persona & Judge Evaluation Controller (Active in Demo Mode) */}
      <DemoBanner
        activeDemoId={activeDemoId}
        onSelectProfile={handleSelectDemoProfile}
        onExitDemo={() => setActiveDemoId(null)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
      />

      {/* Responsive Progress Stepper (hidden on landing and print) */}
      <div className="print:hidden">
        <ProgressBar currentStage={stage} onNavigateStage={setStage} />
      </div>

      {/* Main Content Area with Page-to-Page Transitions */}
      <main className="printable-root flex-1 w-full pb-16 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={normalizedStage}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            {normalizedStage === 'LANDING' && (
              <LandingPage
                profile={profile}
                onChangeProfile={handleUpdateProfile}
                onStartAssessment={() => setStage('PROFILE')}
                hasSavedDraft={hasSavedDraft}
                onContinueDraft={handleContinueDraft}
                onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
                onOpenDemoSelector={() => setIsDemoSelectorOpen(true)}
                onOpenArchitecture={() => setIsArchitectureOpen(true)}
                onSelectDemoProfile={handleSelectDemoProfile}
              />
            )}

            {normalizedStage === 'PROFILE' && (
              <ProfileForm
                profile={profile}
                onChangeProfile={handleUpdateProfile}
                onSubmit={() => setStage('CANDIDATE_MATCH')}
                onOpenDemoSelector={() => setIsDemoSelectorOpen(true)}
              />
            )}

            {normalizedStage === 'CANDIDATE_MATCH' && (
              <InitialMatching
                candidates={candidateSchemes}
                profile={profile}
                onContinue={() => setStage('QUESTIONNAIRE')}
                onBackToProfile={() => setStage('PROFILE')}
              />
            )}

            {normalizedStage === 'QUESTIONNAIRE' && (
              <AdaptiveQuestionnaire
                profile={profile}
                candidateSchemes={candidateSchemes}
                onChangeProfile={handleUpdateProfile}
                onComplete={() => setStage('DOCUMENT_CHECKLIST')}
                onBack={() => setStage('CANDIDATE_MATCH')}
              />
            )}

            {normalizedStage === 'PROCESSING' && (
              <ProcessingState
                onComplete={() => setStage('ELIGIBILITY_RESULTS')}
              />
            )}

            {normalizedStage === 'ELIGIBILITY_RESULTS' && (
              <EligibilityResults
                evaluations={evaluations}
                conflictsCount={conflicts.length}
                onProceedToConflicts={() => setStage('CONFLICT_DETECTION')}
                onBackToQuestions={() => setStage('QUESTIONNAIRE')}
              />
            )}

            {normalizedStage === 'DOCUMENT_CHECKLIST' && (
              <DocumentChecklist
                bundleSchemes={eligibleSchemes}
                declaredDocumentIds={declaredDocumentIds}
                onToggleDocument={handleToggleDocument}
                onSelectAll={handleSelectAllDocuments}
                onClearAll={handleClearAllDocuments}
                onProceedToReadiness={() => setStage('PROCESSING')}
                onBackToBundle={() => setStage('QUESTIONNAIRE')}
                onOpenIssueResolver={handleOpenIssueResolver}
              />
            )}

            {normalizedStage === 'CONFLICT_DETECTION' && (
              <ConflictDetection
                conflicts={conflicts}
                onProceedToBundle={() => setStage('OPTIMIZED_BUNDLE')}
                onBackToResults={() => setStage('DOCUMENT_CHECKLIST')}
              />
            )}

            {normalizedStage === 'OPTIMIZED_BUNDLE' && (
              <OptimizedBundleView
                bundle={authoritativeBundle}
                profile={profile}
                onProceedToDocuments={() => setStage('DOCUMENT_READINESS')}
                onBackToConflicts={() => setStage('CONFLICT_DETECTION')}
              />
            )}

            {normalizedStage === 'DOCUMENT_READINESS' && (
              <DocumentReadinessView
                readiness={readiness}
                onProceedToDependencies={() => setStage('DOCUMENT_DEPENDENCIES')}
                onBackToChecklist={() => setStage('DOCUMENT_CHECKLIST')}
              />
            )}

            {normalizedStage === 'DOCUMENT_DEPENDENCIES' && (
              <DocumentDependencies
                nodes={documentDependencyNodes}
                onProceedToRoadmap={() => setStage('APPLICATION_ROADMAP')}
                onBackToReadiness={() => setStage('DOCUMENT_READINESS')}
              />
            )}

            {normalizedStage === 'APPLICATION_ROADMAP' && (
              <ApplicationRoadmap
                steps={roadmapSteps}
                profile={profile}
                bundle={authoritativeBundle}
                onProceedToSummary={() => setStage('RECOMMENDATION_SUMMARY')}
                onBackToDependencies={() => setStage('DOCUMENT_DEPENDENCIES')}
              />
            )}

            {normalizedStage === 'RECOMMENDATION_SUMMARY' && (
              <RecommendationSummary
                profile={profile}
                bundle={authoritativeBundle}
                evaluations={evaluations}
                roadmapSteps={roadmapSteps}
                declaredDocumentIds={declaredDocumentIds}
                onRestart={handleReset}
                onOpenDemoSelector={() => setIsDemoSelectorOpen(true)}
                onBackToRoadmap={() => setStage('APPLICATION_ROADMAP')}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Modals */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />

      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      <DemoProfileModal
        isOpen={isDemoSelectorOpen}
        onClose={() => setIsDemoSelectorOpen(false)}
        onSelectProfile={handleSelectDemoProfile}
      />

      <SystematicTestPlanModal
        isOpen={isTestPlanOpen}
        onClose={() => setIsTestPlanOpen(false)}
      />

      {/* Civic GIGW Footer */}
      <Footer
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenDemoSelector={() => setIsDemoSelectorOpen(true)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onOpenIssueResolver={handleOpenIssueResolver}
      />

      {/* Floating Quick Action: Solve an Issue / Grievance Desk */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 print:hidden">
        <button
          onClick={() => handleOpenIssueResolver('all')}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs rounded-full shadow-lg shadow-amber-500/30 border border-amber-300 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          aria-label="Solve an Issue / Citizen Grievance Desk"
          title="Resolve document issues, name mismatches, bank DBT problems, or portal rejections"
        >
          <HelpCircle className="w-4 h-4 text-slate-950 group-hover:rotate-12 transition-transform" />
          <span className="tracking-tight">Solve an Issue</span>
        </button>
      </div>

      {/* Citizen Grievance & Issue Solver Modal */}
      <IssueResolverModal
        isOpen={isIssueResolverOpen}
        onClose={() => setIsIssueResolverOpen(false)}
        initialCategory={issueResolverCategory}
        onResetSession={handleReset}
      />
    </div>
  );
}
