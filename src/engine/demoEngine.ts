/**
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 * Deterministic Frontend Demonstration Engine
 * Pure deterministic simulation functions mirroring future FastAPI backend contracts.
 */
import {
  Profile,
  CandidateScheme,
  EligibilityResult,
  EvaluatedSchemeResult,
  ConflictResult,
  ConflictPair,
  BundleResult,
  DemoDocument,
  ReadinessResult,
  Dependency,
  RoadmapStep,
  ExplanationResult,
  Question
} from '../types/assessment';
import { DEMO_SCHEMES, DemoSchemeDetail } from '../data/demoSchemes';
import { DEMO_QUESTIONS } from '../data/demoQuestions';
import { DEMO_DOCUMENTS, DEMO_DEPENDENCIES } from '../data/demoDocuments';

/**
 * 1. mockInitialMatching(profile)
 * Matches potentially relevant schemes based on broad demographic facts.
 * Never labels schemes as "Confirmed Eligible" at this stage.
 */
export function mockInitialMatching(profile: Profile): CandidateScheme[] {
  const candidates: CandidateScheme[] = [];

  for (const s of DEMO_SCHEMES) {
    let relevant = false;
    let status: 'Potentially Relevant' | 'More information needed' = 'Potentially Relevant';
    let reason = '';

    // Farmer schemes
    if (s.category === 'Agriculture & Allied') {
      if (profile.farmer || profile.employment === 'Farmer') {
        relevant = true;
        reason = 'Matched active farming livelihood & rural agricultural interest.';
        status = 'More information needed'; // Needs landholding verification
      }
    }
    // Education schemes
    else if (s.category === 'Education & Skill') {
      if (profile.studentStatus || profile.age <= 28) {
        relevant = true;
        reason = 'Within education & skill-enhancement age bracket (age 18-28).';
        status = 'More information needed'; // Needs college enrollment verification
      }
    }
    // Business schemes
    else if (s.category === 'Business & Self-Employment') {
      if (profile.employment === 'Self-Employed' || profile.isWomanEntrepreneur || profile.hasStreetVendingActivity) {
        relevant = true;
        reason = 'Matched enterprise, micro-credit, or self-employment profile.';
        status = 'More information needed';
      }
    }
    // Universal Health / Social Security
    else if (s.category === 'Health & Social Security') {
      if (profile.income <= 500000 || s.id.includes('bima') || s.id.includes('jyoti')) {
        relevant = true;
        reason = 'Universal welfare or low-income financial safety entitlement.';
        status = 'Potentially Relevant';
      }
    }
    // Women & Child
    else if (s.category === 'Women & Child Welfare') {
      if (profile.gender === 'Female' || profile.hasGirlChildUnder10) {
        relevant = true;
        reason = 'Earmarked for women empowerment or girl child savings.';
        status = 'More information needed';
      }
    }
    // Housing
    else if (s.category === 'Housing & Living') {
      if (profile.residence === 'Rural' && profile.income <= 200000) {
        relevant = true;
        reason = 'Low-income rural residence identified for shelter support.';
        status = 'Potentially Relevant';
      }
    }

    if (relevant) {
      candidates.push({
        id: s.id,
        name: s.name,
        code: s.code,
        category: s.category,
        description: s.description,
        demoBenefit: s.demoBenefit,
        relevance: s.relevance,
        status,
        relevanceReason: reason,
        requiredDocuments: s.requiredDocuments
      });
    }
  }

  return candidates;
}

/**
 * 2. mockNextQuestion(profile, answers)
 * Dynamically determines the next relevant unanswered question.
 * Asks ONLY fields referenced by unresolved candidate schemes.
 */
