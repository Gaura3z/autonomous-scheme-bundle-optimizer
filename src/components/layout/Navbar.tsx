/**
 * Top Navigation Bar with Authentic myScheme Portal Branding & Indian Gov Header
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 */
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  HelpCircle, 
  RotateCcw, 
  Sparkles, 
  Layers,
  Search,
  LogIn,
  Globe,
  ChevronDown,
  Building,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AssessmentStage } from '../../types';

interface NavbarProps {
  currentStage: AssessmentStage;
  onReset: () => void;
  onOpenHowItWorks: () => void;
  onOpenDemoSelector: () => void;
  onGoHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentStage,
  onReset,
  onOpenHowItWorks,
  onOpenDemoSelector,
  onGoHome
}) => {
  const handleHomeClick = onGoHome || onReset;
  const isLanding = String(currentStage).toLowerCase() === 'landing';
  const [lang, setLang] = useState<'EN' | 'HI'>('EN');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSsoNotice, setShowSsoNotice] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleHomeClick();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-xs border-b border-slate-200">
      {/* 1. Indian Tricolor Bar at the very top */}
      <div className="w-full h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      {/* 2. Official Government of India Top Strip (GIGW Compliant) */}
      <div className="bg-slate-100 text-slate-700 text-[11px] font-medium border-b border-slate-200 py-1 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Ashoka Chakra / Indian Flag representation */}
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF9933] inline-block ring-1 ring-white" />
              <span>भारत सरकार</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-700">Government of India</span>
            </div>
            <span className="hidden md:inline text-slate-400">•</span>
            <span className="hidden md:inline text-slate-600">
              Ministry of Electronics & IT (MeitY) • NeGD
            </span>
          </div>

          {/* Accessibility & Language Controls */}
          <div className="flex items-center gap-3 text-xs">
            <a 
              href="#main-content" 
              className="hidden lg:inline text-slate-600 hover:text-blue-800 transition-colors text-[11px]"
            >
              Skip to Main Content
            </a>
            
            <div className="hidden sm:flex items-center gap-1 border-l border-slate-300 pl-2 text-[11px] text-slate-600">
              <span>Text Size:</span>
              <button 
                onClick={() => setFontSize('sm')} 
                className={`px-1 py-0.5 rounded font-bold ${fontSize === 'sm' ? 'bg-blue-800 text-white' : 'hover:bg-slate-200'}`}
                title="Small text"
              >
                A-
              </button>
              <button 
                onClick={() => setFontSize('md')} 
                className={`px-1 py-0.5 rounded font-bold ${fontSize === 'md' ? 'bg-blue-800 text-white' : 'hover:bg-slate-200'}`}
                title="Normal text"
              >
                A
              </button>
              <button 
                onClick={() => setFontSize('lg')} 
                className={`px-1 py-0.5 rounded font-bold ${fontSize === 'lg' ? 'bg-blue-800 text-white' : 'hover:bg-slate-200'}`}
                title="Large text"
              >
                A+
              </button>
            </div>

            <div className="flex items-center gap-1 border-l border-slate-300 pl-2 font-semibold">
              <Globe className="w-3 h-3 text-slate-500" />
              <button 
                onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')}
                className="hover:text-blue-800 text-blue-900 cursor-pointer text-[11px]"
              >
                {lang === 'EN' ? 'English' : 'हिन्दी'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Header with Authentic myScheme Logo & Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-3 sm:gap-6">
          {/* Logo, Emblem & Digital India Group (Matches Screenshot 1 exactly) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* National Emblem of India (Lion Capital Representation) */}
            <button 
              onClick={handleHomeClick}
              className="flex items-center gap-1.5 focus:outline-none cursor-pointer group"
              title="Government of India"
            >
              <div className="w-8 h-10 flex flex-col items-center justify-center">
                <Building className="w-6 h-6 text-amber-800 group-hover:scale-105 transition-transform" />
                <span className="text-[8px] font-bold text-slate-800 tracking-tighter uppercase leading-none mt-0.5">
                  सत्यमेव जयते
                </span>
              </div>
            </button>

            <div className="h-8 w-px bg-slate-200 hidden sm:block" />

            {/* myScheme Brandmark */}
            <motion.button 
              onClick={handleHomeClick}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="flex items-center text-left focus:outline-none cursor-pointer shrink-0"
            >
              <div className="flex items-baseline">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-emerald-600">
                  my
                </span>
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                  Scheme
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 ml-0.5 mb-1.5 inline-block" />
              </div>
            </motion.button>

            <div className="h-8 w-px bg-slate-200 hidden md:block" />

            {/* Digital India Emblem */}
            <div className="hidden md:flex items-center gap-1 text-[10px] leading-tight text-slate-600 font-semibold">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-700 via-sky-500 to-amber-500 flex items-center justify-center text-white text-[9px] font-black shadow-xs">
                i
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-800">Digital India</span>
                <span className="text-[8px] text-slate-500 font-normal">Power To Empower</span>
              </div>
            </div>
          </div>

          {/* Center Search Pill (Matches Screenshot 1) */}
          <div className="flex-1 max-w-lg hidden lg:block">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter scheme name to search..."
                className="w-full pl-5 pr-10 py-2.5 bg-white border border-slate-300 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all shadow-2xs font-medium"
              />
              <button
                type="submit"
                className="absolute right-3.5 top-3 text-slate-400 hover:text-emerald-700 transition-colors cursor-pointer"
                title="Search schemes"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Actions: Green Sign In, Language Pill, Theme Toggle, Accessibility (Matches Screenshot 1) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Green Sign In Button with Arrow */}
            <motion.button
              onClick={() => setShowSsoNotice(true)}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-lg text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-all cursor-pointer"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>

            {/* Language Round Selector */}
            <button 
              onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              title="Change Language"
            >
              <div className="w-4 h-4 rounded-full bg-emerald-700 text-white text-[9px] font-bold flex items-center justify-center">
                अ
              </div>
              <span className="hidden sm:inline">{lang === 'EN' ? 'English' : 'हिन्दी'}</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={() => {}}
              className="w-8 h-8 rounded-lg bg-slate-900 text-slate-200 hover:bg-slate-800 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
              title="Toggle theme contrast"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
            </button>

            {/* Purple Accessibility Button */}
            <button
              onClick={onOpenHowItWorks}
              className="w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
              title="Screen Reader & Accessibility Options"
            >
              <Users className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Sub-Navigation Bar (Home, Categories, Central, State) */}
      <div className="bg-slate-50 border-t border-slate-200 px-4 sm:px-6 lg:px-8 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-semibold text-slate-700 py-2">
          <div className="flex items-center gap-6">
            <button 
              onClick={handleHomeClick} 
              className={`hover:text-blue-800 transition-colors cursor-pointer ${isLanding ? 'text-blue-800 font-bold border-b-2 border-blue-800 pb-0.5' : ''}`}
            >
              Home
            </button>
            <button 
              onClick={handleHomeClick} 
              className="hover:text-blue-800 transition-colors cursor-pointer flex items-center gap-1"
            >
              Find Schemes <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-full font-bold">New</span>
            </button>
            <button 
              onClick={onOpenHowItWorks} 
              className="hover:text-blue-800 transition-colors cursor-pointer"
            >
              Scheme Categories
            </button>
            <button 
              onClick={onOpenHowItWorks} 
              className="hover:text-blue-800 transition-colors cursor-pointer"
            >
              Central Ministries
            </button>
            <button 
              onClick={onOpenHowItWorks} 
              className="hover:text-blue-800 transition-colors cursor-pointer"
            >
              States & UTs
            </button>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <button
              onClick={onOpenDemoSelector}
              className="inline-flex items-center gap-1 text-amber-700 hover:text-amber-900 font-bold bg-amber-100/70 px-2 py-0.5 rounded-full border border-amber-300/60 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-600" />
              Demo Citizen Personas
            </button>
            {!isLanding && (
              <button
                onClick={onReset}
                className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
            <div className="hidden lg:flex items-center gap-1.5 text-slate-500 font-normal">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Deterministic Rule Engine</span>
            </div>
          </div>
        </div>
      </div>

      {/* SSO Info Popup */}
      <AnimatePresence>
        {showSsoNotice && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="bg-blue-50 border-b border-blue-200 px-4 py-2.5 text-xs text-blue-900 flex items-center justify-between"
          >
            <div className="flex items-center gap-2 max-w-4xl mx-auto">
              <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
              <span>
                <strong>MeriPehchaan (National Single Sign-On):</strong> As per the PS16 frontend prototype specification, live citizen authentication is simulated deterministically with instant Demo Personas.
              </span>
            </div>
            <button
              onClick={() => setShowSsoNotice(false)}
              className="text-blue-700 hover:text-blue-900 font-bold ml-4 cursor-pointer text-xs"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
