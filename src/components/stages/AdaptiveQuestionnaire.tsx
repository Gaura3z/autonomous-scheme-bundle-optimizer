/**
 * Page 4: Adaptive Questionnaire
 * Asks only the necessary questions needed by unresolved candidate schemes.
 * Provides clear human-centered justification for every question.
 * Enhanced with Dynamic Question Filtering (excluding UPSC/PhD for non-postgrads/aspirants),
 * Statutory Disclaimer Banner, and Refined Focus Controls.
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 */
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  HelpCircle, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Check, 
  CheckCircle2, 
  Info,
  ShieldCheck,
  SlidersHorizontal,
  Filter,
  AlertTriangle,
  X,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Award,
  BookOpen,
  Zap,
  Volume2,
  FileCheck2,
  RotateCcw,
  FlaskConical
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CitizenProfile, AdaptiveQuestion, Scheme } from '../../types';
import { planAdaptiveQuestions, getQuestionRefinementStats } from '../../engine/questions';
import { VoiceGuideBanner } from '../common/VoiceGuideBanner';
import { MobileStickyFooter } from '../common/MobileStickyFooter';

interface AdaptiveQuestionnaireProps {
  profile: CitizenProfile;
  onChangeProfile: (updated: Partial<CitizenProfile>) => void;
  onComplete: () => void;
  onBack: () => void;
  candidateSchemes?: Scheme[];
}