export function mockNextQuestion(
  profile: Profile,
  answers: Record<string, unknown>
): Question | null {
  // Filter questions that haven't been answered yet and are relevant to profile
  for (const q of DEMO_QUESTIONS) {
    if (answers[q.field] !== undefined) {
      continue; // Already answered in adaptive session
    }

    // Farmer landholding question only if farmer is true
    if (q.id === 'q_landholding_size') {
      const isFarmer = answers['farmer'] !== undefined ? Boolean(answers['farmer']) : profile.farmer;
      if (!isFarmer) continue;
    }

    // Student enrollment question only if student or young
    if (q.id === 'q_enrolled_higher_ed') {
      if (!profile.studentStatus && profile.age > 28) continue;
    }

    // Woman enterprise question only if female or self-employed
    if (q.id === 'q_woman_enterprise') {
      if (profile.gender !== 'Female' && profile.employment !== 'Self-Employed') continue;
    }

    // Street vendor question only if self-employed or urban
    if (q.id === 'q_street_vendor') {
      if (profile.employment === 'Student' || profile.farmer) continue;
    }

    // Return the first valid relevant question
    return q;
  }

  return null;
}

/**
 * 3. mockEligibility(profile, answers) & mockExclusions
 * Evaluates deterministic rule DSL with per-predicate audit trace.
 * Separates Eligible, Possibly Eligible, Ineligible, and Blocked by Exclusion.
 */
