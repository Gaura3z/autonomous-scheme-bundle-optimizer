/**
 * Page 8: Recommended Scheme Bundle (Optimized Combination)
 * Visual representation of the feasible, conflict-free, value-maximizing scheme bundle.
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 */
import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  AlertCircle,
  TrendingUp,
  Plus,
  Printer,
  ExternalLink
} from 'lucide-react';
import { OptimizedBundle, Scheme } from '../../types';
import { SchemeJurisdictionBadge } from '../common/SchemeJurisdictionBadge';
import { getBundleValidity } from '../../engine/validity';

interface OptimizedBundleProps {
  bundle: OptimizedBundle;
  onProceedToDocuments: () => void;
  onBackToConflicts: () => void;
}

export const OptimizedBundleView: React.FC<OptimizedBundleProps> = ({
  bundle,
  onProceedToDocuments,
  onBackToConflicts
}) => {
  const [showWhyModal, setShowWhyModal] = useState(false);
  const validity = getBundleValidity(bundle.selectedSchemes.length > 0 ? bundle.selectedSchemes : (bundle.potentialSelectedSchemes ?? []));

  useEffect(() => {
    // Subtle celebratory confetti on initial render
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#1e40af', '#059669', '#d97706']
      });
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Stage 6 • Optimized Bundle
          </span>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
            Status: {bundle.solverStatus}
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Your Recommended Scheme Bundle
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          This is your document-ready bundle: schemes that are eligible, legally compatible, and actionable with the documents you declared.
        </p>
        <button
          type="button"
          onClick={() => window.print()}
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-xs hover:border-blue-400 hover:text-blue-800 print:hidden"
        >
          <Printer className="h-4 w-4" />
          Print / Save PDF
        </button>
      </div>

      <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Bundle validity</p>
            <p className="mt-1 font-extrabold">{validity.validUntil ? `${validity.label}: ${validity.displayDate}` : validity.label}</p>
            <p className="mt-1 text-xs leading-relaxed text-amber-900">{validity.note}</p>
          </div>
          <span className="rounded-full border border-amber-300 bg-white px-3 py-1 text-[11px] font-bold text-amber-900">
            Earliest selected-scheme date
          </span>
        </div>
      </div>

      {(bundle.potentialSelectedSchemes?.length ?? 0) > bundle.selectedSchemes.length && (
        <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-amber-950">Higher-value potential bundle identified</h3>
              <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                The theoretical compatible bundle is worth ₹{(bundle.potentialTotalMonetaryAnnual ?? 0).toLocaleString('en-IN')} per year. {bundle.documentBlockedSchemes?.length ?? 0} scheme(s) are currently gated by missing documents, so they are shown separately instead of being presented as immediately actionable.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {bundle.documentBlockedSchemes?.map(({ scheme, missingDocumentIds }) => (
                  <span key={scheme.id} className="rounded-lg border border-amber-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-amber-900">
                    {scheme.shortName} · {missingDocumentIds.length} missing document{missingDocumentIds.length === 1 ? '' : 's'}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Aggregate Value Highlight Card */}
      <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-blue-900/50 mb-8 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-blue-500/10 blur-2xl" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Monetary Total */}
          <div className="md:col-span-2 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-300">
              Total Profile-Calculated Monetary Benefit
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                ₹{bundle.totalMonetaryAnnual.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-blue-200 font-medium">
                estimated value / year
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Derived strictly from official verified gazette amounts across {bundle.selectedSchemes.length} compatible programs. No arbitrary figures invented.
            </p>
          </div>

          {/* Conflict Resolution Stat */}
          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/15 text-left">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span className="text-xs font-bold text-white">Conflicts Avoided</span>
            </div>
            <span className="text-2xl font-black text-white">
              {bundle.conflictsResolvedCount}
            </span>
            <p className="text-[11px] text-blue-200 mt-0.5 leading-snug">
              Mutually exclusive claims eliminated through binary constraints.
            </p>
          </div>
        </div>

        {/* Non-Monetary Benefits Strip */}
        {bundle.nonMonetaryBenefits.length > 0 && (
          <div className="mt-6 pt-5 border-t border-white/15">
            <span className="text-xs font-semibold text-blue-300 block mb-2">
              Additional Non-Monetary Protections & Coverage:
            </span>
            <div className="flex flex-wrap gap-2">
              {bundle.nonMonetaryBenefits.map((item, idx) => (
                <span
                  key={idx}
                  className="text-xs px-3 py-1 rounded-xl bg-white/10 text-white border border-white/10 font-medium"
                >
                  ✓ {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Connected Scheme Bundle Visual Grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900">
            Selected Bundle Components ({bundle.selectedSchemes.length} Schemes)
          </h3>

          <button
            onClick={() => setShowWhyModal(!showWhyModal)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 transition-colors cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Why this bundle?</span>
            {showWhyModal ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* "Why this bundle" Expandable explanation */}
        {showWhyModal && (
          <div className="mb-6 p-5 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 space-y-2 animate-in fade-in duration-150">
            <strong className="text-sm font-bold block text-blue-900">
              Deterministic Optimizer Rationale:
            </strong>
            <p className="leading-relaxed">
              {bundle.optimalityMetric}
            </p>
            <p className="text-slate-600 leading-relaxed pt-1 border-t border-blue-200/60">
              The optimizer solves a binary integer program: for each eligible scheme, decision variable x(s) is binary (0 or 1). It enforces that for any two statutory conflicting schemes A and B, x(A) + x(B) &le; 1. Under these constraints, it maximizes net verified financial transfer while minimizing document acquisition friction.
            </p>
          </div>
        )}

        {/* Connected Cards Flow */}
        <div className="space-y-3">
          {bundle.selectedSchemes.map((scheme, index) => {
            const applicationUrl = scheme.applicationSteps[0]?.portalUrl || scheme.officialSourceUrl;

            return (
            <div key={scheme.id} className="relative">
              <div className="bg-white rounded-2xl border-2 border-blue-600/30 p-5 shadow-xs hover:border-blue-600 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-900 text-white font-bold text-sm flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                        {scheme.category}
                      </span>
                      <SchemeJurisdictionBadge jurisdiction={scheme.jurisdiction} showStateText={false} />
                      <span className="text-slate-300">•</span>
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        Compatible
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900">
                      {scheme.name}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {scheme.tagline}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                      <span>Last verified: {scheme.lastVerifiedDate}</span>
                      <span>KB: {scheme.kbVersion}</span>
                      <span>{scheme.applicationDeadline ? `Apply by: ${scheme.applicationDeadline}` : 'No fixed deadline recorded'}</span>
                      <a
                        className="inline-flex items-center gap-1 rounded-md bg-blue-900 px-2.5 py-1 font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-1"
                        href={applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Apply for ${scheme.name} on the official portal`}
                      >
                        Apply Now
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 shrink-0">
                  <span className="text-[11px] font-medium text-slate-500 block">Verified Value</span>
                  <span className="text-base font-extrabold text-blue-900">
                    {scheme.benefit.displayAmount}
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    {scheme.requiredDocumentIds.length} document(s) required
                  </span>
                </div>
              </div>

              {/* Plus Connector for all but the last item */}
              {index < bundle.selectedSchemes.length - 1 && (
                <div className="flex items-center justify-center py-1">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold shadow-2xs">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                </div>
              )}
            </div>
            );
          })}
        </div>
      </div>

      {/* Conflicting / Rejected Alternatives (Secondary Section) */}
      {bundle.rejectedAlternatives.length > 0 && (
        <div className="mb-8 p-5 bg-slate-50 rounded-2xl border border-slate-200">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            Excluded Trade-offs ({bundle.rejectedAlternatives.length} Alternative Schemes)
          </h4>
          <p className="text-xs text-slate-500 mb-3">
            These programs were individually eligible, but the optimizer rejected them to satisfy conflict constraints and prioritize higher-value alternatives:
          </p>

          <div className="space-y-2">
            {bundle.rejectedAlternatives.map(({ scheme, rejectionReason }, idx) => (
              <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600">
                <span className="font-bold text-slate-900 block mb-0.5">{scheme.name}</span>
                <span className="text-slate-600">{rejectionReason}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onBackToConflicts}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 py-2 px-4 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          ← Review Conflicts
        </button>

        <button
          onClick={onProceedToDocuments}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-semibold text-sm shadow-md shadow-blue-900/20 transition-all hover:translate-x-0.5 cursor-pointer"
        >
          Review document readiness
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
