/**
 * Systematic Engine Test Plan
 * Validates deterministic scheme filtering, demographic guardrails,
 * and adaptive question gating across diverse citizen and student profiles.
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 */

import { CitizenProfile, Scheme } from '../types';
import { evaluateScheme, evaluateAllSchemes, getCandidateSchemes } from './eligibility';
import { planAdaptiveQuestions, getQuestionRefinementStats } from './questions';
import { MASTER_SCHEMES } from '../data/schemes';

export interface TestCaseResult {
  id: string;
  category: 'Academic' | 'Gender' | 'Social Category' | 'Income' | 'Livelihood' | 'Adaptive Questions';
  name: string;
  description: string;
  passed: boolean;
  assertions: {
    description: string;
    passed: boolean;
    expected: string;
    actual: string;
  }[];
  durationMs: number;
}

export interface TestSuiteSummary {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  totalAssertions: number;
  passedAssertions: number;
  failedAssertions: number;
  results: TestCaseResult[];
  timestamp: string;
}

// Base mock profiles for systematic evaluation
const createBaseProfile = (overrides: Partial<CitizenProfile> = {}): CitizenProfile => ({
  age: 19,
  gender: 'Male',
  state: 'Maharashtra',
  areaType: 'Urban',
  socialCategory: 'OBC',
  maritalStatus: 'Single',
  isStudent: true,
  educationLevel: 'Undergraduate',
  employmentStatus: 'Student',
  occupation: 'Engineering Student',
  annualFamilyIncome: 350000,
  hasBPLCard: false,
  hasRationCard: true,
  isFarmer: false,
  hasDisability: false,
  isMinority: false,
  isWomanEntrepreneur: false,
  hasStreetVendingActivity: false,
  enrolledInHigherEducation: true,
  pursuingApprenticeship: false,
  hasGirlChildUnder10: false,
  isProfessionalCourse: true,
  isCapAdmitted: true,
  isHosteller: true,
  hasCasteValidity: true,
  hasNonCreamyLayer: true,
  attendanceAboveFiftyPercent: true,
  familyBeneficiaryCountUnderTwo: true,
  hasQualifyingExamAbove60: true,
  ...overrides
});

