import { AdaptiveQuestion, CitizenProfile, Scheme } from '../types';
import { ADAPTIVE_QUESTIONS } from '../data/questions';

/**
 * Decision-impact planner for follow-up questions.
 * One question is emitted per profile field, ordered by how many candidate
 * schemes can change when that field changes. Basic profile fields are not
 * repeated here; they were collected in ProfileForm.
 */
export function planAdaptiveQuestions(
  profile: CitizenProfile,
  candidateSchemes: Scheme[],
  answeredQuestionIds: string[] = []
): AdaptiveQuestion[] {
  const answered = new Set(answeredQuestionIds);
  const ruleFields = new Set<string>();
  const schemeNamesByField = new Map<string, string[]>();

  candidateSchemes.forEach((scheme) => {
    const predicates = [
      ...(scheme.rules.all ?? []),
      ...(scheme.rules.any ?? []),
      ...(scheme.rules.none ?? []),
      ...(scheme.rules.exclusionRules ?? [])
    ];
    predicates.forEach((predicate) => {
      const field = String(predicate.field);
      ruleFields.add(field);
      const names = schemeNamesByField.get(field) ?? [];
      if (!names.includes(scheme.shortName)) names.push(scheme.shortName);
      schemeNamesByField.set(field, names);
    });
  });

  const contextualFields = new Set<string>();
  const isHighSchoolOrJuniorCollege = ['Below 10th', '10th Pass', '12th Pass', 'Diploma'].includes(profile.educationLevel) || profile.age < 20;

  if (profile.isStudent || profile.educationLevel === 'Undergraduate' || profile.educationLevel === 'Postgraduate' || isHighSchoolOrJuniorCollege) {
    contextualFields.add('enrolledInHigherEducation');
    contextualFields.add('isProfessionalCourse');
    contextualFields.add('isHosteller');
    contextualFields.add('isCapAdmitted');
    contextualFields.add('hasQualifyingExamAbove60');
    if (['OBC', 'SC', 'ST'].includes(profile.socialCategory)) {
      contextualFields.add('hasCasteValidity');
    }
    if (['OBC'].includes(profile.socialCategory)) {
      contextualFields.add('hasNonCreamyLayer');
    }
    contextualFields.add('isOrphanOrSingleParent');
    contextualFields.add('isItiStudent');
    contextualFields.add('familyBeneficiaryCountUnderTwo');
    contextualFields.add('attendanceAboveFiftyPercent');
    contextualFields.add('hasTwelfthMathPhysicsAbove60');
    if (profile.socialCategory === 'SC' || profile.age <= 20) {
      contextualFields.add('hasTenthMarksAbove75');
    }
    contextualFields.add('isFreedomFighterChild');
    contextualFields.add('isPreparingForEngineeringOrMedicalEntrance');
  }

  // DYNAMIC FILTERING: UPSC & Ph.D. Specific Question Filtering
  // Students who have NOT selected 'Postgraduate' or 'Aspirant' status MUST NOT be asked UPSC or Ph.D. questions.
  const isPostgraduate = profile.educationLevel === 'Postgraduate';
  const isAspirant = Boolean(
    profile.isAspirant === true ||
    profile.academicFocus === 'Aspirant' ||
    profile.employmentRole?.toLowerCase().includes('aspirant') ||
    profile.occupation?.toLowerCase().includes('aspirant') ||
    profile.isPreparingForUpscOrMpsc === true
  );
  const isDoctoral = Boolean(
    profile.academicFocus === 'Doctoral' ||
    profile.isEnrolledInPhd === true ||
    (isPostgraduate && profile.age >= 23)
  );

  // Ph.D. questions strictly require Postgraduate or Doctoral research status
  if (isDoctoral || isPostgraduate) {
    contextualFields.add('isEnrolledInPhd');
  }

  // UPSC/MPSC questions strictly require Postgraduate or Aspirant status (Age 21-38)
  if ((isPostgraduate || isAspirant) && profile.age >= 21 && profile.age <= 38) {
    contextualFields.add('isPreparingForUpscOrMpsc');
    contextualFields.add('hasClearedUpscOrMpscStage');
  }
  if (profile.gender === 'Female' && ['Self-Employed', 'Unemployed'].includes(profile.employmentStatus)) contextualFields.add('isWomanEntrepreneur');
  if (profile.age >= 16 && profile.age <= 35 && !profile.isFarmer && (!profile.isStudent || profile.educationLevel === 'Diploma' || profile.educationLevel === 'Below 10th')) {
    contextualFields.add('pursuingApprenticeship');
  }
  if ((profile.gender === 'Female' || profile.maritalStatus === 'Married') && !profile.isStudent && !profile.isFarmer) contextualFields.add('hasGirlChildUnder10');
  if (profile.isFarmer) {
    contextualFields.add('landholdingHectares');
    contextualFields.add('isRainfedLand');
  }
  if (profile.areaType !== 'Rural' && ['Self-Employed', 'Daily Wage Worker'].includes(profile.employmentStatus) && !profile.isStudent) contextualFields.add('hasStreetVendingActivity');

  const basicFields = new Set([
    'age', 'gender', 'state', 'areaType', 'socialCategory', 'maritalStatus',
    'employmentStatus', 'selfEmploymentCategory', 'selfEmploymentDetails', 'employmentRole', 'employerName',
    'annualFamilyIncome', 'isStudent', 'isFarmer', 'hasDisability', 'isMinority'
  ]);

  const seenFields = new Set<string>();
  const questions = ADAPTIVE_QUESTIONS
    .filter((question) => !answered.has(question.id))
    .filter((question) => {
      const fieldStr = String(question.field);
      if (basicFields.has(fieldStr)) return false;

      // Dynamic Exclusions: strictly exclude UPSC and PhD questions for students who haven't selected Postgraduate or Aspirant status
      if (!isDoctoral && !isPostgraduate && fieldStr === 'isEnrolledInPhd') {
        return false;
      }
      if (!isPostgraduate && !isAspirant && (fieldStr === 'isPreparingForUpscOrMpsc' || fieldStr === 'hasClearedUpscOrMpscStage')) {
        return false;
      }

      // Must be relevant to the citizen's demographics, age, and academic stage
      if (!contextualFields.has(fieldStr)) return false;
      // And must either affect candidate schemes or be a key verification criterion
      return ruleFields.has(fieldStr) || [
        'isCapAdmitted',
        'isProfessionalCourse',
        'isHosteller',
        'hasCasteValidity',
        'hasNonCreamyLayer',
        'isPreparingForEngineeringOrMedicalEntrance'
      ].includes(fieldStr);
    })
    .filter((question) => {
      const field = String(question.field);
      if (seenFields.has(field)) return false;
      seenFields.add(field);
      return true;
    })
    .sort((left, right) => {
      const rightImpact = schemeNamesByField.get(String(right.field))?.length ?? 0;
      const leftImpact = schemeNamesByField.get(String(left.field))?.length ?? 0;
      return rightImpact - leftImpact || left.id.localeCompare(right.id);
    })
    .slice(0, 6) // Focus on top 5-6 high-impact questions for rapid, accurate results
    .map((question) => {
      const schemes = schemeNamesByField.get(String(question.field)) ?? [];
      const reason = schemes.length > 0
        ? `This answer can change eligibility for: ${schemes.slice(0, 4).join(', ')}${schemes.length > 4 ? ' and other matching schemes' : ''}.`
        : question.contextExplanation;
      return { ...question, contextExplanation: reason };
    });

  return questions;
}

/**
 * Returns dynamic refinement metrics for the active profile,
 * letting the UI explicitly show which advanced questions were pruned.
 */
export function getQuestionRefinementStats(profile: CitizenProfile) {
  const isPostgraduate = profile.educationLevel === 'Postgraduate';
  const isAspirant = Boolean(
    profile.isAspirant === true ||
    profile.academicFocus === 'Aspirant' ||
    profile.employmentRole?.toLowerCase().includes('aspirant') ||
    profile.occupation?.toLowerCase().includes('aspirant') ||
    profile.isPreparingForUpscOrMpsc === true
  );
  const isDoctoral = Boolean(
    profile.academicFocus === 'Doctoral' ||
    profile.isEnrolledInPhd === true ||
    (isPostgraduate && profile.age >= 23)
  );

  return {
    phdFilteredOut: !isDoctoral && !isPostgraduate,
    upscFilteredOut: !isPostgraduate && !isAspirant,
    isPostgraduate,
    isAspirant,
    isDoctoral,
    activeFocus: profile.academicFocus || (isAspirant ? 'Aspirant' : isDoctoral ? 'Doctoral' : 'Degree/College')
  };
}
