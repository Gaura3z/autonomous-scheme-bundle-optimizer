import { CitizenProfile } from '../types';

export interface BackendAuditResponse {
  success: boolean;
  bundle: {
    selected_scheme_ids: string[];
    potential_selected_scheme_ids: string[];
    document_blocked_scheme_ids: string[];
  };
  audit: {
    catalog_version: string;
    catalog_size: number;
    eligible_count: number;
    excluded_count: number;
    conflict_count: number;
    declared_document_count: number;
    ready_scheme_count: number;
    document_blocked_count: number;
    solver: string;
    execution_time_ms: number;
    trace: string[];
  };
}

function toBackendProfile(profile: CitizenProfile) {
  return {
    age: profile.age,
    gender: profile.gender,
    state: profile.state,
    socialCategory: profile.socialCategory,
    annualFamilyIncome: profile.annualFamilyIncome,
    occupationCategory: profile.selfEmploymentDetails || profile.employmentRole || profile.occupation || profile.employmentStatus,
    employmentStatus: profile.employmentStatus,
    employmentRole: profile.employmentRole,
    employerName: profile.employerName,
    employmentMonthlyIncome: profile.employmentMonthlyIncome,
    selfEmploymentCategory: profile.selfEmploymentCategory,
    selfEmploymentDetails: profile.selfEmploymentDetails,
    selfEmploymentMonthlyIncome: profile.selfEmploymentMonthlyIncome,
    landHoldingAcres: (profile.landholdingHectares || 0) * 2.47105,
    isStudent: profile.isStudent,
    isDisability: profile.hasDisability,
    disabilityPercentage: profile.disabilityPercentage || 0,
    isMinority: profile.isMinority === true,
    maritalStatus: profile.maritalStatus,
    residenceType: profile.areaType,
    isBPL: profile.hasBPLCard,
    isFarmer: profile.isFarmer,
    isTaxPayer: false,
    isGovernmentEmployee: profile.employmentStatus === 'Employed' && profile.occupation.toLowerCase().includes('government'),
    hasInstitutionalLand: false
  };
}

export async function verifyWithBackend(
  profile: CitizenProfile,
  declaredDocumentIds: string[],
  signal?: AbortSignal
): Promise<BackendAuditResponse> {
  const baseUrl = (import.meta as ImportMeta & { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL || 'http://127.0.0.1:8001';
  const response = await fetch(`${baseUrl}/api/v1/optimize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile: toBackendProfile(profile), declared_document_ids: declaredDocumentIds }),
    signal
  });
  if (!response.ok) throw new Error(`Backend verification failed (${response.status})`);
  return response.json() as Promise<BackendAuditResponse>;
}
