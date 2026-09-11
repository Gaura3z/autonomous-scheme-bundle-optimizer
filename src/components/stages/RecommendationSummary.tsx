/**
 * Page 13: Final Recommendation Synthesis ("Why these recommendations?")
 * Comprehensive audit trail answering why schemes were chosen, why others were excluded,
 * and what trade-offs the optimizer made, with Print / Export support.
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 */
import React from 'react';
import { 
  Printer, 
  RotateCcw, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Layers, 
  Scale, 
  ArrowRight,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { OptimizedBundle, SchemeEvaluation, CitizenProfile, RoadmapStep } from '../../types';

interface RecommendationSummaryProps {
  profile: CitizenProfile;
  bundle: OptimizedBundle;
  evaluations: SchemeEvaluation[];
  roadmapSteps: RoadmapStep[];
  onRestart: () => void;
  onOpenDemoSelector: () => void;
}

export const RecommendationSummary: React.FC<RecommendationSummaryProps> = ({
  profile,
  bundle,
  evaluations,
  roadmapSteps,
  onRestart,
  onOpenDemoSelector
}) => {
  const handlePrint = () => {
    window.print();
  };

  const excludedSchemes = evaluations.filter(
    (ev) => ev.status === 'INELIGIBLE' || ev.status === 'BLOCKED_BY_EXCLUSION'
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10 print:py-2 print:px-0">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200 print:hidden">
        <div>
          <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
            Decision Audit & Audit Trail
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Why These Recommendations?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete transparent rationale for the civic advisory generated for your profile.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            Print / Save PDF
          </button>

          <button
            onClick={onRestart}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            New Assessment
          </button>
        </div>
      </div>

      {/* Citizen Assessment Summary Badge for Print */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-8 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700">
        <div>
          <strong className="text-slate-900">Evaluated Profile: </strong>
          <span>Age: {profile.age}</span> • <span>Gender: {profile.gender}</span> • <span>State: {profile.state}</span> • <span>Category: {profile.socialCategory}</span> • <span>Income: ₹{(profile.annualFamilyIncome).toLocaleString('en-IN')}/yr</span>
        </div>
        <span className="font-mono text-[11px] text-slate-500">
          Generated via PS16 Autonomous Optimizer
        </span>
      </div>

      {/* 4 Pillars of Civic Transparency */}
      <div className="space-y-8">
        {/* Pillar 1: Why chosen */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                1. Why Were These Schemes Chosen?
              </h3>
              <p className="text-xs text-slate-500">
                Selected by binary integer optimization under mutual compatibility constraints.
              </p>
            </div>
          </div>

          <div className="space-y-3 mt-4 text-xs">
            {bundle.selectedSchemes.map((scheme) => (
              <div key={scheme.id} className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-200 text-slate-800">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <strong className="text-sm font-bold text-slate-900">{scheme.name}</strong>
                  <span className="font-extrabold text-emerald-800">{scheme.benefit.displayAmount}</span>
                </div>
                <p className="text-slate-600 mb-1.5">{scheme.tagline}</p>
                <div className="text-[11px] text-slate-500">
                  ✓ Qualified all demographic, domicile, and income ceilings without statutory conflict.
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pillar 2: Excluded alternatives */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
              <XCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                2. Why Were Other Schemes Excluded?
              </h3>
              <p className="text-xs text-slate-500">
                Explicit mathematical threshold checks and demographic criteria failures.
              </p>
            </div>
          </div>

          <div className="space-y-2 mt-4 text-xs">
            {excludedSchemes.slice(0, 5).map((ev) => (
              <div key={ev.scheme.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                <span className="font-bold text-slate-900 block mb-0.5">{ev.scheme.name}</span>
                <span className="text-rose-700">
                  ✕ Excluded: {ev.unmetReasons.concat(ev.exclusionReasons).join('; ') || 'Criteria mismatch'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pillar 3: Trade-offs made */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                3. What Trade-offs Were Resolved?
              </h3>
              <p className="text-xs text-slate-500">
                Statutory conflict edges arbitrated by value maximization.
              </p>
            </div>
          </div>

          <div className="mt-4 text-xs text-slate-700 leading-relaxed bg-purple-50/40 p-4 rounded-xl border border-purple-200 space-y-2">
            <p>
              When two programs provide overlapping capital subsidies or stipends for the identical expense category, statutory deduplication prohibits dual claiming.
            </p>
            {bundle.rejectedAlternatives.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {bundle.rejectedAlternatives.map((alt, i) => (
                  <li key={i}>
                    <strong>{alt.scheme.shortName}:</strong> {alt.rejectionReason}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="italic text-slate-500">
                No active conflicts were triggered for this profile configuration.
              </p>
            )}
          </div>
        </div>

        {/* Pillar 4: Next steps */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                4. What Immediate Actions Should You Take?
              </h3>
              <p className="text-xs text-slate-500">
                Next steps derived from your application roadmap.
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2 text-xs">
            {roadmapSteps.slice(0, 4).map((step, idx) => (
              <div key={step.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div>
                  <strong className="text-slate-900 block">{step.title}</strong>
                  <span className="text-slate-600">{step.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Action Section */}
      <div className="mt-10 p-6 bg-slate-900 text-white rounded-3xl text-center space-y-4 print:hidden">
        <h3 className="text-lg font-bold">Ready to test another citizen scenario?</h3>
        <p className="text-xs text-slate-300 max-w-md mx-auto">
          Switch between college students, rural women entrepreneurs, or marginal farmers to test all branches of the decision engine.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onOpenDemoSelector}
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md cursor-pointer transition-all"
          >
            Load Another Demo Persona
          </button>
          <button
            onClick={onRestart}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-slate-700 cursor-pointer transition-all"
          >
            Start Fresh Profile
          </button>
        </div>
      </div>
    </div>
  );
};
