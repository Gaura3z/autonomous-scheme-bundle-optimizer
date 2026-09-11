/**
 * Page 4: Adaptive Questionnaire
 * Asks only the necessary questions needed by unresolved candidate schemes.
 * Provides clear human-centered justification for every question.
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 */
import React, { useState, useMemo } from 'react';
import { 
  HelpCircle, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Check, 
  CheckCircle2, 
  Info,
  ShieldQuestion
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CitizenProfile, AdaptiveQuestion } from '../../types';
import { ADAPTIVE_QUESTIONS } from '../../data/questions';

interface AdaptiveQuestionnaireProps {
  profile: CitizenProfile;
  onChangeProfile: (updated: Partial<CitizenProfile>) => void;
  onComplete: () => void;
  onBack: () => void;
}

export const AdaptiveQuestionnaire: React.FC<AdaptiveQuestionnaireProps> = ({
  profile,
  onChangeProfile,
  onComplete,
  onBack
}) => {
  // Determine relevant questions based on candidate schemes and profile context
  const relevantQuestions = useMemo(() => {
    return ADAPTIVE_QUESTIONS.filter((q) => {
      if (q.id === 'q_student_higher_ed') {
        return profile.isStudent || profile.educationLevel === 'Undergraduate' || profile.educationLevel === 'Postgraduate';
      }
      if (q.id === 'q_street_vending') {
        return profile.areaType !== 'Rural' && (profile.employmentStatus === 'Self-Employed' || profile.employmentStatus === 'Daily Wage Worker');
      }
      if (q.id === 'q_woman_entrepreneur') {
        return profile.gender === 'Female' || profile.socialCategory === 'SC' || profile.socialCategory === 'ST';
      }
      if (q.id === 'q_apprenticeship') {
        return profile.age >= 16 && profile.age <= 35 && !profile.isFarmer;
      }
      if (q.id === 'q_girl_child') {
        return profile.age >= 18;
      }
      if (q.id === 'q_farmer_landholding') {
        return profile.isFarmer;
      }
      return true;
    });
  }, [profile]);

  const [currentIndex, setCurrentIndex] = useState(0);

  // If no specific adaptive questions apply, auto complete
  if (relevantQuestions.length === 0) {
    onComplete();
    return null;
  }

  const currentQ = relevantQuestions[Math.min(currentIndex, relevantQuestions.length - 1)];
  const isLastQuestion = currentIndex >= relevantQuestions.length - 1;

  const currentAnswer = profile[currentQ.field];

  const handleSelectBoolean = (val: boolean) => {
    onChangeProfile({ [currentQ.field]: val });
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      onBack();
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      {/* Questionnaire Progress */}
      <div className="mb-6 flex items-center justify-between text-xs text-slate-500">
        <span className="font-semibold text-blue-700 uppercase tracking-wider">
          Adaptive Question {currentIndex + 1} of {relevantQuestions.length}
        </span>
        <span className="bg-slate-100 px-2.5 py-1 rounded-full text-[11px] font-medium text-slate-600">
          Targeted Follow-up
        </span>
      </div>

      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-8">
        <motion.div 
          className="bg-blue-700 h-full rounded-full"
          initial={false}
          animate={{ width: `${((currentIndex + 1) / relevantQuestions.length) * 100}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>

      {/* Main Question Card with Animated Transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm transition-all"
        >
          {/* Scheme Context Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-100 mb-4">
            <Info className="w-3.5 h-3.5 text-blue-600" />
            <span>{currentQ.schemeJustification}</span>
          </div>

          {/* Question Title */}
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug mb-3">
            {currentQ.title}
          </h3>

          {/* Human-Centered Explanation */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-8">
            {currentQ.contextExplanation}
          </p>

          {/* Answer Controls */}
          <div className="mb-8">
            {currentQ.type === 'boolean' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectBoolean(true)}
                  className={`p-5 rounded-2xl border-2 text-center font-bold text-base transition-all cursor-pointer ${
                    currentAnswer === true
                      ? 'border-blue-700 bg-blue-50/70 text-blue-900 shadow-sm ring-2 ring-blue-100'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {currentAnswer === true && <Check className="w-5 h-5 text-blue-700" />}
                    <span>Yes, I do / Enrolled</span>
                  </div>
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectBoolean(false)}
                  className={`p-5 rounded-2xl border-2 text-center font-bold text-base transition-all cursor-pointer ${
                    currentAnswer === false
                      ? 'border-blue-700 bg-blue-50/70 text-blue-900 shadow-sm ring-2 ring-blue-100'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {currentAnswer === false && <Check className="w-5 h-5 text-blue-700" />}
                    <span>No, does not apply</span>
                  </div>
                </motion.button>
              </div>
            )}

            {currentQ.type === 'number' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">Specify amount ({currentQ.unit}):</span>
                  <span className="text-lg font-bold text-blue-900 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                    {Number(currentAnswer) || currentQ.min || 1} {currentQ.unit}
                  </span>
                </div>
                <input
                  type="range"
                  min={currentQ.min || 0}
                  max={currentQ.max || 10}
                  step={currentQ.step || 1}
                  value={Number(currentAnswer) || currentQ.min || 1}
                  onChange={(e) => onChangeProfile({ [currentQ.field]: parseFloat(e.target.value) })}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-700"
                />
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <motion.button
              type="button"
              onClick={handlePrevious}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </motion.button>

            <motion.button
              type="button"
              onClick={handleNext}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-semibold text-sm shadow-md shadow-blue-900/20 transition-colors cursor-pointer"
            >
              <span>{isLastQuestion ? 'Complete Assessment' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
