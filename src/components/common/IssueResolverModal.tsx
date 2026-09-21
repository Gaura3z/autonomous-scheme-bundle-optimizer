import React, { useState, useMemo } from 'react';
import { 
  HelpCircle, 
  X, 
  Search, 
  AlertTriangle, 
  FileText, 
  PhoneCall, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldAlert, 
  Building2, 
  CreditCard, 
  RefreshCw,
  Sparkles,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface IssueResolverModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
  onResetSession?: () => void;
}

interface IssueTemplate {
  id: string;
  category: 'document' | 'name_mismatch' | 'bank_dbt' | 'caste_validity' | 'portal_rejection' | 'app_help';
  categoryLabel: string;
  title: string;
  summary: string;
  symptoms: string[];
  immediateSteps: string[];
  affidavitTemplate?: {
    title: string;
    text: string;
  };
  officialHelpline?: {
    name: string;
    number: string;
    hours: string;
    portalUrl?: string;
  };
}

const ISSUE_DATABASE: IssueTemplate[] = [
  {
    id: 'name_mismatch',
    category: 'name_mismatch',
    categoryLabel: 'Name & Spelling Mismatch',
    title: 'Name / Surname / DOB Differs Between Marksheet, Aadhaar & Caste Certificate',
    summary: 'Spelling variations (e.g. initials vs. expanded name, father\'s name order) are the #1 reason scholarship verification gets stuck at the college scrutinizer desk.',
    symptoms: [
      'Aadhaar has expanded name while 10th marksheet uses father\'s initials',
      'Spelling differences in surname across Ration Card, Domicile, or Marksheet',
      'MahaDBT or NSP shows error: "Applicant name does not match UIDAI demographic database"'
    ],
    immediateSteps: [
      'Draft a standard ₹100 Notarized "One and the Same Person" Affidavit (format provided below). All universities and state welfare departments accept this.',
      'Submit the notarized affidavit copy to your college scholarship nodal officer along with your application acknowledgment.',
      'For long-term correction: Update Aadhaar name online via myaadhaar.uidai.gov.in (takes 48 to 72 hours using 10th Passing Certificate as Proof of Identity).'
    ],
    affidavitTemplate: {
      title: 'Affidavit for Name Variation / "One and the Same Person"',
      text: `BEFORE THE EXECUTIVE MAGISTRATE / NOTARY PUBLIC

AFFIDAVIT OF IDENTITY (ONE AND THE SAME PERSON)

I, [FULL NAME AS PER 10TH MARKSHEET], Age: [AGE] Years, Residing at [FULL RESIDENTIAL ADDRESS], do hereby solemnly affirm and state on oath as under:

1. That my name is recorded as "[NAME IN MARKSHEET]" in my 10th / 12th Board Marksheet and College Records.
2. That my name is recorded as "[NAME IN AADHAAR]" in my Aadhaar Card (UIDAI No: XXXX-XXXX-[LAST 4 DIGITS]).
3. That both the above-mentioned names belong to one and the same person, i.e., myself, the deponent.
4. That I am making this affidavit to submit before the College Principal, Welfare Department, and MahaDBT / National Scholarship Portal authorities as conclusive proof of my single identity.

Whatever stated above is true and correct to the best of my knowledge and belief.

Deponent Signature: __________________
Date & Place: __________________
Verified by Notary Public / Oath Commissioner`
    },
    officialHelpline: {
      name: 'UIDAI Aadhaar Demographic Helpdesk',
      number: '1947',
      hours: '24x7 Toll-Free',
      portalUrl: 'https://myaadhaar.uidai.gov.in'
    }
  },
  {
    id: 'bank_dbt_failed',
    category: 'bank_dbt',
    categoryLabel: 'Bank & DBT Seeding Issue',
    title: 'Bank Account Not Seeded with NPCI / Aadhaar Direct Benefit Transfer (DBT) Inactive',
    summary: 'Government scholarship and welfare cash benefits can ONLY be credited to an Aadhaar-mapped NPCI DBT account. Merely linking Aadhaar for KYC is NOT enough.',
    symptoms: [
      'Scholarship sanctioned by department but amount shows "Payment Failed / Account Inactive"',
      'PFMS (Public Financial Management System) status shows "Aadhaar not mapped to NPCI"',
      'Bank account is a minor/student zero-balance account with low incoming credit ceiling'
    ],
    immediateSteps: [
      'Visit your bank branch and ask specifically for the "NPCI Aadhaar Mandate Form (Annexure-I for DBT enablement)".',
      'Do NOT just do e-KYC. Clearly instruct the clerk: "I need NPCI DBT Direct Credit Mapping for Government Scholarships".',
      'Verify status online: Visit resident.uidai.gov.in/bank-mapper or use the BHIM app -> Bank Accounts -> Aadhaar Seeding.',
      'Submit the bank-stamped NPCI acknowledgment copy to your college scholarship section to re-trigger PFMS disbursement.'
    ],
    officialHelpline: {
      name: 'PFMS (Public Financial Management System) Toll-Free',
      number: '1800-118-111',
      hours: 'Mon–Sat (9:30 AM – 6:00 PM)',
      portalUrl: 'https://pfms.nic.in'
    }
  },
  {
    id: 'caste_validity_delay',
    category: 'caste_validity',
    categoryLabel: 'Caste Validity Delay',
    title: 'Caste Scrutiny Committee Validity Certificate Pending or Delayed',
    summary: 'Under Maharashtra Government Resolution (GR), students who have applied for validity are protected from admission or scholarship cancellation by submitting the committee receipt and undertaking.',
    symptoms: [
      'Caste validity application submitted at Dr. Babasaheb Ambedkar Research & Training Institute (BARTI / CCVIS portal) but certificate not issued yet',
      'College warning of admission cancellation or demanding full open-category fee due to missing validity',
      'MahaDBT form requiring Validity Certificate number'
    ],
    immediateSteps: [
      'Under Maharashtra Govt Resolution, submit the Scrutiny Committee Application Receipt (पावती) along with the standard Undertaking (हमीपत्र).',
      'Colleges are legally mandated to accept the Scrutiny Receipt for provisional admission without charging full Open-category fees.',
      'Check status on the CCVIS (Caste Certificate Verification Information System) portal at barticcvs.maharashtra.gov.in.',
      'If pending for more than 90 days, file an inquiry under the Maharashtra Guarantee of Public Services (RTS) Act via Aaple Sarkar portal.'
    ],
    affidavitTemplate: {
      title: 'College Undertaking Format (हमीपत्र) for Pending Caste Validity',
      text: `UNDERTAKING / हमीपत्र (MAHARASHTRA GOVT RESOLUTION COMPLIANT)

To,
The Principal / Head of Institution,
[COLLEGE / INSTITUTION NAME]

Subject: Undertaking regarding submission of Caste Validity Certificate.

Respected Sir/Madam,
I, [STUDENT NAME], admitted to [COURSE & YEAR] under [SC / ST / VJNT / OBC / SEBC] category:

1. I have applied for Caste Validity Certificate before the Divisional Caste Scrutiny Committee on [DATE OF APPLICATION].
2. The Application Form Receipt / Token No. is [RECEIPT / APPLICATION NUMBER].
3. I hereby declare that as soon as the Scrutiny Committee issues the validity certificate, I will submit the original copy to the college within the stipulated window.
4. In accordance with State Government Resolutions, I request you to accept this acknowledgment receipt and forward my scholarship application on MahaDBT.

Student Name: _______________________
Roll No / Admission No: ______________
Date: _______________________________`
    },
    officialHelpline: {
      name: 'BARTI Caste Scrutiny CCVIS Support',
      number: '020-26058133',
      hours: 'Mon–Fri (10:00 AM – 5:30 PM)',
      portalUrl: 'https://barticcvs.maharashtra.gov.in'
    }
  },
  {
    id: 'income_cert_delay',
    category: 'document',
    categoryLabel: 'Income & Domicile Delay',
    title: 'Income Certificate Expired or Tahsildar / Setu Office Delay',
    summary: 'Income certificates in Maharashtra are valid strictly up to March 31st of the financial year. Learn how to secure priority issuance or submit a valid interim receipt.',
    symptoms: [
      'Tahsildar / Setu Kendra token issued but final digitally signed certificate not generated',
      'Income certificate from previous fiscal year expired on March 31st',
      'College asking for current financial year certificate immediately'
    ],
    immediateSteps: [
      'Under the Maharashtra Right to Public Services Act (RTS), the Tahsildar is legally bound to deliver income certificates within 15 working days.',
      'Check application status on Aaple Sarkar (aaplesarkar.mahaonline.gov.in) with your 15-digit application token.',
      'Download digitally signed copy instantly via DigiLocker once approved—you do NOT need to stand in line at the Setu Kendra for a physical stamp.',
      'If delayed beyond 15 days, click "First Appeal" on Aaple Sarkar directly to the Sub-Divisional Officer (SDO).'
    ],
    officialHelpline: {
      name: 'Maharashtra Citizen Helpline (Aaple Sarkar / RTS)',
      number: '1800-120-8040',
      hours: 'Toll-Free 24x7',
      portalUrl: 'https://aaplesarkar.mahaonline.gov.in'
    }
  },
  {
    id: 'mahadbt_rejection',
    category: 'portal_rejection',
    categoryLabel: 'Portal Rejection & Grievance',
    title: 'Scholarship Application Rejected by College Scrutinizer or Department',
    summary: 'A rejection remark does not mean you permanently lost the scholarship. Most rejections are "Send Back to Applicant" for document re-upload within a 15-day rectification window.',
    symptoms: [
      'Application status reads: "Scrutiny Completed - Rejected" or "Sent Back with Remark"',
      'Remark states: "Clear marksheet copy needed", "Income certificate unclear", or "Hostel certificate not attached"',
      'Status stuck at "Under DDO Approval" for months'
    ],
    immediateSteps: [
      'Log into MahaDBT / NSP, open "My Applied Schemes History", and click the "View Remark" eye icon to see the exact missing point.',
      'Do NOT apply as a new applicant! Click "Edit / Re-upload" to rectify only the flagged document within the 15-day window.',
      'Inform your College Scholarship Clerk in person to re-forward your form to the Department Clerk (Level 2).',
      'If unfairly rejected, file an official grievance on the MahaDBT Grievance Redressal tab or call the State Helpline 181.'
    ],
    officialHelpline: {
      name: 'MahaDBT Official Helpdesk (Department of Social Welfare)',
      number: '022-49150800',
      hours: 'Mon–Sat (8:00 AM – 8:00 PM)',
      portalUrl: 'https://mahadbt.maharashtra.gov.in'
    }
  },
  {
    id: 'schemewise_app_issue',
    category: 'app_help',
    categoryLabel: 'SchemeWise Troubleshooting',
    title: 'Need to Change Answers, Re-evaluate Schemes, or Clear Saved Data',
    summary: 'Guidance on resetting your evaluation, adjusting student vs. citizen status, or changing your income tier in SchemeWise.',
    symptoms: [
      'Selected wrong category or education level in the questionnaire',
      'Want to try a different scenario (e.g. Hosteller vs. Day Scholar)',
      'Need to see what schemes unlock if you get a missing certificate'
    ],
    immediateSteps: [
      'Click the "Reset" button in the top navigation bar at any time to clear cached inputs and restart fresh.',
      'In the "Document Checklist" stage, checking or unchecking documents instantly recalibrates the readiness roadmap.',
      'In the "Optimized Bundle" stage, use the "Customize Selection" controls to test alternate non-conflicting combinations.'
    ]
  }
];