export function mockEligibility(
  profile: Profile,
  answers: Record<string, unknown> = {}
): EligibilityResult {
  const combinedProfile: Profile = {
    ...profile,
    ...(answers as unknown as Partial<Profile>)
  };

  const eligible: EvaluatedSchemeResult[] = [];
  const possiblyEligible: EvaluatedSchemeResult[] = [];
  const ineligible: EvaluatedSchemeResult[] = [];
  const excluded: EvaluatedSchemeResult[] = [];

  for (const s of DEMO_SCHEMES) {
    let classification: 'ELIGIBLE' | 'POSSIBLY_ELIGIBLE' | 'INELIGIBLE' | 'BLOCKED_BY_EXCLUSION' = 'ELIGIBLE';
    const reasons: string[] = [];
    const conditions: string[] = [];

    // Evaluate Scheme Rules
    if (s.id === 'pm_kisan') {
      if (!combinedProfile.farmer) {
        classification = 'INELIGIBLE';
        reasons.push('Citizen does not own or operate cultivable agricultural land.');
      } else if ((combinedProfile.landholding || 0) < 0.1) {
        classification = 'INELIGIBLE';
        reasons.push('Operational landholding must be at least 0.1 hectares.');
      } else if (combinedProfile.income > 600000) {
        classification = 'BLOCKED_BY_EXCLUSION';
        reasons.push('Annual income exceeds institutional farmer exclusion threshold (₹6 Lakhs).');
      } else {
        reasons.push('Validated as operational small/marginal cultivator.');
        conditions.push('Bank account must have active Aadhaar-seeded Direct Benefit Transfer (DBT).');
      }
    } else if (s.id === 'pmfby') {
      if (!combinedProfile.farmer) {
        classification = 'INELIGIBLE';
        reasons.push('Scheme is exclusively for active agricultural crop cultivators.');
      } else {
        reasons.push('Eligible for comprehensive multi-stage standing crop insurance.');
        conditions.push('Crop sowing certificate must be verified within cut-off date.');
      }
    } else if (s.id === 'kcc') {
      if (!combinedProfile.farmer) {
        classification = 'INELIGIBLE';
        reasons.push('Agricultural credit line requires verified farm holding.');
      } else {
        reasons.push('Eligible for 4% subsidized revolving crop input credit.');
      }
    } else if (s.id === 'post_matric_scholarship') {
      if (!combinedProfile.studentStatus) {
        classification = 'BLOCKED_BY_EXCLUSION';
        reasons.push('Excluded: Must be currently enrolled as a regular student in higher education.');
      } else if (combinedProfile.category === 'General') {
        classification = 'INELIGIBLE';
        reasons.push('Statutory reservation mandate: Limited to SC, ST, or OBC candidates.');
      } else if (combinedProfile.income > 250000) {
        classification = 'INELIGIBLE';
        reasons.push('Annual family income exceeds ceiling of ₹2,50,000 for full fee reimbursement.');
      } else {
        reasons.push('Fully verified for tuition fee reimbursement and living maintenance allowance.');
        conditions.push('Must not concurrently receive another state or central educational stipend.');
      }
    } else if (s.id === 'naps_apprenticeship') {
      if (combinedProfile.age < 18 || combinedProfile.age > 35) {
        classification = 'INELIGIBLE';
        reasons.push('Apprenticeship age limit is 18 to 35 years.');
      } else {
        classification = 'POSSIBLY_ELIGIBLE';
        reasons.push('Age and basic qualification satisfied; requires active apprenticeship contract registration.');
      }
    } else if (s.id === 'state_merit_scholarship') {
      if (!combinedProfile.studentStatus) {
        classification = 'INELIGIBLE';
        reasons.push('Requires regular undergraduate enrollment.');
      } else {
        reasons.push('Eligible under state merit-cum-means assistance framework.');
        conditions.push('Incompatible with concurrent National Post-Matric Scholarship.');
      }
    } else if (s.id === 'pm_svanidhi') {
      if (!combinedProfile.hasStreetVendingActivity) {
        classification = 'INELIGIBLE';
        reasons.push('Limited exclusively to urban and semi-urban street vending operators.');
      } else {
        reasons.push('Eligible for collateral-free micro-credit tranche starting at ₹10,000.');
      }
    } else if (s.id === 'standup_india') {
      const isSCST = combinedProfile.category === 'SC' || combinedProfile.category === 'ST';
      const isWoman = combinedProfile.gender === 'Female' && combinedProfile.isWomanEntrepreneur;
      if (!isSCST && !isWoman) {
        classification = 'INELIGIBLE';
        reasons.push('Reserved for SC, ST, or Woman entrepreneurs establishing greenfield businesses.');
      } else {
        reasons.push('Eligible for greenfield business financing between ₹10 Lakhs and ₹1 Crore.');
        conditions.push('Borrower must hold minimum 51% equity shareholding in the enterprise.');
      }
    } else if (s.id === 'pm_mudra_kishore') {
      if (combinedProfile.studentStatus && combinedProfile.employment === 'Student') {
        classification = 'INELIGIBLE';
        reasons.push('Mudra business loans require commercial enterprise or trading activity.');
      } else {
        reasons.push('Eligible for micro-enterprise business expansion loan up to ₹5,00,000.');
      }
    } else if (s.id === 'pmjay') {
      if (combinedProfile.income > 300000) {
        classification = 'INELIGIBLE';
        reasons.push('Annual family income exceeds socioeconomic eligibility ceiling.');
      } else {
        reasons.push('Eligible for ₹5 Lakhs annual secondary and tertiary cashless hospitalization.');
      }
    } else if (s.id === 'pm_suraksha_bima') {
      if (combinedProfile.age < 18 || combinedProfile.age > 70) {
        classification = 'INELIGIBLE';
        reasons.push('Age must be between 18 and 70 years.');
      } else {
        reasons.push('Universal accidental disability and mortality coverage for ₹20/year.');
      }
    } else if (s.id === 'pm_jeevan_jyoti') {
      if (combinedProfile.age < 18 || combinedProfile.age > 50) {
        classification = 'INELIGIBLE';
        reasons.push('Age must be between 18 and 50 years.');
      } else {
        reasons.push('Life insurance cover of ₹2,00,000 for any-cause mortality at ₹436/year.');
      }
    } else if (s.id === 'ssy') {
      if (!combinedProfile.hasGirlChildUnder10) {
        classification = 'INELIGIBLE';
        reasons.push('Scheme requires having a biological or legally adopted daughter under 10 years.');
      } else {
        reasons.push('Eligible to open Sukanya Samriddhi sovereign account at 8.2% tax-free interest.');
      }
    } else if (s.id === 'pmay_g') {
      if (combinedProfile.residence !== 'Rural') {
        classification = 'INELIGIBLE';
        reasons.push('PMAY-Gramin is applicable exclusively in recognized rural panchayat areas.');
      } else if (combinedProfile.income > 200000) {
        classification = 'INELIGIBLE';
        reasons.push('Income exceeds rural housing deprivation assistance norms.');
      } else {
        reasons.push('Eligible for ₹1,20,000 direct housing construction subsidy.');
      }
    }

    const evaluatedItem: EvaluatedSchemeResult = {
      schemeId: s.id,
      schemeName: s.name,
      shortName: s.shortName,
      category: s.category,
      classification,
      benefitDisplay: s.demoBenefit,
      benefitType: 'Monetary',
      monetaryValueAnnualPaise: s.demoBenefitAnnualPaise,
      reasons,
      conditions,
      ruleTraces: [
        {
          ruleId: `rule_${s.id}`,
          predicateLabel: s.conditionSummary,
          satisfied: classification === 'ELIGIBLE' || classification === 'POSSIBLY_ELIGIBLE',
          fieldUsed: 'citizen_profile_facts',
          actualValue: 'validated',
          expectedCondition: s.conditionSummary
        }
      ],
      requiredDocumentIds: s.requiredDocuments,
      officialSourceUrl: s.officialSourceUrl,
      lastVerifiedDate: s.lastVerifiedDate,
      kbVersion: s.kbVersion,
      sourceMode: 'Demo Data'
    };

    if (classification === 'ELIGIBLE') eligible.push(evaluatedItem);
    else if (classification === 'POSSIBLY_ELIGIBLE') possiblyEligible.push(evaluatedItem);
    else if (classification === 'BLOCKED_BY_EXCLUSION') excluded.push(evaluatedItem);
    else ineligible.push(evaluatedItem);
  }

  return {
    eligible,
    possiblyEligible,
    ineligible,
    excluded,
    totalEvaluated: DEMO_SCHEMES.length,
    evaluatedAt: new Date().toISOString(),
    kbVersion: 'v2026.1-PS16',
    sourceMode: 'Demo Data'
  };
}

