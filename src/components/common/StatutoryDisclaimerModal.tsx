import React, { useState } from 'react';
import { ShieldAlert, FileText, CheckCircle2, ChevronDown, ChevronUp, Info, ExternalLink, X } from 'lucide-react';

interface StatutoryDisclaimerModalProps {
  variant?: 'banner' | 'card' | 'footer';
  className?: string;
}

export const StatutoryDisclaimerModal: React.FC<StatutoryDisclaimerModalProps> = ({
  variant = 'banner',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasAcknowledged, setHasAcknowledged] = useState(() => {
    return localStorage.getItem('schemewise_terms_acknowledged') === 'true';
  });
  const [expandedSection, setExpandedSection] = useState<number | null>(0);

  const handleAcknowledge = () => {
    localStorage.setItem('schemewise_terms_acknowledged', 'true');
    setHasAcknowledged(true);
    setIsOpen(false);
  };

  const advisoryPoints = [
    {
      title: 'Algorithmic Estimation vs. Official Government Sanction',
      content:
        'SchemeWise computes eligibility mathematically using published Government Resolutions (GRs) from MahaDBT, National Scholarship Portal (NSP), and Ministry guidelines. However, recommendations do NOT guarantee automatic sanction or bank disbursement. Final approval rests exclusively with College Scrutiny Committees and District Social Welfare Officers.'
    },
    {
      title: 'Scrutiny of Physical & Certified Documents',
      content:
        'Your eligibility calculation is strictly contingent on the accuracy and validity of declared certificates (Income Certificate issued by Tahsildar, Caste Certificate, Caste Validity Certificate, Non-Creamy Layer, Domicile, and CAP Allotment Letter). Any discrepancies during institutional document physical verification may lead to rejection by the department.'
    },
    {
      title: 'Annual Budget Allocations & State Quota Ceilings',
      content:
        'Certain merit schemes, foreign scholarships, and training stipends have fixed annual budgetary ceilings and departmental selection quotas. Meeting basic eligibility criteria makes you eligible to apply, but does not guarantee selection if departmental applicant quotas are exceeded.'
    },
    {
      title: 'Government Resolution (GR) & Date Revisions',
      content:
        'State and Central departments reserve statutory authority to revise application deadlines, income caps, attendance requirements, or disbursement schedules without advance notice. Always cross-verify current portal status on official portals (mahadbt.maharashtra.gov.in / scholarships.gov.in).'
    }
  ];

  return (
    <>
      {/* Visual In-page Banner */}
      <div
        className={`rounded-xl border border-amber-200 bg-amber-50/90 p-4 text-amber-900 shadow-sm print:hidden ${className}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-amber-950">
                  Statutory Advisory & Eligibility Disclaimer
                </h4>
                {hasAcknowledged && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> Acknowledged
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-800/90 mt-0.5 leading-relaxed">
                Scheme recommendations are advisory estimates based on published government criteria. Final disbursement depends entirely on physical certificate scrutiny by college & government nodal officers.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="self-start sm:self-center shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-950 bg-amber-200/80 hover:bg-amber-200 rounded-lg transition-colors border border-amber-300"
          >
            <Info className="w-3.5 h-3.5 text-amber-800" />
            View Terms & Advisory
          </button>
        </div>
      </div>

      {/* Full Advisory Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Terms of Advisory & Scheme Eligibility Disclaimers
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mandatory transparency declaration for citizen applicants
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-5 overflow-y-auto space-y-4 text-sm text-slate-700">
              <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-900 leading-relaxed">
                <strong>Notice to Students & Parents:</strong> SchemeWise is an independent civic-tech advisory engine designed to help citizens identify, prioritize, and prepare documents for legitimate government welfare and scholarship programs. We do NOT represent government sanctioning authorities or charge fees on behalf of the Government.
              </div>

              <div className="space-y-3">
                {advisoryPoints.map((item, idx) => {
                  const isExpanded = expandedSection === idx;
                  return (
                    <div
                      key={idx}
                      className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
                    >
                      <button
                        onClick={() => setExpandedSection(isExpanded ? null : idx)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100/80 text-left font-medium text-slate-800 text-sm"
                      >
                        <span className="flex items-center gap-2">
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-xs font-bold">
                            {idx + 1}
                          </span>
                          {item.title}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="px-4 py-3 text-xs leading-relaxed text-slate-600 bg-white border-t border-slate-100">
                          {item.content}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 text-xs text-slate-500 space-y-1">
                <p>
                  <strong>Official Portals for Verification:</strong>
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <a
                    href="https://mahadbt.maharashtra.gov.in"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium text-[11px]"
                  >
                    Aaple Sarkar MahaDBT <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href="https://scholarships.gov.in"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium text-[11px]"
                  >
                    National Scholarship Portal (NSP) <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href="https://pmkisan.gov.in"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium text-[11px]"
                  >
                    PM-KISAN Portal <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
              <span className="text-xs text-slate-500">
                SchemeWise Advisory Governance v2026.2
              </span>
              <button
                onClick={handleAcknowledge}
                className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                I Understand & Agree
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
