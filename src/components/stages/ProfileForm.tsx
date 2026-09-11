/**
 * Page 2: Primary Profile Form
 * Guided, responsive, visually polished citizen criteria input with natural conditional fields.
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 */
import React from 'react';
import { 
  User, 
  GraduationCap, 
  Wallet, 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { CitizenProfile, Gender, SocialCategory, AreaType, MaritalStatus, EducationLevel, EmploymentStatus } from '../../types';

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
];

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  onChangeProfile,
  onSubmit,
  onOpenDemoSelector
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10">
      {/* Header Banner */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
            Stage 1 • Basic Profile
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Tell us about yourself
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            We use these foundational details to filter candidates and eliminate inapplicable schemes upfront.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenDemoSelector}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition-colors shadow-2xs cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-600" />
          Load Demo Profile
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: About You */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Demographic Details</h3>
              <p className="text-xs text-slate-500">Core personal factors used in scheme eligibility age and domicile brackets.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Age */}
            <div>
              <label htmlFor="input-age" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Age (Years) <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-age"
                type="number"
                min={14}
                max={100}
                required
                value={profile.age || ''}
                onChange={(e) => onChangeProfile({ age: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm font-medium text-slate-900 bg-white"
                placeholder="e.g. 24"
              />
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="input-gender" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Gender <span className="text-rose-500">*</span>
              </label>
              <select
                id="input-gender"
                value={profile.gender}
                onChange={(e) => onChangeProfile({ gender: e.target.value as Gender })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm font-medium text-slate-900 bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Transgender">Transgender</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* State */}
            <div>
              <label htmlFor="input-state" className="block text-xs font-semibold text-slate-700 mb-1.5">
                State of Residence <span className="text-rose-500">*</span>
              </label>
              <select
                id="input-state"
                value={profile.state}
                onChange={(e) => onChangeProfile({ state: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm font-medium text-slate-900 bg-white"
              >
                {INDIAN_STATES.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Area Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Area Type <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Rural', 'Urban'] as AreaType[]).map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => onChangeProfile({ areaType: area })}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      profile.areaType === area
                        ? 'bg-blue-900 text-white border-blue-900 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            {/* Social Category */}
            <div>
              <label htmlFor="input-category" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Social Category <span className="text-rose-500">*</span>
              </label>
              <select
                id="input-category"
                value={profile.socialCategory}
                onChange={(e) => onChangeProfile({ socialCategory: e.target.value as SocialCategory })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm font-medium text-slate-900 bg-white"
              >
                <option value="General">General</option>
                <option value="OBC">OBC (Other Backward Classes)</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
                <option value="EWS">EWS (Economically Weaker Section)</option>
              </select>
            </div>

            {/* Marital Status */}
            <div>
              <label htmlFor="input-marital" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Marital Status
              </label>
              <select
                id="input-marital"
                value={profile.maritalStatus}
                onChange={(e) => onChangeProfile({ maritalStatus: e.target.value as MaritalStatus })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm font-medium text-slate-900 bg-white"
              >
                <option value="Single">Single / Unmarried</option>
                <option value="Married">Married</option>
                <option value="Widowed">Widowed</option>
                <option value="Divorced">Divorced</option>
                <option value="Separated">Separated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Education & Work */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-800 flex items-center justify-center font-bold">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Education & Employment</h3>
              <p className="text-xs text-slate-500">Determines scholarship, skilling, apprentice, or enterprise scheme eligibility.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Student Status Toggle */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Currently a Student?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onChangeProfile({ isStudent: true, employmentStatus: 'Student' })}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                    profile.isStudent
                      ? 'bg-blue-900 text-white border-blue-900 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => onChangeProfile({ isStudent: false })}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                    !profile.isStudent
                      ? 'bg-blue-900 text-white border-blue-900 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Education Level */}
            <div>
              <label htmlFor="input-edu" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Highest Education Level
              </label>
              <select
                id="input-edu"
                value={profile.educationLevel}
                onChange={(e) => onChangeProfile({ educationLevel: e.target.value as EducationLevel })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm font-medium text-slate-900 bg-white"
              >
                <option value="Below 10th">Below 10th</option>
                <option value="10th Pass">10th Pass (Matriculation)</option>
                <option value="12th Pass">12th Pass (Higher Secondary)</option>
                <option value="Undergraduate">Undergraduate Degree (Enrolled or Passed)</option>
                <option value="Postgraduate">Postgraduate Degree</option>
                <option value="Diploma">Diploma / ITI</option>
                <option value="Vocational">Vocational Certificate</option>
              </select>
            </div>

            {/* Employment Status */}
            <div>
              <label htmlFor="input-emp" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Primary Employment Status
              </label>
              <select
                id="input-emp"
                value={profile.employmentStatus}
                onChange={(e) => {
                  const val = e.target.value as EmploymentStatus;
                  onChangeProfile({ 
                    employmentStatus: val,
                    isFarmer: val === 'Farmer',
                    isStudent: val === 'Student'
                  });
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm font-medium text-slate-900 bg-white"
              >
                <option value="Student">Student</option>
                <option value="Farmer">Farmer / Agriculture</option>
                <option value="Self-Employed">Self-Employed / Micro-Enterprise</option>
                <option value="Unemployed">Unemployed / Job Seeker</option>
                <option value="Employed">Employed (Salaried / Private)</option>
                <option value="Daily Wage Worker">Daily Wage / Informal Worker</option>
              </select>
            </div>

            {/* Occupation text */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label htmlFor="input-occupation" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Specific Occupation / Activity (Optional)
              </label>
              <input
                id="input-occupation"
                type="text"
                value={profile.occupation || ''}
                onChange={(e) => onChangeProfile({ occupation: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm font-medium text-slate-900 bg-white"
                placeholder="e.g. Engineering student, Handloom weaver, Vegetable street vendor, Cotton farmer"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Financial & Household Details */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Financial & Household Circumstances</h3>
              <p className="text-xs text-slate-500">Essential for means-tested subsidies, housing grants, and health protection schemes.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Annual Income */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="input-income-slider" className="text-xs font-semibold text-slate-700">
                  Total Annual Family Income:
                </label>
                <span className="text-sm font-extrabold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                  ₹{(profile.annualFamilyIncome || 0).toLocaleString('en-IN')} / year
                </span>
              </div>

              <input
                id="input-income-slider"
                type="range"
                min={30000}
                max={1200000}
                step={10000}
                value={profile.annualFamilyIncome}
                onChange={(e) => onChangeProfile({ annualFamilyIncome: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-700"
              />

              <div className="flex justify-between text-[11px] text-slate-500">
                <span>₹30,000 (BPL/Vulnerable)</span>
                <span>₹2.5 Lakhs (Scholarship Cap)</span>
                <span>₹12 Lakhs</span>
              </div>
            </div>

            {/* Cards & Categorization */}
            <div className="grid grid-cols-2 gap-3 self-center">
              <div 
                onClick={() => onChangeProfile({ hasRationCard: !profile.hasRationCard })}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  profile.hasRationCard 
                    ? 'border-emerald-400 bg-emerald-50/50' 
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
                <p className="text-[11px] text-slate-500">NFSA / Priority Household / AAY card holder</p>
              </div>

              <div 
                onClick={() => onChangeProfile({ hasBPLCard: !profile.hasBPLCard })}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  profile.hasBPLCard 
                    ? 'border-emerald-400 bg-emerald-50/50' 
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
                <p className="text-[11px] text-slate-500">Officially verified Below Poverty Line household</p>
              </div>
            </div>
          </div>

          {/* Conditional Agricultural Section (reveals only if farmer or selected farming) */}
          {profile.employmentStatus === 'Farmer' && (
            <div className="mt-6 pt-5 border-t border-slate-100 bg-amber-50/40 p-4 rounded-xl border border-amber-200/60">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-amber-600" />
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                  Agricultural Landholding Parameters
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="input-landholding" className="block text-xs font-semibold text-slate-700 mb-1">
                    Cultivable Landholding (Hectares)
                  </label>
                  <input
                    id="input-landholding"
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="20"
                    value={profile.landholdingHectares || 1.0}
                    onChange={(e) => onChangeProfile({ landholdingHectares: parseFloat(e.target.value) || 0.1 })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 bg-white"
                    placeholder="e.g. 1.4"
                  />
                  <span className="text-[11px] text-slate-500 mt-0.5 block">
                    Small/Marginal farmer threshold is up to 2.0 Hectares (approx 5 acres).
                  </span>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer mt-3">
                    <input
                      type="checkbox"
                      checked={profile.isRainfedLand || false}
                      onChange={(e) => onChangeProfile({ isRainfedLand: e.target.checked })}
                      className="rounded text-blue-700 w-4 h-4"
                    />
                    <span className="text-xs font-medium text-slate-700">
                      Un-irrigated / Rainfed Crop Cultivation
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-blue-600 shrink-0" />
            <span>All fields are processed locally; no server tracking is performed.</span>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-semibold text-sm shadow-md shadow-blue-900/20 transition-all hover:translate-x-0.5 cursor-pointer"
          >
            Find Potential Schemes
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