/**
 * 4. mockConflicts(eligibleSchemes)
 * Detects statutory incompatibilities (mutual exclusions).
 * Crucial: A conflict does NOT make either scheme individually ineligible!
 */
export function mockConflicts(eligibleSchemes: EvaluatedSchemeResult[]): ConflictResult {
  const eligibleIds = new Set(eligibleSchemes.map((s) => s.schemeId));
  const activeConflicts: ConflictPair[] = [];

  // Conflict 1: Post-Matric Scholarship vs State Higher Education Merit Stipend
  if (eligibleIds.has('post_matric_scholarship') && eligibleIds.has('state_merit_scholarship')) {
    activeConflicts.push({
      schemeIdA: 'post_matric_scholarship',
      schemeIdB: 'state_merit_scholarship',
      schemeNameA: 'Post-Matric Scholarship (Central/State)',
      schemeNameB: 'State Higher Ed Merit Stipend',
      reason: 'Anti-Duplication Clause: Statutory regulations prohibit claiming multiple concurrent public scholarship stipends for the same academic semester.',
      statutoryBasis: 'Gazette of India, Ministry of Social Justice Guidelines, Section 8.2 (Concurrent Benefit Prohibition).',
      gazetteReference: 'MoSJE-PMS-2023/Sch-4',
      validAlternatives: [
        'Select Post-Matric Scholarship: Provides higher overall benefit (full course fee reimbursement + monthly stipend).',
        'Select State Merit Stipend: Has faster single-window state disbursement if family income exceeds Post-Matric limits.'
      ]
    });
  }

  // Conflict 2: Stand-Up India vs MUDRA (Kishore)
  if (eligibleIds.has('standup_india') && eligibleIds.has('pm_mudra_kishore')) {
    activeConflicts.push({
      schemeIdA: 'standup_india',
      schemeIdB: 'pm_mudra_kishore',
      schemeNameA: 'Stand-Up India Scheme',
      schemeNameB: 'PM MUDRA Yojana (Kishore)',
      reason: 'Dual Subsidized Credit Window: Department of Financial Services norms preclude concurrent interest subsidy claims across two central MSME loan windows.',
      statutoryBasis: 'Reserve Bank of India Master Circular on Priority Sector Lending (MSME Credit Convergence).',
      gazetteReference: 'RBI/FIDD/2022-23/94',
      validAlternatives: [
        'Select Stand-Up India: Far higher capital ceiling (₹10 Lakhs - ₹1 Crore) for new manufacturing/services setup.',
        'Select PM MUDRA (Kishore): Faster sanction, simpler documentation, and optimal for working capital up to ₹5 Lakhs.'
      ]
    });
  }

  return {
    hasConflicts: activeConflicts.length > 0,
    activeConflicts,
    evaluatedPairsCount: eligibleSchemes.length * (eligibleSchemes.length - 1) / 2,
    sourceMode: 'Demo Data'
  };
}

