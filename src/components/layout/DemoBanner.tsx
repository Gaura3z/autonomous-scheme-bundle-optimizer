/**
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 * Demo Banner & Judge Algorithmic Controller
 * Persistent, high-contrast banner that provides:
 * 1. "Prototype · Demonstration Data" compliance label
 * 2. Quick 1-click switching between Student, Working Woman, and Farmer
 * 3. Inspectable Judge Evaluation Insights detailing exact engine outcomes
 */
import React, { useState } from 'react';
import { 
  Sparkles, 
  GraduationCap, 
  Briefcase, 
  Tractor, 
  Info, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  ArrowRight, 
  X, 
  Layers, 
  Workflow,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DEMO_PROFILES } from '../../data/demoProfiles';
import { DEMO_JOURNEYS } from '../../data/demoJourneys';
import { DemoCitizenProfile } from '../../types';

interface DemoBannerProps {
  activeDemoId: string | null;
  onSelectProfile: (demo: DemoCitizenProfile) => void;
  onExitDemo: () => void;
  onOpenArchitecture?: () => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({
  activeDemoId,
  onSelectProfile,
  onExitDemo,
  onOpenArchitecture
}) => {
  const [showJudgeModal, setShowJudgeModal] = useState(false);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);

  if (!activeDemoId) return null;

  const currentDemo = DEMO_PROFILES.find((p) => p.id === activeDemoId) || DEMO_PROFILES[0];
  const journeyConfig = DEMO_JOURNEYS[activeDemoId] || DEMO_JOURNEYS.demo_student;

  const getPersonaIcon = (id: string) => {
    switch (id) {
      case 'demo_student':
        return GraduationCap;
      case 'demo_woman_artisan':
        return Briefcase;
      case 'demo_farmer':
        return Tractor;
      default:
        return Sparkles;
    }
  };

  const Icon = getPersonaIcon(currentDemo.id);

