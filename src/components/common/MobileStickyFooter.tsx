/**
 * Mobile Sticky Footer Navigation
 * Solves the mobile drop-off issue by ensuring the next step button is always visible
 * and clearly guides students to scroll or tap to proceed through all 6 steps.
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 */
import React from 'react';
import { ArrowRight, ChevronUp } from 'lucide-react';
import { motion } from 'motion/react';

interface MobileStickyFooterProps {
  currentStep: number;
  totalSteps?: number;
  nextStepLabel: string;
  onNext: () => void;
  disabled?: boolean;
  onBack?: () => void;
  backLabel?: string;
}

export const MobileStickyFooter: React.FC<MobileStickyFooterProps> = ({
  currentStep,
  totalSteps = 6,
  nextStepLabel,
  onNext,
  disabled = false,
  onBack,
  backLabel = 'Back'
}) => {
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 p-3 shadow-lg">
      <div className="flex items-center justify-between gap-2.5">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="px-3 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors shrink-0"
          >
            {backLabel}
          </button>
        ) : (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-blue-50 text-blue-800 text-[11px] font-bold">
            <span>Step {currentStep}/{totalSteps}</span>
          </div>
        )}

        <motion.button
          type="button"
          disabled={disabled}
          onClick={onNext}
          whileTap={!disabled ? { scale: 0.97 } : {}}
          className={`flex-1 inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl text-xs font-bold shadow-md transition-all ${
            disabled
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-blue-900 text-white hover:bg-blue-800 shadow-blue-900/20 active:bg-blue-950'
          }`}
        >
          <span>{nextStepLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </div>
  );
};
