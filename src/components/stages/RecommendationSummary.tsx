/**
 * Page 13: Final Recommendation Synthesis ("Why these recommendations?")
 * Comprehensive audit trail answering why schemes were chosen, why others were excluded,
 * and what trade-offs the optimizer made, with Print / Export support.
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 */
import React, { useState } from 'react';
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
  BookOpen,
  Download,
  Calendar,
  ArrowLeft,
  FileCheck2,
  FileText
} from 'lucide-react';
import { OptimizedBundle, SchemeEvaluation, CitizenProfile, RoadmapStep } from '../../types';
import { BackendAuditCard } from './BackendAuditCard';
import { CATALOG_VERSION } from '../../data/schemes';
import { MASTER_DOCUMENTS } from '../../data/documents';
import { getBundleValidity } from '../../engine/validity';
import { StatutoryDisclaimerModal } from '../common/StatutoryDisclaimerModal';
import { PaymentCheckoutModal } from '../common/PaymentCheckoutModal';
import { downloadRoadmapPdfFile, safePrintOrDownloadRoadmap } from '../../services/roadmapPdf';

interface RecommendationSummaryProps {
  profile: CitizenProfile;
  bundle: OptimizedBundle;
  evaluations: SchemeEvaluation[];
  roadmapSteps: RoadmapStep[];
  declaredDocumentIds: string[];
  onRestart: () => void;
  onOpenDemoSelector: () => void;
  onBackToRoadmap?: () => void;
}

