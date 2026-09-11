/**
 * Page 11: Document Dependency Graph
 * Visual prerequisite chains connecting foundational documents to certificates to scheme filings.
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 */
import React from 'react';
import { 
  ArrowRight, 
  Layers, 
  Workflow, 
  CheckCircle2, 
  AlertTriangle, 
  FileText,
  Building2,
  GitMerge
} from 'lucide-react';
import { DocumentDependencyNode } from '../../engine/documents';
import { Scheme } from '../../types';

interface DocumentDependenciesProps {
  nodes: DocumentDependencyNode[];
  onProceedToRoadmap: () => void;
  onBackToReadiness: () => void;
}

export const DocumentDependencies: React.FC<DocumentDependenciesProps> = ({
  nodes,
  onProceedToRoadmap,
  onBackToReadiness
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
          Stage 9 • Dependency Mapping
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
          Document Dependency Chains
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Certain certificates require prior foundational proofs (like Aadhaar or Ration Card) before local revenue offices can issue them.
        </p>
      </div>

      {nodes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-emerald-200 p-8 text-center shadow-xs mb-8">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Zero Prerequisite Bottlenecks</h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto mb-4">
            You already hold the necessary foundational proofs. There are no prerequisite blockers preventing direct certificate application.
          </p>
        </div>
      ) : (
        <div className="space-y-6 mb-8">
          {nodes.map((node) => (
            <div
              key={node.document.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center font-bold">
                    <Workflow className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Target Certificate: {node.document.name}
                    </h3>
                    <span className="text-[11px] text-slate-500">
                      Authority: {node.document.issuingAuthority}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  Missing Now
                </span>
              </div>

              {/* Visual Horizontal Chain */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col md:flex-row items-center gap-3 justify-between">
                {/* Step 1: Prerequisites */}
                <div className="w-full md:w-5/12">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                    1. Verified Prerequisites Needed
                  </span>

                  {node.prerequisites.length === 0 ? (
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs text-slate-600">
                      None required (Direct online/physical self-service)
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {node.prerequisites.map((p) => {
                        const isMissing = node.missingPrerequisites.some((m) => m.id === p.id);

                        return (
                          <div
                            key={p.id}
                            className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                              isMissing
                                ? 'bg-amber-50 border-amber-300 text-amber-900'
                                : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                            }`}
                          >
                            <span className="font-semibold">{p.name}</span>
                            <span className="text-[10px] font-bold">
                              {isMissing ? 'Missing' : 'Available ✓'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Arrow */}
                <div className="text-slate-400 py-1 md:py-0">
                  <ArrowRight className="w-5 h-5 hidden md:block" />
                  <span className="text-xs font-bold md:hidden">↓</span>
                </div>

                {/* Step 2: Target Document */}
                <div className="w-full md:w-3/12">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                    2. Apply & Procure
                  </span>
                  <div className="p-3 bg-white rounded-lg border-2 border-blue-600 text-xs font-bold text-slate-900 shadow-2xs">
                    {node.document.name}
                    <span className="block text-[10px] text-blue-700 font-normal mt-0.5">
                      ~{node.document.typicalProcessingDays} days
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <div className="text-slate-400 py-1 md:py-0">
                  <ArrowRight className="w-5 h-5 hidden md:block" />
                  <span className="text-xs font-bold md:hidden">↓</span>
                </div>

                {/* Step 3: Unlocked Scheme */}
                <div className="w-full md:w-4/12">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                    3. Unlocks Application
                  </span>
                  <div className="space-y-1">
                    {node.impactedSchemes.map((s) => (
                      <div
                        key={s.id}
                        className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-xs font-semibold text-emerald-900"
                      >
                        {s.shortName} ({s.benefit.displayAmount})
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Navigation Footer */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onBackToReadiness}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 py-2 px-4 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          ← Back to Readiness Groups
        </button>

        <button
          onClick={onProceedToRoadmap}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-semibold text-sm shadow-md shadow-blue-900/20 transition-all hover:translate-x-0.5 cursor-pointer"
        >
          Build My Application Roadmap
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