export function runSystematicTestPlan(): TestSuiteSummary {
  const results: TestCaseResult[] = [];

  // ==========================================
  // TEST 1: Standard Undergraduate (No UPSC, No Ph.D. questions)
  // ==========================================
  {
    const start = performance.now();
    const profile = createBaseProfile({
      educationLevel: 'Undergraduate',
      age: 20,
      isAspirant: false,
      academicFocus: 'Degree/College'
    });

    const candidateSchemes = getCandidateSchemes(profile);
    const questions = planAdaptiveQuestions(profile, candidateSchemes);
    const stats = getQuestionRefinementStats(profile);

    const hasPhdQuestion = questions.some(q => q.field === 'isEnrolledInPhd');
    const hasUpscQuestion = questions.some(q => q.field === 'isPreparingForUpscOrMpsc' || q.field === 'hasClearedUpscOrMpscStage');
    const hasPhdCandidateScheme = candidateSchemes.some(s => s.code.includes('PMRF') || s.name.toLowerCase().includes('ph.d'));
    const hasUpscCandidateScheme = candidateSchemes.some(s => s.code.includes('BARTI-UPSC') || s.name.toLowerCase().includes('upsc prelims'));

    const assertions = [
      {
        description: 'Ph.D. questions strictly excluded for undergraduate student',
        passed: !hasPhdQuestion,
        expected: 'false (Ph.D. question excluded)',
        actual: String(hasPhdQuestion)
      },
      {
        description: 'UPSC/MPSC questions strictly excluded for non-aspirant student',
        passed: !hasUpscQuestion,
        expected: 'false (UPSC question excluded)',
        actual: String(hasUpscQuestion)
      },
      {
        description: 'Refinement stats report Ph.D. and UPSC filtered out',
        passed: stats.phdFilteredOut && stats.upscFilteredOut,
        expected: 'true',
        actual: String(stats.phdFilteredOut && stats.upscFilteredOut)
      },
      {
        description: 'Ph.D. schemes (e.g. PMRF) marked ineligible in candidate pool',
        passed: !hasPhdCandidateScheme,
        expected: 'false (No Ph.D. schemes)',
        actual: String(hasPhdCandidateScheme)
      },
      {
        description: 'Civil services cash schemes marked ineligible in candidate pool',
        passed: !hasUpscCandidateScheme,
        expected: 'false (No UPSC schemes)',
        actual: String(hasUpscCandidateScheme)
      }
    ];

    results.push({
      id: 'TC-01',
      category: 'Academic',
      name: 'Undergraduate Adaptive Question & Scheme Gating',
      description: 'Verifies that undergraduates who have not selected Postgraduate or Aspirant status never see Ph.D. or UPSC questions/schemes.',
      passed: assertions.every(a => a.passed),
      assertions,
      durationMs: Math.round((performance.now() - start) * 100) / 100
    });
  }

  // ==========================================
  // TEST 2: High School / Junior College Student (16 Yrs, 10th Pass)
  // ==========================================
  {
    const start = performance.now();
    const profile = createBaseProfile({
      educationLevel: '10th Pass',
      age: 16,
      socialCategory: 'SC',
      isProfessionalCourse: false,
      isCapAdmitted: false,
      annualFamilyIncome: 180000
    });

    const candidateSchemes = getCandidateSchemes(profile);
    const questions = planAdaptiveQuestions(profile, candidateSchemes);

    const hasHigherEdDegreeQuestions = questions.some(q => q.field === 'isEnrolledInPhd' || q.field === 'isPreparingForUpscOrMpsc');
    const higherEdDegreeSchemes = candidateSchemes.filter(s => s.category === 'Education & Skill' && (s.rules.all ?? []).some(r => r.field === 'isCapAdmitted'));

    const assertions = [
      {
        description: 'Advanced college/doctoral/civil services questions excluded for 16-yr-old',
        passed: !hasHigherEdDegreeQuestions,
        expected: 'false',
        actual: String(hasHigherEdDegreeQuestions)
      },
      {
        description: 'Professional CAP degree schemes filtered out for 10th pass student',
        passed: higherEdDegreeSchemes.length === 0,
        expected: '0 professional degree schemes',
        actual: `${higherEdDegreeSchemes.length} schemes`
      }
    ];

    results.push({
      id: 'TC-02',
      category: 'Academic',
      name: 'Secondary & Junior School Student Filtering',
      description: 'Verifies that secondary students (10th/12th) are not prompted for college professional degree rules.',
      passed: assertions.every(a => a.passed),
      assertions,
      durationMs: Math.round((performance.now() - start) * 100) / 100
    });
  }

  // ==========================================
  // TEST 3: Civil Services Aspirant Status (Age 23, Aspirant Enabled)
  // ==========================================
  {
    const start = performance.now();
    const profile = createBaseProfile({
      educationLevel: 'Undergraduate',
      age: 23,
      isAspirant: true,
      academicFocus: 'Aspirant',
      socialCategory: 'OBC'
    });

    const candidateSchemes = getCandidateSchemes(profile);
    const questions = planAdaptiveQuestions(profile, candidateSchemes);
    const stats = getQuestionRefinementStats(profile);

    const hasUpscQuestion = questions.some(q => q.field === 'isPreparingForUpscOrMpsc');
    const hasPhdQuestion = questions.some(q => q.field === 'isEnrolledInPhd');

    const assertions = [
      {
        description: 'UPSC/MPSC questions appear when Aspirant status is explicitly selected',
        passed: hasUpscQuestion,
        expected: 'true (UPSC questions active)',
        actual: String(hasUpscQuestion)
      },
      {
        description: 'Ph.D. questions remain excluded for non-postgraduate aspirant',
        passed: !hasPhdQuestion,
        expected: 'false (Ph.D. questions excluded)',
        actual: String(hasPhdQuestion)
      },
      {
        description: 'Refinement stats correctly identify Aspirant mode active',
        passed: stats.isAspirant && !stats.upscFilteredOut && stats.phdFilteredOut,
        expected: 'Aspirant: true, UPSC filtered: false, Ph.D. filtered: true',
        actual: `Aspirant: ${stats.isAspirant}, UPSC filtered: ${stats.upscFilteredOut}, Ph.D. filtered: ${stats.phdFilteredOut}`
      }
    ];

    results.push({
      id: 'TC-03',
      category: 'Academic',
      name: 'Civil Services Aspirant Activation & Isolation',
      description: 'Ensures competitive exam questions only unlock for confirmed Aspirants while keeping Ph.D. questions guarded.',
      passed: assertions.every(a => a.passed),
      assertions,
      durationMs: Math.round((performance.now() - start) * 100) / 100
    });
  }

  // ==========================================
  // TEST 4: Gender-Specific 100% Female Fee Waiver Gating
  // ==========================================
  {
    const start = performance.now();
    // Male profile
    const maleProfile = createBaseProfile({
      gender: 'Male',
      socialCategory: 'General',
      annualFamilyIncome: 400000,
      isCapAdmitted: true,
      isProfessionalCourse: true
    });

    // Female profile
    const femaleProfile = createBaseProfile({
      gender: 'Female',
      socialCategory: 'General',
      annualFamilyIncome: 400000,
      isCapAdmitted: true,
      isProfessionalCourse: true
    });

    const maleEvaluations = evaluateAllSchemes(maleProfile);
    const femaleEvaluations = evaluateAllSchemes(femaleProfile);

    // Look for Maharashtra GR TEM-2024/CR-104/TE-4 (100% Female Tuition & Exam Waiver)
    const maleGirlsScheme = maleEvaluations.find(e => e.scheme.code === 'MH-GIRLS-FREE-HE' || e.scheme.name.toLowerCase().includes('girls 100% fee waiver'));
    const femaleGirlsScheme = femaleEvaluations.find(e => e.scheme.code === 'MH-GIRLS-FREE-HE' || e.scheme.name.toLowerCase().includes('girls 100% fee waiver'));

    const assertions = [
      {
        description: 'Female 100% Fee Waiver (GR TEM-2024) is INELIGIBLE for Male applicant',
        passed: maleGirlsScheme ? maleGirlsScheme.status === 'INELIGIBLE' || maleGirlsScheme.status === 'BLOCKED_BY_EXCLUSION' : true,
        expected: 'INELIGIBLE or BLOCKED',
        actual: maleGirlsScheme ? maleGirlsScheme.status : 'Scheme not matched'
      },
      {
        description: 'Female 100% Fee Waiver (GR TEM-2024) is ELIGIBLE for Female applicant',
        passed: femaleGirlsScheme ? femaleGirlsScheme.status === 'ELIGIBLE' : false,
        expected: 'ELIGIBLE',
        actual: femaleGirlsScheme ? femaleGirlsScheme.status : 'Scheme missing'
      }
    ];

    results.push({
      id: 'TC-04',
      category: 'Gender',
      name: 'Gender-Gated Tuition Waiver Validation',
      description: 'Verifies Maharashtra Government Resolution TEM-2024/CR-104/TE-4 strictly gates 100% waivers by gender.',
      passed: assertions.every(a => a.passed),
      assertions,
      durationMs: Math.round((performance.now() - start) * 100) / 100
    });
  }

  // ==========================================
  // TEST 5: Social Category & Caste Reservation Gating
  // ==========================================
  {
    const start = performance.now();
    // General category profile
    const generalProfile = createBaseProfile({
      socialCategory: 'General',
      annualFamilyIncome: 400000
    });

    const generalEvaluations = evaluateAllSchemes(generalProfile);
    const scSchemesForGeneral = generalEvaluations.filter(e => 
      (e.scheme.rules.all ?? []).some(r => r.field === 'socialCategory' && r.op === 'in' && Array.isArray(r.value) && !r.value.includes('General'))
    );

    const allIneligible = scSchemesForGeneral.every(e => e.status === 'INELIGIBLE' || e.status === 'BLOCKED_BY_EXCLUSION');

    const assertions = [
      {
        description: 'Category-specific SC/ST schemes correctly marked INELIGIBLE for General category',
        passed: allIneligible,
        expected: 'All category-restricted schemes INELIGIBLE',
        actual: allIneligible ? 'All INELIGIBLE' : 'Leaked eligible schemes'
      }
    ];

    results.push({
      id: 'TC-05',
      category: 'Social Category',
      name: 'Social Category Affirmative Action Gating',
      description: 'Confirms that caste-restricted schemes (SC/ST/VJNT) never leak to General applicants.',
      passed: assertions.every(a => a.passed),
      assertions,
      durationMs: Math.round((performance.now() - start) * 100) / 100
    });
  }

  // ==========================================
  // TEST 6: Annual Family Income Ceiling Gating
  // ==========================================
  {
    const start = performance.now();
    // High-income profile (> ₹8,00,000 ceiling for EBC and OBC freeships)
    const wealthyProfile = createBaseProfile({
      annualFamilyIncome: 1200000,
      socialCategory: 'OBC'
    });

    const wealthyEvaluations = evaluateAllSchemes(wealthyProfile);
    const ebcScheme = wealthyEvaluations.find(e => e.scheme.code === 'MH-EBC-01' || e.scheme.name.toLowerCase().includes('rajarshi chhatrapati shahu maharaj shikshan'));

    const assertions = [
      {
        description: 'Rajarshi Shahu EBC (8 LPA cap) is marked INELIGIBLE for income ₹12,00,000',
        passed: ebcScheme ? ebcScheme.status === 'INELIGIBLE' || ebcScheme.status === 'BLOCKED_BY_EXCLUSION' : true,
        expected: 'INELIGIBLE',
        actual: ebcScheme ? ebcScheme.status : 'Scheme not found'
      }
    ];

    results.push({
      id: 'TC-06',
      category: 'Income',
      name: 'Income Ceiling Statutory Boundary Check',
      description: 'Checks that candidates with annual family income above statutory ceilings (8 LPA) are excluded from means-tested waivers.',
      passed: assertions.every(a => a.passed),
      assertions,
      durationMs: Math.round((performance.now() - start) * 100) / 100
    });
  }

  // ==========================================
  // TEST 7: Farmer & Agricultural Scheme Isolation
  // ==========================================
  {
    const start = performance.now();
    const studentProfile = createBaseProfile({
      isFarmer: false,
      employmentStatus: 'Student'
    });

    const studentEvaluations = evaluateAllSchemes(studentProfile);
    const pmKisan = studentEvaluations.find(e => e.scheme.code === 'PM-KISAN' || e.scheme.name.toLowerCase().includes('pm-kisan'));

    const assertions = [
      {
        description: 'PM-KISAN direct cash transfer marked INELIGIBLE for non-farmer student',
        passed: pmKisan ? pmKisan.status === 'INELIGIBLE' : true,
        expected: 'INELIGIBLE',
        actual: pmKisan ? pmKisan.status : 'Scheme not found'
      }
    ];

    results.push({
      id: 'TC-07',
      category: 'Livelihood',
      name: 'Agricultural Scheme Cross-Contamination Check',
      description: 'Ensures agricultural income schemes (PM-KISAN, PMFBY) never trigger or pollute student recommendation bundles.',
      passed: assertions.every(a => a.passed),
      assertions,
      durationMs: Math.round((performance.now() - start) * 100) / 100
    });
  }

  // Compute summary metrics
  const totalTests = results.length;
  const passedTests = results.filter(r => r.passed).length;
  const failedTests = totalTests - passedTests;

  let totalAssertions = 0;
  let passedAssertions = 0;
  results.forEach(r => {
    r.assertions.forEach(a => {
      totalAssertions++;
      if (a.passed) passedAssertions++;
    });
  });

  return {
    totalTests,
    passedTests,
    failedTests,
    totalAssertions,
    passedAssertions,
    failedAssertions: totalAssertions - passedAssertions,
    results,
    timestamp: new Date().toISOString()
  };
}
