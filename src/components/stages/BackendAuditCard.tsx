import React, { useEffect, useState } from 'react';
import { CheckCircle2, Cloud, Loader2, ShieldAlert } from 'lucide-react';
import { CitizenProfile } from '../../types';
import { BackendAuditResponse, verifyWithBackend } from '../../services/backendApi';

interface BackendAuditCardProps {
  profile: CitizenProfile;
  declaredDocumentIds: string[];
  frontendSelectedSchemeIds: string[];
  frontendPotentialSchemeIds: string[];
}

export const BackendAuditCard: React.FC<BackendAuditCardProps> = ({ profile, declaredDocumentIds, frontendSelectedSchemeIds, frontendPotentialSchemeIds }) => {
  const [result, setResult] = useState<BackendAuditResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setResult(null);
    setError(null);
    verifyWithBackend(profile, declaredDocumentIds, controller.signal)
      .then(setResult)
      .catch((reason: unknown) => {
        if ((reason as Error)?.name !== 'AbortError') setError('Backend verification is unavailable; the local deterministic result remains active.');
      });
    return () => controller.abort();
  }, [profile, declaredDocumentIds]);

  return (
    <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs print:hidden">
      <div className="flex items-start gap-3">
        {result ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : error ? <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" /> : <Loader2 className="w-5 h-5 text-blue-600 animate-spin shrink-0" />}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">FastAPI decision verification</h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600"><Cloud className="w-3 h-3" /> Backend audit</span>
          </div>
          {result && <>
            <p className="mt-1 text-xs text-emerald-800">Backend verification completed using catalog {result.audit.catalog_version} in {result.audit.execution_time_ms} ms.</p>
            <p className="mt-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-[11px] text-blue-950">
              Frontend/backend comparison: {sameIds(frontendSelectedSchemeIds, result.bundle.selected_scheme_ids) ? 'ready-now selections match.' : 'selection differences detected; review the catalog/rule version before release.'}
              {' '}{sameIds(frontendPotentialSchemeIds, result.bundle.potential_selected_scheme_ids) ? 'Potential selections match.' : 'Potential selections differ because the catalogs are not yet fully unified.'}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5 text-[11px]">
              <Metric label="Catalog" value={result.audit.catalog_size} />
              <Metric label="Eligible" value={result.audit.eligible_count} />
              <Metric label="Conflicts" value={result.audit.conflict_count} />
              <Metric label="Ready now" value={result.audit.ready_scheme_count} />
              <Metric label="Doc gated" value={result.audit.document_blocked_count} />
            </div>
            <details className="mt-3 text-[11px] text-slate-600">
              <summary className="cursor-pointer font-semibold text-blue-800">Show backend decision trace</summary>
              <ol className="mt-2 space-y-1 list-decimal list-inside">
                {result.audit.trace.map((item) => <li key={item}>{item}</li>)}
              </ol>
            </details>
          </>}
          {!result && !error && <p className="mt-1 text-xs text-slate-500">Checking the same profile and declared documents through the Python orchestration API…</p>}
          {error && <p className="mt-1 text-xs text-amber-800">{error}</p>}
        </div>
      </div>
    </section>
  );
};

const sameIds = (left: string[], right: string[]) => [...left].sort().join('|') === [...right].sort().join('|');

const Metric: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2">
    <span className="block text-slate-500">{label}</span>
    <strong className="block text-sm text-slate-900">{value}</strong>
  </div>
);
