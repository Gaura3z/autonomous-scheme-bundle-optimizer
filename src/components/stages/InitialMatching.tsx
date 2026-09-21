/**
 * Stage 2 Transition: Automated Candidate Matching & Radar Redirect
 * 
 * IMPORTANT UX FIX FOR STUDENTS & MOBILE USERS:
 * Instead of showing raw, unverified scheme cards (which misled students into
 * thinking the assessment was complete and stopped them from continuing), this
 * view provides a high-energy animated transition that clearly communicates:
 * 1. Your profile was analyzed and candidate schemes were found.
 * 2. You are now automatically moving to the quick verification questions
 *    to confirm your 100% fee waiver and calculate your final bundle.
 * 
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 */
import React, { useEffect, useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  GraduationCap,
  Loader2,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';
import { Scheme, CitizenProfile } from '../../types';

interface InitialMatchingProps {
  candidates: Scheme[];
  profile: CitizenProfile;
  onContinue: () => void;
  onBackToProfile: () => void;
}

export const InitialMatching: React.FC<InitialMatchingProps> = ({
  candidates,
  profile,
  onContinue,
  onBackToProfile
}) => {
  const [countdownProgress, setCountdownProgress] = useState(0);

  // Auto-redirect to questionnaire after 2.0 seconds with smooth visual progress
  useEffect(() => {
    const intervalTime = 30;
    const totalTime = 2000;
    const increment = (intervalTime / totalTime) * 100;

    const timer = setInterval(() => {
      setCountdownProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          onContinue();
          return 100;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onContinue]);

  const maharashtraSpecificCount = candidates.filter(
    (c) => (c.targetStates && c.targetStates.includes('MH')) || c.jurisdiction === 'State-Specific'
  ).length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xl text-center relative overflow-hidden"
      >
        {/* Decorative ambient gradient backdrop */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-100 rounded-full blur-3xl opacity-60 pointer-events-none" />

        {/* Pulse radar animation ring */}
        <div className="relative z-10 mx-auto mb-6 w-24 h-24 flex items-center justify-center">
          <motion.div 
            className="absolute inset-0 rounded-full bg-blue-600/10 border border-blue-600/20"
            animate={{ scale: [1, 1.35, 1], opacity: [0.7, 0.15, 0.7] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute -inset-3 rounded-full bg-indigo-600/10 border border-indigo-600/20"
            animate={{ scale: [1, 1.55, 1], opacity: [0.5, 0.1, 0.5] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          />
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/30 text-white">
            <GraduationCap className="w-8 h-8" />
          </div>
        </div>

        {/* Stage Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200/60 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Profile Matched Successfully</span>
        </div>

        {/* Dynamic Title */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          Found {candidates.length} Candidate Welfare Opportunities
        </h2>

        <p className="text-sm text-slate-600 max-w-lg mx-auto mb-6 leading-relaxed">
          Identified <strong className="text-blue-900">{maharashtraSpecificCount} Maharashtra State</strong> and <strong className="text-blue-900">{candidates.length - maharashtraSpecificCount} Central Government</strong> opportunities matching your age, education, and social category.
        </p>

        {/* Verification Checklist Indicator */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mb-6 text-left max-w-lg mx-auto space-y-2.5">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Automatic Next Step</span>
          </div>

          <div className="flex items-center gap-2.5 text-xs font-medium text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Age, Domicile ({profile.state}) & Social Category Filtered</span>
          </div>

          <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
            <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
            <span>Redirecting to verify CAP Admission, Female 100% Waiver & Marks...</span>
          </div>
        </div>

        {/* Countdown / Progress Bar */}
        <div className="w-full max-w-md mx-auto mb-6">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-medium">
            <span>Entering Step 2 of 6: Eligibility Verification</span>
            <span>{Math.round(countdownProgress)}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/70 p-0.5">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 rounded-full transition-all duration-75"
              style={{ width: `${countdownProgress}%` }}
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <motion.button
            type="button"
            onClick={onContinue}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm shadow-md shadow-blue-900/20 cursor-pointer transition-all"
          >
            <span>Verify Eligibility Questions Now</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>

          <button
            type="button"
            onClick={onBackToProfile}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 py-2 px-3 transition-colors cursor-pointer"
          >
            ← Modify Profile Details
          </button>
        </div>
      </motion.div>
    </div>
  );
};
