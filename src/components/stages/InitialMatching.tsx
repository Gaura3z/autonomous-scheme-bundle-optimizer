/**
 * Page 3: Initial Scheme Candidate Matching
 * Shows candidate welfare opportunities that match the initial profile.
 * Clarifies these are CANDIDATE matches, not final confirmations.
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 */
import React from 'react';
import { 
  CheckCircle, 
  HelpCircle, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Building2, 
  ChevronRight,
  ShieldAlert
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
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-10">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            Stage 2 • Candidate Matching
          </span>
          <span className="text-xs text-slate-500">•</span>
          <span className="text-xs font-medium text-slate-600">
            {candidates.length} Candidate Opportunities Found
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Schemes that may be relevant to you
        </h2>

        {/* Disclaimer Callout */}
        <div className="mt-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <strong>Preliminary Screening Notice:</strong> These schemes match your primary demographic and occupational profile. They are <em>candidate schemes</em>, not confirmed eligibility. Answering a few quick adaptive questions in the next step will deterministically verify your exact qualification and detect any statutory conflicts.
          </div>
        </div>
      </motion.div>

      {/* Candidate Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {candidates.map((scheme, idx) => (
          <motion.div
            key={scheme.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.4) }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Category & Jurisdiction badges */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  {scheme.category}
                </span>

                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                  scheme.jurisdiction === 'Central'
                    ? 'bg-blue-50 text-blue-800 border border-blue-200'
                    : 'bg-purple-50 text-purple-800 border border-purple-200'
                }`}>
                  {scheme.jurisdiction} Scheme
                </span>
              </div>

              {/* Title & Tagline */}
              <h3 className="font-bold text-slate-900 text-base mb-1 leading-snug">
                {scheme.name}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                {scheme.tagline}
              </p>

              {/* Potential Benefit Highlight */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-3">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-0.5">
                  Potential Benefit Preview
                </span>
                <span className="text-sm font-extrabold text-blue-900">
                  {scheme.benefit.displayAmount}
                </span>
              </div>

              {/* Ministry & Verification */}
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mb-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{scheme.ministry}</span>
              </div>
            </div>

            {/* Card Footer status */}
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Needs a few more answers
              </span>

              <span className="text-xs text-slate-400">
                {scheme.requiredDocumentIds.length} doc(s) needed
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Navigation Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <motion.button
          type="button"
          onClick={onBackToProfile}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 py-2 px-4 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          ← Edit Profile Details
        </motion.button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <motion.button
            onClick={onContinue}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-semibold text-sm shadow-md shadow-blue-900/20 transition-colors cursor-pointer"
          >
            Continue Assessment ({candidates.length} candidate schemes)
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