export const RecommendationSummary: React.FC<RecommendationSummaryProps> = ({
  profile,
  bundle,
  evaluations,
  roadmapSteps,
  declaredDocumentIds,
  onRestart,
  onOpenDemoSelector,
  onBackToRoadmap
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [hasPaidPro, setHasPaidPro] = useState(() => {
    try {
      return localStorage.getItem('schemewise_pro_paid') === 'true';
    } catch {
      return false;
    }
  });

  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    try {
      await downloadRoadmapPdfFile(roadmapSteps, profile, bundle);
    } catch (err) {
      console.error('PDF generation error:', err);
      handleExportTextAudit();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = async () => {
    try {
      await safePrintOrDownloadRoadmap(roadmapSteps, profile, bundle);
    } catch (err) {
      await handleDownloadPDF();
    }
  };

  const excludedSchemes = evaluations.filter(
    (ev) => ev.status === 'INELIGIBLE' || ev.status === 'BLOCKED_BY_EXCLUSION'
  );
  const allBundleSchemes = bundle.selectedSchemes.length > 0 ? bundle.selectedSchemes : (bundle.potentialSelectedSchemes ?? []);
  const bundleValidity = getBundleValidity(allBundleSchemes);
  const missingDocumentIds: string[] = Array.from(new Set<string>(
    (bundle.documentBlockedSchemes ?? []).flatMap((item) => item.missingDocumentIds)
  ));
  const categoryLabel = profile.socialCategoryDetail
    ? `${profile.socialCategoryDetail} (${profile.socialCategory})`
    : profile.socialCategory;

  // Generate offline audit text report
  const handleExportTextAudit = () => {
    const dateStr = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    let content = `===============================================================================\n`;
    content += `GOVERNMENT OF INDIA • NATIONAL MY-SCHEME PORTAL\n`;
    content += `AUTONOMOUS SCHEME-BUNDLE OPTIMIZER — CITIZEN DECISION AUDIT REPORT\n`;
    content += `Kurukshetra 2.0 HACKFEST 2026 PS16\n`;
    content += `Audit Date: ${dateStr}\n`;
    content += `Catalog Version: ${CATALOG_VERSION}\n`;
    content += `Bundle Validity: ${bundleValidity.validUntil ? `${bundleValidity.label}: ${bundleValidity.displayDate}` : bundleValidity.label}\n`;
    content += `Validity Note: ${bundleValidity.note}\n`;
    content += `===============================================================================\n\n`;

    content += `CITIZEN PROFILE:\n`;
    content += `Age: ${profile.age} | Gender: ${profile.gender} | State: ${profile.state}\n`;
    content += `Social Category: ${categoryLabel} | Occupation: ${profile.occupation || profile.employmentStatus || 'General'}\n`;
    content += `Annual Family Income: INR ${profile.annualFamilyIncome.toLocaleString('en-IN')}\n\n`;

    content += `===============================================================================\n`;
    content += `1. SELECTED SCHEMES IN OPTIMIZED BUNDLE (${bundle.selectedSchemes.length} Schemes):\n`;
    content += `   Total Direct Monetary Benefit: INR ${bundle.totalMonetaryAnnual.toLocaleString('en-IN')}\n`;
    content += `   Conflicts resolved / alternatives rejected: ${bundle.conflictsResolvedCount}\n`;
    content += `===============================================================================\n\n`;

    bundle.selectedSchemes.forEach((scheme, i) => {
      content += `[${i + 1}] ${scheme.name.toUpperCase()}\n`;
      content += `    Ministry: ${scheme.ministry}\n`;
      content += `    Benefit: ${scheme.benefit.displayAmount} (${scheme.benefit.type})\n`;
      content += `    Description: ${scheme.tagline}\n`;
      content += `    Last Verified: ${scheme.lastVerifiedDate} | Knowledge Base: ${scheme.kbVersion}\n`;
      content += `    Official Source: ${scheme.officialSourceUrl}\n`;
      content += `    Application Date: ${scheme.applicationDeadline || 'No fixed deadline recorded'}\n`;
      content += `    Date Note: ${scheme.validityNote || 'Verify the official portal before filing.'}\n`;
      content += `    Statutory Decision: Qualified all eligibility thresholds without negative exclusion\n`;
      content += `\n`;
    });

    content += `===============================================================================\n`;
    content += `2. EXCLUDED ALTERNATIVES & THRESHOLD FAILURES:\n`;
    content += `===============================================================================\n\n`;

    excludedSchemes.forEach((ev, i) => {
      content += `[${i + 1}] ${ev.scheme.name}\n`;
      content += `    Reason: ${ev.unmetReasons.concat(ev.exclusionReasons).join('; ') || 'Criteria mismatch'}\n\n`;
      content += `    Official Source: ${ev.scheme.officialSourceUrl}\n`;
      content += `    Last Verified: ${ev.scheme.lastVerifiedDate}\n\n`;
    });

    content += `===============================================================================\n`;
    content += `3. MISSING DOCUMENTS / READINESS BLOCKERS:\n`;
    content += `===============================================================================\n\n`;
    if (missingDocumentIds.length > 0) {
      missingDocumentIds.forEach((documentId) => {
        content += `[ ] ${MASTER_DOCUMENTS[documentId]?.name || documentId}\n`;
        content += `    Declared by citizen: ${declaredDocumentIds.includes(documentId) ? 'Yes' : 'No'}\n`;
        content += `    Required by: ${(bundle.documentBlockedSchemes ?? []).filter((item) => item.missingDocumentIds.includes(documentId)).map((item) => item.scheme.name).join(', ') || 'Selected bundle'}\n\n`;
      });
    } else {
      content += `No missing documents were recorded for the actionable bundle.\n\n`;
    }

    content += `===============================================================================\n`;
    content += `4. STATUTORY CONFLICT & TRADE-OFF ARBITRATIONS:\n`;
    content += `===============================================================================\n\n`;

    if (bundle.rejectedAlternatives.length > 0) {
      bundle.rejectedAlternatives.forEach((alt, i) => {
        content += `[${i + 1}] Overlap with ${alt.scheme.shortName}:\n`;
        content += `    Arbitration: ${alt.rejectionReason}\n\n`;
      });
    } else {
      content += `No mutual exclusion conflicts triggered for this profile configuration.\n\n`;
    }

    content += `===============================================================================\n`;
    content += `5. IMMEDIATE APPLICATION ROADMAP CHECKLIST:\n`;
    content += `===============================================================================\n\n`;

    roadmapSteps.forEach((step) => {
      content += `[ ] Step ${step.stepNumber}: ${step.title} (${step.estimatedTimeline})\n`;
      content += `    Details: ${step.description}\n`;
      if (step.actionUrl) {
        content += `    Portal: ${step.actionUrl}\n`;
      }
      content += `\n`;
    });

    content += `===============================================================================\n`;
    content += `6. POTENTIAL BUNDLE (IF DOCUMENTS ARE COMPLETED):\n`;
    content += `===============================================================================\n\n`;
    (bundle.potentialSelectedSchemes ?? []).forEach((scheme) => {
      content += `- ${scheme.name} | ${scheme.benefit.displayAmount} | ${scheme.officialSourceUrl}\n`;
    });
    if (!(bundle.potentialSelectedSchemes ?? []).length) content += `No separate potential bundle was returned.\n`;
    content += `\n`;

    content += `===============================================================================\n`;
    content += `7. FUTURE / CONDITIONAL VERIFICATION ITEMS:\n`;
    content += `===============================================================================\n\n`;
    content += `These are intentionally not used to change today's recommendation:\n`;
    content += `- State-specific or phase-specific closing windows, if the official source publishes them.\n`;
    content += `- Rolling-window confirmation for schemes without a fixed deadline.\n`;
    content += `- Re-application, appeal, or renewal rules when the admin catalog supports them.\n`;
    content += `- Fresh source verification before a future catalog release.\n\n`;

    content += `===============================================================================\n`;
    content += `CIVIC AUDIT VERIFICATION: Deterministic calculation by PS16 Rule & Optimization Engines.\n`;
    content += `===============================================================================\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SchemeWise_Decision_Audit_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10 print:py-2 print:px-0">
      {/* Official Government Print Header Banner */}
      <div className="print-header-banner">
        <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900">
          <div>
            <div className="text-[10pt] font-extrabold uppercase tracking-wider text-slate-800">
              SchemeWise Citizen Benefits Portal
            </div>
            <h1 className="text-xl font-black text-slate-900 mt-0.5">
              Citizen Benefit Recommendation & Decision Audit
            </h1>
            <div className="text-xs text-slate-600 mt-0.5">
              Autonomous Scheme-Bundle Optimizer (PS16) • Deterministic Multi-Scheme Optimization Audit
            </div>
          </div>
          <div className="text-right text-[9pt] text-slate-600 font-mono">
            <div>Date: {new Date().toLocaleDateString('en-IN')}</div>
            <div>Audit ID: PS16-OPT-{profile.state}</div>
            <div>Status: Deterministic Verified</div>
          </div>
        </div>
      </div>

      {/* Screen Action Header */}
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

        <div className="flex flex-wrap items-center gap-2">
          {onBackToRoadmap && (
            <button
              onClick={onBackToRoadmap}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              title="Return to Application Roadmap"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600" />
              Roadmap
            </button>
          )}

          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-60"
            title="Download verified PDF summary report"
          >
            {isGeneratingPdf ? (
              <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <FileText className="w-3.5 h-3.5 text-blue-200" />
            )}
            <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
            title="Print or export as clean PDF"
          >
            <Printer className="w-4 h-4 text-slate-700" />
            Print
          </button>

          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-900 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
            title="Fast-Track Assisted Filing Pass"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>{hasPaidPro ? 'Assisted Pass Active' : 'Assisted Filing Pass (₹49)'}</span>
          </button>

          <button
            onClick={handleExportTextAudit}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-2xs transition-colors cursor-pointer"
            title="Download offline plain text audit trail"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            .TXT
          </button>

          <button
            onClick={onRestart}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Statutory Advisory & Eligibility Disclaimer Banner */}
      <div className="mb-6">
        <StatutoryDisclaimerModal />
      </div>

      {/* Citizen Assessment Summary Badge */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-8 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700 print:bg-white print:border-slate-300 print:p-3 print:rounded-none">
        <div>
          <strong className="text-slate-900">Evaluated Profile: </strong>
          <span>Age: {profile.age}</span> • <span>Gender: {profile.gender}</span> • <span>State: {profile.state}</span> • <span>Category: {categoryLabel}</span> • <span>Income: ₹{(profile.annualFamilyIncome).toLocaleString('en-IN')}/yr</span>
        </div>
        <span className="font-mono text-[11px] text-slate-500 print:text-slate-800">
          Generated via PS16 Autonomous Optimizer • {bundle.selectedSchemes.length} Schemes • Value: ₹{bundle.totalMonetaryAnnual.toLocaleString('en-IN')}
        </span>
      </div>

      <div className="mb-8 grid gap-3 sm:grid-cols-3 text-xs">
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-blue-950"><span className="block font-bold uppercase tracking-wider text-[10px] text-blue-700">Catalog version</span><strong className="mt-1 block">{CATALOG_VERSION}</strong><span className="mt-1 block text-blue-800">Used for this report</span></div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950"><span className="block font-bold uppercase tracking-wider text-[10px] text-amber-700">Bundle validity</span><strong className="mt-1 block">{bundleValidity.validUntil ? bundleValidity.displayDate : bundleValidity.label}</strong><span className="mt-1 block text-amber-900">{bundleValidity.note}</span></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-800"><span className="block font-bold uppercase tracking-wider text-[10px] text-slate-500">Missing documents</span><strong className="mt-1 block">{missingDocumentIds.length}</strong><span className="mt-1 block text-slate-500">Readiness blockers in this decision</span></div>
      </div>

      <BackendAuditCard
        profile={profile}
        declaredDocumentIds={declaredDocumentIds}
        frontendSelectedSchemeIds={bundle.selectedSchemes.map((scheme) => scheme.id)}
        frontendPotentialSchemeIds={(bundle.potentialSelectedSchemes ?? bundle.selectedSchemes).map((scheme) => scheme.id)}
      />

      {/* 4 Pillars of Civic Transparency */}
      <div className="space-y-8">
        {/* Pillar 1: Why chosen */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs print-avoid-break print:p-4 print:border-slate-300 print:shadow-none print:rounded-none">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold print:border print:border-slate-400">
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
              <div key={scheme.id} className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-200 text-slate-800 print:bg-white print:border-slate-300">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <strong className="text-sm font-bold text-slate-900">{scheme.name}</strong>
                  <span className="font-extrabold text-emerald-800 print:text-black">{scheme.benefit.displayAmount}</span>
                </div>
                <p className="text-slate-600 mb-1.5">{scheme.tagline}</p>
                <div className="text-[11px] text-slate-500">
                  ✓ Qualified all demographic, domicile, and income ceilings without statutory conflict.
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                  <span>Last verified: {scheme.lastVerifiedDate}</span>
                  <span>KB: {scheme.kbVersion}</span>
                  <a className="font-semibold text-blue-700 hover:underline" href={scheme.officialSourceUrl} target="_blank" rel="noreferrer">
                    Official source
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pillar 2: Excluded alternatives */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs print-avoid-break print:p-4 print:border-slate-300 print:shadow-none print:rounded-none">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center font-bold print:border print:border-slate-400">
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
            {excludedSchemes.slice(0, 6).map((ev) => (
              <div key={ev.scheme.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 print:bg-white print:border-slate-300">
                <span className="font-bold text-slate-900 block mb-0.5">{ev.scheme.name}</span>
                <span className="text-rose-700 print:text-black">
                  ✕ Excluded: {ev.unmetReasons.concat(ev.exclusionReasons).join('; ') || 'Criteria mismatch'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pillar 3: Trade-offs made */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs print-avoid-break print:p-4 print:border-slate-300 print:shadow-none print:rounded-none">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold print:border print:border-slate-400">
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

          <div className="mt-4 text-xs text-slate-700 leading-relaxed bg-purple-50/40 p-4 rounded-xl border border-purple-200 space-y-2 print:bg-white print:border-slate-300">
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
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs print-avoid-break print:p-4 print:border-slate-300 print:shadow-none print:rounded-none">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold print:border print:border-slate-400">
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
            {roadmapSteps.slice(0, 5).map((step, idx) => (
              <div key={step.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3 print:bg-white print:border-slate-300">
                <span className="w-5 h-5 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5 print:bg-slate-800">
                  {idx + 1}
                </span>
                <div>
                  <strong className="text-slate-900 block">{step.title}</strong>
                  <span className="text-slate-600">{step.description}</span>
                  {step.actionUrl && (
                    <span className="block text-[11px] text-slate-500 mt-1 font-mono">
                      Portal: {step.actionUrl}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Action Section (Hidden on Print) */}
      <div className="mt-10 p-6 bg-slate-900 text-white rounded-3xl text-center space-y-4 print:hidden">
        <h3 className="text-lg font-bold">Ready to test another citizen scenario?</h3>
        <p className="text-xs text-slate-300 max-w-md mx-auto">
          Switch between college students, rural women entrepreneurs, or marginal farmers to test all branches of the decision engine.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onOpenDemoSelector}
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md cursor-pointer transition-all"
          >
            Load Another Demo Persona
          </button>
          {onBackToRoadmap && (
            <button
              onClick={onBackToRoadmap}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-slate-700 cursor-pointer transition-all inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Review Roadmap
            </button>
          )}
          <button
            onClick={onRestart}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-slate-700 cursor-pointer transition-all"
          >
            Start Fresh Profile
          </button>
        </div>
      </div>

      {/* Fast-Track Payment Modal */}
      <PaymentCheckoutModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentSuccess={() => {
          setHasPaidPro(true);
        }}
      />
    </div>
  );
};
