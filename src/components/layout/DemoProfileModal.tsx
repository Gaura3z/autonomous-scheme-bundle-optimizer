/**
 * Demo Profile Selector Modal
 * Quick-loader for 3 judge demo personas.
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 */
import React from 'react';
import { 
  X, 
  Sparkles, 
  GraduationCap, 
  Briefcase, 
  Tractor, 
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Workflow
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DEMO_PROFILES } from '../../data/demoProfiles';
import { DEMO_JOURNEYS } from '../../data/demoJourneys';
import { DemoCitizenProfile } from '../../types';

interface DemoProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProfile: (demo: DemoCitizenProfile) => void;
}

export const DemoProfileModal: React.FC<DemoProfileModalProps> = ({
  isOpen,
  onClose,
  onSelectProfile
}) => {
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

          {/* Modal Box */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 14 }}
            transition={{ type: 'spring', damping: 26, stiffness: 360 }}
            className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative z-10 max-h-[90vh] overflow-y-auto"
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

            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shadow-xs">
                <Sparkles className="w-5 h-5 animate-spin-slow" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-900">
                    Select a Demonstration Citizen Persona
                  </h3>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                    Prototype Data
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Deterministic evaluation scenarios for Kurukshetra 2.0 PS16 Hackfest Judges
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Every persona passes through the <strong>exact same product journey</strong> (Profile → Candidates → Adaptive Questions → Analysis → Results → Conflicts → Bundle → Documents → Readiness → Dependencies → Roadmap). Selecting a persona loads deterministic inputs to verify specific engine outcomes.
            </p>

            <div className="space-y-4">
              {DEMO_PROFILES.map((demo, idx) => {
                const journey = DEMO_JOURNEYS[demo.id] || DEMO_JOURNEYS.demo_student;
                const Icon = demo.id === 'demo_student' 
                  ? GraduationCap 
                  : demo.id === 'demo_woman_artisan' 
                  ? Briefcase 
                  : Tractor;

                return (
                  <motion.div
                    key={demo.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    className="p-5 rounded-2xl border-2 border-slate-200 hover:border-blue-600 hover:bg-blue-50/20 transition-all group flex flex-col gap-3 shadow-2xs hover:shadow-md text-left"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-900 text-white font-bold flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                              {demo.name}
                            </h4>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                              {demo.badge}
                            </span>
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              Demo Persona
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-slate-600">
                            {demo.roleTitle} • {demo.profile.state} ({demo.profile.areaType}) • Income: ₹{(demo.profile.annualFamilyIncome).toLocaleString('en-IN')}/yr
                          </p>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.04, x: 2 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => {
                          onSelectProfile(demo);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-xs cursor-pointer shrink-0"
                      >
                        <span>Select Persona</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {demo.shortSummary}
                    </p>

                    {/* Algorithmic Highlights Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-[11px]">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                        <span className="font-bold text-slate-400 uppercase text-[9px] block">
                          1. Adaptive Questions
                        </span>
                        <span className="font-semibold text-slate-800">
                          {journey.expectedHighlight.adaptiveQuestionsCount} Sector Questions
                        </span>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                        <span className="font-bold text-slate-400 uppercase text-[9px] block">
                          2. Conflict Test
                        </span>
                        <span className="font-semibold text-slate-800 line-clamp-1">
                          {journey.expectedHighlight.hasConflict 
                            ? journey.expectedHighlight.conflictDescription?.split('(')[0] || 'Conflict Detected'
                            : 'Zero Conflict Synergy'}
                        </span>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                        <span className="font-bold text-slate-400 uppercase text-[9px] block">
                          3. Document Readiness Gap
                        </span>
                        <span className="font-semibold text-amber-800 line-clamp-1">
                          Missing: {journey.expectedHighlight.missingDocumentName}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="italic">All outputs labeled: Prototype · Demonstration Data</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
              >
                Close Window
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
