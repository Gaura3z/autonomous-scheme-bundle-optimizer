/**
 * Page 5: Simulated Processing / Analysis Experience
 * Transparent 5-step evaluation animation matching the PS16 BenefitStrategist state transitions.
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 */
import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Sparkles, Cpu, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProcessingStateProps {
  onComplete: () => void;
}

const STEPS = [
  'Understanding citizen demographic & economic profile',
  'Querying active knowledge-base records (Central & State)',
  'Evaluating deterministic eligibility & exclusion rules',
  'Evaluating statutory conflict edges across eligible programs',
  'Synthesizing optimal feasible scheme bundle'
];

export const ProcessingState: React.FC<ProcessingStateProps> = ({ onComplete }) => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(onComplete, 450);
          return prev;
        }
      });
    }, 420);

    return () => clearInterval(interval);
  }, [onComplete]);

  const progressPercent = Math.round(((activeStep + 1) / STEPS.length) * 100);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-xl text-center relative overflow-hidden"
      >
        {/* Animated ambient background circle */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-blue-100 rounded-full blur-2xl pointer-events-none opacity-60" />
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-indigo-100 rounded-full blur-2xl pointer-events-none opacity-60" />

        {/* Animated Icon with subtle orbiting pulse */}
        <div className="relative w-20 h-20 mx-auto mb-5 flex items-center justify-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-2xl border-2 border-dashed border-blue-400/40"
          />
          <div className="absolute inset-2 rounded-xl bg-blue-100 animate-ping opacity-30" />
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-900 to-indigo-800 text-white flex items-center justify-center shadow-md">
            <Cpu className="w-7 h-7 animate-pulse text-blue-200" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-1">
          Evaluating Decision Engines
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Deterministic Rule DSL & PuLP Conflict Optimizer
        </p>

        {/* Progress indicator bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-6 relative">
          <motion.div 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>

        {/* Step Progress Checklist */}
        <div className="space-y-3 text-left mb-7">
          {STEPS.map((stepText, idx) => {
            const isDone = idx < activeStep;
            const isCurrent = idx === activeStep;

            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.05 }}
                className={`flex items-center gap-3 text-xs transition-all duration-300 p-2 rounded-lg ${
                  isDone 
                    ? 'text-emerald-800 bg-emerald-50/50 font-medium' 
                    : isCurrent 
                    ? 'text-blue-950 bg-blue-50 font-bold border border-blue-100' 
                    : 'text-slate-400 opacity-70'
                }`}
              >
                {isDone ? (
                  <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  </motion.div>
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-blue-700 animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                )}
                <span>{stepText}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Skip button for instant demo */}
        <motion.button
          onClick={onComplete}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-xs text-slate-400 hover:text-blue-700 font-medium transition-colors cursor-pointer"
        >
          Skip animation →
        </motion.button>
      </motion.div>
    </div>
  );
};
