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
  if (profile.isStudent || profile.educationLevel === 'Undergraduate' || profile.educationLevel === 'Postgraduate') contextualFields.add('enrolledInHigherEducation');
  if (profile.gender === 'Female' && ['Self-Employed', 'Unemployed'].includes(profile.employmentStatus)) contextualFields.add('isWomanEntrepreneur');
  if (profile.age >= 16 && profile.age <= 35 && !profile.isFarmer) contextualFields.add('pursuingApprenticeship');
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
  return ADAPTIVE_QUESTIONS
    .filter((question) => !answered.has(question.id))
    .filter((question) => (ruleFields.has(String(question.field)) || contextualFields.has(String(question.field))) && !basicFields.has(String(question.field)))
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
    .map((question) => {
      const schemes = schemeNamesByField.get(String(question.field)) ?? [];
      const reason = schemes.length > 0
        ? `This answer can change eligibility for: ${schemes.slice(0, 4).join(', ')}${schemes.length > 4 ? ' and other matching schemes' : ''}.`
        : question.contextExplanation;
      return { ...question, contextExplanation: reason };
    });
}