  return (
    <>
      {/* High-visibility sticky demo banner below navbar */}
      <aside aria-label="Demo Persona Controller" className="w-full bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 text-white shadow-md border-b-2 border-amber-400/50 py-2 px-4 sm:px-6 lg:px-8 relative z-30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Persona Identity & Prototype Tag */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-amber-100" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider bg-white text-amber-900 px-2 py-0.5 rounded shadow-2xs">
                  Prototype · Demonstration Data
                </span>
                <span className="text-xs font-bold text-amber-100 hidden sm:inline">
                  | {currentDemo.name} ({currentDemo.roleTitle})
                </span>
              </div>
              <p className="text-[11px] text-amber-100 font-medium line-clamp-1">
                Testing Engine: {journeyConfig.headline}
              </p>
            </div>
          </div>

          {/* Center/Right: Quick Switcher & Judge Insights */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Persona Switcher Buttons (Desktop) */}
            <div className="hidden md:flex items-center bg-black/20 rounded-xl p-0.5 border border-white/20">
              {DEMO_PROFILES.map((p) => {
                const PIcon = getPersonaIcon(p.id);
                const isActive = p.id === activeDemoId;
                return (
                  <button
                    key={p.id}
                    onClick={() => onSelectProfile(p)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-white text-amber-950 shadow-xs' 
                        : 'text-amber-100 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <PIcon className="w-3.5 h-3.5" />
                    <span>{p.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Persona Switcher Dropdown (Mobile) */}
            <div className="relative md:hidden">
              <button
                onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/20 text-white text-xs font-bold border border-white/20"
              >
                <span>Switch Persona</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {showPersonaMenu && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1 text-slate-800 z-50">
                  {DEMO_PROFILES.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        onSelectProfile(p);
                        setShowPersonaMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-slate-100 flex items-center justify-between"
                    >
                      <span>{p.name}</span>
                      <span className="text-[10px] text-slate-500 font-normal">{p.roleTitle.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tech Stack & Architecture Button */}
            <button
              onClick={() => {
                if (onOpenArchitecture) {
                  onOpenArchitecture();
                } else {
                  window.dispatchEvent(new CustomEvent('open-architecture-modal'));
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/30 hover:bg-black/40 text-amber-100 hover:text-white text-xs font-bold border border-amber-300/40 transition-colors cursor-pointer"
              title="View Fixed Tech Stack & Architecture"
            >
              <Workflow className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Architecture</span>
            </button>

            {/* Judge Evaluation Insights Button */}
            <button
              onClick={() => setShowJudgeModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-bold border border-white/30 transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-amber-200" />
              <span>Judge Insights</span>
            </button>

            {/* Exit Demo Mode */}
            <button
              onClick={onExitDemo}
              className="p-1 rounded-lg hover:bg-black/20 text-amber-200 hover:text-white transition-colors cursor-pointer"
              title="Exit demo persona"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Judge Evaluation Modal / Drawer */}
      <AnimatePresence>
        {showJudgeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col text-slate-900"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Layers className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                      Judge Evaluation Protocol • PS16 Hackfest 2026
                    </span>
                    <h3 className="text-lg font-bold leading-tight">
                      {currentDemo.name} — Algorithmic Journey
                    </h3>
                    <p className="text-xs text-blue-200">
                      {currentDemo.roleTitle} • State: {currentDemo.profile.state}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowJudgeModal(false)}
                  className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6 overflow-y-auto text-xs">
                {/* 1. Core Verification Points */}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Key Algorithmic Verification Objectives
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">
                        Adaptive Questions
                      </span>
                      <p className="text-xs font-bold text-slate-900 mt-0.5">
                        {journeyConfig.expectedHighlight.adaptiveQuestionsCount} Targeted Questions
                      </p>
                      <span className="text-[11px] text-slate-500">
                        Zero irrelevant cross-sector questions prompted
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">
                        Conflict Edge Detection
                      </span>
                      <p className="text-xs font-bold text-slate-900 mt-0.5">
                        {journeyConfig.expectedHighlight.hasConflict ? 'Mutual Exclusion Detected' : 'Verified Multi-Scheme Synergy'}
                      </p>
                      <span className="text-[11px] text-slate-500">
                        {journeyConfig.expectedHighlight.conflictDescription || 'Zero mutual conflict between schemes'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">
                        Missing Document Gap
                      </span>
                      <p className="text-xs font-bold text-amber-700 mt-0.5">
                        {journeyConfig.expectedHighlight.missingDocumentName}
                      </p>
                      <span className="text-[11px] text-slate-500">
                        Classified as "Eligible, but document missing" (never Ineligible)
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">
                        Roadmap Topological Sort
                      </span>
                      <p className="text-xs font-bold text-blue-900 mt-0.5">
                        {journeyConfig.expectedHighlight.roadmapStepsCount} Sequenced Milestones
                      </p>
                      <span className="text-[11px] text-slate-500">
                        Pre-requisite certification sequenced before application submission
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Step-by-Step Testing Notes */}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <Workflow className="w-4 h-4 text-blue-600" />
                    How to Validate This Persona Through the 11 Stages:
                  </h4>
                  <ul className="space-y-2 text-slate-600 text-xs">
                    {journeyConfig.judgeEvaluationNotes.map((note, i) => (
                      <li key={i} className="flex items-start gap-2 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100">
                        <span className="w-4 h-4 rounded-full bg-blue-700 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="text-slate-800 leading-relaxed">{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 3. Switcher within Modal */}
                <div className="pt-4 border-t border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 block mb-2">
                    Switch Test Persona:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {DEMO_PROFILES.map((p) => {
                      const PIcon = getPersonaIcon(p.id);
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            onSelectProfile(p);
                            setShowJudgeModal(false);
                          }}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            p.id === activeDemoId
                              ? 'border-blue-700 bg-blue-50 text-blue-900 font-bold'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <PIcon className="w-4 h-4 mx-auto mb-1 text-slate-600" />
                          <span className="block text-xs font-semibold">{p.name.split(' ')[0]}</span>
                          <span className="text-[10px] text-slate-500 block">{p.badge}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">
                  Autonomous Scheme Bundle Optimizer • Kurukshetra 2.0
                </span>
                <button
                  onClick={() => setShowJudgeModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
                >
                  Continue Assessment
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
