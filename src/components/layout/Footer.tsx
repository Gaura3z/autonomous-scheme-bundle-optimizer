/**
 * SchemeWise Portal Footer (GIGW Compliant)
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 */
import React from 'react';
import { 
  Building2, 
  ExternalLink, 
  Phone, 
  Mail, 
  ShieldCheck, 
  HelpCircle, 
  Sparkles,
  Layers,
  Award
} from 'lucide-react';

interface FooterProps {
  onOpenHowItWorks: () => void;
  onOpenDemoSelector: () => void;
  onOpenArchitecture?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenHowItWorks,
  onOpenDemoSelector,
  onOpenArchitecture
}) => {
  return (
    <footer className="bg-slate-900 text-slate-300 text-xs border-t border-slate-800 print:hidden">
      {/* 1. Official Government Portals & Initiatives Banner */}
      <div className="border-b border-slate-800 bg-slate-950 py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-6 text-slate-400 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF9933]" />
            <span className="font-semibold text-slate-200">National Digital Public Infrastructure</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[11px]">
            <a 
              href="https://digitalindia.gov.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              Digital India <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
            </a>
            <a 
              href="https://india.gov.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              India.gov.in <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
            </a>
            <a 
              href="https://mygov.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              myGov <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
            </a>
            <a 
              href="https://web.umang.gov.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              UMANG <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
            </a>
            <a 
              href="https://data.gov.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              Data.gov.in <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Portal Links Strip */}
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Identity & Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                <Layers className="w-4 h-4 text-amber-300" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-white">Scheme</span>
                <span className="text-lg font-black text-blue-400">Wise</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Citizen scheme discovery, eligibility guidance, and actionable application roadmaps.
            </p>
            <div className="text-[11px] text-slate-500">
            </div>
          </div>

          {/* Col 2: Schemes Navigation */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              Scheme Discovery
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button 
                  onClick={onOpenHowItWorks}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Central Government Schemes
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenHowItWorks}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  State & UT Programs
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenHowItWorks}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Categories Directory
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenHowItWorks}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Ministry Gazette Knowledge Base
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal Policies & Guidelines */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              Compliance & Policies
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">
                  Guidelines for Indian Government Websites (GIGW)
                </span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">
                  Deterministic Rule Execution Policy
                </span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">
                  Privacy & Zero-Citizen-Tracking
                </span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">
                  Terms of Service & Disclaimer
                </span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">
                  Hyperlinking Policy
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Citizen Support & Helpdesk */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              Citizen Helpdesk
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Toll Free: 1800-111-555 / 14443</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>SchemeWise support desk</span>
              </div>
              <div className="mt-3 p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-[11px] text-slate-300">
                <span className="font-semibold text-white block mb-0.5">National Grievance Portal</span>
                Citizens can register scheme-related grievances directly on CPGRAMS (pgportal.gov.in).
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Official Copyright & Timestamp Bottom Bar */}
      <div className="bg-slate-950 border-t border-slate-800 py-4 px-4 sm:px-6 lg:px-8 text-center text-[11px] text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Content Managed by National e-Governance Division (NeGD), Ministry of Electronics & IT, Government of India.
          </span>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Last Updated: 11 Sep 2026</span>
            <span>•</span>
            <span>Total Visitors: 14,892,104</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
