/**
 * Page 12: Actionable Application Roadmap
 * Sequenced, topological timeline guiding the citizen from prerequisite acquisition to final filing.
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 */
import React, { useState } from 'react';
import { 
  CheckCircle, 
  Circle, 
  ExternalLink, 
  ArrowRight, 
  Clock, 
  Building2, 
  Calendar, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RoadmapStep } from '../../types';

interface ApplicationRoadmapProps {
  steps: RoadmapStep[];
  onProceedToSummary: () => void;
  onBackToDependencies: () => void;
}

export const ApplicationRoadmap: React.FC<ApplicationRoadmapProps> = ({
  steps: initialSteps,
  onProceedToSummary,
  onBackToDependencies
}) => {
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
              Stage 10 • Application Action Plan
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Your Application Roadmap
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Follow this sequenced timeline to obtain certificates without wasted trips and submit verified applications.
            </p>
          </div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-blue-50 border border-blue-200 px-3.5 py-2 rounded-xl text-center shrink-0 shadow-2xs"
          >
            <span className="text-[11px] font-semibold text-blue-700 block">Progress</span>
            <span className="text-sm font-extrabold text-blue-900">
              {completedCount} / {initialSteps.length} Done
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Sequenced Action List */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-blue-200 space-y-6 mb-8 ml-3 sm:ml-4">
        {initialSteps.map((step, idx) => {
          const isDone = !!completedSteps[step.id];

          return (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.4) }}
              className="relative group"
            >
              {/* Step Circle Indicator */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleStep(step.id)}
                className={`absolute -left-[35px] sm:-left-[43px] top-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                  isDone
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-blue-900 border-2 border-blue-600 shadow-2xs hover:bg-blue-50'
                }`}
                title="Click to toggle completed"
              >
                {isDone ? <CheckCircle className="w-5 h-5 fill-emerald-600 text-white" /> : step.stepNumber}
              </motion.button>

              {/* Step Card */}
              <motion.div
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
                className={`bg-white rounded-2xl border p-5 shadow-xs transition-colors ${
                  isDone
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-slate-200 hover:border-blue-400'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      step.phase === 'Prerequisite'
                        ? 'bg-amber-100 text-amber-900'
                        : step.phase === 'Document Acquisition'
                        ? 'bg-purple-100 text-purple-900'
                        : 'bg-blue-100 text-blue-900'
                    }`}>
                      Phase: {step.phase}
                    </span>

                    <span className="text-xs text-slate-400">•</span>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {step.estimatedTimeline}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleStep(step.id)}
                    className="self-start text-[11px] font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    {isDone ? 'Mark as Incomplete' : 'Mark as Done ✓'}
                  </button>
                </div>

                <h3 className={`text-base font-bold mb-1.5 transition-colors ${
                  isDone ? 'line-through text-slate-400' : 'text-slate-900'
                }`}>
                  {step.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {step.description}
                </p>

                {step.criticalDependency && (
                  <div className="text-[11px] font-medium text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200/70 mb-3">
                    ⚠ {step.criticalDependency}
                  </div>
                )}

                {/* Official Action Portal Link */}
                {step.actionUrl && (
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Official Government Digital Interface
                    </span>
                    <motion.a
                      href={step.actionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                    >
                      Open Application Desk
                      <ExternalLink className="w-3.5 h-3.5" />
                    </motion.a>
                  </div>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation Footer */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <motion.button
          onClick={onBackToDependencies}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 py-2 px-4 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          ← Back to Dependencies
        </motion.button>

        <motion.button
          onClick={onProceedToSummary}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-semibold text-sm shadow-md shadow-blue-900/20 transition-colors cursor-pointer"
        >
          Why These Recommendations? (Final Summary)
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </div>
  );
};
