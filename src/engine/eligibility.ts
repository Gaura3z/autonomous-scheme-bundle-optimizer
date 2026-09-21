/**
 * Deterministic Eligibility & Exclusion Evaluation Engine
 * Pure TypeScript rule evaluator matching the PS16 Technical Blueprint DSL.
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 */
import { CitizenProfile, Scheme, SchemeEvaluation, RulePredicate } from '../types';
import { MASTER_SCHEMES } from '../data/schemes';

export function evaluatePredicate(predicate: RulePredicate, profile: CitizenProfile): { met: boolean; reason: string } {
  const { field, op, value, min, max, label } = predicate;
  const profileVal = profile[field];

  if (profileVal === undefined || profileVal === null) {
    return { met: false, reason: `Missing information for: ${label}` };
  }

  switch (op) {
    case 'eq':
      return {
        met: profileVal === value,
        reason: profileVal === value ? `Condition satisfied: ${label}` : `Unmet: ${label} (Your profile: ${String(profileVal)})`
      };

    case 'in':
      if (Array.isArray(value)) {
        const matches = value.includes(profileVal);
        return {
          met: matches,
          reason: matches ? `Condition satisfied: ${label}` : `Unmet: ${label} (Requires one of: ${value.join(', ')})`
        };
      }
      return { met: false, reason: `Rule configuration error for ${label}` };

    case 'lte':
      if (typeof profileVal === 'number' && typeof max === 'number') {
        const matches = profileVal <= max;
        return {
          met: matches,
          reason: matches ? `Income within limit: ${label}` : `Exceeds threshold: ${label} (Your profile: ₹${profileVal.toLocaleString('en-IN')})`
        };
      }
      return { met: false, reason: `Numeric check failed for ${label}` };

    case 'gte':
      if (typeof profileVal === 'number' && typeof min === 'number') {
        const matches = profileVal >= min;
        return {
          met: matches,
          reason: matches ? `Condition satisfied: ${label}` : `Unmet minimum threshold: ${label}`
        };
      }
      return { met: false, reason: `Numeric check failed for ${label}` };

    case 'between':
      if (typeof profileVal === 'number' && typeof min === 'number' && typeof max === 'number') {
        const matches = profileVal >= min && profileVal <= max;
        return {
          met: matches,
          reason: matches ? `Condition satisfied: ${label}` : `Out of range: ${label} (Allowed: ${min}-${max})`
        };
      }
      return { met: false, reason: `Range check failed for ${label}` };

    case 'exists':
      return {
        met: profileVal !== undefined && profileVal !== false && profileVal !== '',
        reason: `Condition: ${label}`
      };

    default:
      return { met: false, reason: `Unsupported rule operator in: ${label}` };
  }
}

