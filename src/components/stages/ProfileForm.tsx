/**
 * Stage 1: Guided Progressive Profile Intake
 * Matches a clear Indian G2C SchemeWise chunked step-by-step experience:
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
  SocialCategoryDetail,
  AreaType, 
  EmploymentStatus,
  SelfEmploymentCategory
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
  },
  MINORITY: {
    title: 'Notified minority community',
    description: 'Some government schemes provide targeted support to notified minority communities. Select Yes only when this applies to your official records.',
    statutoryReference: 'Ministry of Minority Affairs / applicable scheme guidelines'
  }
};

const SELF_EMPLOYMENT_OPTIONS: {
  value: SelfEmploymentCategory;
  label: string;
  detailLabel: string;
  placeholder: string;
}[] = [
  { value: 'Farmer / Agriculture', label: 'Farmer / Agriculture', detailLabel: 'Type of farming', placeholder: 'Example: crops, dairy, poultry, or livestock' },
  { value: 'Business Owner', label: 'Business Owner', detailLabel: 'Business type', placeholder: 'Example: manufacturing, services, or online business' },
  { value: 'Shop Owner', label: 'Shop Owner', detailLabel: 'Shop or business details', placeholder: 'Example: grocery shop, clothing shop, or repair shop' },
  { value: 'Trader', label: 'Trader', detailLabel: 'Trading activity', placeholder: 'Example: wholesale, retail, or agricultural trading' },
  { value: 'Freelancer', label: 'Freelancer', detailLabel: 'Freelance field or service', placeholder: 'Example: design, writing, coding, or digital marketing' },
  { value: 'Consultant', label: 'Consultant', detailLabel: 'Consulting field', placeholder: 'Example: finance, education, technology, or management' },
  { value: 'Contractor', label: 'Contractor', detailLabel: 'Type of contracting work', placeholder: 'Example: construction, electrical, plumbing, or maintenance' },
  { value: 'Driver / Transport', label: 'Driver / Transport', detailLabel: 'Type of transport or work', placeholder: 'Example: taxi, auto, delivery, or goods transport' },
  { value: 'Artisan / Handicraft', label: 'Artisan / Handicraft', detailLabel: 'Type of craft or work', placeholder: 'Example: handloom, pottery, carpentry, or embroidery' },
  { value: 'Skilled Worker', label: 'Skilled Worker', detailLabel: 'Skill or trade', placeholder: 'Example: electrician, mason, mechanic, or tailor' },
  { value: 'Teacher / Tutor', label: 'Teacher / Tutor', detailLabel: 'Teaching type or subject', placeholder: 'Example: school subject, coaching, or music' },
  { value: 'Professional Services', label: 'Professional Services', detailLabel: 'Profession or service type', placeholder: 'Example: legal, medical, accounting, or design services' },
  { value: 'Other Self-Employment', label: 'Other Self-Employment', detailLabel: 'Occupation description', placeholder: 'Describe your self-employment work' }
];

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  onChangeProfile,
  onSubmit,
  onOpenDemoSelector
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [activeInfo, setActiveInfo] = useState<InfoItem | null>(null);
  const [validationMessage, setValidationMessage] = useState('');
  const totalSteps = 7;

  const validateStep = () => {
    if (currentStep === 1 && (!profile.gender || profile.age < 15 || profile.age > 120)) return 'Please choose a gender and a valid age between 15 and 120.';
    if (currentStep === 2 && (!profile.state || !profile.areaType)) return 'Please select your state and area of residence.';
    if (currentStep === 3 && !profile.socialCategory) return 'Please select your social category.';
    if (currentStep === 4 && profile.hasDisability && (!profile.disabilityPercentage || profile.disabilityPercentage < 1 || profile.disabilityPercentage > 100)) return 'Please select a valid certified disability percentage.';
    if (currentStep === 7 && !['Student', 'Employed', 'Self-Employed'].includes(profile.employmentStatus)) return 'Please select Student, Employment, or Self-Employment.';
    if (currentStep === 7 && profile.employmentStatus === 'Self-Employed' && !profile.selfEmploymentCategory) return 'Please select a self-employment category.';
    if (currentStep === 7 && profile.employmentStatus === 'Self-Employed' && !profile.selfEmploymentDetails?.trim()) return 'Please add a short description of your self-employment work.';
    if (currentStep === 7 && profile.employmentStatus === 'Self-Employed' && (profile.selfEmploymentMonthlyIncome === undefined || profile.selfEmploymentMonthlyIncome < 0)) return 'Please enter your monthly self-employment income.';
    if (currentStep === 7 && profile.annualFamilyIncome < 0) return 'Please provide a valid annual income.';
    return '';
  };

  const handleNext = () => {
    const error = validateStep();
    if (error) { setValidationMessage(error); return; }
    setValidationMessage('');
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onSubmit();
    }
  };

  const handleBack = () => {
    setValidationMessage('');
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
        {validationMessage && <div role="alert" aria-live="polite" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">{validationMessage}</div>}
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
              {Array.from({ length: totalSteps }, (_, index) => index + 1).map((stepIdx) => {
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <p className="-mt-1 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-xs leading-relaxed text-blue-950">
                Select one category only. Choose the most specific category shown on your official certificate. PVTG is a specific group within ST, and DNT is shown separately from the parent category so the system does not select two options.
              </p>

              <div className="space-y-2.5" role="radiogroup" aria-label="Social category">
                {[
                  { id: 'General', label: 'General', infoKey: null },
                  { id: 'OBC', label: 'Other Backward Class (OBC)', infoKey: 'OBC' },
                  { id: 'PVTG', label: 'Particularly Vulnerable Tribal Group (PVTG)', infoKey: 'PVTG', subOf: 'ST' },
                  { id: 'SC', label: 'Scheduled Caste (SC)', infoKey: 'SC' },
                  { id: 'ST', label: 'Scheduled Tribe (ST)', infoKey: 'ST' },
                  { id: 'DNT', label: 'De-Notified, Nomadic, and Semi-Nomadic (DNT) communities', infoKey: 'DNT', subOf: 'OBC' },
                  { id: 'EWS', label: 'Economically Weaker Section (EWS)', infoKey: 'EWS' }
                ].map((item) => {
                  const isSelected = item.subOf
                    ? profile.socialCategoryDetail === item.id
                    : profile.socialCategoryDetail === undefined && profile.socialCategory === item.id;
                  const selectCategory = () => {
                    if (item.subOf) {
                      onChangeProfile({
                        socialCategory: item.subOf as SocialCategory,
                        socialCategoryDetail: item.id as SocialCategoryDetail
                      });
                    } else {
                      onChangeProfile({
                        socialCategory: item.id as SocialCategory,
                        socialCategoryDetail: undefined
                      });
                    }
                  };
                  return (
                    <div
                      key={item.id}
                      role="radio"
                      aria-checked={isSelected}
                      tabIndex={0}
                      onClick={selectCategory}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          selectCategory();
                        }
                      }}
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              {/* Minority and marital status are separate steps on mobile and desktop. */}
            </motion.div>
          )}

          {/* STEP 5: MINORITY COMMUNITY */}
          {currentStep === 5 && (
            <motion.div key="step-5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <label className="text-sm sm:text-base font-bold text-slate-900">
                    <span className="text-rose-500 mr-1">*</span>
                    Do you belong to a minority community?
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveInfo(INFO_DEFINITIONS.MINORITY)}
                    className="w-5 h-5 rounded-full bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-800 flex items-center justify-center shrink-0 cursor-pointer transition-colors"
                    title="View minority-community guidance"
                  >
                    <Info className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => onChangeProfile({ isMinority: true })}
                    className={`py-3.5 px-4 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                      profile.isMinority === true
                        ? 'border-emerald-600 bg-emerald-50/20 text-emerald-800 font-bold shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 font-semibold bg-white'
                    }`}
                  >
                    <span className="text-sm">Yes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onChangeProfile({ isMinority: false })}
                    className={`py-3.5 px-4 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                      profile.isMinority !== true
                        ? 'border-emerald-600 bg-emerald-50/20 text-emerald-800 font-bold shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 font-semibold bg-white'
                    }`}
                  >
                    <span className="text-sm">No</span>
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  This helps identify schemes that specifically support notified minority communities.
                </p>
              </div>
            </motion.div>
          )}

          {/* STEP 6: MARITAL STATUS */}
          {currentStep === 6 && (
            <motion.div key="step-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="space-y-6">
              {profile.gender === 'Female' && (
                <div>
                  <label className="block text-sm sm:text-base font-bold text-slate-900 mb-3">
                    What is your marital status?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              {profile.gender !== 'Female' && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-center text-sm text-slate-600">
                  Marital status is not needed for this profile. Continue to the next step.
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 7: LIVELIHOOD, INCOME & HOUSEHOLD */}
          {currentStep === 7 && (
            <motion.div
              key="step-7"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Primary employment status */}
              <div>
                <label className="block text-sm sm:text-base font-bold text-slate-900 mb-2.5">
                  <span className="text-rose-500 mr-1">*</span>
                  Current Employment Status
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'Student', label: 'Student' },
                    { id: 'Employed', label: 'Employment' },
                    { id: 'Self-Employed', label: 'Self-Employment' }
                  ].map((statusOption) => {
                    const isSelected = profile.employmentStatus === statusOption.id;
                    return (
                      <button
                        key={statusOption.id}
                        type="button"
                        onClick={() => {
                          const status = statusOption.id as EmploymentStatus;
                          onChangeProfile({
                            employmentStatus: status,
                            isStudent: status === 'Student',
                            occupation: status === 'Student' ? 'Student' : '',
                            isFarmer: false,
                            selfEmploymentCategory: undefined,
                            selfEmploymentDetails: undefined,
                            selfEmploymentMonthlyIncome: undefined,
                            employmentRole: undefined,
                            employerName: undefined,
                            employmentMonthlyIncome: undefined
                          });
                        }}
                        className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/20 text-emerald-800 font-bold'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700 font-semibold bg-white'
                        }`}
                      >
                        <span className="text-xs sm:text-sm">{statusOption.label}</span>
                      </button>
                    );
                  })}
                </div>

                {profile.employmentStatus === 'Self-Employed' && (
                  <div className="mt-5 space-y-3 rounded-2xl border border-blue-200 bg-blue-50/40 p-4">
                    <label className="block text-xs font-bold text-slate-700">
                      <span className="text-rose-500 mr-1">*</span>
                      Self-Employment Category
                      <select
                        value={profile.selfEmploymentCategory || ''}
                        onChange={(event) => {
                          const category = event.target.value as SelfEmploymentCategory;
                          onChangeProfile({
                            selfEmploymentCategory: category || undefined,
                            selfEmploymentDetails: undefined,
                            occupation: category || '',
                            isFarmer: category === 'Farmer / Agriculture',
                            landholdingHectares: category === 'Farmer / Agriculture' ? profile.landholdingHectares : undefined,
                            isRainfedLand: category === 'Farmer / Agriculture' ? profile.isRainfedLand : undefined
                          });
                        }}
                        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900"
                      >
                        <option value="">Select a category</option>
                        {SELF_EMPLOYMENT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                      </select>
                    </label>

                    {profile.selfEmploymentCategory && (() => {
                      const detail = SELF_EMPLOYMENT_OPTIONS.find((option) => option.value === profile.selfEmploymentCategory);
                      if (!detail) return null;
                      return (
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="text-xs font-bold text-slate-700 sm:col-span-2">
                            <span className="text-rose-500 mr-1">*</span>
                            {detail.detailLabel}
                            <input
                              type="text"
                              value={profile.selfEmploymentDetails || ''}
                              onChange={(event) => onChangeProfile({ selfEmploymentDetails: event.target.value, occupation: event.target.value })}
                              placeholder={detail.placeholder}
                              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900"
                            />
                          </label>
                          <label className="text-xs font-bold text-slate-700">
                            <span className="text-rose-500 mr-1">*</span>
                            Monthly Self-Employment Income
                            <input
                              type="number"
                              min="0"
                              value={profile.selfEmploymentMonthlyIncome ?? ''}
                              onChange={(event) => onChangeProfile({ selfEmploymentMonthlyIncome: event.target.value === '' ? undefined : Number(event.target.value) })}
                              placeholder="Enter amount in rupees"
                              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900"
                            />
                          </label>
                          {profile.selfEmploymentCategory === 'Farmer / Agriculture' && (
                            <label className="text-xs font-bold text-slate-700">
                              Agricultural Landholding (hectares, optional)
                              <input
                                type="number"
                                min="0"
                                step="0.1"
                                value={profile.landholdingHectares ?? ''}
                                onChange={(event) => onChangeProfile({ landholdingHectares: event.target.value === '' ? undefined : Number(event.target.value) })}
                                placeholder="Example: 1.5"
                                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900"
                              />
                            </label>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>

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
                  step={5000}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
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