export const IssueResolverModal: React.FC<IssueResolverModalProps> = ({
  isOpen,
  onClose,
  initialCategory,
  onResetSession
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [activeIssueId, setActiveIssueId] = useState<string>('name_mismatch');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter issues based on search and selected category
  const filteredIssues = useMemo(() => {
    return ISSUE_DATABASE.filter((issue) => {
      const matchesCat = selectedCategory === 'all' || issue.category === selectedCategory;
      if (!matchesCat) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        issue.title.toLowerCase().includes(q) ||
        issue.summary.toLowerCase().includes(q) ||
        issue.categoryLabel.toLowerCase().includes(q) ||
        issue.symptoms.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [selectedCategory, searchQuery]);

  const activeIssue = useMemo(() => {
    return ISSUE_DATABASE.find((i) => i.id === activeIssueId) || filteredIssues[0] || ISSUE_DATABASE[0];
  }, [activeIssueId, filteredIssues]);

  const handleCopyText = (id: string, text: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      // ignore
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-5 py-4 sm:px-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <HelpCircle className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">
                  Citizen Grievance & Issue Solver
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-semibold">
                  Instant Self-Resolution
                </span>
              </div>
              <p className="text-xs text-blue-200">
                Fix document errors, name mismatches, bank DBT failures & portal rejections without visiting agents
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close Issue Solver"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 shrink-0 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your issue (e.g. name spelling mismatch, bank DBT inactive, caste validity pending)..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Issues ({ISSUE_DATABASE.length})
            </button>
            <button
              onClick={() => setSelectedCategory('name_mismatch')}
              className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-colors cursor-pointer ${
                selectedCategory === 'name_mismatch'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Name & Spelling
            </button>
            <button
              onClick={() => setSelectedCategory('bank_dbt')}
              className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-colors cursor-pointer ${
                selectedCategory === 'bank_dbt'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Bank DBT / NPCI
            </button>
            <button
              onClick={() => setSelectedCategory('caste_validity')}
              className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-colors cursor-pointer ${
                selectedCategory === 'caste_validity'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Caste Validity Delay
            </button>
            <button
              onClick={() => setSelectedCategory('document')}
              className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-colors cursor-pointer ${
                selectedCategory === 'document'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Income / Domicile
            </button>
            <button
              onClick={() => setSelectedCategory('portal_rejection')}
              className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-colors cursor-pointer ${
                selectedCategory === 'portal_rejection'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Portal Rejections
            </button>
          </div>
        </div>

        {/* Modal Body: Two-Column Responsive Layout */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 min-h-0">
          {/* Issue List Column */}
          <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-slate-200 p-3 space-y-2 bg-slate-50/50 overflow-y-auto max-h-[30vh] md:max-h-full">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1">
              Select Your Situation ({filteredIssues.length})
            </span>

            {filteredIssues.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">
                No matching problem found. Try searching for &quot;Aadhaar&quot;, &quot;Bank&quot;, or &quot;Validity&quot;.
              </div>
            ) : (
              filteredIssues.map((issue) => {
                const isActive = issue.id === activeIssue.id;
                return (
                  <button
                    key={issue.id}
                    onClick={() => setActiveIssueId(issue.id)}
                    className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer border ${
                      isActive
                        ? 'bg-white border-blue-600 shadow-sm ring-1 ring-blue-600/30'
                        : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <span className="text-[10px] font-semibold text-blue-700 block mb-0.5">
                      {issue.categoryLabel}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                      {issue.title}
                    </h3>
                  </button>
                );
              })
            )}

            {/* Quick App Reset Card */}
            <div className="mt-4 pt-3 border-t border-slate-200 px-2">
              <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
                Stuck in SchemeWise Assessment?
              </span>
              <button
                onClick={() => {
                  if (onResetSession) {
                    onResetSession();
                    onClose();
                  } else {
                    window.location.reload();
                  }
                }}
                className="w-full py-2 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
                <span>Reset & Restart Assessment</span>
              </button>
            </div>
          </div>

          {/* Solution Detail Column */}
          <div className="md:col-span-8 p-5 sm:p-6 overflow-y-auto space-y-6 bg-white">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                  {activeIssue.categoryLabel}
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Legally Approved Pathway
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                {activeIssue.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                {activeIssue.summary}
              </p>
            </div>

            {/* Identified Symptoms */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Common Signs of this Problem:</span>
              </div>
              <ul className="space-y-1.5 text-xs text-amber-950">
                {activeIssue.symptoms.map((symptom, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{symptom}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actionable Steps */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-700" />
                <span>Exact Resolution Steps to Follow:</span>
              </h3>
              <div className="space-y-3">
                {activeIssue.immediateSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3"
                  >
                    <span className="w-6 h-6 rounded-full bg-blue-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-slate-800 leading-relaxed font-medium">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Affidavit / Legal Format Template (if present) */}
            {activeIssue.affidavitTemplate && (
              <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-700" />
                    <h3 className="text-xs font-bold text-indigo-950">
                      {activeIssue.affidavitTemplate.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleCopyText(activeIssue.id, activeIssue.affidavitTemplate!.text)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-indigo-200 text-xs font-semibold text-indigo-900 hover:bg-indigo-100 shadow-2xs transition-colors cursor-pointer"
                  >
                    {copiedId === activeIssue.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Copy Format</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-indigo-800 mb-3">
                  Print this draft on ₹100 non-judicial stamp paper or plain paper with college stamp.
                </p>

                <pre className="p-3.5 bg-white rounded-xl border border-indigo-100 text-[11px] font-mono text-slate-800 leading-relaxed whitespace-pre-wrap max-h-52 overflow-y-auto">
                  {activeIssue.affidavitTemplate.text}
                </pre>
              </div>
            )}

            {/* Official Helpline / Portal Card */}
            {activeIssue.officialHelpline && (
              <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-950">
                      {activeIssue.officialHelpline.name}
                    </h4>
                    <span className="text-xs font-extrabold text-emerald-700 block">
                      📞 {activeIssue.officialHelpline.number}{' '}
                      <span className="font-normal text-emerald-800">
                        ({activeIssue.officialHelpline.hours})
                      </span>
                    </span>
                  </div>
                </div>

                {activeIssue.officialHelpline.portalUrl && (
                  <a
                    href={activeIssue.officialHelpline.portalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-2xs"
                  >
                    <span>Visit Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            SchemeWise Citizen Support Engine • Compliant with Maharashtra Right to Public Services Act (RTS)
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto ml-auto px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Done / Close Solver
          </button>
        </div>
      </motion.div>
    </div>
  );
};