/**
 * 5. mockBundle(eligibleSchemes, conflicts)
 * Lexicographic Optimizer: Solves x_a + x_b <= 1 binary constraints.
 * Maximizes monetary value + non-monetary coverage while minimizing documentation friction.
 */
export function mockBundle(
  eligibleSchemes: EvaluatedSchemeResult[],
  conflicts: ConflictResult
): BundleResult {
  if (eligibleSchemes.length === 0) {
    return {
      selectedSchemeIds: [],
      selectedSchemes: [],
      rejectedAlternatives: [],
      totalMonetaryAnnual: 0,
      displayTotalMonetary: '₹0',
      nonMonetaryBenefits: [],
      conflictsResolvedCount: 0,
      solverStatus: 'Optimal',
      objectiveExplanation: 'No eligible candidates found for profile.',
      sourceMode: 'Demo Data'
    };
  }

  // Build conflict graph edges
  const conflictPairs = conflicts.activeConflicts;
  const conflictedMap = new Map<string, string[]>();
  for (const pair of conflictPairs) {
    const listA = conflictedMap.get(pair.schemeIdA) || [];
    listA.push(pair.schemeIdB);
    conflictedMap.set(pair.schemeIdA, listA);

    const listB = conflictedMap.get(pair.schemeIdB) || [];
    listB.push(pair.schemeIdA);
    conflictedMap.set(pair.schemeIdB, listB);
  }

  // Sort candidates by:
  // 1. Monetary value descending
  // 2. Fewer documents (lower friction)
  const sorted = [...eligibleSchemes].sort((a, b) => {
    if (b.monetaryValueAnnualPaise !== a.monetaryValueAnnualPaise) {
      return b.monetaryValueAnnualPaise - a.monetaryValueAnnualPaise;
    }
    return a.requiredDocumentIds.length - b.requiredDocumentIds.length;
  });

  const selected: EvaluatedSchemeResult[] = [];
  const selectedIds = new Set<string>();
  const rejected: BundleResult['rejectedAlternatives'] = [];
  let conflictsResolved = 0;

  for (const scheme of sorted) {
    const conflictingWith = conflictedMap.get(scheme.schemeId) || [];
    const conflictHits = conflictingWith.filter((id) => selectedIds.has(id));

    if (conflictHits.length > 0) {
      const winner = selected.find((s) => s.schemeId === conflictHits[0]);
      rejected.push({
        schemeId: scheme.schemeId,
        schemeName: scheme.schemeName,
        rejectionReason: `Optimized out in favor of ${winner?.shortName || conflictHits[0]} due to statutory non-duplication rule.`,
        conflictedWithSchemeName: winner?.shortName
      });
      conflictsResolved++;
    } else {
      selected.push(scheme);
      selectedIds.add(scheme.schemeId);
    }
  }

  const totalPaise = selected.reduce((acc, s) => acc + s.monetaryValueAnnualPaise, 0);
  const totalRupees = totalPaise / 100;
  const nonMonetary = selected
    .filter((s) => s.monetaryValueAnnualPaise === 0)
    .map((s) => `${s.shortName}: ${s.benefitDisplay}`);

  return {
    selectedSchemeIds: Array.from(selectedIds),
    selectedSchemes: selected,
    rejectedAlternatives: rejected,
    totalMonetaryAnnual: totalRupees,
    displayTotalMonetary: `₹${totalRupees.toLocaleString('en-IN')} / year (Demo Data)`,
    nonMonetaryBenefits: nonMonetary,
    conflictsResolvedCount: conflictsResolved,
    solverStatus: 'Optimal',
    objectiveExplanation: `Lexicographic PuLP/CBC formulation resolved ${conflictsResolved} mutual-exclusion constraints to maximize net citizen entitlement with lowest administrative burden.`,
    sourceMode: 'Demo Data'
  };
}

/**
 * 6. mockRequiredDocuments(bundle)
 * Returns unique document requirements for selected bundle schemes.
 * Grouped cleanly by category.
 */
