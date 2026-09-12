import React from 'react';
import governmentOfIndiaMark from '../../assets/government-of-india.png';

interface SchemeJurisdictionBadgeProps {
  jurisdiction: 'Central' | 'State-Specific';
  showStateText?: boolean;
}

export const SchemeJurisdictionBadge: React.FC<SchemeJurisdictionBadgeProps> = ({
  jurisdiction,
  showStateText = true
}) => {
  if (jurisdiction === 'Central') {
    return (
      <span className="inline-flex h-8 items-center rounded-md border border-slate-200 bg-white px-1.5 shadow-xs" title="Government of India scheme" aria-label="Government of India scheme">
        <img src={governmentOfIndiaMark} alt="Government of India" className="h-6 w-[76px] object-contain" />
      </span>
    );
  }

  return showStateText ? (
    <span className="inline-flex items-center rounded bg-purple-50 px-2 py-1 text-[11px] font-medium text-purple-800 border border-purple-200">
      State / UT Scheme
    </span>
  ) : null;
};
