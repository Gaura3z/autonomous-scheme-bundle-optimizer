/**
 * Page 6: Deterministic Eligibility & Exclusion Results
 * Displays classified welfare schemes with transparent criteria audit traces.
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 */
import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  HelpCircle, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  ShieldAlert,
  Layers,
  Sparkles
} from 'lucide-react';
import { SchemeEvaluation, EligibilityStatus } from '../../types';
import { SchemeJurisdictionBadge } from '../common/SchemeJurisdictionBadge';

interface EligibilityResultsProps {
  evaluations: SchemeEvaluation[];
  conflictsCount: number;
  onProceedToConflicts: () => void;
  onBackToQuestions: () => void;
}

export const EligibilityResults: React.FC<EligibilityResultsProps> = ({
  evaluations,
  conflictsCount,
  onProceedToConflicts,
  onBackToQuestions
}) => {
  const [filter, setFilter] = useState<'ELIGIBLE' | 'POSSIBLY_ELIGIBLE' | 'INELIGIBLE'>('ELIGIBLE');
  const [expandedSchemeId, setExpandedSchemeId] = useState<string | null>(null);

  const eligibleCount = evaluations.filter((e) => e.status === 'ELIGIBLE').length;
  const possiblyCount = evaluations.filter((e) => e.status === 'POSSIBLY_ELIGIBLE').length;
  const ineligibleCount = evaluations.filter((e) => e.status === 'INELIGIBLE' || e.status === 'BLOCKED_BY_EXCLUSION').length;

  const filteredEvaluations = evaluations.filter((ev) => {
    if (filter === 'ELIGIBLE') return ev.status === 'ELIGIBLE';
    if (filter === 'POSSIBLY_ELIGIBLE') return ev.status === 'POSSIBLY_ELIGIBLE';
    if (filter === 'INELIGIBLE') return ev.status === 'INELIGIBLE' || ev.status === 'BLOCKED_BY_EXCLUSION';
    return false;
  });

  const toggleExpand = (id: string) => {
    setExpandedSchemeId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-10">
      {/* Header & Stats Banner */}
      <div className="mb-8">
        <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
          Stage 4 • Evaluated Classifications
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 mb-4">
          Your Scheme Assessment
        </h2>

        {/* Summary Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500 block">Total Evaluated</span>
            <span className="text-2xl font-black text-slate-900">{evaluations.length}</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Active catalog schemes</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-2xs">
            <span className="text-xs font-semibold text-emerald-800 block">Eligible Schemes</span>
            <span className="text-2xl font-black text-emerald-700">{eligibleCount}</span>
            <span className="text-[11px] text-emerald-600 block mt-0.5">100% criteria satisfied</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-semibold text-slate-600 block">Ineligible / Disqualified</span>
            <span className="text-2xl font-black text-slate-700">{ineligibleCount}</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Condition bounds unmet</span>
          </div>

          <div className={`p-4 rounded-xl border shadow-2xs ${
            conflictsCount > 0 
              ? 'bg-amber-50/40 border-amber-300 text-amber-950' 
              : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <span className="text-xs font-semibold block">Scheme Conflicts</span>
            <span className={`text-2xl font-black ${conflictsCount > 0 ? 'text-amber-700' : 'text-slate-900'}`}>
              {conflictsCount}
            </span>
            <span className="text-[11px] block mt-0.5 text-slate-500">
              {conflictsCount > 0 ? 'Requires optimization' : 'No conflicts'}
            </span>
          </div>
        </div>

        {/* Mutually exclusive result groups */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setFilter('ELIGIBLE')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filter === 'ELIGIBLE'
                ? 'bg-emerald-700 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Eligible recommendations ({eligibleCount})
          </button>
          <button
            onClick={() => setFilter('INELIGIBLE')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filter === 'INELIGIBLE'
                ? 'bg-rose-700 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Ineligible ({ineligibleCount})
          </button>
          <button
            onClick={() => setFilter('POSSIBLY_ELIGIBLE')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filter === 'POSSIBLY_ELIGIBLE'
                ? 'bg-amber-600 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Needs information ({possiblyCount})
          </button>
        </div>
      </div>

      {/* Evaluation List */}
      <div className="space-y-4 mb-8">
        {filteredEvaluations.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-8 text-center shadow-2xs">
            <p className="text-sm font-semibold text-slate-800">
              {filter === 'ELIGIBLE'
                ? 'No confirmed eligible schemes found.'
                : filter === 'POSSIBLY_ELIGIBLE'
                ? 'No schemes need additional information.'
                : 'No ineligible schemes in this assessment.'}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {filter === 'ELIGIBLE'
                ? 'Review your answers or open “Needs information” to see schemes requiring more details.'
                : 'Only schemes in this result group are shown here.'}
            </p>
          </div>
        ) : filteredEvaluations.map((ev) => {
          const isExpanded = expandedSchemeId === ev.scheme.id;
          const isEligible = ev.status === 'ELIGIBLE';
          const isPossibly = ev.status === 'POSSIBLY_ELIGIBLE';
          const isBlocked = ev.status === 'BLOCKED_BY_EXCLUSION';

          return (
            <div
              key={ev.scheme.id}
              className={`bg-white rounded-2xl border transition-all p-5 shadow-2xs ${
                isEligible 
                  ? 'border-emerald-300/80 hover:border-emerald-400' 
                  : isPossibly
                  ? 'border-amber-300/80 hover:border-amber-400'
                  : 'border-slate-200 opacity-80'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Category & Status */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                      {ev.scheme.category}
                    </span>
                    <SchemeJurisdictionBadge jurisdiction={ev.scheme.jurisdiction} showStateText={false} />
                    <span className="text-slate-300">•</span>

                    {isEligible && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Eligible
                      </span>
                    )}

                    {isPossibly && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        More info needed
                      </span>
                    )}

                    {!isEligible && !isPossibly && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
                        <XCircle className="w-3.5 h-3.5" />
                        {isBlocked ? 'Blocked by exclusion' : 'Not eligible'}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {ev.scheme.name}
                  </h3>

                  <p className="text-xs text-slate-600 mt-1 mb-2">
                    {ev.scheme.tagline}
                  </p>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-extrabold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                      Benefit: {ev.scheme.benefit.displayAmount}
                    </span>
                    <span className="text-slate-400">
                      Source: {ev.scheme.ministry}
                    </span>
                  </div>
                </div>

                {/* Expand "Why?" Button */}
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  aria-controls={`eligibility-details-${ev.scheme.id}`}
                  onClick={() => toggleExpand(ev.scheme.id)}
                  className="self-start sm:self-center inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  <span>Why {isEligible ? 'Eligible?' : isPossibly ? 'More information?' : 'Ineligible?'}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Expandable Criteria Audit Panel */}
              {isExpanded && (
                <div id={`eligibility-details-${ev.scheme.id}`} className="mt-4 pt-4 border-t border-slate-100 text-xs space-y-3 animate-in fade-in duration-150">
                  {/* Matched Positive Criteria */}
                  {ev.matchedPositiveReasons.length > 0 && (
                    <div>
                      <span className="font-semibold text-emerald-800 block mb-1">
                        ✓ Conditions Satisfied:
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
                        {ev.matchedPositiveReasons.map((reason, i) => (
                          <li key={i}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Unmet / Missing Criteria */}
                  {ev.unmetReasons.length > 0 && (
                    <div>
                      <span className="font-semibold text-rose-700 block mb-1">
                        ✕ Conditions Not Satisfied:
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                        {ev.unmetReasons.map((reason, i) => (
                          <li key={i}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Exclusion Reasons */}
                  {ev.exclusionReasons.length > 0 && (
                    <div>
                      <span className="font-semibold text-rose-800 block mb-1">
                        🚫 Negative Exclusion Triggered:
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-rose-700 pl-1">
                        {ev.exclusionReasons.map((reason, i) => (
                          <li key={i}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Verification metadata and official application action */}
                  <div className="pt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-[11px] text-slate-400 border-t border-slate-100">
                    <span>
                      Verified Knowledge Base: {ev.scheme.kbVersion} (Last Checked: {ev.scheme.lastVerifiedDate})
                    </span>
                    {isEligible && (
                      <a
                        href={ev.scheme.officialSourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit the official website for ${ev.scheme.name}`}
                        className="inline-flex items-center gap-1 text-blue-700 text-xs font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-1 rounded"
                      >
                        Official Website
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Footer */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onBackToQuestions}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 py-2 px-4 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          ← Review Previous Answers
        </button>

        <button
          onClick={onProceedToConflicts}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-semibold text-sm shadow-md shadow-blue-900/20 transition-all hover:translate-x-0.5 cursor-pointer"
        >
          {conflictsCount > 0 
            ? `Evaluate Scheme Conflicts (${conflictsCount} Detected)` 
            : 'Proceed to Bundle Optimization'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
