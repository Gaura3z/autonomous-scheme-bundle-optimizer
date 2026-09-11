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
  const [showSsoNotice, setShowSsoNotice] = useState(false);
  const isLanding = String(currentStage).toLowerCase() === 'landing';
  const goHome = onGoHome || onReset;

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-xs border-b border-slate-200 print:hidden">
      <div className="h-1 bg-gradient-to-r from-orange-500 via-white to-emerald-600" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-4">
          <button onClick={goHome} className="flex items-baseline shrink-0 cursor-pointer" aria-label="myScheme home">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-emerald-600">my</span>
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Scheme</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 ml-0.5 mb-1.5" />
          </button>

          <form onSubmit={(event) => { event.preventDefault(); if (searchQuery.trim()) goHome(); }} className="hidden md:block flex-1 max-w-md relative">
            <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search schemes" className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600" />
            <Search className="absolute right-3.5 top-3 w-4 h-4 text-slate-400" />
          </form>

          <div className="flex items-center gap-2">
            <button onClick={() => setShowSsoNotice(true)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer">
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
        {showSsoNotice && <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="bg-blue-50 border-b border-blue-200 px-4 py-2.5 text-xs text-blue-900 flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-700" /><span>Sign-in is not required for this assessment preview.</span><button onClick={() => setShowSsoNotice(false)} className="font-bold ml-2 cursor-pointer">✕</button></motion.div>}
      </AnimatePresence>
    </header>
  );
};
