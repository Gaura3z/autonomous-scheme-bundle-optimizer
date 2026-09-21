/**
 * Page 10: Document Readiness Evaluation
 * Partitions bundle into "Ready to Pursue" vs "Eligible, Document Missing".
 * Explicitly treats missing documents as readiness gaps, not disqualifications.
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 */
import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  HelpCircle, 
  FileText, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
  Building2,
  Printer
} from 'lucide-react';
import { DocumentReadiness, Scheme, DocumentInfo } from '../../types';
import { SchemeJurisdictionBadge } from '../common/SchemeJurisdictionBadge';
import { createDocumentReadinessPdf } from '../../services/documentReadinessPdf';

interface DocumentReadinessProps {
  readiness: DocumentReadiness;
  onProceedToDependencies: () => void;
  onBackToChecklist: () => void;
}

export const DocumentReadinessView: React.FC<DocumentReadinessProps> = ({
  readiness,
  onProceedToDependencies,
  onBackToChecklist
}) => {
  const [selectedDocForGuidance, setSelectedDocForGuidance] = useState<DocumentInfo | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const handlePdfExport = async () => {
    setIsExportingPdf(true);
    try {
      const pdfBytes = await createDocumentReadinessPdf(readiness);
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = pdfUrl;
      downloadLink.download = `SchemeWise_Document_Readiness_${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      window.setTimeout(() => URL.revokeObjectURL(pdfUrl), 10_000);
    } catch (error) {
      console.error('Unable to create the document readiness PDF', error);
      try {
        window.print();
      } catch {
        // ignore
      }
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handlePrint = async () => {
    try {
      window.print();
    } catch {
      await handlePdfExport();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10 print:py-2 print:px-0">
      {/* Official Print Watermark Banner */}
      <div className="print-header-banner">
        <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900">
          <div>
            <div className="text-[10pt] font-extrabold uppercase tracking-wider text-slate-800">
              SchemeWise Citizen Benefits Portal
            </div>
            <h1 className="text-xl font-black text-slate-900 mt-0.5">
              Document Readiness & Procurement Audit
            </h1>
            <div className="text-xs text-slate-600 mt-0.5">
              Autonomous Scheme-Bundle Optimizer (PS16) • Ready Applications vs. Missing Certificates
            </div>
          </div>
          <div className="text-right text-[9pt] text-slate-600 font-mono">
            <div>Date: {new Date().toLocaleDateString('en-IN')}</div>
            <div>Ready: {readiness.readySchemes.length} Schemes</div>
            <div>Action Required: {readiness.documentMissingSchemes.length} Schemes</div>
          </div>
        </div>
      </div>

      {/* Screen Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              Stage 8 • Readiness Separation
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Document Readiness Assessment
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              We compare your declared documents against scheme filing requirements to separate immediate opportunities from those needing certificate issuance.
            </p>
          </div>

          <div className="print:hidden shrink-0 flex items-center gap-2">
            <button
              type="button"
              onClick={handlePdfExport}
              disabled={isExportingPdf}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-60"
              title="Download verified Document Readiness PDF report"
              aria-label="Download the document readiness assessment as a PDF"
            >
              {isExportingPdf ? (
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <FileText className="w-3.5 h-3.5 text-blue-200" />
              )}
              <span>{isExportingPdf ? 'Generating PDF...' : 'Download PDF'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
              title="Print document readiness assessment"
            >
              <Printer className="w-4 h-4 text-slate-700" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Civic Principle Notice */}
        <div className="mt-4 p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start gap-3 print:bg-white print:border-slate-300 print:rounded-none">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-950 leading-relaxed print:text-black">
            <strong>System Principle:</strong> Missing a document does <em>not</em> mean you are ineligible. You have fully qualified under the statutory criteria; you simply need to procure the missing proof to complete your application.
          </div>
        </div>
      </div>

      {/* Group 1: Ready to Pursue (GREEN) */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 rounded-full bg-emerald-600" />
          <h3 className="text-base font-bold text-slate-900">
            Ready to Pursue ({readiness.readySchemes.length} Schemes)
          </h3>
          <span className="text-xs text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full font-semibold">
            All Documents Ready
          </span>
        </div>

        {readiness.readySchemes.length === 0 ? (
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-slate-500 text-center">
            No schemes currently have all documents available. Procuring the missing documents below will unlock your applications.
          </div>
        ) : (
          <div className="space-y-3">
            {readiness.readySchemes.map((scheme) => (
              <div
                key={scheme.id}
                className="bg-white rounded-2xl border-2 border-emerald-300 p-5 shadow-2xs hover:border-emerald-500 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 print-avoid-break print:rounded-none print:border-slate-300 print:p-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                      {scheme.category}
                    </span>
                    <SchemeJurisdictionBadge jurisdiction={scheme.jurisdiction} showStateText={false} />
                    <span className="text-slate-300 print:hidden">•</span>
                    <span className="text-xs font-bold text-emerald-700 print:text-black">
                      ✓ Instant Online Filing Possible
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900">
                    {scheme.name}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {scheme.tagline}
                  </p>
                </div>

                <div className="sm:text-right shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                  <span className="text-sm font-extrabold text-emerald-800 print:text-black block">
                    {scheme.benefit.displayAmount}
                  </span>
                  <a
                    href={scheme.officialSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline mt-1 print:hidden"
                  >
                    Portal Guide
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="hidden print:block text-[9pt] font-mono text-slate-600">
                    {scheme.officialSourceUrl}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Group 2: Eligible, But Document Missing (YELLOW) */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <h3 className="text-base font-bold text-slate-900">
            Eligible, But Document Missing ({readiness.documentMissingSchemes.length} Schemes)
          </h3>
          <span className="text-xs text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full font-semibold">
            Readiness Gap Only
          </span>
        </div>

        {readiness.documentMissingSchemes.length === 0 ? (
          <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/30 text-xs text-emerald-800 text-center font-medium">
            Outstanding! You already possess all necessary documents for your entire bundle.
          </div>
        ) : (
          <div className="space-y-4">
            {readiness.documentMissingSchemes.map(({ scheme, missingDocuments }) => (
              <div
                key={scheme.id}
                className="bg-white rounded-2xl border border-amber-200 p-5 shadow-2xs hover:border-amber-300 transition-all print-avoid-break print:rounded-none print:border-slate-300 print:p-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded print:border print:border-slate-300 print:bg-white print:text-black">
                        ✓ Eligibility Conditions Met
                      </span>
                      <span className="text-slate-300 print:hidden">•</span>
                      <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded print:border print:border-slate-300 print:bg-white print:text-black">
                        ⚠ {missingDocuments.length} document(s) missing
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900">
                      {scheme.name}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {scheme.tagline}
                    </p>
                  </div>

                  <span className="text-sm font-extrabold text-blue-900 print:text-black shrink-0">
                    {scheme.benefit.displayAmount}
                  </span>
                </div>

                {/* Missing Document Pills with "How to get" button */}
                <div className="bg-amber-50/50 rounded-xl p-3 border border-amber-200/60 print:bg-white print:border-slate-300">
                  <span className="text-[11px] font-bold text-amber-900 print:text-slate-900 block mb-2">
                    Missing Documents Required for this Application:
                  </span>

                  <div className="flex flex-wrap gap-2">
                    {missingDocuments.map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() => setSelectedDocForGuidance(doc)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-slate-800 border border-amber-300 hover:bg-amber-100/60 transition-colors cursor-pointer shadow-2xs print:border-slate-400 print:shadow-none"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-600 print:text-black" />
                        <span>{doc.name}</span>
                        <span className="text-[10px] text-blue-700 underline font-semibold ml-1 print:hidden">
                          How to get?
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* "How to get this document" Detail Modal */}
      {selectedDocForGuidance && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 print:hidden">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150">
            <h4 className="text-base font-bold text-slate-900 mb-1">
              How to Obtain: {selectedDocForGuidance.name}
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Issuing Authority: {selectedDocForGuidance.issuingAuthority}
            </p>

            <div className="space-y-3 text-xs text-slate-700 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <strong className="block font-semibold text-slate-900 mb-0.5">Description:</strong>
                <p className="text-slate-600">{selectedDocForGuidance.description}</p>
              </div>

              <div>
                <strong className="block font-semibold text-slate-900 mb-0.5">Typical Processing Time:</strong>
                <p className="text-slate-600">
                  {selectedDocForGuidance.typicalProcessingDays > 0
                    ? `Approximately ${selectedDocForGuidance.typicalProcessingDays} working days`
                    : 'Instant digital token download'}
                </p>
              </div>

              {selectedDocForGuidance.prerequisites.length > 0 && (
                <div>
                  <strong className="block font-semibold text-slate-900 mb-0.5">Prerequisites Required:</strong>
                  <p className="text-amber-800">
                    You must possess: {selectedDocForGuidance.prerequisites.join(', ')} before applying.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              {selectedDocForGuidance.applicationPortal ? (
                <a
                  href={selectedDocForGuidance.applicationPortal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold"
                >
                  Official Portal
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : <div />}

              <button
                onClick={() => setSelectedDocForGuidance(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <button
          onClick={onBackToChecklist}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 py-2 px-4 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          ← Update Checked Documents
        </button>

        <button
          onClick={onProceedToDependencies}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-semibold text-sm shadow-md shadow-blue-900/20 transition-all hover:translate-x-0.5 cursor-pointer"
        >
          View Document Dependencies & Roadmap
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
