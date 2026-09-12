import React, { useMemo, useState } from 'react';
import { ArrowLeft, Download, Plus, ShieldCheck, Trash2 } from 'lucide-react';
import { MASTER_DOCUMENTS } from '../../data/documents';
import { SchemeWizard } from './SchemeWizard';

type RegistryStatus = 'REVIEW_REQUIRED' | 'PUBLISHED';
export type EligibilityField = 'age' | 'gender' | 'state' | 'socialCategory' | 'annualFamilyIncome' | 'areaType' | 'maritalStatus' | 'isStudent' | 'isFarmer' | 'hasDisability' | 'isMinority' | 'isWomanEntrepreneur' | 'hasStreetVendingActivity' | 'pursuingApprenticeship';
type EligibilityOperator = 'equals' | 'not_equals' | 'less_than_or_equal' | 'greater_than_or_equal';

export interface EligibilityRule {
  field: EligibilityField;
  operator: EligibilityOperator;
  value: string;
}

export interface RegistryRecord {
  id: string;
  name: string;
  ministry: string;
  category: string;
  officialSourceUrl: string;
  lastVerifiedDate: string;
  kbVersion: string;
  validityStartDate?: string;
  applicationDeadline?: string;
  validityNote?: string;
  requiredDocumentIds: string[];
  eligibilityRules: EligibilityRule[];
  exclusionRules: EligibilityRule[];
  questions: { id: string; field: EligibilityField; title: string; explanation: string; type: 'boolean' | 'number' | 'text' }[];
  applicationSteps: { title: string; instructions: string; portalUrl: string; issuingAuthority: string; estimatedDays: number }[];
  conflictRules: { schemeId: string; reason: string; source: string }[];
  generatedTests: { name: string; expected: string; status: 'PENDING' | 'PASSED' | 'FAILED' }[];
  status: RegistryStatus;
}

const STORAGE_KEY = 'ps16-scheme-registry-v1';
const INITIAL_REGISTRY: RegistryRecord[] = [
  ['pm-kisan', 'PM-KISAN', 'Agriculture & Farmers Welfare', 'Agriculture', 'https://pmkisan.gov.in'],
  ['pmfby', 'Pradhan Mantri Fasal Bima Yojana', 'Agriculture & Farmers Welfare', 'Agriculture', 'https://pmfby.gov.in'],
  ['pmay-g', 'PMAY-Gramin', 'Rural Development', 'Housing', 'https://pmayg.nic.in'],
  ['pmay-u', 'PMAY-Urban', 'Housing & Urban Affairs', 'Housing', 'https://pmay-urban.gov.in'],
  ['pmjay', 'Ayushman Bharat PM-JAY', 'Health & Family Welfare', 'Health', 'https://pmjay.gov.in'],
  ['pm-svanidhi', 'PM SVANidhi', 'Housing & Urban Affairs', 'Livelihood', 'https://pmsvanidhi.mohua.gov.in'],
  ['stand-up-india', 'Stand-Up India', 'Finance', 'Business', 'https://www.standupmitra.in'],
  ['mudra', 'Pradhan Mantri MUDRA Yojana', 'Finance', 'Business', 'https://www.mudra.org.in'],
  ['pmegp', 'Prime Minister Employment Generation Programme', 'MSME', 'Business', 'https://www.kviconline.gov.in/pmegpeportal'],
  ['pm-vishwakarma', 'PM Vishwakarma', 'MSME', 'Skills', 'https://pmvishwakarma.gov.in'],
  ['national-scholarship', 'National Scholarship Portal', 'Education', 'Education', 'https://scholarships.gov.in'],
  ['nsp-pm-yasasvi', 'PM YASASVI', 'Social Justice & Empowerment', 'Education', 'https://scholarships.gov.in'],
  ['apprenticeship', 'National Apprenticeship Promotion Scheme', 'Skill Development', 'Skills', 'https://www.apprenticeshipindia.gov.in'],
  ['ddu-gky', 'Deen Dayal Upadhyaya Grameen Kaushalya Yojana', 'Rural Development', 'Skills', 'https://ddugky.info'],
  ['atal-pension', 'Atal Pension Yojana', 'Finance', 'Social Security', 'https://www.pfrda.org.in'],
  ['pm-jeevan-jyoti', 'PM Jeevan Jyoti Bima Yojana', 'Finance', 'Insurance', 'https://jansuraksha.gov.in'],
  ['pm-suraksha-bima', 'PM Suraksha Bima Yojana', 'Finance', 'Insurance', 'https://jansuraksha.gov.in'],
  ['pm-kusum', 'PM-KUSUM', 'New & Renewable Energy', 'Energy', 'https://pmkusum.mnre.gov.in'],
  ['pm-surya-ghar', 'PM Surya Ghar: Muft Bijli Yojana', 'New & Renewable Energy', 'Energy', 'https://www.pmsuryaghar.gov.in'],
  ['nsap', 'National Social Assistance Programme', 'Rural Development', 'Social Security', 'https://nsap.nic.in'],
].map(([id, name, ministry, category, officialSourceUrl]) => ({
  id, name, ministry, category, officialSourceUrl,
  lastVerifiedDate: '2026-09-12', kbVersion: 'registry-2026.1',
  applicationDeadline: '', validityStartDate: '', validityNote: '',
  requiredDocumentIds: ['aadhaar'], eligibilityRules: [], exclusionRules: [], questions: [], applicationSteps: [], conflictRules: [], generatedTests: [], status: 'REVIEW_REQUIRED'
}));

