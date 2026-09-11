/**
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 * Fixed Technology Stack & System Architecture Modal
 * 
 * Implements the official technical presentation architecture:
 * 1. Fixed Technology Stack (Layer, Technology, Purpose)
 * 2. Most Important Architectural Principle (Deterministic Decision-Critical Path)
 * 3. Formal Architectural Flow Diagram (Interactive Visual + Verbatim ASCII Diagram)
 */
import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  Copy, 
  Check, 
  ShieldCheck, 
  Workflow, 
  Database, 
  Sparkles, 
  Terminal,
  ArrowDown,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'diagram' | 'stack' | 'ascii';
}

export const TECH_STACK_DATA = [
  { layer: 'Frontend', tech: 'React + TypeScript', purpose: 'Citizen-facing application' },
  { layer: 'Build Tool', tech: 'Vite', purpose: 'Fast frontend development/build' },
  { layer: 'UI', tech: 'Tailwind CSS', purpose: 'Responsive UI and styling' },
  { layer: 'Backend', tech: 'Python + FastAPI', purpose: 'APIs and application orchestration' },
  { layer: 'Validation', tech: 'Pydantic', purpose: 'Request/response and data validation' },
  { layer: 'Knowledge Base', tech: 'Curated JSON', purpose: 'Scheme, eligibility, exclusion, conflict, document and benefit rules' },
  { layer: 'Eligibility', tech: 'Python deterministic rule engine', purpose: 'Checks scheme eligibility' },
  { layer: 'Exclusion', tech: 'Python deterministic rules', purpose: 'Detects explicit exclusions/negative conditions' },
  { layer: 'Conflict Detection', tech: 'Python + optionally NetworkX', purpose: 'Finds incompatible schemes' },
  { layer: 'Optimization', tech: 'PuLP + CBC', purpose: 'Selects the best valid scheme bundle' },
  { layer: 'Document Engine', tech: 'Python', purpose: 'Missing documents, dependencies and readiness' },
  { layer: 'Roadmap Engine', tech: 'Python', purpose: 'Generates application sequence/checklist' },
  { layer: 'AI/LLM', tech: 'Google Gemini API', purpose: 'Explanation, natural-language assistance, multilingual interaction' },
  { layer: 'Testing', tech: 'Pytest + frontend tests', purpose: 'Backend and UI validation' },
  { layer: 'Version Control', tech: 'Git + GitHub', purpose: 'Collaboration/version history' },
  { layer: 'Deployment', tech: 'Vercel + Render', purpose: 'Frontend + FastAPI backend' },
];