export const AdaptiveQuestionnaire: React.FC<AdaptiveQuestionnaireProps> = ({
  profile,
  onChangeProfile,
  onComplete,
  onBack,
  candidateSchemes = []
}) => {
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<string[]>([]);
  const [isDisclaimerExpanded, setIsDisclaimerExpanded] = useState(false);
  const [isDisclaimerDismissed, setIsDisclaimerDismissed] = useState(false);
  const [isRefinePanelOpen, setIsRefinePanelOpen] = useState(false);
  const [showMarathiSubtitle, setShowMarathiSubtitle] = useState(true);

  // Dynamic Refinement Stats
  const refinementStats = useMemo(() => {
    return getQuestionRefinementStats(profile);
  }, [profile]);

  // Re-plan after every answer. The next question is selected from the
  // current candidate set, not from a fixed questionnaire length.
  const relevantQuestions = useMemo(() => {
    return planAdaptiveQuestions(profile, candidateSchemes, answeredQuestionIds);
  }, [profile, candidateSchemes, answeredQuestionIds]);

  const hasCalledComplete = useRef(false);

  useEffect(() => {
    if (relevantQuestions.length === 0 && !hasCalledComplete.current) {
      hasCalledComplete.current = true;
      const timer = setTimeout(() => {
        onComplete();
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [relevantQuestions.length, onComplete]);

  if (relevantQuestions.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 flex items-center justify-center mx-auto mb-4 animate-pulse">
          <FileCheck2 className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Eligibility Questions Verified</h3>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          Dynamic filtering confirmed all prerequisites. Transitioning to document checklist...
        </p>
      </div>
    );
  }

  const currentQ = relevantQuestions[0];
  const isLastQuestion = relevantQuestions.length === 1;
  const currentAnswer = profile[currentQ.field];

  const handleSelectBoolean = (val: boolean) => {
    onChangeProfile({ [currentQ.field]: val });
  };

  const handleNext = () => {
    setAnsweredQuestionIds((previous) => previous.includes(currentQ.id) ? previous : [...previous, currentQ.id]);
    if (isLastQuestion) {
      onComplete();
    }
  };

  const handleSkipQuestion = () => {
    // Record current question field as false / not applicable and advance
    onChangeProfile({ [currentQ.field]: false });
    setAnsweredQuestionIds((previous) => previous.includes(currentQ.id) ? previous : [...previous, currentQ.id]);
    if (isLastQuestion) {
      onComplete();
    }
  };

  const handlePrevious = () => {
    onBack();
  };

  // Quick switch of academic focus for dynamic filtering
  const handleSetAcademicFocus = (focus: 'Degree/College' | 'Aspirant' | 'Doctoral') => {
    if (focus === 'Aspirant') {
      onChangeProfile({ 
        academicFocus: 'Aspirant', 
        isAspirant: true 
      });
    } else if (focus === 'Doctoral') {
      onChangeProfile({ 
        academicFocus: 'Doctoral', 
        educationLevel: 'Postgraduate',
        isAspirant: false 
      });
    } else {
      onChangeProfile({ 
        academicFocus: 'Degree/College', 
        isAspirant: false,
        isEnrolledInPhd: false,
        isPreparingForUpscOrMpsc: false,
        hasClearedUpscOrMpscStage: false
      });
    }
  };

  // Fast-track auto-skip: set all remaining unresolved fields to false and complete immediately
  const handleFastTrackComplete = () => {
    const updates: Record<string, unknown> = {};
    relevantQuestions.forEach((q) => {
      updates[q.field] = false;
    });
    onChangeProfile(updates as Partial<CitizenProfile>);
    onComplete();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10 pb-24 sm:pb-12">
      {/* Voice Guide Banner */}
      <VoiceGuideBanner
        stepNumber={2}
        totalSteps={6}
        title="Eligibility Verification Questions"
        guidanceText="Answer these quick targeted questions regarding CAP admission, attendance, and merit marks to confirm your 100% fee waiver and state scholarships under Government of Maharashtra resolutions."
        marathiText="कॅप प्रवेश, उपस्थिती आणि गुणांबद्दलच्या या प्रश्नांची उत्तरे द्या जेणेकरून १००% फी माफी आणि शिष्यवृत्ती निश्चित करता येईल."
        showScrollHint={false}
      />

      {/* FEATURE 1: STATUTORY DISCLAIMER BANNER (From User Image) */}
      {!isDisclaimerDismissed ? (
        <div className="mb-6 bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 shadow-xs text-slate-800 transition-all">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 bg-amber-100/90 rounded-lg text-amber-800 shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                    Statutory Government Advisory
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-200/60 text-amber-900">
                    Deterministic Simulation
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-200/70 text-slate-700">
                    AY 2026–27 Window
                  </span>
                </div>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                  SchemeWise provides deterministic policy-grade eligibility matching based on published Maharashtra Government Resolutions (GRs) and Central Portal rules. It does not replace statutory sanction by the District Social Welfare Office or Tahsildar. Final benefit release is subject to document scrutiny upon submission on MahaDBT or NSP.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setIsDisclaimerExpanded(!isDisclaimerExpanded)}
                className="p-1 text-slate-500 hover:text-slate-800 text-xs flex items-center gap-1 font-semibold rounded hover:bg-amber-100/60 transition-colors cursor-pointer"
                title="View Legal References"
              >
                <span>{isDisclaimerExpanded ? 'Hide GRs' : 'View GRs'}</span>
                {isDisclaimerExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => setIsDisclaimerDismissed(true)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-amber-100/60 transition-colors cursor-pointer"
                aria-label="Dismiss disclaimer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Collapsible Legal Citations */}
          {isDisclaimerExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 pt-3 border-t border-amber-200/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700"
            >
              <div className="bg-white/70 p-2.5 rounded-xl border border-amber-200/60">
                <strong className="text-amber-950 block mb-0.5 font-bold">Higher & Tech. Education GR:</strong>
                <span>TEM-2024/CR-104/TE-4 (100% Female Tuition & Exam Fee Waiver in CAP admissions).</span>
              </div>
              <div className="bg-white/70 p-2.5 rounded-xl border border-amber-200/60">
                <strong className="text-amber-950 block mb-0.5 font-bold">Social Justice & Assistance:</strong>
                <span>MahaDBT Post-Matric Freeship & Dr. B.R. Ambedkar Swadhar Scheme guidelines (2018–2026).</span>
              </div>
              <div className="bg-white/70 p-2.5 rounded-xl border border-amber-200/60">
                <strong className="text-amber-950 block mb-0.5 font-bold">Tribal Development Dept:</strong>
                <span>Pandit Deendayal Upadhyay Swayam Yojana for tribal hostel boarders.</span>
              </div>
              <div className="bg-white/70 p-2.5 rounded-xl border border-amber-200/60">
                <strong className="text-amber-950 block mb-0.5 font-bold">AICTE & Central NSP:</strong>
                <span>AICTE Pragati, Swanath & Central Sector Scholarship (CSSS) statutory criteria.</span>
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="mb-4 flex items-center justify-between text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60">
          <span className="flex items-center gap-1 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Statutory GR Advisory active (MahaDBT & NSP criteria)</span>
          </span>
          <button
            type="button"
            onClick={() => setIsDisclaimerDismissed(false)}
            className="text-blue-700 hover:underline font-medium text-[11px] cursor-pointer"
          >
            Show Full Disclaimer
          </button>
        </div>
      )}

      {/* FEATURE 2: REFINE ADAPTIVE QUESTIONS & DYNAMIC FILTERING CONTROLS (From User Image) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-700" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Dynamic Question Filtering Active
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                Accuracy Guardrail
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Targeted focus prevents irrelevant questions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsRefinePanelOpen(!isRefinePanelOpen)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isRefinePanelOpen 
                  ? 'bg-blue-900 text-white shadow-xs' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Refine Questions</span>
              {isRefinePanelOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Dynamic Exclusion Status Bar */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
          <span className="text-slate-500 font-medium">Excluded by filter:</span>
          {refinementStats.phdFilteredOut && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/60 font-semibold">
              <Check className="w-3 h-3 text-emerald-600" />
              Ph.D. / Doctoral Questions Filtered Out
            </span>
          )}
          {refinementStats.upscFilteredOut && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/60 font-semibold">
              <Check className="w-3 h-3 text-emerald-600" />
              UPSC / MPSC Civil Services Filtered Out
            </span>
          )}
          {!refinementStats.phdFilteredOut && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200/60 font-semibold">
              <BookOpen className="w-3 h-3 text-indigo-600" />
              Ph.D. Fellowships Active
            </span>
          )}
          {!refinementStats.upscFilteredOut && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200/60 font-semibold">
              <Award className="w-3 h-3 text-amber-600" />
              Civil Services Aspirant Active
            </span>
          )}
        </div>

        {/* Expandable Refinement Panel */}
        {isRefinePanelOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-slate-100 space-y-3.5"
          >
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-2">
                Select Your Academic Focus / Goal:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleSetAcademicFocus('Degree/College')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    !profile.isAspirant && profile.educationLevel !== 'Postgraduate' && profile.academicFocus !== 'Doctoral'
                      ? 'border-blue-700 bg-blue-50/70 text-blue-900 shadow-xs font-bold'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs">
                    <GraduationCap className="w-4 h-4 text-blue-700 shrink-0" />
                    <span>Degree & Diploma</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Excludes Ph.D. and UPSC questions. Best for 10th, 12th, Engineering & College students.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleSetAcademicFocus('Aspirant')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    profile.isAspirant || profile.academicFocus === 'Aspirant'
                      ? 'border-blue-700 bg-blue-50/70 text-blue-900 shadow-xs font-bold'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs">
                    <Award className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Civil Services Aspirant</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Enables BARTI, SARTHI, and Mahajyoti UPSC/MPSC coaching stipends & stage cash awards.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleSetAcademicFocus('Doctoral')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    profile.academicFocus === 'Doctoral' || (profile.educationLevel === 'Postgraduate' && !profile.isAspirant)
                      ? 'border-blue-700 bg-blue-50/70 text-blue-900 shadow-xs font-bold'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs">
                    <BookOpen className="w-4 h-4 text-indigo-700 shrink-0" />
                    <span>Doctoral / Ph.D. Scholar</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Enables Prime Minister Research Fellowship (PMRF) and state BANRF / CSRF fellowships.
                  </p>
                </button>
              </div>
            </div>

            {/* Fast Track Option & Systematic Verification */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 gap-3">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Fast-Track Mode</span>
                <span className="text-[11px] text-slate-500">Skip remaining optional allowances and generate standard fee reimbursement bundle instantly.</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('open-test-plan-modal'))}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Run automated test plan to verify UPSC/PhD question isolation"
                >
                  <FlaskConical className="w-3.5 h-3.5 text-blue-700" />
                  <span>Run Engine Test Plan</span>
                </button>
                <button
                  type="button"
                  onClick={handleFastTrackComplete}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Fast-Track Complete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Questionnaire Header & Progress */}
      <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-bold text-blue-900 uppercase tracking-wider">
            Verification Question · {relevantQuestions.length} remaining
          </span>
          <span className="bg-slate-100 px-2 py-0.5 rounded-md text-[11px] font-semibold text-slate-700">
            {answeredQuestionIds.length + 1} of {answeredQuestionIds.length + relevantQuestions.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowMarathiSubtitle(!showMarathiSubtitle)}
            className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 underline cursor-pointer"
          >
            {showMarathiSubtitle ? 'Hide Marathi' : 'मराठी दाखवा'}
          </button>
        </div>
      </div>

      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-6">
        <motion.div 
          className="bg-gradient-to-r from-blue-700 to-indigo-600 h-full rounded-full"
          initial={false}
          animate={{ width: `${(answeredQuestionIds.length / Math.max(answeredQuestionIds.length + relevantQuestions.length, 1)) * 100}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>

      {/* Main Question Card with Animated Transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm transition-all"
        >
          {/* Scheme Justification Badge with Impact Highlight */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-900 border border-blue-200/70 mb-4">
            <Zap className="w-3.5 h-3.5 text-blue-700 shrink-0" />
            <span>{currentQ.schemeJustification}</span>
          </div>

          {/* Question Title in English */}
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug mb-2">
            {currentQ.title}
          </h3>

          {/* Bilingual Marathi Title (if available and enabled) */}
          {showMarathiSubtitle && currentQ.titleMr && (
            <p className="text-sm font-semibold text-indigo-900 bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-100 mb-4 leading-relaxed">
              🇮🇳 {currentQ.titleMr}
            </p>
          )}

          {/* Human-Centered Explanation */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
            {currentQ.contextExplanation}
          </p>

          {/* Answer Controls */}
          <div className="mb-6">
            {currentQ.type === 'boolean' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleSelectBoolean(true)}
                  className={`p-4 sm:p-5 rounded-2xl border-2 text-center font-bold text-base transition-all cursor-pointer ${
                    currentAnswer === true
                      ? 'border-blue-700 bg-blue-50/80 text-blue-900 shadow-sm ring-2 ring-blue-100'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {currentAnswer === true && <Check className="w-5 h-5 text-blue-700 shrink-0" />}
                    <span>Yes, I am / Enrolled</span>
                  </div>
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleSelectBoolean(false)}
                  className={`p-4 sm:p-5 rounded-2xl border-2 text-center font-bold text-base transition-all cursor-pointer ${
                    currentAnswer === false
                      ? 'border-blue-700 bg-blue-50/80 text-blue-900 shadow-sm ring-2 ring-blue-100'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {currentAnswer === false && <Check className="w-5 h-5 text-blue-700 shrink-0" />}
                    <span>No, does not apply</span>
                  </div>
                </motion.button>
              </div>
            )}

            {currentQ.type === 'number' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">Specify amount ({currentQ.unit}):</span>
                  <span className="text-lg font-bold text-blue-900 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                    {Number(currentAnswer) || currentQ.min || 1} {currentQ.unit}
                  </span>
                </div>
                <input
                  type="range"
                  min={currentQ.min || 0}
                  max={currentQ.max || 10}
                  step={currentQ.step || 1}
                  value={Number(currentAnswer) || currentQ.min || 1}
                  onChange={(e) => onChangeProfile({ [currentQ.field]: parseFloat(e.target.value) })}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-700"
                />
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <motion.button
                type="button"
                onClick={handlePrevious}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </motion.button>

              <button
                type="button"
                onClick={handleSkipQuestion}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Skip Question
              </button>
            </div>

            <motion.button
              type="button"
              onClick={handleNext}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm shadow-md shadow-blue-900/20 transition-all cursor-pointer"
            >
              <span>{isLastQuestion ? 'Complete Assessment' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Mobile Sticky Action Footer */}
      <MobileStickyFooter
        currentStep={2}
        totalSteps={6}
        nextStepLabel={isLastQuestion ? 'Complete Verification →' : 'Next Question →'}
        onNext={handleNext}
        onBack={handlePrevious}
        backLabel="Back"
      />
    </div>
  );
};
