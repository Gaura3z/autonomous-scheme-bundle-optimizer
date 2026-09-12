/**
 * Page 1: SchemeWise Portal Landing Experience
 * Inspired by official citizen-service design patterns (Screenshots 1 & 2):
 * - Hero carousel with phone mockup, sector badges (Health, Education, Agriculture, Housing) & QR scanner
 * - #GOVERNMENTSCHEMES / #SCHEMESFORYOU hashtag header
 * - Prominent "Find Schemes For You ->" action
 * - 3 Mint-Green Scheme Metric Cards showing the current verified project catalog
 * - 3 Interactive Tabs: Categories | States/UTs | Central Ministries
 * - Illustrated Category Grid
 * - Floating interactive SchemeBot AI Mascot (as seen in Screenshot 2 bottom-right)
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 */
import React, { useState } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  HelpCircle, 
  ShieldCheck, 
  FileCheck2, 
  Split, 
  Workflow, 
  BookOpenCheck,
  CheckCircle,
  Building2,
  Lock,
  Search,
  Users,
  Sprout,
  Landmark,
  Briefcase,
  GraduationCap,
  HeartPulse,
  Home,
  Award,
  Compass,
  Cpu,
  Truck,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  MapPin,
  Calendar,
  CheckCircle2,
  QrCode,
  Smartphone,
  Bot,
  X,
  Send,
  SlidersHorizontal,
  Bookmark,
  Tractor,
  Terminal,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CitizenProfile, DemoCitizenProfile } from '../../types';
import { DEMO_PROFILES } from '../../data/demoProfiles';
import { DEMO_JOURNEYS } from '../../data/demoJourneys';
import { TECH_STACK_DATA } from '../layout/ArchitectureModal';
import { MASTER_SCHEMES } from '../../data/schemes';

interface LandingPageProps {
  profile?: CitizenProfile;
  onChangeProfile?: (updated: Partial<CitizenProfile>) => void;
  onStartAssessment: () => void;
  onOpenHowItWorks: () => void;
  onOpenDemoSelector: () => void;
  onSelectDemoProfile?: (demo: DemoCitizenProfile) => void;
  onOpenArchitecture?: () => void;
  hasSavedDraft?: boolean;
  onContinueDraft?: () => void;
}

const CATALOG_COUNTS = {
  total: MASTER_SCHEMES.length,
  central: MASTER_SCHEMES.filter((scheme) => scheme.jurisdiction === 'Central').length,
  stateOrUt: MASTER_SCHEMES.filter((scheme) => scheme.jurisdiction !== 'Central').length
};