const readRegistry = (): RegistryRecord[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : INITIAL_REGISTRY;
    return parsed.map((record: Partial<RegistryRecord>) => ({
      ...record,
      requiredDocumentIds: record.requiredDocumentIds?.length ? record.requiredDocumentIds : ['aadhaar'],
      applicationDeadline: record.applicationDeadline || '',
      validityStartDate: record.validityStartDate || '',
      validityNote: record.validityNote || '',
      eligibilityRules: record.eligibilityRules || [],
      exclusionRules: record.exclusionRules || [], questions: record.questions || [], applicationSteps: record.applicationSteps || [], conflictRules: record.conflictRules || [], generatedTests: record.generatedTests || [],
      status: record.status || 'REVIEW_REQUIRED'
    })) as RegistryRecord[];
  } catch { return INITIAL_REGISTRY; }
};

export function AdminPortal({ onExit }: { onExit: () => void }) {
  const [records, setRecords] = useState<RegistryRecord[]>(readRegistry);
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('ps16-admin-token') || '');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [form, setForm] = useState<RegistryRecord>({
    id: '', name: '', ministry: '', category: 'Other', officialSourceUrl: '',
    lastVerifiedDate: '2026-09-12', kbVersion: 'registry-2026.1',
    applicationDeadline: '', validityStartDate: '', validityNote: '',
    requiredDocumentIds: ['aadhaar'], eligibilityRules: [], exclusionRules: [], questions: [], applicationSteps: [], conflictRules: [], generatedTests: [], status: 'REVIEW_REQUIRED'
  });
  const [selectedDocumentId, setSelectedDocumentId] = useState('');
  const [ruleDraft, setRuleDraft] = useState<EligibilityRule>({ field: 'age', operator: 'greater_than_or_equal', value: '' });
  const [message, setMessage] = useState('');
  const reviewCount = useMemo(() => records.filter((record) => record.status === 'REVIEW_REQUIRED').length, [records]);

  const save = (next: RegistryRecord[]) => { setRecords(next); localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); };
  const update = (key: keyof RegistryRecord, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const addDocument = () => {
    if (selectedDocumentId && !form.requiredDocumentIds.includes(selectedDocumentId)) setForm((current) => ({ ...current, requiredDocumentIds: [...current.requiredDocumentIds, selectedDocumentId] }));
    setSelectedDocumentId('');
  };
  const addRule = () => {
    if (ruleDraft.value.trim()) setForm((current) => ({ ...current, eligibilityRules: [...current.eligibilityRules, { ...ruleDraft, value: ruleDraft.value.trim() }] }));
    setRuleDraft((current) => ({ ...current, value: '' }));
  };
  const addRecord = (event: React.FormEvent) => {
    event.preventDefault();
    if (!/^[a-z0-9-]+$/.test(form.id) || !form.name || !form.ministry || !/^https:\/\//.test(form.officialSourceUrl) || form.requiredDocumentIds.length === 0 || form.eligibilityRules.length === 0) {
      setMessage('Complete the required fields, add at least one required document and one eligibility rule, and provide an HTTPS official source URL.'); return;
    }
    if (records.some((record) => record.id === form.id)) { setMessage('That scheme ID already exists.'); return; }
    save([form, ...records]); setMessage('Added to the review queue. It is not active in recommendations yet.');
    setForm({ ...form, id: '', name: '', ministry: '', officialSourceUrl: '', requiredDocumentIds: ['aadhaar'], eligibilityRules: [] });
  };
  const exportRegistry = () => {
    const blob = new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const anchor = document.createElement('a');
    anchor.href = url; anchor.download = 'ps16-scheme-registry.json'; anchor.click(); URL.revokeObjectURL(url);
  };
  const apiBase = (import.meta as ImportMeta & { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL || 'http://127.0.0.1:8001';
  const signIn = async (event: React.FormEvent) => {
    event.preventDefault(); setLoginError('');
    try {
      const response = await fetch(`${apiBase}/api/v1/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: loginUsername, password: loginPassword }) });
      if (!response.ok) throw new Error('Invalid credentials');
      const result = await response.json() as { token: string };
      localStorage.setItem('ps16-admin-token', result.token); setAdminToken(result.token);
    } catch { setLoginError('Unable to sign in. Check the admin credentials and backend status.'); }
  };
  const saveToBackend = async (record: RegistryRecord) => {
    const response = await fetch(`${apiBase}/api/v1/admin/catalog`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` }, body: JSON.stringify({ payload: record }) });
    if (response.status === 401) { localStorage.removeItem('ps16-admin-token'); setAdminToken(''); throw new Error('Admin session expired'); }
    if (!response.ok) throw new Error('Backend catalog save failed');
  };
  const handleWizardSave = async (record: RegistryRecord) => {
    try { await saveToBackend(record); save([record, ...records]); setMessage('Scheme saved to the backend review catalog and local copy.'); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Backend save failed.'); }
  };
  const publish = async (record: RegistryRecord) => {
    try {
      const response = await fetch(`${apiBase}/api/v1/admin/catalog/${record.id}/publish`, { method: 'POST', headers: { Authorization: `Bearer ${adminToken}` } });
      if (!response.ok) throw new Error('Publish failed');
      save(records.map((item) => item.id === record.id ? { ...item, status: 'PUBLISHED' } : item)); setMessage(`${record.name} published in the backend catalog.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Publish failed.'); }
  };

  if (!adminToken) return <div className="flex min-h-screen items-center justify-center bg-slate-950 px-5"><form onSubmit={signIn} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"><p className="text-xs font-bold uppercase tracking-wider text-blue-700">PS16 administration</p><h1 className="mt-2 text-2xl font-extrabold">Admin sign in</h1><p className="mt-2 text-sm text-slate-600">Server-side session required for catalog changes.</p><div className="mt-6 space-y-3"><input autoComplete="username" className="w-full rounded-xl border p-3 text-sm" placeholder="Username" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} /><input autoComplete="current-password" type="password" className="w-full rounded-xl border p-3 text-sm" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} /></div>{loginError && <p role="alert" className="mt-3 text-sm font-semibold text-rose-700">{loginError}</p>}<button className="mt-5 w-full rounded-xl bg-blue-900 px-4 py-3 text-sm font-bold text-white">Sign in</button><p className="mt-4 rounded-xl bg-amber-50 p-3 text-[11px] text-amber-950"><strong>Local demo:</strong> admin / ps16-demo-admin. Set PS16_ADMIN_USERNAME, PS16_ADMIN_PASSWORD, and PS16_ADMIN_TOKEN_SECRET before deployment.</p><button type="button" onClick={onExit} className="mt-4 w-full rounded-xl border px-4 py-3 text-sm font-bold">Back to citizen view</button></form></div>;

  return <div className="min-h-screen bg-slate-50 text-slate-900">
    <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
      <div><p className="text-xs font-bold uppercase tracking-wider text-blue-700">PS16 administration</p><h1 className="text-xl font-extrabold">Scheme registry</h1></div>
      <div className="flex gap-2"><button onClick={() => { localStorage.removeItem('ps16-admin-token'); setAdminToken(''); }} className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold">Sign out</button><button onClick={onExit} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold"><ArrowLeft className="h-4 w-4" /> Citizen view</button></div>
    </div></header>
    <main className="mx-auto max-w-6xl space-y-6 px-5 py-8">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"><strong>Catalog safety boundary:</strong> drafts are stored in the backend review catalog. They are not used by citizen recommendations until explicitly published after source and test review.</div>
      <section className="rounded-2xl border border-blue-200 bg-blue-50 p-6"><h2 className="font-bold text-blue-950">Admin capabilities</h2><div className="mt-3 grid gap-3 text-sm text-blue-950 sm:grid-cols-2"><div>✓ Add schemes with official source and metadata</div><div>✓ Track verification date and knowledge-base version</div><div>✓ Review records before publication</div><div>✓ Export the registry for audit or backend import</div><div>✓ Remove incorrect review-queue records</div><div>✓ Prepare future rule, document, and conflict workflows</div></div><p className="mt-4 text-xs text-blue-800">The current portal does not directly publish eligibility rules or alter live recommendations. That release gate should remain deliberate until each rule has automated tests.</p></section>
      <div className="grid gap-4 sm:grid-cols-3"><div className="rounded-2xl bg-white p-5 shadow-xs"><div className="text-xs text-slate-500">Registry records</div><div className="text-2xl font-black">{records.length}</div></div><div className="rounded-2xl bg-white p-5 shadow-xs"><div className="text-xs text-slate-500">Awaiting review</div><div className="text-2xl font-black text-amber-700">{reviewCount}</div></div><div className="rounded-2xl bg-white p-5 shadow-xs"><div className="text-xs text-slate-500">Catalog release</div><div className="text-sm font-bold text-emerald-700">Manual approval required</div></div></div>
      <SchemeWizard existingRecords={records} onSave={handleWizardSave} />
      {false && <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs"><div className="mb-4 flex items-center gap-2"><Plus className="h-5 w-5 text-blue-700" /><h2 className="font-bold">Add scheme to review queue</h2></div>
        <form onSubmit={addRecord} className="grid gap-3 sm:grid-cols-2">
          <input className="rounded-xl border p-3 text-sm" placeholder="ID e.g. pm-kisan" value={form.id} onChange={(e) => update('id', e.target.value)} />
          <input className="rounded-xl border p-3 text-sm" placeholder="Scheme name" value={form.name} onChange={(e) => update('name', e.target.value)} />
          <input className="rounded-xl border p-3 text-sm" placeholder="Ministry" value={form.ministry} onChange={(e) => update('ministry', e.target.value)} />
          <input className="rounded-xl border p-3 text-sm" placeholder="Category" value={form.category} onChange={(e) => update('category', e.target.value)} />
          <input className="rounded-xl border p-3 text-sm sm:col-span-2" placeholder="Official HTTPS source URL" value={form.officialSourceUrl} onChange={(e) => update('officialSourceUrl', e.target.value)} />

          <fieldset className="rounded-xl border border-slate-200 p-4 sm:col-span-2"><legend className="px-1 text-sm font-bold">Required documents</legend><div className="flex flex-col gap-2 sm:flex-row"><select className="flex-1 rounded-xl border p-3 text-sm" value={selectedDocumentId} onChange={(e) => setSelectedDocumentId(e.target.value)}><option value="">Select a document name</option>{Object.values(MASTER_DOCUMENTS).map((document) => <option key={document.id} value={document.id}>{document.name}</option>)}</select><button type="button" onClick={addDocument} className="rounded-xl border border-blue-200 px-4 py-3 text-sm font-bold text-blue-800">Add document</button></div><div className="mt-3 flex flex-wrap gap-2">{form.requiredDocumentIds.map((documentId) => <span key={documentId} className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900">{MASTER_DOCUMENTS[documentId]?.name || documentId}<button type="button" onClick={() => setForm((current) => ({ ...current, requiredDocumentIds: current.requiredDocumentIds.filter((id) => id !== documentId) }))} className="ml-2 font-black text-emerald-700" aria-label={`Remove ${documentId}`}>×</button></span>)}</div></fieldset>

          <fieldset className="rounded-xl border border-slate-200 p-4 sm:col-span-2"><legend className="px-1 text-sm font-bold">Eligibility rules</legend><p className="mb-3 text-xs text-slate-500">Add deterministic conditions. Values are stored for review and test generation; they do not become live until approved.</p><div className="grid gap-2 sm:grid-cols-4"><select className="rounded-xl border p-3 text-sm" value={ruleDraft.field} onChange={(e) => setRuleDraft((current) => ({ ...current, field: e.target.value as EligibilityField }))}><option value="age">Age</option><option value="gender">Gender</option><option value="state">State</option><option value="socialCategory">Social category</option><option value="annualFamilyIncome">Annual family income</option><option value="areaType">Area type</option><option value="maritalStatus">Marital status</option><option value="isStudent">Is student</option><option value="isFarmer">Is farmer</option><option value="hasDisability">Has disability</option><option value="isWomanEntrepreneur">Woman entrepreneur</option><option value="hasStreetVendingActivity">Street vending activity</option><option value="pursuingApprenticeship">Pursuing apprenticeship</option></select><select className="rounded-xl border p-3 text-sm" value={ruleDraft.operator} onChange={(e) => setRuleDraft((current) => ({ ...current, operator: e.target.value as EligibilityOperator }))}><option value="equals">Equals</option><option value="not_equals">Does not equal</option><option value="less_than_or_equal">Less than or equal to</option><option value="greater_than_or_equal">Greater than or equal to</option></select><input className="rounded-xl border p-3 text-sm" placeholder="Value e.g. 180000, Female, true" value={ruleDraft.value} onChange={(e) => setRuleDraft((current) => ({ ...current, value: e.target.value }))} /><button type="button" onClick={addRule} className="rounded-xl border border-blue-200 px-4 py-3 text-sm font-bold text-blue-800">Add rule</button></div><div className="mt-3 space-y-2">{form.eligibilityRules.map((rule, index) => <div key={`${rule.field}-${index}`} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs"><span><strong>{rule.field}</strong> {rule.operator.replaceAll('_', ' ')} <strong>{rule.value}</strong></span><button type="button" onClick={() => setForm((current) => ({ ...current, eligibilityRules: current.eligibilityRules.filter((_, ruleIndex) => ruleIndex !== index) }))} className="font-bold text-rose-700">Remove</button></div>)}</div></fieldset>

          <div className="flex flex-wrap gap-2 sm:col-span-2"><button className="inline-flex items-center gap-2 rounded-xl bg-blue-900 px-4 py-3 text-sm font-bold text-white"><Plus className="h-4 w-4" /> Add for review</button><button type="button" onClick={exportRegistry} className="inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold"><Download className="h-4 w-4" /> Export registry</button></div>
        </form>
        {message && <p className="mt-3 text-sm font-semibold text-slate-700">{message}</p>}
      </section>}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs"><div className="mb-4 flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-emerald-700" /><h2 className="font-bold">Records and verification status</h2></div><div className="space-y-2">{records.map((record) => <div key={record.id} className="flex flex-col gap-2 rounded-xl border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between"><div><div className="font-bold">{record.name} <span className="ml-2 rounded-full bg-amber-100 px-2 py-1 text-[10px] text-amber-800">{record.status}</span></div><div className="text-xs text-slate-500">{record.ministry} · Last verified {record.lastVerifiedDate} · {record.kbVersion} · {record.requiredDocumentIds.length} document(s) · {record.eligibilityRules.length} rule(s) · <a className="text-blue-700 underline" href={record.officialSourceUrl} target="_blank" rel="noreferrer">Official source</a></div></div><div className="flex gap-1">{record.status !== 'PUBLISHED' && <button onClick={() => publish(record)} className="rounded-lg border border-emerald-200 px-2 py-1 text-[11px] font-bold text-emerald-800">Publish</button>}{record.id !== 'pm-kisan' && <button onClick={() => save(records.filter((item) => item.id !== record.id))} className="self-start rounded-lg p-2 text-rose-700 hover:bg-rose-50" aria-label={`Delete ${record.name}`}><Trash2 className="h-4 w-4" /></button>}</div></div>)}</div></section>
    </main>
  </div>;
}
