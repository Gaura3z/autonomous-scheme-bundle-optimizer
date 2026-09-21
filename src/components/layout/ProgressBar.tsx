/**
 * Responsive Step Progress Indicator
 * Clean visual breadcrumb showing students where they are in the continuous 6-step assessment flow.
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 */
import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'motion/react';
import { AssessmentStage } from '../../types';

interface ProgressBarProps {
  currentStage: AssessmentStage;
  onNavigateStage?: (stage: AssessmentStage) => void;
}

interface StepMeta {
  key: AssessmentStage;
  label: string;
  stageOrder: number;
}

const STEPS: StepMeta[] = [
  { key: 'PROFILE', label: '1. Profile', stageOrder: 1 },
  { key: 'QUESTIONNAIRE', label: '2. Verification', stageOrder: 2 },
  { key: 'DOCUMENT_CHECKLIST', label: '3. Documents', stageOrder: 3 },
  { key: 'PROCESSING', label: '4. AI Solver', stageOrder: 4 },
  { key: 'OPTIMIZED_BUNDLE', label: '5. Benefit Bundle', stageOrder: 5 },
  { key: 'APPLICATION_ROADMAP', label: '6. Roadmap', stageOrder: 6 },
];

function getStageOrder(stage: AssessmentStage): number {
  switch (stage) {
    case 'landing':
    case 'LANDING':
      return 0;
    case 'profile':
    case 'PROFILE':
      return 1;
    case 'initial_matching':
    case 'CANDIDATE_MATCH':
      return 1.5;
    case 'questionnaire':
    case 'QUESTIONNAIRE':
      return 2;
    case 'documents_checklist':
    case 'DOCUMENT_CHECKLIST':
      return 3;
    case 'processing':
    case 'PROCESSING':
      return 4;
    case 'results':
    case 'ELIGIBILITY_RESULTS':
    case 'conflicts':
    case 'CONFLICT_DETECTION':
    case 'bundle':
    case 'OPTIMIZED_BUNDLE':
      return 5;
    case 'readiness':
    case 'DOCUMENT_READINESS':
    case 'dependencies':
    case 'DOCUMENT_DEPENDENCIES':
    case 'roadmap':
    case 'APPLICATION_ROADMAP':
    case 'explanation':
    case 'RECOMMENDATION_SUMMARY':
      return 6;
    default:
      return 1;
  }
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStage, onNavigateStage }) => {
  const norm = String(currentStage).toLowerCase();
  if (norm === 'landing') {
    return null;
  }

  const currentOrder = getStageOrder(currentStage);
  const roundedOrder = Math.min(6, Math.max(1, Math.round(currentOrder)));
  const progressPercent = Math.min(100, Math.max(0, ((currentOrder - 1) / 5) * 100));

  const currentStepMeta = STEPS.find(s => s.stageOrder === roundedOrder) || STEPS[0];

  return (
    <nav aria-label="Assessment Progress" className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 py-3 px-4 shadow-xs sticky top-16 z-30 transition-all">
      <div className="max-w-5xl mx-auto">
        {/* Desktop view */}
        <div className="hidden sm:flex items-center justify-between relative">
          {/* Background rail */}
          <div className="absolute top-3.5 left-3 right-3 h-1 bg-slate-200/90 -translate-y-1/2 z-0 rounded-full" />
          
          {/* Animated active progress fill */}
          <motion.div
            className="absolute top-3.5 left-3 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 -translate-y-1/2 z-0 rounded-full shadow-xs"
            initial={{ width: '0%' }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />

          {STEPS.map((step) => {
            const isCompleted = currentOrder > step.stageOrder;
            const isCurrent = Math.floor(currentOrder) === step.stageOrder;
            const canJump = isCompleted && onNavigateStage;

            return (
              <motion.button
                key={step.key}
                type="button"
                disabled={!canJump}
                onClick={() => canJump && onNavigateStage(step.key)}
                whileHover={canJump ? { scale: 1.08, y: -1 } : {}}
                whileTap={canJump ? { scale: 0.95 } : {}}
                className={`relative z-10 flex flex-col items-center group focus:outline-none ${
                  canJump ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <motion.div
                  layout
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : isCurrent
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-md scale-110'
                      : 'bg-slate-100 text-slate-500 border border-slate-300'
                  }`}
                  animate={isCurrent ? { scale: [1, 1.1, 1.05] } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : step.stageOrder}
                </motion.div>
                <span
                  className={`mt-1.5 text-[11px] tracking-tight whitespace-nowrap transition-colors duration-200 ${
                    isCurrent
                      ? 'text-blue-900 font-bold'
                      : isCompleted
                      ? 'text-slate-700 font-medium'
                      : 'text-slate-500 font-normal'
                  }`}
                >
                  {step.label}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Mobile compact view */}
        <div className="sm:hidden flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.span 
              key={roundedOrder}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold shadow-xs"
            >
              {roundedOrder}
            </motion.span>
            <span className="text-xs font-semibold text-slate-800">
              Step {roundedOrder} of 6:
            </span>
            <span className="text-xs font-bold text-blue-700 truncate max-w-[140px]">
              {currentStepMeta.label.replace(/^\d+\.\s*/, '')}
            </span>
          </div>

          <div className="w-28 bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
            <motion.div 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${Math.min(100, (roundedOrder / 6) * 100)}%` }}
              transition={{ type: 'spring', stiffness: 100, damping: 18 }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};
