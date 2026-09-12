import { Scheme } from '../types';

export interface BundleValidity {
  validUntil: string | null;
  displayDate: string | null;
  label: string;
  note: string;
  isDemoPlanningWindow: boolean;
}

/**
 * A bundle is only as actionable as its earliest scheme deadline. Missing
 * dates are not invented: the citizen is told to verify the official portal.
 */
export function getBundleValidity(schemes: Scheme[]): BundleValidity {
  const deadlines = schemes
    .map((scheme) => scheme.applicationDeadline)
    .filter((date): date is string => Boolean(date))
    .sort();

  if (deadlines.length === 0) {
    return {
      validUntil: null,
      displayDate: null,
      label: 'No fixed deadline recorded',
      note: 'Check each official scheme portal before filing. A rolling scheme may remain open, but this report does not assume that.',
      isDemoPlanningWindow: false
    };
  }

  const validUntil = deadlines[0];
  const demo = schemes.some((scheme) => scheme.validityNote?.toLowerCase().includes('demo'));
  const displayDate = new Date(`${validUntil}T00:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  return {
    validUntil,
    displayDate,
    label: demo ? 'Demo planning window ends' : 'Earliest recorded application deadline',
    note: demo
      ? 'Demo date only — replace it with the official deadline in the admin portal after verification.'
      : 'If any selected scheme has a separate state or phase deadline, confirm it on the official source.',
    isDemoPlanningWindow: demo
  };
}
