/**
 * Stage 1: Guided Progressive Profile Intake
 * Matches official Indian G2C myScheme chunked step-by-step experience:
 * - 1-2 focused questions per step
 * - Tactile visual cards for Gender, Area, Category, and Disability
 * - Connected progress dots with checkmarks
 * - Contextual statutory (i) info modals
 * - A guided path that keeps document declaration before eligibility
 * 
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Sparkles, 
  Info, 
  X,
  User,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { 
  CitizenProfile, 
  Gender, 
  SocialCategory, 
  AreaType, 
  EmploymentStatus 
} from '../../types';

interface ProfileFormProps {
  profile: CitizenProfile;
  onChangeProfile: (updated: Partial<CitizenProfile>) => void;
  onSubmit: () => void;
  onOpenDemoSelector: () => void;
}

const INDIAN_STATES = [
  { code: 'MH', name: 'Maharashtra' },
  { code: 'GJ', name: 'Gujarat' },
  { code: 'RJ', name: 'Rajasthan' },
  { code: 'KA', name: 'Karnataka' },
  { code: 'UP', name: 'Uttar Pradesh' },
  { code: 'MP', name: 'Madhya Pradesh' },
  { code: 'TN', name: 'Tamil Nadu' },
  { code: 'DL', name: 'Delhi NCR' },
  { code: 'WB', name: 'West Bengal' },
  { code: 'AP', name: 'Andhra Pradesh' },
  { code: 'TG', name: 'Telangana' },
  { code: 'KL', name: 'Kerala' },
  { code: 'BR', name: 'Bihar' },
  { code: 'PB', name: 'Punjab' },
  { code: 'HR', name: 'Haryana' },
  { code: 'OR', name: 'Odisha' },
  { code: 'AS', name: 'Assam' },
  { code: 'JH', name: 'Jharkhand' },
  { code: 'CG', name: 'Chhattisgarh' },
  { code: 'UK', name: 'Uttarakhand' },
  { code: 'HP', name: 'Himachal Pradesh' },
  { code: 'JK', name: 'Jammu & Kashmir' },
  { code: 'GA', name: 'Goa' },
];

interface InfoItem {
  title: string;
  description: string;
  statutoryReference: string;
}

const INFO_DEFINITIONS: Record<string, InfoItem> = {
  OBC: {
    title: 'Other Backward Classes (OBC)',
    description: 'Statutory non-creamy layer OBC candidates are eligible for Central & State affirmative scholarships, fee reimbursement, and subsidized enterprise finance.',
    statutoryReference: 'National Commission for Backward Classes (NCBC) Central List'
  },
  PVTG: {
    title: 'Particularly Vulnerable Tribal Groups (PVTG)',
    description: '75 classified indigenous communities with declining populations, pre-agricultural technology, and low literacy. Targeted under the PM-JANMAN mission with prioritized housing, water, and electrification grants.',
    statutoryReference: 'Ministry of Tribal Affairs / PM-JANMAN Scheme'
  },
  SC: {
    title: 'Scheduled Castes (SC)',
    description: 'Officially notified communities under Article 341 of the Constitution of India. Entitled to Post-Matric scholarships, Stand-Up India credit priority, and venture capital funds.',
    statutoryReference: 'Constitution (Scheduled Castes) Order, 1950'
  },
  ST: {
    title: 'Scheduled Tribes (ST)',
    description: 'Indigenous communities recognized under Article 342. Eligible for tribal sub-plan grants, FRA land title support, and Eklavya Model Residential School access.',
    statutoryReference: 'Constitution (Scheduled Tribes) Order, 1950'
  },
  DNT: {
    title: 'De-Notified, Nomadic, and Semi-Nomadic Communities (DNT)',
    description: 'Historically alienated communities covered under the Scheme for Economic Empowerment of DNT Communities (SEED) for coaching, health insurance, and housing.',
    statutoryReference: 'Development and Welfare Board for DNTs (DWBDNC)'
  },
  EWS: {
    title: 'Economically Weaker Section (EWS)',
    description: 'Persons not covered under SC/ST/OBC reservations whose family gross annual income is below INR 8 Lakhs, qualifying for 10% educational & employment reservation.',
    statutoryReference: '103rd Constitutional Amendment Act, 2019'
  },
  DISABILITY: {
    title: 'Persons with Benchmark Disabilities (PwD)',
    description: 'Individuals with not less than 40% of a specified disability certified by a medical authority or verified through a Unique Disability ID (UDID) card.',
    statutoryReference: 'Rights of Persons with Disabilities (RPwD) Act, 2016'
  }
};

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  onChangeProfile,
  onSubmit,
  onOpenDemoSelector
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [activeInfo, setActiveInfo] = useState<InfoItem | null>(null);
  const totalSteps = 5;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-[82vh] flex flex-col justify-between max-w-2xl mx-auto px-4 py-6 sm:py-10">
      {/* Focused intake notice */}
      <div className="mb-6 flex items-center justify-between bg-emerald-50/70 border border-emerald-200/80 rounded-2xl px-4 py-2.5 text-xs text-emerald-950">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span className="font-medium">
            <strong>Progressive Intake Mode:</strong> Chunked 1-by-1 citizen assessment
          </span>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-10 relative">
        {/* Step Indicator Header with Back button */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
            ) : (
              <span className="text-xs font-semibold text-slate-400">
                Step 1 of {totalSteps}
              </span>
            )}

            {/* Progress Dots Component */}
            <div className="flex items-center gap-1 sm:gap-2">
              {[1, 2, 3, 4, 5].map((stepIdx) => {
                const isCompleted = stepIdx < currentStep;
                const isActive = stepIdx === currentStep;

                return (
                  <React.Fragment key={stepIdx}>
                    {/* Connecting line */}
                    {stepIdx > 1 && (
                      <div
                        className={`h-0.5 w-4 sm:w-7 rounded-full transition-all duration-300 ${
                          stepIdx <= currentStep ? 'bg-emerald-600' : 'bg-slate-200'
                        }`}
                      />
                    )}

                    {/* Step Circle */}
                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all duration-200 ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isActive
                          ? 'border-2 border-emerald-600 bg-white text-emerald-700'
                          : 'border border-slate-300 bg-white text-slate-400'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                      ) : isActive ? (
                        <div className="w-2 h-2 rounded-full bg-emerald-600" />
                      ) : null}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>

            <span className="text-xs font-mono text-slate-400">
              {Math.round((currentStep / totalSteps) * 100)}%
            </span>
          </div>

          {/* Heading matching screenshot */}
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 text-center tracking-tight">
            Help us find the best schemes for you
          </h1>
        </div>

        {/* Dynamic Animated Steps */}
        <AnimatePresence mode="wait">
          {/* STEP 1: GENDER & AGE */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              <div>
                <label className="block text-sm sm:text-base font-bold text-slate-900 mb-4">
                  <span className="text-rose-500 mr-1">*</span>
                  Tell us about yourself, you are a...
                </label>

                {/* 3 Gender Cards with exact symbols */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  {[
                    {
                      id: 'Male',
                      label: 'Male',
                      symbol: (
                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="10" cy="14" r="5" />
                          <line x1="19" y1="5" x2="13.6" y2="10.4" />
                          <line x1="19" y1="5" x2="14" y2="5" />
                          <line x1="19" y1="5" x2="19" y2="10" />
                        </svg>
                      )
                    },
                    {
                      id: 'Female',
                      label: 'Female',
                      symbol: (
                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="9" r="5" />
                          <line x1="12" y1="14" x2="12" y2="21" />
                          <line x1="9" y1="18" x2="15" y2="18" />
                        </svg>
                      )
                    },
                    {
                      id: 'Transgender',
                      label: 'Transgender',
                      symbol: (
                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="4" />
                          <line x1="12" y1="16" x2="12" y2="21" />
                          <line x1="9.5" y1="19" x2="14.5" y2="19" />
                          <line x1="14.8" y1="9.2" x2="19" y2="5" />
                          <line x1="19" y1="5" x2="15" y2="5" />
                          <line x1="19" y1="5" x2="19" y2="9" />
                          <line x1="9.2" y1="9.2" x2="5" y2="5" />
                          <line x1="5" y1="5" x2="9" y2="5" />
                          <line x1="5" y1="5" x2="5" y2="9" />
                        </svg>
                      )
                    }
                  ].map((genderOption) => {
                    const isSelected = profile.gender === genderOption.id;
                    return (
                      <button
                        key={genderOption.id}
                        type="button"
                        onClick={() => onChangeProfile({ gender: genderOption.id as Gender })}
                        className={`flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/20 text-emerald-700 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                        }`}
                      >
                        <div className={`mb-2 ${isSelected ? 'text-emerald-600' : 'text-slate-500'}`}>
                          {genderOption.symbol}
                        </div>
                        <span className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-emerald-700' : 'text-slate-800'}`}>
                          {genderOption.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Inline Age Selection */}
              <div className="pt-2">
                <label className="flex items-center flex-wrap gap-2 text-sm sm:text-base font-bold text-slate-900">
                  <span className="text-rose-500">*</span>
                  <span>and your age is</span>
                  <select
                    value={profile.age || 28}
                    onChange={(e) => onChangeProfile({ age: parseInt(e.target.value) || 28 })}
                    className="inline-block px-3.5 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-sm font-extrabold text-slate-900 bg-white cursor-pointer shadow-2xs"
                  >
                    {Array.from({ length: 85 }, (_, i) => i + 15).map((ageVal) => (
                      <option key={ageVal} value={ageVal}>
                        {ageVal}
                      </option>
                    ))}
                  </select>
                  <span>years</span>
                </label>
                <p className="text-xs text-slate-500 mt-2">
                  Helps match age-bracketed youth schemes, maternal incentives, or senior citizen pensions.
                </p>
              </div>
            </motion.div>
          )}

          {/* STEP 2: STATE & AREA OF RESIDENCE */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div>
                <label htmlFor="select-state" className="block text-sm sm:text-base font-bold text-slate-900 mb-2">
                  Please select your state
                </label>
                <select
                  id="select-state"
                  value={profile.state}
                  onChange={(e) => onChangeProfile({ state: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-sm font-semibold text-slate-900 bg-white cursor-pointer shadow-2xs"
                >
                  <option value="">--Select One--</option>
                  {INDIAN_STATES.map((st) => (
                    <option key={st.code} value={st.code}>
                      {st.name} ({st.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm sm:text-base font-bold text-slate-900 mb-2">
                  <span className="text-rose-500 mr-1">*</span>
                  Please select your area of residence
                </label>

                <div className="grid grid-cols-2 gap-4">
                  {(['Urban', 'Rural'] as AreaType[]).map((area) => {
                    const isSelected = profile.areaType === area;
                    return (
                      <button
                        key={area}
                        type="button"
                        onClick={() => onChangeProfile({ areaType: area })}
                        className={`py-3.5 px-4 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/20 text-emerald-800 font-bold shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700 font-semibold bg-white'
                        }`}
                      >
                        <span className="text-sm">{area}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Determines qualification between Gramin (Rural) and Shehari (Urban) housing, sanitation, and livelihood missions.
                </p>
              </div>
            </motion.div>
          )}

          {/* STEP 3: SOCIAL CATEGORY / CASTE */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <label className="block text-sm sm:text-base font-bold text-slate-900 mb-3">
                <span className="text-rose-500 mr-1">*</span>
                You belong to...
              </label>

              <div className="space-y-2.5">
                {[
                  { id: 'General', label: 'General', infoKey: null },
                  { id: 'OBC', label: 'Other Backward Class (OBC)', infoKey: 'OBC' },
                  { id: 'PVTG', label: 'Particularly Vulnerable Tribal Group (PVTG)', infoKey: 'PVTG', subOf: 'ST' },
                  { id: 'SC', label: 'Scheduled Caste (SC)', infoKey: 'SC' },
                  { id: 'ST', label: 'Scheduled Tribe (ST)', infoKey: 'ST' },
                  { id: 'DNT', label: 'De-Notified, Nomadic, and Semi-Nomadic (DNT) communities', infoKey: 'DNT', subOf: 'OBC' },
                  { id: 'EWS', label: 'Economically Weaker Section (EWS)', infoKey: 'EWS' }
                ].map((item) => {
                  const isSelected = profile.socialCategory === (item.subOf || item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => onChangeProfile({ socialCategory: (item.subOf || item.id) as SocialCategory })}
                      className={`flex items-center justify-between p-3.5 px-4 rounded-xl border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/20 text-emerald-800'
                          : 'border-slate-200 hover:border-slate-300 text-slate-800 bg-white'
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-semibold">
                        {item.label}
                      </span>

                      {item.infoKey && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveInfo(INFO_DEFINITIONS[item.infoKey!]);
                          }}
                          className="w-6 h-6 rounded-full bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-800 flex items-center justify-center shrink-0 cursor-pointer ml-2 transition-colors"
                          title="Click to view statutory criteria"
                        >
                          <Info className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 4: DISABILITY / DIFFERENTLY ABLED */}
          {currentStep === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <label className="text-sm sm:text-base font-bold text-slate-900">
                    <span className="text-rose-500 mr-1">*</span>
                    Do you identify as a person with a disability?
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveInfo(INFO_DEFINITIONS.DISABILITY)}
                    className="w-5 h-5 rounded-full bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-800 flex items-center justify-center shrink-0 cursor-pointer transition-colors"
                    title="View benchmark disability guidelines"
                  >
                    <Info className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => onChangeProfile({ hasDisability: true, disabilityPercentage: profile.disabilityPercentage || 40 })}
                    className={`py-3.5 px-4 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                      profile.hasDisability
                        ? 'border-emerald-600 bg-emerald-50/20 text-emerald-800 font-bold shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 font-semibold bg-white'
                    }`}
                  >
                    <span className="text-sm">Yes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onChangeProfile({ hasDisability: false, disabilityPercentage: 0 })}
                    className={`py-3.5 px-4 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                      !profile.hasDisability
                        ? 'border-emerald-600 bg-emerald-50/20 text-emerald-800 font-bold shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 font-semibold bg-white'
                    }`}
                  >
                    <span className="text-sm">No</span>
                  </button>
                </div>
              </div>

              {/* Conditional Percentage Selector if Yes */}
              {profile.hasDisability && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="pt-2"
                >
                  <label htmlFor="select-disability-pct" className="block text-sm sm:text-base font-bold text-slate-900 mb-2">
                    <span className="text-rose-500 mr-1">*</span>
                    What is your differently abled percentage?
                  </label>
                  <select
                    id="select-disability-pct"
                    value={profile.disabilityPercentage || 40}
                    onChange={(e) => onChangeProfile({ disabilityPercentage: parseInt(e.target.value) || 40 })}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-sm font-semibold text-slate-900 bg-white cursor-pointer shadow-2xs"
                  >
                    <option value={14}>14% (Below benchmark)</option>
                    <option value={40}>40% (Benchmark Disability standard threshold)</option>
                    <option value={50}>50%</option>
                    <option value={75}>75% (Severe disability)</option>
                    <option value={100}>100% (Complete / total disability)</option>
                  </select>
                  <span className="text-xs text-slate-500 mt-2 block">
                    Under the RPwD Act 2016, a minimum 40% certified disability unlocks reserved pensions, ADIP aids, and assistive appliances.
                  </span>
                </motion.div>
              )}

              {profile.gender === 'Female' && (
                <div className="pt-2 border-t border-slate-100">
                  <label className="block text-sm sm:text-base font-bold text-slate-900 mb-3">
                    What is your marital status?
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {(['Single', 'Married'] as const).map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => onChangeProfile({ maritalStatus: status })}
                        className={`py-3.5 px-4 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                          profile.maritalStatus === status
                            ? 'border-emerald-600 bg-emerald-50/20 text-emerald-800 font-bold shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700 font-semibold bg-white'
                        }`}
                      >
                        {status === 'Single' ? 'Unmarried / Single' : 'Married'}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    This helps identify women- and household-focused schemes. You can change it later.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 5: LIVELIHOOD, INCOME & HOUSEHOLD */}
          {currentStep === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Primary Occupation */}
              <div>
                <label className="block text-sm sm:text-base font-bold text-slate-900 mb-2.5">
                  <span className="text-rose-500 mr-1">*</span>
                  What is your primary occupation or status?
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'Farmer', label: 'Farmer / Agri' },
                    { id: 'Student', label: 'Student' },
                    { id: 'Self-Employed', label: 'Artisan / Small Business' },
                    { id: 'Daily Wage Worker', label: 'Daily Wage / Informal' },
                    { id: 'Unemployed', label: 'Job Seeker' },
                    { id: 'Employed', label: 'Salaried' }
                  ].map((emp) => {
                    const isSelected = profile.employmentStatus === emp.id;
                    return (
                      <button
                        key={emp.id}
                        type="button"
                        onClick={() => {
                          const val = emp.id as EmploymentStatus;
                          onChangeProfile({
                            employmentStatus: val,
                            isFarmer: val === 'Farmer',
                            isStudent: val === 'Student'
                          });
                        }}
                        className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/20 text-emerald-800 font-bold'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700 font-semibold bg-white'
                        }`}
                      >
                        <span className="text-xs sm:text-sm">{emp.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Conditional Land Holding for Farmers */}
              {profile.employmentStatus === 'Farmer' && (
                <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-2xl">
                  <label htmlFor="input-land-acres" className="block text-xs font-bold text-amber-950 mb-1">
                    Agricultural Landholding (Acres)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      id="input-land-acres"
                      type="number"
                      step="0.5"
                      min="0.1"
                      max="25"
                      value={((profile.landholdingHectares || 1.0) * 2.47).toFixed(1)}
                      onChange={(e) => {
                        const acres = parseFloat(e.target.value) || 1.0;
                        onChangeProfile({ landholdingHectares: acres / 2.47 });
                      }}
                      className="w-32 px-3 py-2 rounded-xl border border-slate-300 font-bold text-sm bg-white"
                    />
                    <span className="text-xs text-slate-600">
                      Small/Marginal Farmer limit: &le; 5 Acres (2.0 Hectares)
                    </span>
                  </div>
                </div>
              )}

              {/* Annual Income Slider */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="range-family-income" className="text-xs font-bold text-slate-700">
                    Total Annual Family Income:
                  </label>
                  <span className="text-sm font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                    ₹{(profile.annualFamilyIncome || 0).toLocaleString('en-IN')} / year
                  </span>
                </div>

                <input
                  id="range-family-income"
                  type="range"
                  min={30000}
                  max={1200000}
                  step={10000}
                  value={profile.annualFamilyIncome}
                  onChange={(e) => onChangeProfile({ annualFamilyIncome: parseInt(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />

                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>₹30,000 (BPL)</span>
                  <span>₹1.8L (Housing Cap)</span>
                  <span>₹2.5L (Scholarships)</span>
                  <span>₹12L+</span>
                </div>
              </div>

              {/* Household Cards (Ration Card / BPL) */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div
                  onClick={() => onChangeProfile({ hasRationCard: !profile.hasRationCard })}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    profile.hasRationCard
                      ? 'border-emerald-600 bg-emerald-50/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">Ration Card</span>
                    <input
                      type="checkbox"
                      checked={profile.hasRationCard}
                      onChange={() => {}}
                      className="rounded text-emerald-600"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">NFSA / PHH card</p>
                </div>

                <div
                  onClick={() => onChangeProfile({ hasBPLCard: !profile.hasBPLCard })}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    profile.hasBPLCard
                      ? 'border-emerald-600 bg-emerald-50/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">BPL Status</span>
                    <input
                      type="checkbox"
                      checked={profile.hasBPLCard}
                      onChange={() => {}}
                      className="rounded text-emerald-600"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">Below Poverty Line</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Navigation Buttons matching screenshot */}
        <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between gap-3">
          <div />

          {/* Forward Action Button */}
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            <span>{currentStep === totalSteps ? 'Find Schemes' : 'Next'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Statutory Info Modal when clicking (i) */}
      {activeInfo && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setActiveInfo(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Info className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {activeInfo.title}
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {activeInfo.description}
            </p>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-500 font-mono">
              <strong>Statutory Authority:</strong> {activeInfo.statutoryReference}
            </div>

            <button
              type="button"
              onClick={() => setActiveInfo(null)}
              className="w-full mt-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
