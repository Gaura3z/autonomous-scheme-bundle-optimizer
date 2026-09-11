/**
 * Demo Profile Selector Modal
 * Quick-loader for 3 judge demo personas.
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 */
import React from 'react';
import { X, Sparkles, GraduationCap, Briefcase, Tractor, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DEMO_PROFILES } from '../../data/demoProfiles';
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

            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shadow-xs">
                <Sparkles className="w-5 h-5 animate-spin-slow" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Select a Demo Citizen Profile
                </h3>
                <p className="text-xs text-slate-500">
                  Live Evaluation Personas for Hackathon Judges & Demonstrators
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Selecting a demo persona immediately loads their verified profile and pre-declared documents into the decision pipeline, demonstrating deterministic pathing and conflict resolution.
            </p>

            <div className="space-y-3.5">
              {DEMO_PROFILES.map((demo, idx) => {
                const Icon = demo.id === 'demo_student' 
                  ? GraduationCap 
                  : demo.id === 'demo_woman_artisan' 
                  ? Briefcase 
                  : Tractor;

                return (
                  <motion.button
                    key={demo.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    whileHover={{ scale: 1.015, y: -2 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => {
                      onSelectProfile(demo);
                      onClose();
                    }}
                    className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 transition-colors group flex items-start gap-4 cursor-pointer shadow-2xs hover:shadow-xs"
                  >
                    <div className="w-11 h-11 rounded-xl bg-blue-900 text-white font-bold flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                          {demo.name}
                        </h4>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                          {demo.badge}
                        </span>
                      </div>

                      <p className="text-xs font-medium text-slate-600 mb-1.5">
                        {demo.roleTitle} • State: {demo.profile.state} • Income: ₹{(demo.profile.annualFamilyIncome).toLocaleString('en-IN')}/yr
                      </p>

                      <p className="text-xs text-slate-500 line-clamp-2">
                        {demo.shortSummary}
                      </p>
                    </div>

                    <div className="shrink-0 self-center text-slate-400 group-hover:text-blue-700 group-hover:translate-x-1 transition-all">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="italic">Data tagged: Prototype / Demonstration Personas</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
