/**
 * Page 12: Actionable Application Roadmap
 * Sequenced, topological timeline guiding the citizen from prerequisite acquisition to final filing.
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 */
import React, { useState } from 'react';
import { 
  CheckCircle, 
  Circle, 
  ExternalLink, 
  ArrowRight, 
  Clock, 
  Building2, 
  Calendar, 
  AlertCircle,
  Sparkles,
  Download,
  Printer,
  FileText,
  Filter,
  CheckSquare,
  RotateCcw,
  Share2,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RoadmapStep, CitizenProfile, OptimizedBundle } from '../../types';
import { VoiceGuideBanner } from '../common/VoiceGuideBanner';
import { MobileStickyFooter } from '../common/MobileStickyFooter';
import { StatutoryDisclaimerModal } from '../common/StatutoryDisclaimerModal';
import { PaymentCheckoutModal } from '../common/PaymentCheckoutModal';
import { downloadRoadmapPdfFile, safePrintOrDownloadRoadmap } from '../../services/roadmapPdf';

interface ApplicationRoadmapProps {
  steps: RoadmapStep[];
  profile?: CitizenProfile;
  bundle?: OptimizedBundle;
  onProceedToSummary: () => void;
  onBackToDependencies: () => void;
}

export const ApplicationRoadmap: React.FC<ApplicationRoadmapProps> = ({
  steps: initialSteps,
  profile,
  bundle,
  onProceedToSummary,
  onBackToDependencies
}) => {
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [activePhaseFilter, setActivePhaseFilter] = useState<string>('ALL');
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [hasPaidPro, setHasPaidPro] = useState(() => {
    return localStorage.getItem('schemewise_pro_paid') === 'true';
  });

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  const markAllDone = () => {
    const allDone: Record<string, boolean> = {};
    initialSteps.forEach((s) => {
      allDone[s.id] = true;
    });
    setCompletedSteps(allDone);
  };

  const resetAll = () => {
    setCompletedSteps({});
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = initialSteps.length > 0 ? Math.round((completedCount / initialSteps.length) * 100) : 0;

  // Filter steps by phase
  const filteredSteps = initialSteps.filter((step) => {
    if (activePhaseFilter === 'ALL') return true;
    return step.phase.toLowerCase().includes(activePhaseFilter.toLowerCase());
  });

  // Export Roadmap as formatted Offline Text File (.txt)
  const handleExportTextFile = () => {
    const dateStr = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    let content = `===============================================================================\n`;
    content += `GOVERNMENT OF INDIA • NATIONAL MY-SCHEME PORTAL\n`;
    content += `AUTONOMOUS SCHEME-BUNDLE OPTIMIZER — ACTIONABLE APPLICATION ROADMAP\n`;
    content += `Kurukshetra 2.0 HACKFEST 2026 PS16\n`;
    content += `Generated On: ${dateStr}\n`;
    content += `===============================================================================\n\n`;

    content += `ROADMAP SUMMARY:\n`;
    content += `Total Steps: ${initialSteps.length}\n`;
    content += `Completed Progress: ${completedCount} of ${initialSteps.length} (${progressPercent}%)\n`;
    content += `Execution Sequence: Verified topological order to prevent circular prerequisite traps.\n\n`;

    content += `-------------------------------------------------------------------------------\n`;
    content += `SEQUENCED APPLICATION TIMELINE & ACTION ITEMS:\n`;
    content += `-------------------------------------------------------------------------------\n\n`;

    initialSteps.forEach((step) => {
      const isDone = !!completedSteps[step.id];
      content += `[${isDone ? 'X' : ' '}] STEP ${step.stepNumber}: ${step.title.toUpperCase()}\n`;
      content += `    Phase: ${step.phase}\n`;
      content += `    Estimated Timeline: ${step.estimatedTimeline}\n`;
      content += `    Status: ${isDone ? 'Completed' : 'Pending Action'}\n`;
      content += `    Action Details: ${step.description}\n`;
      if (step.applicationDeadline) content += `    Apply By: ${step.applicationDeadline}\n`;
      if (step.criticalDependency) {
        content += `    CRITICAL PREREQUISITE: ${step.criticalDependency}\n`;
      }
      if (step.actionUrl) {
        content += `    Official Government Portal: ${step.actionUrl}\n`;
      }
      content += `\n`;
    });

    content += `-------------------------------------------------------------------------------\n`;
    content += `OFFLINE CSC / TAHSIL PHYSICAL CHECKLIST:\n`;
    content += `-------------------------------------------------------------------------------\n`;
    initialSteps.forEach((step) => {
      content += `[ ] Step ${step.stepNumber}: ${step.title} (${step.estimatedTimeline})\n`;
    });

    content += `\n===============================================================================\n`;
    content += `NOTE: This roadmap was deterministically generated by the PS16 Benefit Strategist\n`;
    content += `Orchestrator. Keep this offline reference during your visits to Common Service\n`;
    content += `Centers (CSC) or administrative offices.\n`;
    content += `===============================================================================\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SchemeWise_Application_Roadmap_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Fallback profile if not passed
  const effectiveProfile: CitizenProfile = profile || {
    state: 'MH',
    socialCategory: 'General',
    age: 20,
    gender: 'Male',
    annualFamilyIncome: 250000,
    educationLevel: 'Undergraduate',
    employmentStatus: 'Student',
    isStudent: true,
    isMinority: false,
    hasDisability: false,
    hasBPLCard: false,
    areaType: 'Urban',
    hasCasteValidity: false,
    hasNonCreamyLayer: false,
    isOrphan: false,
    isFarmer: false,
    isLandlessLabour: false,
    isConstructionWorker: false,
    isStreetVendor: false,
    isHosteller: false,
    isWomanEntrepreneur: false
  };

  // Direct, rock-solid PDF generation and file download using pdf-lib
  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    try {
      await downloadRoadmapPdfFile(initialSteps, effectiveProfile, bundle);
    } catch (err) {
      console.error('PDF generation error:', err);
      // Fallback to offline text download if error occurs
      handleExportTextFile();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Safe Print with auto-fallback to direct PDF download
  const handlePrintOrPdf = async () => {
    try {
      await safePrintOrDownloadRoadmap(initialSteps, effectiveProfile, bundle);
    } catch (err) {
      await handleDownloadPDF();
    }
  };

  // Quick Share / Copy Text summary to clipboard
  const handleCopySummary = () => {
    const summaryText = `SchemeWise Application Roadmap (${initialSteps.length} Steps):\n` +
      initialSteps.map(s => `${s.stepNumber}. ${s.title} [${s.estimatedTimeline}]`).join('\n');
    navigator.clipboard.writeText(summaryText);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10 print:py-2 print:px-0">
      {/* Official Government Print-Only Watermark Banner */}
      <div className="print-header-banner">
        <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900">
          <div>
            <div className="text-[10pt] font-extrabold uppercase tracking-wider text-slate-800">
              SchemeWise Citizen Benefits Portal
            </div>
            <h1 className="text-xl font-black text-slate-900 mt-0.5">
              Actionable Citizen Application Roadmap
            </h1>
            <div className="text-xs text-slate-600 mt-0.5">
              Autonomous Scheme-Bundle Optimizer (PS16) • Deterministic Sequential Execution Plan
            </div>
          </div>
          <div className="text-right text-[9pt] text-slate-600 font-mono">
            <div>Date: {new Date().toLocaleDateString('en-IN')}</div>
            <div>Total Steps: {initialSteps.length}</div>
            <div>Order: Topological Verified</div>
          </div>
        </div>
      </div>

      {/* Civic Voice & Step Guide Banner */}
      <div className="print:hidden mb-6">
        <VoiceGuideBanner
          stepNumber={6}
          totalSteps={6}
          title="Official Application Roadmap & Portals"
          guidanceText="Follow this chronological checklist to file your applications on the MahaDBT and National Scholarship Portals before deadlines. Tap 'Save Offline' or 'Print PDF' to keep this action plan on your phone."
          marathiText="हा तुमचा अंतिम अर्ज करण्याचा रोडमॅप आहे. दिलेल्या मुदतीपूर्वी महाडीबीटी आणि राष्ट्रीय पोर्टलवर अर्ज करण्यासाठी ही क्रमवारी वापरा."
          showScrollHint={true}
        />
      </div>

      {/* Screen Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
              Step 6 of 6 • Application Action Plan
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Your Application Roadmap
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Follow this sequenced timeline to obtain certificates without wasted trips and submit verified applications.
            </p>
          </div>

          {/* Export & Actions Toolbar */}
          <div className="flex flex-wrap items-center gap-2 print:hidden shrink-0">
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-60"
              title="Download Official Verified PDF Document"
            >
              {isGeneratingPdf ? (
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <FileText className="w-3.5 h-3.5 text-blue-200" />
              )}
              <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}</span>
            </button>

            <button
              onClick={handlePrintOrPdf}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
              title="Print Roadmap or Save as PDF"
            >
              <Printer className="w-4 h-4 text-slate-700" />
              <span>Print</span>
            </button>

            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-900 text-xs font-bold shadow-2xs transition-all cursor-pointer"
              title="Activate Assisted Filing & Verified Application Pass"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>{hasPaidPro ? 'Assisted Filing Pass Active' : 'Fast-Track Assisted Filing (₹49)'}</span>
            </button>

            <button
              onClick={handleExportTextFile}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-2xs transition-colors cursor-pointer"
              title="Download clean offline text file"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>.TXT</span>
            </button>

            <button
              onClick={handleCopySummary}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
              title="Copy summary list to clipboard"
            >
              {copiedNotification ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Share2 className="w-4 h-4 text-slate-600" />
              )}
            </button>
          </div>
        </div>

        {/* Statutory Legal Disclaimer & Terms Banner */}
        <div className="mt-4">
          <StatutoryDisclaimerModal />
        </div>

        {/* Interactive Progress & Phase Filter Bar */}
        <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
          {/* Progress Tracker */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 font-black text-sm flex items-center justify-center shrink-0">
              {progressPercent}%
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">
                {completedCount} of {initialSteps.length} Steps Completed
              </div>
              <div className="w-44 h-1.5 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
                <motion.div 
                  className="h-full bg-emerald-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>

          {/* Quick Mark Actions */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={markAllDone}
              className="text-blue-700 hover:text-blue-900 font-semibold cursor-pointer px-2 py-1 rounded hover:bg-blue-100/50"
            >
              Mark All Done
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={resetAll}
              className="text-slate-500 hover:text-slate-800 font-medium cursor-pointer px-2 py-1 rounded hover:bg-slate-200/60"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Phase Filter Tabs (Screen Only) */}
        <div className="flex items-center gap-2 mt-4 print:hidden overflow-x-auto pb-1">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {[
            { id: 'ALL', label: `All Steps (${initialSteps.length})` },
            { id: 'prerequisite', label: 'Prerequisites' },
            { id: 'acquisition', label: 'Certificates' },
            { id: 'application', label: 'Portal Filing' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActivePhaseFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activePhaseFilter === tab.id
                  ? 'bg-blue-900 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Sequenced Action List */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-blue-200 print:border-slate-400 space-y-6 mb-8 ml-3 sm:ml-4 print:hidden">
        {filteredSteps.map((step, idx) => {
          const isDone = !!completedSteps[step.id];

          return (
            <motion.div 
              key={step.id}
              initial={{ opacity: 1 }}
              className="relative group print-avoid-break"
            >
              {/* Step Circle Indicator */}
              <button
                type="button"
                onClick={() => toggleStep(step.id)}
                className={`absolute -left-[35px] sm:-left-[43px] top-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer print:bg-white print:border-2 print:border-slate-800 print:text-black ${
                  isDone
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-blue-900 border-2 border-blue-600 shadow-2xs hover:bg-blue-50'
                }`}
                title="Click to toggle completed status"
              >
                {isDone ? (
                  <CheckCircle className="w-5 h-5 fill-emerald-600 text-white print:fill-black" />
                ) : (
                  step.stepNumber
                )}
              </button>

              {/* Step Card */}
              <div
                className={`bg-white rounded-2xl border p-5 shadow-xs transition-colors print:rounded-none print:p-3 print:border-slate-300 print:shadow-none ${
                  isDone
                    ? 'border-emerald-200 bg-emerald-50/20 print:bg-white'
                    : 'border-slate-200 hover:border-blue-400 print:bg-white'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded print:border print:border-slate-400 ${
                      step.phase.toLowerCase().includes('prerequisite')
                        ? 'bg-amber-100 text-amber-900'
                        : step.phase.toLowerCase().includes('acquisition') || step.phase.toLowerCase().includes('document')
                        ? 'bg-purple-100 text-purple-900'
                        : 'bg-blue-100 text-blue-900'
                    }`}>
                      Phase: {step.phase}
                    </span>

                    <span className="text-xs text-slate-400 print:hidden">•</span>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {step.estimatedTimeline}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleStep(step.id)}
                    className="self-start text-[11px] font-semibold text-slate-500 hover:text-slate-800 cursor-pointer print:hidden"
                  >
                    {isDone ? 'Mark as Incomplete' : 'Mark as Done ✓'}
                  </button>
                </div>

                <h3 className={`text-base font-bold mb-1.5 transition-colors ${
                  isDone ? 'line-through text-slate-400 print:text-black print:no-underline' : 'text-slate-900'
                }`}>
                  {step.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {step.description}
                </p>

                {step.applicationDeadline && (
                  <div className="mb-3 inline-flex flex-wrap items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[11px] font-semibold text-amber-900">
                    <Calendar className="h-3.5 w-3.5" /> Apply by: {step.applicationDeadline}
                    {step.validityNote && <span className="font-normal">· {step.validityNote}</span>}
                  </div>
                )}

                {step.criticalDependency && (
                  <div className="text-[11px] font-medium text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200/70 mb-3 print:bg-slate-50 print:border-slate-300">
                    ⚠ {step.criticalDependency}
                  </div>
                )}

                {/* Official application portal link & printed URL */}
                {step.actionUrl && (
                  <div className="pt-3 border-t border-slate-100 print:border-slate-300 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 print:text-slate-700">
                      Official Government Digital Interface: <strong className="font-mono text-[10px]">{step.actionUrl}</strong>
                    </span>
                    <a
                      href={step.actionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors print:hidden"
                    >
                      Apply Now
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Print uses the complete roadmap, even when a screen phase filter is active. */}
      <div className="hidden print:block space-y-4 mb-8 ml-3 pl-6 border-l-2 border-slate-400">
        {initialSteps.map((step) => (
          <article key={`print-${step.id}`} className="relative rounded-none border border-slate-300 bg-white p-3 print-avoid-break">
            <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-700">Step {step.stepNumber} · {step.phase} · {step.estimatedTimeline}</div>
            <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-700">{step.description}</p>
            {step.criticalDependency && <p className="mt-2 border border-slate-300 bg-slate-50 p-2 text-[11px] text-slate-800">Prerequisite: {step.criticalDependency}</p>}
            {step.actionUrl && <p className="mt-2 border-t border-slate-300 pt-2 font-mono text-[10px] text-slate-700">Official portal: {step.actionUrl}</p>}
          </article>
        ))}
      </div>

      {/* Navigation & Export Footer (Hidden on Print) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <button
          onClick={onBackToDependencies}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 py-2 px-4 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          ← Back to Dependencies
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleExportTextFile}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Download .TXT</span>
          </button>

          <button
            onClick={onProceedToSummary}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-semibold text-sm shadow-md shadow-blue-900/20 transition-all hover:translate-x-0.5 cursor-pointer"
          >
            Why These Recommendations? (Final Summary)
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Sticky Action Footer */}
      <MobileStickyFooter
        currentStep={6}
        totalSteps={6}
        nextStepLabel="View Final Summary & Why →"
        onNext={onProceedToSummary}
        onBack={onBackToDependencies}
        backLabel="Back"
      />

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