export const ASCII_ARCHITECTURE_DIAGRAM = `                    ┌──────────────────────────┐
                    │        CITIZEN           │
                    │ Profile + Preferences    │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │     REACT FRONTEND       │
                    │ TypeScript + Vite        │
                    │ Tailwind CSS             │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │       FASTAPI API        │
                    │      Backend Layer       │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                 ┌─────────────────────────────────┐
                 │        BENEFIT STRATEGIST        │
                 │          ORCHESTRATOR            │
                 │ Coordinates the decision flow    │
                 └───────────────┬─────────────────┘
                                 │
             ┌───────────────────┼────────────────────┐
             │                   │                    │
             ▼                   ▼                    ▼
   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
   │ ELIGIBILITY     │  │ EXCLUSION       │  │ CONFLICT        │
   │ ENGINE          │  │ ENGINE          │  │ ENGINE          │
   │                 │  │                 │  │                 │
   │ Deterministic   │  │ Negative rules  │  │ Scheme-to-      │
   │ rule evaluation │  │ / blockers      │  │ scheme conflicts│
   └────────┬────────┘  └────────┬────────┘  └────────┬────────┘
            │                    │                    │
            └────────────────────┼────────────────────┘
                                 ▼
                    ┌──────────────────────────┐
                    │    ELIGIBLE SCHEMES      │
                    │ + exclusions + conflicts │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │    BUNDLE OPTIMIZER      │
                    │      PuLP + CBC          │
                    │                          │
                    │ Best valid combination   │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │    OPTIMIZED BUNDLE      │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │     DOCUMENT ENGINE      │
                    │                          │
                    │ Required documents       │
                    │ Available documents      │
                    │ Missing documents        │
                    │ Dependencies             │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │     ROADMAP ENGINE        │
                    │                          │
                    │ Application checklist    │
                    │ Prerequisites            │
                    │ Application sequence     │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │       EXPLANATION         │
                    │       GEMINI API          │
                    │                          │
                    │ "Why these schemes?"     │
                    │ Simple explanation       │
                    │ Multilingual assistance  │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │      FINAL CITIZEN       │
                    │      RECOMMENDATION      │
                    │                          │
                    │ ✓ Best Bundle            │
                    │ ✓ Why eligible           │
                    │ ✓ Conflicts              │
                    │ ✓ Missing documents      │
                    │ ✓ Dependencies           │
                    │ ✓ Application Roadmap    │
                    └──────────────────────────┘


       ┌─────────────────────────────────────────────┐
       │          SCHEME KNOWLEDGE BASE              │
       │                                             │
       │ Scheme Rules | Benefits | Documents         │
       │ Eligibility | Exclusions | Conflicts        │
       │ Dependencies | Application Steps            │
       │ Official Sources / Verification Metadata     │
       └──────────────────────┬──────────────────────┘
                              │
                              ▼
                    Used by all decision engines`;

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ 
  isOpen, 
  onClose,
  defaultTab = 'diagram'
}) => {
  const [activeTab, setActiveTab] = useState<'diagram' | 'stack' | 'ascii'>(defaultTab);
  const [copied, setCopied] = useState(false);

  const handleCopyAscii = () => {
    navigator.clipboard.writeText(ASCII_ARCHITECTURE_DIAGRAM);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 text-slate-900">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 relative z-10 flex flex-col max-h-[92vh] overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-5 sm:p-6 flex items-start justify-between border-b border-slate-800">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shadow-inner">
                  <Workflow className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                      Technical Architecture Spec • PS16
                    </span>
                    <span className="text-xs text-slate-400 hidden sm:inline">• Kurukshetra 2.0 Hackfest</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
                    System Architecture & Technology Stack
                  </h3>
                  <p className="text-xs text-blue-200">
                    Deterministic Multi-Engine Benefit Strategist with PuLP + CBC Optimization
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Core Architectural Principle Banner */}
            <div className="bg-amber-50 border-b border-amber-200 p-4 sm:px-6">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0 mt-0.5 font-black text-xs shadow-xs">
                  !
                </div>
                <div className="text-xs text-amber-950">
                  <p className="font-bold text-sm text-amber-900 mb-0.5">
                    Most Important Architectural Principle: AI does NOT decide eligibility.
                  </p>
                  <p className="leading-relaxed">
                    The decision-critical path is <strong>strictly deterministic</strong>:
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1 font-mono text-[11px] font-bold text-amber-950">
                    <span className="bg-white px-2 py-0.5 rounded border border-amber-300 shadow-2xs">Rules</span>
                    <span>→</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-amber-300 shadow-2xs">Eligibility</span>
                    <span>→</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-amber-300 shadow-2xs">Exclusions</span>
                    <span>→</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-amber-300 shadow-2xs">Conflicts</span>
                    <span>→</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-amber-300 shadow-2xs">Optimization (PuLP+CBC)</span>
                    <span>→</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-amber-300 shadow-2xs">Documents</span>
                    <span>→</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-amber-300 shadow-2xs">Roadmap</span>
                  </div>
                  <p className="mt-1 text-[11px] text-amber-800">
                    <strong>Gemini is used strictly after the result is calculated</strong>, mainly to explain it naturally and provide multilingual guidance.
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6 gap-2 pt-2">
              <button
                onClick={() => setActiveTab('diagram')}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'diagram'
                    ? 'border-blue-700 text-blue-900 bg-white rounded-t-lg shadow-2xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                }`}
              >
                <Workflow className="w-3.5 h-3.5 text-blue-700" />
                <span>Visual Flow Diagram</span>
              </button>

              <button
                onClick={() => setActiveTab('stack')}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'stack'
                    ? 'border-blue-700 text-blue-900 bg-white rounded-t-lg shadow-2xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-indigo-700" />
                <span>Technology Stack (16 Layers)</span>
              </button>

              <button
                onClick={() => setActiveTab('ascii')}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'ascii'
                    ? 'border-blue-700 text-blue-900 bg-white rounded-t-lg shadow-2xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-emerald-700" />
                <span>Official ASCII Diagram (Copyable)</span>
              </button>
            </div>

            {/* Content Area */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 text-xs">
              {/* TAB 1: VISUAL FLOW DIAGRAM */}
              {activeTab === 'diagram' && (
                <div className="space-y-6">
                  <div className="max-w-xl mx-auto space-y-3">
                    {/* Node 1: Citizen */}
                    <div className="p-3 bg-white border-2 border-slate-300 rounded-xl shadow-xs text-center">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Input</span>
                      <h4 className="font-bold text-slate-900 text-sm">CITIZEN</h4>
                      <p className="text-[11px] text-slate-600">Profile + Preferences</p>
                    </div>

                    <div className="flex justify-center text-slate-400">
                      <ArrowDown className="w-4 h-4" />
                    </div>

                    {/* Node 2: React Frontend */}
                    <div className="p-3 bg-blue-50/70 border-2 border-blue-400 rounded-xl shadow-xs text-center">
                      <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">Client Tier</span>
                      <h4 className="font-bold text-blue-950 text-sm">REACT FRONTEND</h4>
                      <p className="text-[11px] text-blue-800">TypeScript + Vite + Tailwind CSS</p>
                    </div>

                    <div className="flex justify-center text-slate-400">
                      <ArrowDown className="w-4 h-4" />
                    </div>

                    {/* Node 3: FastAPI Backend */}
                    <div className="p-3 bg-indigo-50/70 border-2 border-indigo-400 rounded-xl shadow-xs text-center">
                      <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">API Tier</span>
                      <h4 className="font-bold text-indigo-950 text-sm">FASTAPI API</h4>
                      <p className="text-[11px] text-indigo-800">Backend Layer + Pydantic Validation</p>
                    </div>

                    <div className="flex justify-center text-slate-400">
                      <ArrowDown className="w-4 h-4" />
                    </div>

                    {/* Node 4: Orchestrator */}
                    <div className="p-3.5 bg-slate-900 text-white border-2 border-slate-800 rounded-xl shadow-md text-center">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Control Plane</span>
                      <h4 className="font-bold text-base text-white">BENEFIT STRATEGIST ORCHESTRATOR</h4>
                      <p className="text-[11px] text-slate-300">Coordinates the decision flow</p>
                    </div>

                    <div className="flex justify-center text-slate-400">
                      <ArrowDown className="w-4 h-4" />
                    </div>

                    {/* 3 Parallel Engines */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="p-3 bg-emerald-50 border-2 border-emerald-300 rounded-xl text-center shadow-xs">
                        <h5 className="font-bold text-emerald-950 text-xs uppercase">Eligibility Engine</h5>
                        <p className="text-[11px] text-emerald-800 mt-0.5">Deterministic rule evaluation</p>
                      </div>
                      <div className="p-3 bg-rose-50 border-2 border-rose-300 rounded-xl text-center shadow-xs">
                        <h5 className="font-bold text-rose-950 text-xs uppercase">Exclusion Engine</h5>
                        <p className="text-[11px] text-rose-800 mt-0.5">Negative rules / blockers</p>
                      </div>
                      <div className="p-3 bg-amber-50 border-2 border-amber-300 rounded-xl text-center shadow-xs">
                        <h5 className="font-bold text-amber-950 text-xs uppercase">Conflict Engine</h5>
                        <p className="text-[11px] text-amber-800 mt-0.5">Scheme-to-scheme conflicts</p>
                      </div>
                    </div>

                    <div className="flex justify-center text-slate-400">
                      <ArrowDown className="w-4 h-4" />
                    </div>

                    {/* Node 6: Eligible Schemes */}
                    <div className="p-3 bg-white border-2 border-slate-300 rounded-xl text-center shadow-xs">
                      <h4 className="font-bold text-slate-900 text-sm">ELIGIBLE SCHEMES</h4>
                      <p className="text-[11px] text-slate-600">+ exclusions + conflict metadata</p>
                    </div>

                    <div className="flex justify-center text-slate-400">
                      <ArrowDown className="w-4 h-4" />
                    </div>

                    {/* Node 7: Bundle Optimizer */}
                    <div className="p-3.5 bg-blue-900 text-white border-2 border-blue-700 rounded-xl text-center shadow-md">
                      <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider block">Mathematical Solver</span>
                      <h4 className="font-bold text-base text-white">BUNDLE OPTIMIZER (PuLP + CBC)</h4>
                      <p className="text-[11px] text-blue-100">Selects best valid combination under budget & mutual exclusivity</p>
                    </div>

                    <div className="flex justify-center text-slate-400">
                      <ArrowDown className="w-4 h-4" />
                    </div>

                    {/* Node 8: Optimized Bundle */}
                    <div className="p-3 bg-emerald-50 border-2 border-emerald-400 rounded-xl text-center shadow-xs">
                      <h4 className="font-bold text-emerald-950 text-sm">OPTIMIZED BUNDLE</h4>
                      <p className="text-[11px] text-emerald-800">Maximizes citizen welfare without statutory duplication</p>
                    </div>

                    <div className="flex justify-center text-slate-400">
                      <ArrowDown className="w-4 h-4" />
                    </div>

                    {/* Node 9: Document Engine */}
                    <div className="p-3 bg-white border-2 border-slate-300 rounded-xl text-center shadow-xs">
                      <h4 className="font-bold text-slate-900 text-sm">DOCUMENT ENGINE</h4>
                      <p className="text-[11px] text-slate-600">Required docs • Available docs • Missing documents • Dependencies</p>
                    </div>

                    <div className="flex justify-center text-slate-400">
                      <ArrowDown className="w-4 h-4" />
                    </div>

                    {/* Node 10: Roadmap Engine */}
                    <div className="p-3 bg-white border-2 border-slate-300 rounded-xl text-center shadow-xs">
                      <h4 className="font-bold text-slate-900 text-sm">ROADMAP ENGINE</h4>
                      <p className="text-[11px] text-slate-600">Application checklist • Prerequisites • Topological sequence</p>
                    </div>

                    <div className="flex justify-center text-slate-400">
                      <ArrowDown className="w-4 h-4" />
                    </div>

                    {/* Node 11: Explanation Gemini API */}
                    <div className="p-3.5 bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-xl text-center shadow-md border-2 border-purple-500">
                      <div className="flex items-center justify-center gap-1.5 mb-0.5">
                        <Sparkles className="w-4 h-4 text-purple-300" />
                        <span className="text-[10px] font-bold text-purple-200 uppercase tracking-wider">Post-Decision Explainer</span>
                      </div>
                      <h4 className="font-bold text-base text-white">EXPLANATION (GEMINI API)</h4>
                      <p className="text-[11px] text-purple-100">"Why these schemes?" • Simple natural explanation • Multilingual assistance</p>
                    </div>

                    <div className="flex justify-center text-slate-400">
                      <ArrowDown className="w-4 h-4" />
                    </div>

                    {/* Node 12: Final Recommendation */}
                    <div className="p-4 bg-emerald-900 text-white border-2 border-emerald-600 rounded-2xl text-left shadow-lg">
                      <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">Delivered Result</span>
                      <h4 className="font-bold text-lg text-white mb-2">FINAL CITIZEN RECOMMENDATION</h4>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-emerald-100">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                          <span>✓ Best Bundle</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                          <span>✓ Why eligible</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                          <span>✓ Conflicts</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                          <span>✓ Missing documents</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                          <span>✓ Dependencies</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                          <span>✓ Application Roadmap</span>
                        </div>
                      </div>
                    </div>

                    {/* Underpinning Knowledge Base */}
                    <div className="mt-6 p-4 bg-amber-50/80 border-2 border-dashed border-amber-400 rounded-2xl text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Database className="w-4 h-4 text-amber-700" />
                        <h4 className="font-bold text-amber-950 text-sm">SCHEME KNOWLEDGE BASE</h4>
                      </div>
                      <p className="text-[11px] text-amber-800">
                        Scheme Rules | Benefits | Documents | Eligibility | Exclusions | Conflicts | Dependencies | Application Steps | Official Sources / Verification Metadata
                      </p>
                      <span className="text-[10px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full inline-block mt-2">
                        Used by all decision engines
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: TECHNOLOGY STACK TABLE */}
              {activeTab === 'stack' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-600 font-medium">
                      Complete technology specifications across all application and algorithmic tiers:
                    </p>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                      16 Verified Components
                    </span>
                  </div>

                  <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-900 text-white text-xs font-bold">
                          <th className="py-3 px-4 w-1/4 border-b border-slate-800">Layer</th>
                          <th className="py-3 px-4 w-1/3 border-b border-slate-800">Technology</th>
                          <th className="py-3 px-4 border-b border-slate-800">Purpose</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-xs">
                        {TECH_STACK_DATA.map((item, idx) => (
                          <tr 
                            key={item.layer} 
                            className={`hover:bg-blue-50/40 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}`}
                          >
                            <td className="py-2.5 px-4 font-bold text-slate-900">
                              {item.layer}
                            </td>
                            <td className="py-2.5 px-4 font-mono font-semibold text-blue-900">
                              {item.tech}
                            </td>
                            <td className="py-2.5 px-4 text-slate-700">
                              {item.purpose}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: VERBATIM ASCII ARCHITECTURAL DIAGRAM */}
              {activeTab === 'ascii' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">
                      Verbatim System Architecture Diagram (Fixed Presentation Spec)
                    </span>
                    <button
                      onClick={handleCopyAscii}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied to Clipboard</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-300" />
                          <span>Copy ASCII Diagram</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-slate-950 rounded-2xl p-4 sm:p-5 border border-slate-800 text-emerald-400 font-mono text-[10px] sm:text-[11px] leading-relaxed overflow-x-auto shadow-inner select-all">
                    <pre className="whitespace-pre">{ASCII_ARCHITECTURE_DIAGRAM}</pre>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Deterministic Core + Post-Decision AI Explanation</span>
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                Close Specification
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
