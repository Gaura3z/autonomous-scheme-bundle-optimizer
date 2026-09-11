/**
 * Page 7: Scheme Conflict Detection & Mutual Incompatibility Resolution
 * Visually displays conflict pairs, official circular citations, and optimizer trade-offs.
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 */
import React from 'react';
import { 
  AlertTriangle, 
  ArrowRight, 
  Split, 
  ShieldAlert, 
  BookOpen, 
  Info, 
  Scale,
  CheckCircle2
} from 'lucide-react';
import { ActiveConflict } from '../../engine/conflicts';

interface ConflictDetectionProps {
  conflicts: ActiveConflict[];
  onProceedToBundle: () => void;
  onBackToResults: () => void;
}

export const ConflictDetection: React.FC<ConflictDetectionProps> = ({
  conflicts,
  onProceedToBundle,
  onBackToResults
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
          Stage 5 • Conflict Evaluation
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
          Statutory Scheme Conflicts
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Government regulations restrict certain welfare programs from being claimed simultaneously for the same project or expenditure.
        </p>

        {/* Important Civic Clarification Banner */}
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-950 leading-relaxed">
            <strong className="block mb-0.5">Crucial Distinction:</strong>
            A conflict does <strong>not</strong> mean you are ineligible for either program. You may qualify for both individually. However, statutory rules prohibit receiving dual benefits from both concurrently. The system’s mathematical optimizer will select the optimal program for your bundle.
          </div>
        </div>
      </div>

      {conflicts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-emerald-200 p-8 text-center shadow-xs mb-8">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No Scheme Incompatibilities Detected</h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto mb-4">
            All your eligible welfare schemes are fully compatible and can be pursued concurrently without risk of clawback or rejection.
          </p>
        </div>
      ) : (
        <div className="space-y-6 mb-8">
          {conflicts.map(({ conflict, schemeA, schemeB }) => (
            <div
              key={conflict.id}
              className="bg-white rounded-2xl border border-amber-200 p-6 shadow-xs hover:border-amber-300 transition-all"
            >
              {/* Conflict Header */}
              <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                  <Split className="w-3.5 h-3.5" />
                  Mutual Exclusion Rule
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {conflict.id}
                </span>
              </div>

              {/* Visual Conflict Pair Cards */}
              <div className="grid grid-cols-1 md:grid-cols-11 items-center gap-3 mb-5">
                {/* Scheme A */}
                <div className="md:col-span-5 p-4 rounded-xl bg-slate-50 border border-slate-200 text-left">
                  <span className="text-[10px] font-bold text-blue-700 uppercase block mb-1">Option A</span>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{schemeA.name}</h4>
                  <span className="text-xs font-extrabold text-blue-900 block">{schemeA.benefit.displayAmount}</span>
                </div>

                {/* Conflict Bridge Indicator */}
                <div className="md:col-span-1 text-center py-2 flex md:flex-col items-center justify-center gap-1 text-rose-600">
                  <div className="h-0.5 md:h-6 w-8 md:w-0.5 bg-rose-300" />
                  <span className="text-[11px] font-black uppercase px-2 py-0.5 rounded bg-rose-50 border border-rose-200">
                    VS
                  </span>
                  <div className="h-0.5 md:h-6 w-8 md:w-0.5 bg-rose-300" />
                </div>

                {/* Scheme B */}
                <div className="md:col-span-5 p-4 rounded-xl bg-slate-50 border border-slate-200 text-left">
                  <span className="text-[10px] font-bold text-blue-700 uppercase block mb-1">Option B</span>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{schemeB.name}</h4>
                  <span className="text-xs font-extrabold text-blue-900 block">{schemeB.benefit.displayAmount}</span>
                </div>
              </div>

              {/* Conflict Rationale Details */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-2.5 text-xs text-slate-700 border border-slate-200/60">
                <div>
                  <strong className="text-slate-900 block font-semibold mb-0.5">Reason for Conflict:</strong>
                  <p className="text-slate-600 leading-relaxed">{conflict.reason}</p>
                </div>

                <div>
                  <strong className="text-slate-900 block font-semibold mb-0.5">Statutory Reference:</strong>
                  <p className="text-slate-500 font-mono text-[11px]">{conflict.officialCircularReference}</p>
                </div>

                <div>
                  <strong className="text-slate-900 block font-semibold mb-0.5">Consequence of Simultaneous Claim:</strong>
                  <p className="text-rose-700 leading-relaxed">{conflict.consequence}</p>
                </div>

                <div className="pt-2 border-t border-slate-200 text-blue-900">
                  <strong className="font-semibold block mb-0.5">Optimizer Recommendation:</strong>
                  <p className="leading-relaxed">{conflict.resolutionAdvice}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Navigation Footer */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onBackToResults}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 py-2 px-4 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          ← Back to Eligibility List
        </button>

        <button
          onClick={onProceedToBundle}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-semibold text-sm shadow-md shadow-blue-900/20 transition-all hover:translate-x-0.5 cursor-pointer"
        >
          Build My Best Bundle
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