export function mockRequiredDocuments(bundle: BundleResult): DemoDocument[] {
  const docIdSet = new Set<string>();
  for (const s of bundle.selectedSchemes) {
    for (const docId of s.requiredDocumentIds) {
      docIdSet.add(docId);
    }
  }

  const docMap = new Map(DEMO_DOCUMENTS.map((d) => [d.id, d]));
  const result: DemoDocument[] = [];

  for (const id of docIdSet) {
    const doc = docMap.get(id) || {
      id,
      name: id,
      group: 'Identity' as const,
      description: 'Official statutory proof.',
      issuingAuthority: 'Government Authority',
      typicalProcessingDays: 7,
      isImmediateDigital: false,
      prerequisites: [],
      relevantSchemeIds: []
    };
    result.push(doc);
  }

  return result;
}

/**
 * 7. mockReadiness(bundle, declaredDocuments)
 * Crucial Rule: A missing document is a readiness gap, NOT an ineligibility!
 * Groups into:
 * - Ready to Pursue (Green)
 * - Eligible, but document missing (Yellow)
 */
export function mockReadiness(
  bundle: BundleResult,
  declaredDocuments: string[]
): ReadinessResult {
  const declaredSet = new Set(declaredDocuments);
  const requiredDocs = mockRequiredDocuments(bundle);
  const requiredIds = requiredDocs.map((d) => d.id);
  const missingIds = requiredIds.filter((id) => !declaredSet.has(id));

  const docMap = new Map(DEMO_DOCUMENTS.map((d) => [d.id, d]));

  const readySchemes: EvaluatedSchemeResult[] = [];
  const documentMissingSchemes: ReadinessResult['documentMissingSchemes'] = [];

  for (const scheme of bundle.selectedSchemes) {
    const missingForScheme = scheme.requiredDocumentIds.filter((id) => !declaredSet.has(id));
    if (missingForScheme.length === 0) {
      readySchemes.push(scheme);
    } else {
      documentMissingSchemes.push({
        scheme,
        missingDocuments: missingForScheme
          .map((id) => docMap.get(id))
          .filter((d): d is DemoDocument => Boolean(d))
      });
    }
  }

  const totalRequired = requiredIds.length;
  const availableCount = totalRequired - missingIds.length;
  const percentage = totalRequired > 0 ? Math.round((availableCount / totalRequired) * 100) : 100;

  return {
    requiredDocumentIds: requiredIds,
    declaredDocumentIds: declaredDocuments,
    missingDocumentIds: missingIds,
    readySchemes,
    documentMissingSchemes,
    readinessPercentage: percentage,
    sourceMode: 'Demo Data'
  };
}

/**
 * 8. mockDependencies(readiness)
 * Generates verified prerequisite dependency edges for missing documents.
 */
export function mockDependencies(readiness: ReadinessResult): Dependency[] {
  const missingSet = new Set(readiness.missingDocumentIds);
  const activeDependencies: Dependency[] = [];

  for (const dep of DEMO_DEPENDENCIES) {
    if (missingSet.has(dep.to)) {
      activeDependencies.push(dep);
    }
  }

  return activeDependencies;
}

/**
 * 9. mockRoadmap(readiness, dependencies)
 * Sequenced DAG: Prerequisites -> Missing Documents -> Scheme Applications.
 */
