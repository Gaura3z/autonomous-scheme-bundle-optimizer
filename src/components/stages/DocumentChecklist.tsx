/**
 * Page 5: Document Declaration before conflict resolution and optimization
 * Extremely clean, privacy-preserving checkbox selection.
 * No uploads or credential demands.
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 */
import React from 'react';
import { 
  CheckSquare, 
  Square, 
  ArrowRight, 
  ShieldCheck, 
  Info, 
  FileText,
  Building2,
  Clock
} from 'lucide-react';
import { DocumentInfo, Scheme } from '../../types';
import { planDocumentRequests } from '../../engine/documents';

interface DocumentChecklistProps {
  bundleSchemes: Scheme[];
  declaredDocumentIds: string[];
  onToggleDocument: (docId: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  onProceedToReadiness: () => void;
  onBackToBundle: () => void;
}

export const DocumentChecklist: React.FC<DocumentChecklistProps> = ({
  bundleSchemes,
  declaredDocumentIds,
  onToggleDocument,
  onSelectAll,
  onClearAll,
  onProceedToReadiness,
  onBackToBundle
}) => {
  const documentRequests = planDocumentRequests(bundleSchemes, declaredDocumentIds);
  const requiredDocIds = documentRequests.map((request) => request.document.id);

  const declaredSet = new Set(declaredDocumentIds);

  // Group only documents connected to the current eligible scheme set.
  const docsByCategory: Record<string, DocumentInfo[]> = {};
  for (const request of documentRequests) {
    const doc = request.document;

    if (!docsByCategory[doc.category]) {
      docsByCategory[doc.category] = [];
    }
    docsByCategory[doc.category].push(doc);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
          Stage 5 • Quick Document Check
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
          Which required documents do you already have?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          We ask only about documents relevant to schemes you may qualify for. Your answers decide what can be filed today; they do not decide eligibility.
        </p>

        {/* Privacy Notice */}
        <div className="mt-4 p-4 bg-blue-50/80 border border-blue-200 rounded-2xl flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-950 leading-relaxed">
            <strong>Zero-Upload Privacy Model:</strong> We only use this self-declared checklist to calculate your immediate readiness gap. You do <em>not</em> need to upload files, enter Aadhaar OTPs, or transmit private records.
          </div>
        </div>
      </div>

      {/* Select All / Clear Quick Bar */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
        <span className="text-xs font-semibold text-slate-700">
          Selected: <strong className="text-blue-900">{declaredDocumentIds.filter((id) => requiredDocIds.includes(id)).length}</strong> of {requiredDocIds.length} relevant documents
        </span>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSelectAll}
            className="text-xs font-semibold text-blue-700 hover:text-blue-900 hover:underline cursor-pointer"
          >
            Select All
          </button>
          <span className="text-slate-300">|</span>
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-semibold text-slate-500 hover:text-slate-700 hover:underline cursor-pointer"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Grouped Checklist */}
      <div className="space-y-6 mb-8">
        {Object.entries(docsByCategory).map(([category, docs]) => (
          <div key={category} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              {category} Documents
            </h3>

            <div className="space-y-2.5">
              {docs.map((doc) => {
                const isChecked = declaredSet.has(doc.id);

                return (
                  <div
                    key={doc.id}
                    onClick={() => onToggleDocument(doc.id)}
                    role="checkbox"
                    aria-checked={isChecked}
                    tabIndex={0}
                    onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onToggleDocument(doc.id); } }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isChecked
                        ? 'border-emerald-400 bg-emerald-50/40'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div className="mt-0.5 text-emerald-700 shrink-0">
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="text-sm font-bold text-slate-900">
                          {doc.name}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {doc.typicalProcessingDays > 0 ? `~${doc.typicalProcessingDays} days` : 'Instant Digital'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed mb-1">
                        {doc.description}
                      </p>

                      <p className="text-[11px] font-semibold text-blue-800">
                        Unlocks: {documentRequests.find((request) => request.document.id === doc.id)?.requiredBy.map((scheme) => scheme.shortName).join(', ')}
                      </p>

                      <span className="text-[11px] text-slate-400 block">
                        Issuing Authority: {doc.issuingAuthority}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Footer */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onBackToBundle}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 py-2 px-4 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          ← Back to Questions
        </button>

        <button
          onClick={onProceedToReadiness}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-semibold text-sm shadow-md shadow-blue-900/20 transition-all hover:translate-x-0.5 cursor-pointer"
        >
          Continue to conflict-safe bundle
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
