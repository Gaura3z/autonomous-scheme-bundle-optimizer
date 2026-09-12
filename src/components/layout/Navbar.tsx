import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Search, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AssessmentStage } from '../../types';

interface NavbarProps {
  currentStage: AssessmentStage;
  onReset: () => void;
  onOpenHowItWorks: () => void;
  onOpenDemoSelector: () => void;
  onOpenArchitecture?: () => void;
  onGoHome?: () => void;
}

/** Calm, English-only navigation; advanced controls stay out of the citizen path. */
export const Navbar: React.FC<NavbarProps> = ({ currentStage, onReset, onOpenHowItWorks, onGoHome }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showPortalChooser, setShowPortalChooser] = useState(false);
  const isLanding = String(currentStage).toLowerCase() === 'landing';
  const goHome = onGoHome || onReset;

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-xs border-b border-slate-200 print:hidden">
      <div className="h-1 bg-gradient-to-r from-orange-500 via-white to-emerald-600" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-4">
          <button onClick={goHome} className="flex items-baseline shrink-0 cursor-pointer" aria-label="SchemeWise home">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-emerald-600">Scheme</span>
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Wise</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 ml-0.5 mb-1.5" />
          </button>

          <form onSubmit={(event) => { event.preventDefault(); if (searchQuery.trim()) goHome(); }} className="hidden md:block flex-1 max-w-md relative">
            <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search schemes" className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600" />
            <Search className="absolute right-3.5 top-3 w-4 h-4 text-slate-400" />
          </form>

          <div className="flex items-center gap-2">
            <button onClick={() => setShowPortalChooser(true)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer">
              Sign In <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button onClick={onOpenHowItWorks} className="hidden sm:inline-flex px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer">How it works</button>
            {!isLanding && <button onClick={onReset} className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"><RotateCcw className="w-3 h-3" /> Reset</button>}
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border-t border-slate-200 px-4 sm:px-6 lg:px-8 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center gap-6 text-xs font-semibold text-slate-700 py-2">
          <button onClick={goHome} className={isLanding ? 'text-blue-800 font-bold' : 'hover:text-blue-800 cursor-pointer'}>Home</button>
          <button onClick={goHome} className="hover:text-blue-800 cursor-pointer">Find Schemes</button>
          <button onClick={onOpenHowItWorks} className="hover:text-blue-800 cursor-pointer">Decision Framework</button>
        </div>
      </div>

      <AnimatePresence>
        {showPortalChooser && <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="border-b border-blue-200 bg-blue-50 px-4 py-4 text-blue-950">
          <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div><div className="flex items-center gap-2 text-sm font-bold"><CheckCircle2 className="h-4 w-4 text-blue-700" /> Choose your portal</div><p className="mt-1 text-xs text-blue-800">Use the citizen/student portal to find schemes, or the admin portal to manage the scheme catalog.</p></div>
            <div className="flex flex-wrap gap-2"><button onClick={() => { window.location.href = '/?portal=student'; }} className="rounded-xl bg-blue-900 px-4 py-2 text-xs font-bold text-white">Citizen / Student Portal</button><button onClick={() => { window.location.href = '/admin'; }} className="rounded-xl border border-blue-300 bg-white px-4 py-2 text-xs font-bold text-blue-900">Admin Portal</button><button onClick={() => setShowPortalChooser(false)} className="px-2 py-2 text-xs font-bold text-blue-700">Close</button></div>
          </div>
        </motion.div>}
      </AnimatePresence>
    </header>
  );
};
