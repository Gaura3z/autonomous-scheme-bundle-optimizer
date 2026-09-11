/**
 * How It Works Modal
 * Transparent explanation of the 8-stage deterministic decision framework.
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 */
import React from 'react';
import { X, CheckCircle2, ShieldCheck, Scale, Cpu, FileCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative z-10"
            role="dialog"
            aria-modal="true"
          >
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </motion.button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100 shadow-xs">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Autonomous Scheme-Bundle Optimizer
                </h3>
                <p className="text-xs text-slate-500">
                  Kurukshetra 2.0 PS16 • Algorithmic Decision Architecture
                </p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-700 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin">
              <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-900 leading-relaxed">
                  <strong>Zero Hallucination Guarantee:</strong> All eligibility, conflict, and document calculations are performed by deterministic rule engines against verified, source-backed scheme guidelines. No AI model invents rules or benefits.
                </p>
              </div>

              <ol className="space-y-3 pt-2">
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <div>
                    <strong className="text-slate-900 block">Profile-Conditioned Matching</strong>
                    <span className="text-xs text-slate-600">Extracts demographic, occupational, and economic parameters to identify initial candidate schemes.</span>
                  </div>
                </li>

                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <div>
                    <strong className="text-slate-900 block">Adaptive Questionnaire</strong>
                    <span className="text-xs text-slate-600">Asks only the questions needed to resolve remaining unclassified candidate schemes. No redundant questions.</span>
                  </div>
                </li>

                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <div>
                    <strong className="text-slate-900 block">Deterministic Eligibility & Exclusion</strong>
                    <span className="text-xs text-slate-600">Evaluates formal predicates. Ineligibility and negative exclusion boundaries are separated with detailed predicate audit traces.</span>
                  </div>
                </li>

                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">4</span>
                  <div>
                    <strong className="text-slate-900 block">Verified Conflict Graph & Optimization</strong>
                    <span className="text-xs text-slate-600">Detects statutory incompatibilities (e.g., dual capital subsidies). Formulates binary constraints to select the highest-value valid bundle.</span>
                  </div>
                </li>

                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">5</span>
                  <div>
                    <strong className="text-slate-900 block">Document Inventory & Readiness Gaps</strong>
                    <span className="text-xs text-slate-600">A single checkbox checklist verifies what you already possess. Missing documents are labeled as <em>readiness gaps</em>, never disqualifications.</span>
                  </div>
                </li>

                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">6</span>
                  <div>
                    <strong className="text-slate-900 block">Actionable Application Roadmap</strong>
                    <span className="text-xs text-slate-600">Topologically orders prerequisite certificates and provides step-by-step guidance directly to official government portals.</span>
                  </div>
                </li>
              </ol>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  onClose();
                  // Trigger architecture modal if event provided
                  window.dispatchEvent(new CustomEvent('open-architecture-modal'));
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-800 hover:text-blue-900 bg-blue-50 px-3 py-2 rounded-xl border border-blue-200 cursor-pointer"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>View Full Architecture & Tech Stack</span>
              </button>

              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-5 py-2.5 rounded-xl bg-blue-900 text-white font-medium text-sm hover:bg-blue-800 transition-colors shadow-xs cursor-pointer"
              >
                Understood
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