export function evaluateScheme(scheme: Scheme, profile: CitizenProfile): SchemeEvaluation {
  const matchedPositiveReasons: string[] = [];
  const unmetReasons: string[] = [];
  const exclusionReasons: string[] = [];
  const unknownPredicates: string[] = [];

  // Check Jurisdiction first
  if (scheme.jurisdiction === 'State-Specific' && scheme.targetStates && scheme.targetStates.length > 0) {
    if (!scheme.targetStates.includes(profile.state)) {
      unmetReasons.push(`Scheme is notified specifically for residents of ${scheme.targetStates.join(', ')} (Your state: ${profile.state})`);
    } else {
      matchedPositiveReasons.push(`State domicile criteria met for ${profile.state}`);
    }
  }

  // Academic and Demographic coherence guardrails
  const isHighSchoolOrDiploma = ['Below 10th', '10th Pass', '12th Pass', 'Diploma'].includes(profile.educationLevel) || profile.age < 20;
  const requiresPhd = (scheme.rules.all ?? []).some(r => r.field === 'isEnrolledInPhd') ||
                      (scheme.rules.any ?? []).some(r => r.field === 'isEnrolledInPhd');
  if (requiresPhd && (isHighSchoolOrDiploma || profile.isEnrolledInPhd === false)) {
    unmetReasons.push(`Requires active Ph.D./doctoral research registration (Not applicable for ${profile.educationLevel})`);
  }

  const requiresCivilServices = (scheme.rules.all ?? []).some(r => r.field === 'isPreparingForUpscOrMpsc' || r.field === 'hasClearedUpscOrMpscStage');
  if (requiresCivilServices && (isHighSchoolOrDiploma || profile.isPreparingForUpscOrMpsc === false || profile.hasClearedUpscOrMpscStage === false)) {
    unmetReasons.push('Requires graduate-level UPSC/MPSC competitive civil services examination pathway');
  }

  if (scheme.rules.all?.some(r => r.field === 'isFarmer') && !profile.isFarmer) {
    unmetReasons.push('Applicant profile does not indicate an agricultural farmer occupation');
  }

  // Check exclusion rules first (Hard Negative Rules)
  if (scheme.rules.exclusionRules) {
    for (const rule of scheme.rules.exclusionRules) {
      const res = evaluatePredicate(rule, profile);
      if (res.met) {
        exclusionReasons.push(rule.label);
      }
    }
  }

  if (exclusionReasons.length > 0) {
    return {
      scheme,
      status: 'BLOCKED_BY_EXCLUSION',
      matchedPositiveReasons,
      unmetReasons,
      exclusionReasons,
      unknownPredicates,
      confidence: 'Blocked'
    };
  }

  // Evaluate "all" required positive predicates
  if (scheme.rules.all) {
    for (const rule of scheme.rules.all) {
      const res = evaluatePredicate(rule, profile);
      if (res.met) {
        matchedPositiveReasons.push(res.reason);
      } else {
        unmetReasons.push(res.reason);
      }
    }
  }

  // Evaluate "any" positive predicates
  if (scheme.rules.any && scheme.rules.any.length > 0) {
    let anyMet = false;
    const anyReasons: string[] = [];
    for (const rule of scheme.rules.any) {
      const res = evaluatePredicate(rule, profile);
      if (res.met) {
        anyMet = true;
        anyReasons.push(res.reason);
      }
    }
    if (anyMet) {
      matchedPositiveReasons.push(`Alternative criteria met: ${anyReasons[0]}`);
    } else {
      unmetReasons.push(`Must meet at least one category criteria: ${scheme.rules.any.map(r => r.label).join(' OR ')}`);
    }
  }

  // Determine classification
  if (unmetReasons.length === 0) {
    return {
      scheme,
      status: 'ELIGIBLE',
      matchedPositiveReasons,
      unmetReasons: [],
      exclusionReasons: [],
      unknownPredicates: [],
      confidence: 'High'
    };
  } else {
    // If it's just due to conditional fields not yet answered
    const onlyNeedsConditional = unmetReasons.every(r => r.includes('Missing information'));
    return {
      scheme,
      status: onlyNeedsConditional ? 'POSSIBLY_ELIGIBLE' : 'INELIGIBLE',
      matchedPositiveReasons,
      unmetReasons,
      exclusionReasons: [],
      unknownPredicates,
      confidence: onlyNeedsConditional ? 'Partial' : 'High'
    };
  }
}

export function evaluateAllSchemes(profile: CitizenProfile): SchemeEvaluation[] {
  return MASTER_SCHEMES.map(scheme => evaluateScheme(scheme, profile));
}

export function getCandidateSchemes(profile: CitizenProfile): Scheme[] {
  const evaluations = evaluateAllSchemes(profile);
  // Candidate schemes are either fully ELIGIBLE or POSSIBLY_ELIGIBLE, excluding hard ineligibles
  return evaluations
    .filter(ev => ev.status === 'ELIGIBLE' || ev.status === 'POSSIBLY_ELIGIBLE')
    .map(ev => ev.scheme);
}