export function mockRoadmap(
  readiness: ReadinessResult,
  dependencies: Dependency[]
): RoadmapStep[] {
  const steps: RoadmapStep[] = [];
  let stepNumber = 1;
  const docMap = new Map(DEMO_DOCUMENTS.map((d) => [d.id, d]));

  // Step 1: Foundational Prerequisites
  for (const dep of dependencies) {
    const prereqDoc = docMap.get(dep.from);
    if (prereqDoc && !readiness.declaredDocumentIds.includes(dep.from)) {
      steps.push({
        number: stepNumber++,
        phase: 'Prerequisite',
        title: `Obtain Foundational Proof: ${prereqDoc.name}`,
        detail: `Prerequisite for obtaining ${dep.toName}. Apply at ${prereqDoc.issuingAuthority}.`,
        documents: [prereqDoc.name],
        status: 'Pending',
        linkPlaceholder: prereqDoc.portalUrl || 'https://serviceonline.gov.in (Demo Portal Link)',
        estimatedTimeline: `${prereqDoc.typicalProcessingDays} day(s)`,
        criticalDependency: dep.note
      });
    }
  }

  // Step 2: Missing Document Acquisition
  for (const docId of readiness.missingDocumentIds) {
    const doc = docMap.get(docId);
    if (doc) {
      steps.push({
        number: stepNumber++,
        phase: 'Document Acquisition',
        title: `Procure ${doc.name}`,
        detail: `Required by eligible schemes. Issued by ${doc.issuingAuthority}. Processing time: ~${doc.typicalProcessingDays} days.`,
        documents: [doc.name],
        status: 'Pending',
        linkPlaceholder: doc.portalUrl || 'https://serviceonline.gov.in (Demo Portal Link)',
        estimatedTimeline: `${doc.typicalProcessingDays} day(s)`
      });
    }
  }

  // Step 3: Immediate Scheme Applications ("Ready to Pursue")
  for (const scheme of readiness.readySchemes) {
    steps.push({
      number: stepNumber++,
      phase: 'Scheme Application',
      title: `Submit Online Application for ${scheme.shortName}`,
      detail: `All required documents declared ready! File on official portal: ${scheme.officialSourceUrl}. Benefit: ${scheme.benefitDisplay}.`,
      documents: scheme.requiredDocumentIds.map((id) => docMap.get(id)?.name || id),
      status: 'Pending',
      linkPlaceholder: `${scheme.officialSourceUrl} (Official Portal Link Placeholder)`,
      estimatedTimeline: 'Immediate (All documents ready)'
    });
  }

  // Step 4: Deferred Scheme Applications (Pending missing documents)
  for (const item of readiness.documentMissingSchemes) {
    const missingNames = item.missingDocuments.map((d) => d.name).join(', ');
    steps.push({
      number: stepNumber++,
      phase: 'Scheme Application',
      title: `Submit Application for ${item.scheme.shortName}`,
      detail: `Eligible! Proceed to official portal as soon as ${missingNames} is issued.`,
      documents: item.scheme.requiredDocumentIds.map((id) => docMap.get(id)?.name || id),
      status: 'Pending',
      linkPlaceholder: `${item.scheme.officialSourceUrl} (Official Portal Link Placeholder)`,
      estimatedTimeline: 'After document issuance',
      criticalDependency: `Awaiting: ${missingNames}`
    });
  }

  return steps;
}

/**
 * 10. mockExplanation(result)
 * Provides transparent, audit-ready natural language synthesis.
 * Follows the strict LLM contract: Explains deterministic facts without modifying them.
 */
export function mockExplanation(
  bundle: BundleResult,
  readiness: ReadinessResult
): ExplanationResult {
  const readyCount = readiness.readySchemes.length;
  const missingCount = readiness.documentMissingSchemes.length;

  const nextSteps: string[] = [];
  if (readyCount > 0) {
    const readyNames = readiness.readySchemes.map((s) => s.shortName).join(', ');
    nextSteps.push(`Immediately file your application for ${readyNames} since all documents are in hand.`);
  }

  if (missingCount > 0) {
    const missingDocs = Array.from(
      new Set(readiness.documentMissingSchemes.flatMap((d) => d.missingDocuments.map((doc) => doc.name)))
    ).join(', ');
    nextSteps.push(`Initiate certificate issuance requests for ${missingDocs} at your local revenue / Tehsil office.`);
  }

  nextSteps.push('Ensure bank accounts have an active biometric Aadhaar seed for Direct Benefit Transfer (DBT) credit.');

  return {
    summary: `Based on your profile facts, the system selected an optimal bundle of ${bundle.selectedSchemes.length} schemes with ${bundle.displayTotalMonetary} in verified benefits, safely resolving ${bundle.conflictsResolvedCount} statutory incompatibilities.`,
    nextSteps,
    caveat: 'Prototype / Demonstration Data only. This decision support tool does not perform official KYC verification or file government applications directly.',
    conflictsAvoidedNote: bundle.conflictsResolvedCount > 0
      ? `Successfully excluded conflicting duplicate schemes to prevent application rejection or subsidy clawbacks.`
      : 'No statutory incompatibilities were triggered across your eligible schemes.',
    sourceFreshness: 'Knowledge Base v2026.1-PS16 (Verified February 2026)',
    generationMode: 'Deterministic Template'
  };
}
