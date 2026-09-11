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

// Layout Components
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProgressBar } from './components/layout/ProgressBar';
import { HowItWorksModal } from './components/layout/HowItWorksModal';
import { DemoProfileModal } from './components/layout/DemoProfileModal';

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

export default function App() {
  const [stage, setStage] = useState<AssessmentStage>('LANDING');
  const [profile, setProfile] = useState<CitizenProfile>(DEFAULT_PROFILE);
  const [declaredDocumentIds, setDeclaredDocumentIds] = useState<string[]>([
    'doc_aadhaar',
    'doc_ration_card',
    'doc_bank_passbook'
  ]);

  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isDemoSelectorOpen, setIsDemoSelectorOpen] = useState(false);

  // Smooth scroll to top whenever the stage changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [stage]);

  const normalizedStage = String(stage).toUpperCase();

  // Profile update handler
  const handleUpdateProfile = (partial: Partial<CitizenProfile>) => {
    setProfile((prev) => ({ ...prev, ...partial }));
  };

  // Demo Profile loader
  const handleSelectDemoProfile = (demo: DemoCitizenProfile) => {
    setProfile(demo.profile);
    setDeclaredDocumentIds(demo.initialDeclaredDocuments);
    setStage('CANDIDATE_MATCH');
  };

  // Reset entire assessment
  const handleReset = () => {
    setProfile(DEFAULT_PROFILE);
    setDeclaredDocumentIds(['doc_aadhaar', 'doc_ration_card', 'doc_bank_passbook']);
    setStage('LANDING');
  };

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
    return optimizeSchemeBundle(eligibleSchemes);
  }, [eligibleSchemes]);

  // 6. Document readiness categorization (Ready vs Missing)
  const readiness = useMemo(() => {
    return evaluateDocumentReadiness(bundle.selectedSchemes, declaredDocumentIds);
  }, [bundle.selectedSchemes, declaredDocumentIds]);

  // 7. Document dependency graph
  const documentDependencyNodes = useMemo(() => {
    return buildDocumentDependencyGraph(bundle.selectedSchemes, declaredDocumentIds);
  }, [bundle.selectedSchemes, declaredDocumentIds]);

  // 8. Actionable Application Roadmap
  const roadmapSteps = useMemo(() => {
    return generateApplicationRoadmap(readiness, bundle.selectedSchemes);
  }, [readiness, bundle.selectedSchemes]);

  // Document checklist toggling
  const handleToggleDocument = (docId: string) => {
    setDeclaredDocumentIds((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  const handleSelectAllDocuments = () => {
    const allRequired = Array.from(
      new Set(bundle.selectedSchemes.flatMap((s) => s.requiredDocumentIds))
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
        onOpenHowItWorks={() => setIsHowItWorksOpen(false || true)}
        onOpenDemoSelector={() => setIsDemoSelectorOpen(true)}
        onReset={handleReset}
        onGoHome={() => setStage('LANDING')}
      />

      {/* Responsive Progress Stepper (hidden on landing and print) */}
      <div className="print:hidden">
        <ProgressBar currentStage={stage} onNavigateStage={setStage} />
      </div>

      {/* Main Content Area with Page-to-Page Transitions */}
      <main className="flex-1 w-full pb-16 overflow-x-hidden">
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
                onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
                onOpenDemoSelector={() => setIsDemoSelectorOpen(true)}
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
                onChangeProfile={handleUpdateProfile}
                onComplete={() => setStage('PROCESSING')}
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

            {normalizedStage === 'CONFLICT_DETECTION' && (
              <ConflictDetection
                conflicts={conflicts}
                onProceedToBundle={() => setStage('OPTIMIZED_BUNDLE')}
                onBackToResults={() => setStage('ELIGIBILITY_RESULTS')}
              />
            )}

            {normalizedStage === 'OPTIMIZED_BUNDLE' && (
              <OptimizedBundleView
                bundle={bundle}
                onProceedToDocuments={() => setStage('DOCUMENT_CHECKLIST')}
                onBackToConflicts={() => setStage('CONFLICT_DETECTION')}
              />
            )}

            {normalizedStage === 'DOCUMENT_CHECKLIST' && (
              <DocumentChecklist
                bundleSchemes={bundle.selectedSchemes}
                declaredDocumentIds={declaredDocumentIds}
                onToggleDocument={handleToggleDocument}
                onSelectAll={handleSelectAllDocuments}
                onClearAll={handleClearAllDocuments}
                onProceedToReadiness={() => setStage('DOCUMENT_READINESS')}
                onBackToBundle={() => setStage('OPTIMIZED_BUNDLE')}
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
                onProceedToSummary={() => setStage('RECOMMENDATION_SUMMARY')}
                onBackToDependencies={() => setStage('DOCUMENT_DEPENDENCIES')}
              />
            )}

            {normalizedStage === 'RECOMMENDATION_SUMMARY' && (
              <RecommendationSummary
                profile={profile}
                bundle={bundle}
                evaluations={evaluations}
                roadmapSteps={roadmapSteps}
                onRestart={handleReset}
                onOpenDemoSelector={() => setIsDemoSelectorOpen(true)}
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

      <DemoProfileModal
        isOpen={isDemoSelectorOpen}
        onClose={() => setIsDemoSelectorOpen(false)}
        onSelectProfile={handleSelectDemoProfile}
      />

      {/* Civic GIGW Footer */}
      <Footer
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenDemoSelector={() => setIsDemoSelectorOpen(true)}
      />
    </div>
  );
}