// 12 Official Categories with clean counts
const SCHEMEWISE_CATEGORIES = [
  { id: 'agriculture', title: 'Agriculture, Rural & Environment', count: '480+ Schemes', icon: Sprout, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  { id: 'banking', title: 'Banking, Financial Services & Insurance', count: '210+ Schemes', icon: Landmark, color: 'text-blue-700 bg-blue-50 border-blue-200' },
  { id: 'business', title: 'Business & Entrepreneurship', count: '340+ Schemes', icon: Briefcase, color: 'text-amber-700 bg-amber-50 border-amber-200' },
  { id: 'education', title: 'Education & Learning', count: '720+ Schemes', icon: GraduationCap, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
  { id: 'health', title: 'Health & Wellness', count: '280+ Schemes', icon: HeartPulse, color: 'text-rose-700 bg-rose-50 border-rose-200' },
  { id: 'housing', title: 'Housing & Shelter', count: '130+ Schemes', icon: Home, color: 'text-teal-700 bg-teal-50 border-teal-200' },
  { id: 'skills', title: 'Skills & Employment', count: '460+ Schemes', icon: Award, color: 'text-orange-700 bg-orange-50 border-orange-200' },
  { id: 'social', title: 'Social Welfare & Empowerment', count: '810+ Schemes', icon: Users, color: 'text-purple-700 bg-purple-50 border-purple-200' },
  { id: 'safety', title: 'Public Safety, Law & Justice', count: '95+ Schemes', icon: ShieldCheck, color: 'text-slate-700 bg-slate-100 border-slate-300' },
  { id: 'science', title: 'Science, IT & Communications', count: '85+ Schemes', icon: Cpu, color: 'text-cyan-700 bg-cyan-50 border-cyan-200' },
  { id: 'sports', title: 'Sports & Culture', count: '75+ Schemes', icon: Compass, color: 'text-amber-700 bg-amber-50 border-amber-200' },
  { id: 'transport', title: 'Transport & Infrastructure', count: '110+ Schemes', icon: Truck, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' }
];

// Major Indian States & UTs with real scheme counts
const MAJOR_STATES = [
  { name: 'Maharashtra', count: '460+ Schemes', code: 'MH' },
  { name: 'Uttar Pradesh', count: '520+ Schemes', code: 'UP' },
  { name: 'Karnataka', count: '390+ Schemes', code: 'KA' },
  { name: 'Tamil Nadu', count: '370+ Schemes', code: 'TN' },
  { name: 'Bihar', count: '340+ Schemes', code: 'BR' },
  { name: 'Delhi (NCT)', count: '280+ Schemes', code: 'DL' },
  { name: 'Gujarat', count: '350+ Schemes', code: 'GJ' },
  { name: 'Rajasthan', count: '380+ Schemes', code: 'RJ' },
  { name: 'West Bengal', count: '360+ Schemes', code: 'WB' },
  { name: 'Madhya Pradesh', count: '370+ Schemes', code: 'MP' },
  { name: 'Kerala', count: '310+ Schemes', code: 'KL' },
  { name: 'Andhra Pradesh', count: '330+ Schemes', code: 'AP' }
];

// Key Central Ministries with scheme counts
const CENTRAL_MINISTRIES = [
  { name: 'Ministry of Agriculture & Farmers Welfare', count: '68 Schemes', code: 'MoAFW' },
  { name: 'Ministry of Education', count: '94 Schemes', code: 'MoE' },
  { name: 'Ministry of Finance', count: '52 Schemes', code: 'MoF' },
  { name: 'Ministry of Health & Family Welfare', count: '45 Schemes', code: 'MoHFW' },
  { name: 'Ministry of Housing & Urban Affairs', count: '38 Schemes', code: 'MoHUA' },
  { name: 'Ministry of Micro, Small & Medium Enterprises', count: '62 Schemes', code: 'MoMSME' },
  { name: 'Ministry of New & Renewable Energy', count: '24 Schemes', code: 'MNRE' },
  { name: 'Ministry of Social Justice & Empowerment', count: '76 Schemes', code: 'MoSJE' }
];

// Featured Government Schemes with Official Details
const FEATURED_SCHEMES = [
  {
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    benefit: '₹6,000 / year (Direct Benefit Transfer)',
    type: 'Central Sector Scheme',
    tag: 'Income Support',
    url: 'https://pmkisan.gov.in'
  },
  {
    name: 'PM Surya Ghar: Muft Bijli Yojana',
    ministry: 'Ministry of New and Renewable Energy',
    benefit: 'Up to ₹78,000 Capital Subsidy + 300 free units/month',
    type: 'Central Sector Scheme',
    tag: 'Clean Energy & Savings',
    url: 'https://pmsuryaghar.gov.in'
  },
  {
    name: 'Ayushman Bharat PM-JAY',
    ministry: 'National Health Authority (MoHFW)',
    benefit: '₹5,00,000 / year Cashless Hospitalization per Family',
    type: 'Centrally Sponsored Scheme',
    tag: 'Healthcare Security',
    url: 'https://pmjay.gov.in'
  },
  {
    name: 'Stand-Up India Scheme',
    ministry: 'Department of Financial Services (MoF)',
    benefit: 'Bank loan ₹10 Lakh to ₹1 Crore for Greenfields',
    type: 'Central Government Scheme',
    tag: 'Women & SC/ST Enterprise',
    url: 'https://www.standupmitra.in'
  },
  {
    name: 'PM SVANidhi (Street Vendor Loan)',
    ministry: 'Ministry of Housing and Urban Affairs',
    benefit: '₹10,000 to ₹50,000 Collateral-free Working Capital',
    type: 'Central Sector Scheme',
    tag: 'Urban Livelihood',
    url: 'https://pmsvanidhi.mohua.gov.in'
  },
  {
    name: 'National Means-cum-Merit Scholarship (NMMSS)',
    ministry: 'Department of School Education (MoE)',
    benefit: '₹12,000 / year for meritorious students in Class 9-12',
    type: 'Central Sector Scheme',
    tag: 'Education Scholarship',
    url: 'https://scholarships.gov.in'
  }
];

export const LandingPage: React.FC<LandingPageProps> = ({
  profile,
  onChangeProfile,
  onStartAssessment,
  onOpenHowItWorks,
  onOpenDemoSelector,
  onSelectDemoProfile,
  onOpenArchitecture,
  hasSavedDraft = false,
  onContinueDraft
}) => {
  // Tab switcher state: 'Categories' | 'States' | 'Ministries'
  const [activeTab, setActiveTab] = useState<'Categories' | 'States' | 'Ministries'>('Categories');
  
  // Interactive SchemeBot mascot drawer state
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [botMessage, setBotMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { from: 'bot', text: 'Namaste! I am SchemeBot, your autonomous government scheme guide. Which category or benefit are you looking for today?' }
  ]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!botMessage.trim()) return;

    const userText = botMessage.trim();
    setChatHistory(prev => [...prev, { from: 'user', text: userText }]);
    setBotMessage('');

    // Instant intelligent simulated response
    setTimeout(() => {
      let reply = `Based on your criteria, our Autonomous Rule Engine will evaluate ${CATALOG_COUNTS.total} verified project schemes without document uploads. Click 'Find Schemes For You' to start!`;
      const lower = userText.toLowerCase();
      if (lower.includes('farmer') || lower.includes('kisan') || lower.includes('crop') || lower.includes('land')) {
        reply = "For farmers, schemes like PM-KISAN (₹6,000/yr), PM Fasal Bima Yojana, and Sub-Mission on Agricultural Mechanization are available! Let's check your landholding eligibility.";
      } else if (lower.includes('student') || lower.includes('scholarship') || lower.includes('college')) {
        reply = "For students, Central Post-Matric Scholarships and AICTE Saksham schemes provide tuition waivers and monthly stipends. Let's optimize your bundle!";
      } else if (lower.includes('business') || lower.includes('loan') || lower.includes('shop') || lower.includes('vendor')) {
        reply = "For entrepreneurs and vendors, PM SVANidhi (up to ₹50k) and PMEGP (35% subsidy) provide working capital with zero collateral!";
      }
      setChatHistory(prev => [...prev, { from: 'bot', text: reply }]);
    }, 450);
  };

  const handleCategorySelect = (categoryTitle: string) => {
    if (onChangeProfile) {
      if (categoryTitle.includes('Agriculture')) {
        onChangeProfile({ isFarmer: true, employmentStatus: 'Farmer' });
      } else if (categoryTitle.includes('Education')) {
        onChangeProfile({ isStudent: true, employmentStatus: 'Student', age: 20 });
      } else if (categoryTitle.includes('Business')) {
        onChangeProfile({ employmentStatus: 'Self-Employed' });
      }
    }
    onStartAssessment();
  };

  const handleStateSelect = (stateName: string) => {
    if (onChangeProfile) {
      onChangeProfile({ state: stateName });
    }
    onStartAssessment();
  };

  return (
    <div className="w-full bg-white text-slate-900 relative">
      {/* 1. HERO CAROUSEL / BANNER SECTION (Matches Screenshot 1 Layout & Visual Hierarchy) */}
      <section className="relative overflow-hidden bg-gradient-to-r from-white via-slate-50 to-orange-50/40 border-b border-slate-200 py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
        {/* Subtle orange circular graphic backdrop (as in Screenshot 1) */}
        <div className="absolute right-0 top-0 w-[550px] h-[550px] bg-gradient-to-bl from-orange-400/20 via-amber-200/25 to-transparent rounded-full blur-2xl pointer-events-none -mr-32 -mt-20" />
        <div className="absolute right-1/4 bottom-0 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column (Headline, UMANG / PS16 Badge, CTAs, QR Code) */}
            <div className="lg:col-span-6 space-y-6 text-left">
              {/* Brand mark & Sub-badge */}
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <div className="flex items-baseline">
                    <span className="text-3xl sm:text-4xl font-black text-emerald-600 tracking-tight">
                      Scheme
                    </span>
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                      Wise
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ml-0.5 mb-2 inline-block" />
                  </div>
                </div>
              </div>

              {/* Main Headline (Clean, Powerful, Non-messy) */}
              <motion.h1 
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight"
              >
                <span className="text-blue-900">One Platform,</span> <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-600">
                  Endless Opportunities
                </span>
              </motion.h1>

              {/* Concise, non-messy description */}
              <motion.p 
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 }}
                className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl"
              >
                Explore verified Central and State Government schemes with automated eligibility checks, statutory conflict elimination, and sequenced application roadmaps.
              </motion.p>

              {/* High-impact CTAs */}
              <motion.div 
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="flex flex-wrap items-center gap-4 pt-2"
              >
                {/* Orange/Emerald Pill CTA (Matches "Visit UMANG" style from Screenshot 1) */}
                <motion.button
                  onClick={onStartAssessment}
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold text-sm shadow-md shadow-orange-600/25 transition-all cursor-pointer"
                >
                  <span>Find Schemes For You</span>
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </motion.button>

                {hasSavedDraft && onContinueDraft && <button type="button" onClick={onContinueDraft} className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-5 py-3.5 text-sm font-bold text-blue-900 hover:bg-blue-100">
                  Continue saved assessment <ArrowRight className="h-4 w-4" />
                </button>}

              </motion.div>
            </div>

            {/* Right Column: Phone Mockup with Dotted Path & Floating Sector Badges (Matches Screenshot 1) */}
            <div className="lg:col-span-6 flex justify-center items-center relative min-h-[420px]">
              {/* Dotted Flight Path & Connected Floating Sector Badges */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {/* Sector 1: Health (Green) */}
                <motion.div 
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute left-4 top-8 p-3 rounded-2xl bg-white border border-emerald-200 shadow-lg flex items-center gap-2 z-20"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <HeartPulse className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block leading-tight">Healthcare</span>
                    <span className="text-xs font-bold text-slate-800 leading-tight">₹5L Cover</span>
                  </div>
                </motion.div>

                {/* Sector 2: Education (Blue) */}
                <motion.div 
                  animate={{ y: [0, 6, 0] }}
                  transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 }}
                  className="absolute left-10 top-36 p-3 rounded-2xl bg-white border border-blue-200 shadow-lg flex items-center gap-2 z-20"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] font-bold text-blue-800 uppercase block leading-tight">Education</span>
                    <span className="text-xs font-bold text-slate-800 leading-tight">Scholarships</span>
                  </div>
                </motion.div>

                {/* Sector 3: Agriculture (Orange) */}
                <motion.div 
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut", delay: 1 }}
                  className="absolute left-12 bottom-28 p-3 rounded-2xl bg-white border border-amber-200 shadow-lg flex items-center gap-2 z-20"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                    <Sprout className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] font-bold text-amber-800 uppercase block leading-tight">Agriculture</span>
                    <span className="text-xs font-bold text-slate-800 leading-tight">PM-KISAN DBT</span>
                  </div>
                </motion.div>

                {/* Sector 4: Housing (Teal) */}
                <motion.div 
                  animate={{ y: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut", delay: 1.5 }}
                  className="absolute left-20 bottom-8 p-3 rounded-2xl bg-white border border-teal-200 shadow-lg flex items-center gap-2 z-20"
                >
                  <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700">
                    <Home className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] font-bold text-teal-800 uppercase block leading-tight">Housing</span>
                    <span className="text-xs font-bold text-slate-800 leading-tight">Solar Subsidy</span>
                  </div>
                </motion.div>
              </div>

              {/* High-Fidelity Smartphone Device Mockup (Matches Screenshot 1 phone UI) */}
              <div className="relative z-10 w-72 sm:w-80 rounded-[40px] bg-slate-900 p-3 shadow-2xl border-4 border-slate-800">
                {/* Top speaker & camera notch */}
                <div className="w-24 h-4 bg-slate-900 rounded-b-xl mx-auto absolute left-1/2 -translate-x-1/2 top-3 z-30 flex items-center justify-center">
                  <div className="w-10 h-1 bg-slate-700 rounded-full" />
                </div>

                {/* Inner Screen */}
                <div className="bg-slate-50 rounded-[32px] overflow-hidden border border-slate-200 text-slate-900 pt-6 pb-4 px-3 space-y-3">
                  {/* App Header */}
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white text-[10px] font-bold">
                        SW
                      </div>
                      <span className="text-xs font-extrabold text-slate-900">SchemeWise</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Verified</span>
                    </div>
                  </div>

                  {/* App Search Bar */}
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      placeholder="Search for schemes..."
                      className="w-full bg-white border border-slate-200 rounded-full py-1.5 pl-8 pr-3 text-[11px] text-slate-600 cursor-pointer shadow-2xs"
                      onClick={onStartAssessment}
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                  </div>

                  {/* "Explore Eligible Schemes" Banner Card */}
                  <div 
                    onClick={onStartAssessment}
                    className="p-3 bg-gradient-to-r from-blue-900 to-indigo-800 text-white rounded-2xl shadow-sm text-left cursor-pointer hover:opacity-95 transition-opacity"
                  >
                    <span className="text-[9px] font-bold text-blue-200 uppercase tracking-wider block">
                      Decision Support Engine
                    </span>
                    <h4 className="text-xs font-bold leading-tight mt-0.5">
                      Explore Eligible Schemes Based on Region, Age & Livelihood
                    </h4>
                    <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-white/10 px-2 py-0.5 rounded-full">
                      Find Schemes <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>

                  {/* Recommended Schemes Mini List */}
                  <div className="space-y-1.5 text-left">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 px-1">
                      <span>Recommended Schemes</span>
                      <span className="text-[10px] text-blue-700 cursor-pointer" onClick={onStartAssessment}>View All (4,770+)</span>
                    </div>

                    {/* Scheme 1 */}
                    <div 
                      onClick={onStartAssessment}
                      className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between cursor-pointer hover:border-emerald-400 transition-colors"
                    >
                      <div>
                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">Agriculture</span>
                        <h5 className="text-[11px] font-bold text-slate-900 mt-0.5">PM-KISAN Samman</h5>
                        <p className="text-[10px] text-slate-500">₹6,000 / yr Direct Transfer</p>
                      </div>
                      <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        →
                      </span>
                    </div>

                    {/* Scheme 2 */}
                    <div 
                      onClick={onStartAssessment}
                      className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between cursor-pointer hover:border-blue-400 transition-colors"
                    >
                      <div>
                        <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded">Clean Energy</span>
                        <h5 className="text-[11px] font-bold text-slate-900 mt-0.5">PM Surya Ghar Solar</h5>
                        <p className="text-[10px] text-slate-500">₹78,000 Capital Subsidy</p>
                      </div>
                      <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                        →
                      </span>
                    </div>
                  </div>

                  {/* App Bottom Navigation Bar */}
                  <div className="border-t border-slate-200 pt-2 flex items-center justify-around text-[9px] text-slate-500">
                    <div className="flex flex-col items-center text-emerald-700 font-bold">
                      <Home className="w-3.5 h-3.5" />
                      <span>Home</span>
                    </div>
                    <div className="flex flex-col items-center cursor-pointer" onClick={onStartAssessment}>
                      <Workflow className="w-3.5 h-3.5" />
                      <span>Schemes</span>
                    </div>
                    <div className="flex flex-col items-center cursor-pointer" onClick={onOpenHowItWorks}>
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>Roadmap</span>
                    </div>
                    <div className="flex flex-col items-center cursor-pointer" onClick={onOpenDemoSelector}>
                      <Users className="w-3.5 h-3.5" />
                      <span>Profile</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE ICONIC CENTER SECTION (Exact Match with Screenshot 2) */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Tagline from Screenshot 2: #GOVERNMENTSCHEMES / #SCHEMESFORYOU */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs sm:text-sm font-black text-slate-800 tracking-widest uppercase mb-4"
        >
          #GOVERNMENTSCHEMES &nbsp;/&nbsp; #SCHEMESFORYOU
        </motion.div>

        {/* Big Prominent Emerald Green Button (From Screenshot 2) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <motion.button
            onClick={onStartAssessment}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-base shadow-lg shadow-emerald-700/25 transition-all cursor-pointer"
          >
            <span>Find Schemes For You</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* 3 Summary Statistics Cards (Exact Mint-Green Cards from Screenshot 2) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14 max-w-5xl mx-auto">
          {/* Card 1: Total Schemes */}
          <motion.div
            whileHover={{ y: -4 }}
            onClick={onStartAssessment}
            className="p-8 rounded-3xl bg-emerald-50/70 border border-emerald-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer text-center group"
          >
            <span className="text-4xl sm:text-5xl font-black text-slate-900 block tracking-tight group-hover:text-emerald-800 transition-colors">
              {CATALOG_COUNTS.total}
            </span>
            <span className="mt-2 text-sm font-bold text-slate-700 inline-flex items-center gap-1">
              Total Schemes in Catalog <ArrowRight className="w-3.5 h-3.5 text-emerald-700 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.div>

          {/* Card 2: Central Schemes */}
          <motion.div
            whileHover={{ y: -4 }}
            onClick={() => { setActiveTab('Ministries'); }}
            className="p-8 rounded-3xl bg-emerald-50/70 border border-emerald-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer text-center group"
          >
            <span className="text-4xl sm:text-5xl font-black text-slate-900 block tracking-tight group-hover:text-emerald-800 transition-colors">
              {CATALOG_COUNTS.central}
            </span>
            <span className="mt-2 text-sm font-bold text-slate-700 inline-flex items-center gap-1">
              Central Schemes <ArrowRight className="w-3.5 h-3.5 text-emerald-700 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.div>

          {/* Card 3: States/UTs Schemes */}
          <motion.div
            whileHover={{ y: -4 }}
            onClick={() => { setActiveTab('States'); }}
            className="p-8 rounded-3xl bg-emerald-50/70 border border-emerald-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer text-center group"
          >
            <span className="text-4xl sm:text-5xl font-black text-slate-900 block tracking-tight group-hover:text-emerald-800 transition-colors">
              {CATALOG_COUNTS.stateOrUt}
            </span>
            <span className="mt-2 text-sm font-bold text-slate-700 inline-flex items-center gap-1">
              State/UT Schemes <ArrowRight className="w-3.5 h-3.5 text-emerald-700 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.div>
        </div>

        {/* 3-Tab Filter Switcher (From Screenshot 2): Categories | States/UTs | Central Ministries */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <button
            onClick={() => setActiveTab('Categories')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'Categories'
                ? 'bg-emerald-100 text-emerald-900 shadow-2xs ring-1 ring-emerald-300'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Categories
          </button>

          <button
            onClick={() => setActiveTab('States')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'States'
                ? 'bg-emerald-100 text-emerald-900 shadow-2xs ring-1 ring-emerald-300'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            States/UTs
          </button>

          <button
            onClick={() => setActiveTab('Ministries')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'Ministries'
                ? 'bg-emerald-100 text-emerald-900 shadow-2xs ring-1 ring-emerald-300'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Central Ministries
          </button>
        </div>

        {/* Main Section Heading (Matches Screenshot 2 display typography) */}
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            {activeTab === 'Categories' && 'Find schemes based on categories'}
            {activeTab === 'States' && 'Find schemes based on your State or UT'}
            {activeTab === 'Ministries' && 'Find schemes by Central Ministries'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl mx-auto">
            {activeTab === 'Categories' && 'Clean, curated categories verified against Ministry Gazette circulars.'}
            {activeTab === 'States' && 'Filter schemes by your state of domicile for targeted welfare assistance.'}
            {activeTab === 'Ministries' && 'Explore flagship programs directly administered by Central Ministries.'}
          </p>
        </div>

        {/* TAB 1: 12 CATEGORIES GRID (Illustrated Icons as in Screenshot 2) */}
        {activeTab === 'Categories' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 text-left">
            {SCHEMEWISE_CATEGORIES.map((cat) => {
              const IconComp = cat.icon;
              return (
                <motion.button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.title)}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-500 hover:shadow-md transition-all text-left group cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 border ${cat.color} group-hover:scale-105 transition-transform`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug mb-1">
                      {cat.title}
                    </h3>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-500">{cat.count}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}

        {/* TAB 2: STATES & UTS GRID */}
        {activeTab === 'States' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-left">
            {MAJOR_STATES.map((st) => (
              <motion.button
                key={st.code}
                onClick={() => handleStateSelect(st.name)}
                whileHover={{ y: -3 }}
                className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-400 hover:shadow-sm transition-all flex items-center justify-between cursor-pointer group"
              >
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full block w-fit mb-1">
                    {st.code}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                    {st.name}
                  </h4>
                  <span className="text-[11px] text-slate-500">{st.count}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            ))}
          </div>
        )}

        {/* TAB 3: CENTRAL MINISTRIES GRID */}
        {activeTab === 'Ministries' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {CENTRAL_MINISTRIES.map((min) => (
              <motion.button
                key={min.code}
                onClick={onStartAssessment}
                whileHover={{ y: -3 }}
                className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-400 hover:shadow-sm transition-all flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full inline-block mb-1.5">
                    {min.code}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-800 transition-colors leading-snug">
                    {min.name}
                  </h4>
                </div>
                <div className="pt-3 border-t border-slate-100 mt-2 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-semibold text-emerald-700">{min.count}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </section>

      {/* 3. HOW SCHEMEWISE WORKS (The 3-Step Clear Citizen Flow) */}
      <section className="bg-slate-50 py-14 sm:py-18 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-12">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-200">
              Easy 3-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
              How SchemeWise Autonomous Optimizer Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl mx-auto">
              Skip endless manual portal searches and avoid application rejections caused by clawback rules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white font-black text-lg flex items-center justify-center mb-4 shadow-sm shadow-emerald-700/30">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Enter Details
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Provide quick demographic, residence, and livelihood details without uploading any Aadhaar or personal credentials.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-blue-800 text-white font-black text-lg flex items-center justify-center mb-4 shadow-sm shadow-blue-800/30">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Search & Detect Conflicts
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The engine evaluates eligibility rules against verified gazettes and flags mutually exclusive schemes to protect your benefits.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-2xl border border-emerald-200 bg-emerald-50/30 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white font-black text-lg flex items-center justify-center mb-4 shadow-sm shadow-orange-600/30">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Select & Apply with Roadmap
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Get an optimal value-maximizing bundle paired with a sequenced timeline of exact documents and official application links.
              </p>
            </div>
          </div>
        </div>
      </section>

      {false && <>
      {/* Advanced demo and architecture showcase is kept in code for review, but not shown in the citizen landing path. */}
      <section className="py-14 sm:py-18 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left bg-gradient-to-b from-slate-50 to-white rounded-3xl border border-slate-200/80 my-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Kurukshetra 2.0 PS16 Hackfest • Evaluation Suite</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Curated Demonstration Personas
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Experience the end-to-end autonomous optimization journey using three deterministic citizen profiles designed to test specific engine capabilities (adaptive branches, hard exclusions, conflict detection, and topological roadmaps).
            </p>
          </div>

          <button
            onClick={onOpenDemoSelector}
            className="text-xs font-bold text-blue-900 hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer bg-white px-4 py-2 rounded-xl border border-slate-300 shadow-2xs"
          >
            <span>View Evaluation Matrix</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DEMO_PROFILES.map((demo) => {
            const journey = DEMO_JOURNEYS[demo.id] || DEMO_JOURNEYS.demo_student;
            const Icon = demo.id === 'demo_student' 
              ? GraduationCap 
              : demo.id === 'demo_woman_artisan' 
              ? Briefcase 
              : Tractor;

            return (
              <motion.div
                key={demo.id}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl border-2 border-slate-200 hover:border-blue-600 p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      Prototype Data
                    </span>
                    <span className="text-[11px] font-semibold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                      {demo.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-900 text-white font-bold flex items-center justify-center shrink-0 shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-tight">
                        {demo.name}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500">
                        {demo.roleTitle}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mb-4 line-clamp-2">
                    {demo.shortSummary}
                  </p>

                  <div className="space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-200/80 mb-5 text-[11px]">
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="font-medium text-slate-500">Adaptive Branch:</span>
                      <span className="font-bold text-slate-900">{journey.expectedHighlight.adaptiveQuestionsCount} Targeted Qs</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="font-medium text-slate-500">Conflict Engine:</span>
                      <span className="font-bold text-slate-900">{journey.expectedHighlight.hasConflict ? 'Detected Exclusion' : 'Full Synergy'}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="font-medium text-slate-500">Document Gap:</span>
                      <span className="font-bold text-amber-800 line-clamp-1">{journey.expectedHighlight.missingDocumentName.split('&')[0]}</span>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (onSelectDemoProfile) {
                      onSelectDemoProfile(demo);
                    } else {
                      onOpenDemoSelector();
                    }
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <span>Launch {demo.name.split(' ')[0]}'s Journey</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3.6. FIXED TECHNOLOGY STACK & SYSTEM ARCHITECTURE (Official PS16 Spec) */}
      <section className="py-14 sm:py-18 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left bg-slate-900 text-white rounded-3xl my-8 shadow-xl border border-slate-800">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30 mb-2">
              <Workflow className="w-3.5 h-3.5 text-blue-400" />
              <span>PS16 Architectural Presentation Specification</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              1. Fixed Technology Stack & System Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Engineered with a deterministic decision-critical core, mathematical binary programming (PuLP + CBC), and post-decision LLM natural language explanation.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                if (onOpenArchitecture) {
                  onOpenArchitecture();
                } else {
                  window.dispatchEvent(new CustomEvent('open-architecture-modal'));
                }
              }}
              className="text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 px-4 py-2.5 rounded-xl shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>View Full ASCII & Diagram Spec</span>
            </button>
          </div>
        </div>

        {/* Most Important Architectural Principle Banner */}
        <div className="bg-amber-500/10 border-2 border-amber-400/40 rounded-2xl p-5 mb-8 text-amber-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              !
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-amber-300 uppercase tracking-wide">
                Most Important Architectural Principle: AI does NOT decide eligibility.
              </h3>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                The decision-critical path is <strong>strictly deterministic</strong>:
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5 font-mono text-[11px] font-bold text-white">
                <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">Rules</span>
                <span className="text-amber-400">→</span>
                <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">Eligibility</span>
                <span className="text-amber-400">→</span>
                <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">Exclusions</span>
                <span className="text-amber-400">→</span>
                <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">Conflicts</span>
                <span className="text-amber-400">→</span>
                <span className="bg-blue-900/80 px-2 py-1 rounded border border-blue-500 text-blue-200">Optimization (PuLP+CBC)</span>
                <span className="text-amber-400">→</span>
                <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">Documents</span>
                <span className="text-amber-400">→</span>
                <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">Roadmap</span>
              </div>
              <p className="text-xs text-amber-200/90 mt-2">
                <strong>Gemini is used after the result is calculated</strong>, mainly to explain it naturally, answer citizen queries, and provide multilingual clarity.
              </p>
            </div>
          </div>
        </div>

        {/* 2-Column Grid: Left Tech Stack Table, Right Architectural Flow Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Tech Stack Table (7 cols) */}
          <div className="lg:col-span-7 bg-slate-950/80 rounded-2xl p-5 border border-slate-800 shadow-inner flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-blue-400" />
                  <span>Technology Stack Specification</span>
                </h4>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  16 Layers
                </span>
              </div>

              <div className="border border-slate-800 rounded-xl overflow-hidden text-xs">
                <div className="max-h-96 overflow-y-auto scrollbar-thin">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">Layer</th>
                        <th className="py-2.5 px-3">Technology</th>
                        <th className="py-2.5 px-3">Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-[11px]">
                      {TECH_STACK_DATA.map((item, i) => (
                        <tr key={item.layer} className={i % 2 === 0 ? 'bg-slate-950' : 'bg-slate-900/40'}>
                          <td className="py-2 px-3 font-bold text-slate-200 whitespace-nowrap">
                            {item.layer}
                          </td>
                          <td className="py-2 px-3 font-mono font-semibold text-blue-400 whitespace-nowrap">
                            {item.tech}
                          </td>
                          <td className="py-2 px-3 text-slate-400">
                            {item.purpose}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Full-stack architecture verified for cloud deployment</span>
              <span className="text-emerald-400 font-semibold">✓ Pytest & UI Validated</span>
            </div>
          </div>

          {/* Architectural Decision Flow Summary (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-950 to-blue-950/40 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-emerald-400" />
                  <span>2. Architectural Diagram Flow</span>
                </h4>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Zero Hallucination
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="font-bold text-slate-300">1. Citizen Input:</span>
                  <span className="text-blue-300 font-medium">Profile + Preferences</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="font-bold text-slate-300">2. Client Layer:</span>
                  <span className="text-blue-300 font-medium">React + TypeScript + Tailwind</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="font-bold text-slate-300">3. Backend Layer:</span>
                  <span className="text-indigo-300 font-medium">FastAPI + Pydantic API</span>
                </div>
                <div className="p-2.5 bg-blue-900/40 rounded-xl border border-blue-700/50 flex items-center justify-between text-blue-200 font-bold">
                  <span>4. Orchestrator:</span>
                  <span>Benefit Strategist Engine</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-300">5. Parallel Engines:</span>
                  <span className="text-emerald-300">Eligibility · Exclusion · Conflict</span>
                </div>
                <div className="p-2.5 bg-emerald-950/40 rounded-xl border border-emerald-700/50 flex items-center justify-between text-emerald-200 font-bold">
                  <span>6. PuLP + CBC:</span>
                  <span>Mathematical Optimization</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-300">7. Readiness & Plan:</span>
                  <span className="text-amber-300">Document Engine + Roadmap</span>
                </div>
                <div className="p-2.5 bg-purple-950/40 rounded-xl border border-purple-700/50 flex items-center justify-between text-purple-200 font-bold">
                  <span>8. Post-Decision AI:</span>
                  <span>Gemini Explanation & Multilingual</span>
                </div>
              </div>

              {/* Scheme Knowledge Base Callout */}
              <div className="mt-4 p-3 bg-amber-950/30 border border-amber-500/30 rounded-xl text-[11px] text-amber-200">
                <div className="flex items-center gap-1.5 font-bold mb-0.5 text-amber-300">
                  <Database className="w-3.5 h-3.5" />
                  <span>Scheme Knowledge Base (Curated JSON)</span>
                </div>
                <p className="text-slate-300 text-[10px]">
                  Scheme Rules | Benefits | Documents | Eligibility | Exclusions | Conflicts | Dependencies
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (onOpenArchitecture) {
                  onOpenArchitecture();
                } else {
                  window.dispatchEvent(new CustomEvent('open-architecture-modal'));
                }
              }}
              className="mt-4 w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Inspect Full Interactive Diagram & ASCII</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      </>}

      {/* 4. FEATURED SCHEMES SHOWCASE */}
      <section className="py-14 sm:py-18 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Verified Public Catalog
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Featured Government Schemes
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Flagship programs with verified Ministry circulars and Direct Benefit Transfer (DBT) support.
            </p>
          </div>

          <button
            onClick={onStartAssessment}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 cursor-pointer"
          >
            Explore All {CATALOG_COUNTS.total} Schemes <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURED_SCHEMES.map((scheme, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -3 }}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-emerald-400 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-100">
                    {scheme.type}
                  </span>
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {scheme.tag}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug mb-1">
                  {scheme.name}
                </h3>
                <p className="text-xs text-slate-500 mb-3 font-medium">
                  {scheme.ministry}
                </p>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-4 text-xs font-bold text-slate-900">
                  <span className="text-[10px] text-slate-400 block font-normal">Direct Citizen Benefit:</span>
                  {scheme.benefit}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={onStartAssessment}
                  className="font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                >
                  Check My Eligibility →
                </button>
                <a
                  href={scheme.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-slate-600"
                  title="Official portal"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {false && <>
      {/* Optional assistant is intentionally hidden from the focused citizen workflow. */}
      <div className="fixed bottom-6 right-6 z-50 print:hidden">
        {/* The Animated Floating Mascot Button */}
        <motion.button
          onClick={() => setIsBotOpen(!isBotOpen)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white shadow-xl flex items-center justify-center border-2 border-white ring-4 ring-blue-500/20 cursor-pointer relative group"
          title="Ask SchemeBot - Government Assistant"
        >
          {/* Cute robot face icon with pulse */}
          <Bot className="w-7 h-7 text-white group-hover:rotate-6 transition-transform" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
        </motion.button>

        {/* The SchemeBot Assistant Popup Drawer */}
        <AnimatePresence>
          {isBotOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-left"
            >
              {/* Bot Header */}
              <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-none">SchemeBot Assistant</h4>
                    <span className="text-[10px] text-blue-200">Autonomous Citizen AI Guide</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsBotOpen(false)}
                  className="w-6 h-6 rounded-full hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Message History */}
              <div className="p-4 space-y-3 max-h-72 overflow-y-auto text-xs">
                {chatHistory.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`p-3 rounded-2xl max-w-[85%] ${
                      msg.from === 'user' 
                        ? 'bg-blue-900 text-white rounded-tr-none' 
                        : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Prompt Suggestions */}
              <div className="px-4 pb-2 pt-1 flex flex-wrap gap-1.5 border-t border-slate-100">
                <button
                  onClick={() => {
                    setBotMessage('Show schemes for small farmers');
                    handleSendMessage();
                  }}
                  className="text-[10px] px-2 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 font-semibold cursor-pointer transition-colors"
                >
                  🌾 Farmer Schemes
                </button>
                <button
                  onClick={() => {
                    setBotMessage('What are college student scholarships?');
                    handleSendMessage();
                  }}
                  className="text-[10px] px-2 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-800 text-slate-600 font-semibold cursor-pointer transition-colors"
                >
                  🎓 Scholarships
                </button>
                <button
                  onClick={() => {
                    setBotMessage('How do I apply for rooftop solar?');
                    handleSendMessage();
                  }}
                  className="text-[10px] px-2 py-1 rounded-full bg-slate-100 hover:bg-amber-50 hover:text-amber-800 text-slate-600 font-semibold cursor-pointer transition-colors"
                >
                  ☀️ Solar Subsidy
                </button>
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 flex items-center gap-2 bg-slate-50">
                <input
                  type="text"
                  value={botMessage}
                  onChange={(e) => setBotMessage(e.target.value)}
                  placeholder="Ask SchemeBot about any scheme..."
                  className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <button
                  type="submit"
                  className="p-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div></>}
    </div>
  );
};
