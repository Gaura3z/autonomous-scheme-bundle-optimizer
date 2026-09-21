import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { MASTER_SCHEMES } from './src/data/schemes';
import { evaluateAllSchemes } from './src/engine/eligibility';
import { detectSchemeConflicts } from './src/engine/conflicts';
import { evaluateDocumentReadiness } from './src/engine/documents';
import { optimizeSchemeBundle } from './src/engine/optimizer';
import { CitizenProfile, Scheme } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory admin store
const ADMIN_USERNAME = process.env.PS16_ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.PS16_ADMIN_PASSWORD || 'ps16-demo-admin';
const TOKEN_SECRET = (process.env.PS16_ADMIN_TOKEN_SECRET || 'local-ps16-change-this-secret');

interface AuditEntry {
  id: number;
  action: string;
  actor: string;
  scheme_id: string;
  version: string;
  details: string;
  created_at: string;
}

let auditIdCounter = 1;
const auditLog: AuditEntry[] = [];
const adminCatalog = new Map<string, Record<string, unknown>>();

function hashValue(val: string): string {
  return crypto.createHash('sha256').update(val).digest('hex');
}

function authenticateAdmin(user: string, pass: string): string | null {
  const userMatch = user.length === ADMIN_USERNAME.length && crypto.timingSafeEqual(Buffer.from(user), Buffer.from(ADMIN_USERNAME));
  const passHash = hashValue(pass);
  const expectedHash = hashValue(ADMIN_PASSWORD);
  const passMatch = crypto.timingSafeEqual(Buffer.from(passHash), Buffer.from(expectedHash));
  if (!userMatch || !passMatch) return null;

  const timestamp = Math.floor(Date.now() / 1000);
  const raw = `${user}:${timestamp}`;
  const signature = crypto.createHmac('sha256', TOKEN_SECRET).update(raw).digest('hex');
  return `${raw}:${signature}`;
}

function verifyAdminToken(token: string | undefined): string | null {
  if (!token) return null;
  const clean = token.startsWith('Bearer ') ? token.slice(7).trim() : token.trim();
  const parts = clean.split(':');
  if (parts.length !== 3) return null;
  const [username, timestampStr, signature] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp) || Math.floor(Date.now() / 1000) - timestamp > 8 * 3600) return null;

  const raw = `${username}:${timestampStr}`;
  const expected = crypto.createHmac('sha256', TOKEN_SECRET).update(raw).digest('hex');
  if (signature.length === expected.length && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return username;
  }
  return null;
}

function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  const username = verifyAdminToken(authHeader);
  if (!username) {
    res.status(401).json({ detail: 'Valid admin session required' });
    return;
  }
  (req as unknown as { adminUser: string }).adminUser = username;
  next();
}

function normalizeCitizenProfile(input: Record<string, unknown> = {}): CitizenProfile {
  return {
    age: Number(input.age) || 22,
    gender: (input.gender as CitizenProfile['gender']) || 'Female',
    state: String(input.state || 'MH'),
    areaType: (input.residenceType || input.areaType || 'Urban') as CitizenProfile['areaType'],
    socialCategory: (input.socialCategory || 'General') as CitizenProfile['socialCategory'],
    socialCategoryDetail: input.socialCategoryDetail as CitizenProfile['socialCategoryDetail'],
    maritalStatus: (input.maritalStatus || 'Single') as CitizenProfile['maritalStatus'],
    isStudent: Boolean(input.isStudent),
    educationLevel: (input.educationLevel || 'Undergraduate') as CitizenProfile['educationLevel'],
    employmentStatus: (input.employmentStatus || 'Student') as CitizenProfile['employmentStatus'],
    occupation: String(input.occupation || input.occupationCategory || 'Student'),
    employmentRole: input.employmentRole ? String(input.employmentRole) : undefined,
    employerName: input.employerName ? String(input.employerName) : undefined,
    employmentMonthlyIncome: typeof input.employmentMonthlyIncome === 'number' ? input.employmentMonthlyIncome : undefined,
    selfEmploymentCategory: input.selfEmploymentCategory as CitizenProfile['selfEmploymentCategory'],
    selfEmploymentDetails: input.selfEmploymentDetails ? String(input.selfEmploymentDetails) : undefined,
    selfEmploymentMonthlyIncome: typeof input.selfEmploymentMonthlyIncome === 'number' ? input.selfEmploymentMonthlyIncome : undefined,
    annualFamilyIncome: Number(input.annualFamilyIncome) || 0,
    hasBPLCard: Boolean(input.isBPL ?? input.hasBPLCard),
    hasRationCard: Boolean(input.hasRationCard ?? true),
    isFarmer: Boolean(input.isFarmer),
    landholdingHectares: typeof input.landholdingHectares === 'number'
      ? input.landholdingHectares
      : (typeof input.landHoldingAcres === 'number' ? input.landHoldingAcres / 2.47105 : 0),
    isRainfedLand: Boolean(input.isRainfedLand),
    hasDisability: Boolean(input.isDisability ?? input.hasDisability),
    disabilityPercentage: typeof input.disabilityPercentage === 'number' ? input.disabilityPercentage : undefined,
    isMinority: Boolean(input.isMinority),
    isWomanEntrepreneur: Boolean(input.isWomanEntrepreneur ?? (input.gender === 'Female' && input.selfEmploymentCategory)),
    hasStreetVendingActivity: Boolean(input.hasStreetVendingActivity ?? (String(input.occupationCategory || '').toLowerCase().includes('vendor'))),
    enrolledInHigherEducation: Boolean(input.enrolledInHigherEducation ?? input.isStudent),
    pursuingApprenticeship: Boolean(input.pursuingApprenticeship),
    hasGirlChildUnder10: Boolean(input.hasGirlChildUnder10),
    isProfessionalCourse: Boolean(input.isProfessionalCourse),
    isHosteller: Boolean(input.isHosteller),
    isCapAdmitted: input.isCapAdmitted !== undefined ? Boolean(input.isCapAdmitted) : true,
    hasQualifyingExamAbove60: input.hasQualifyingExamAbove60 !== undefined ? Boolean(input.hasQualifyingExamAbove60) : true,
    hasCasteValidity: Boolean(input.hasCasteValidity),
    hasNonCreamyLayer: Boolean(input.hasNonCreamyLayer),
    isOrphanOrSingleParent: Boolean(input.isOrphanOrSingleParent),
    isItiStudent: Boolean(input.isItiStudent),
    hasClearedUpscOrMpscStage: Boolean(input.hasClearedUpscOrMpscStage),
    isFreedomFighterChild: Boolean(input.isFreedomFighterChild),
    hasTenthMarksAbove75: input.hasTenthMarksAbove75 !== undefined ? Boolean(input.hasTenthMarksAbove75) : false,
    hasTwelfthMathPhysicsAbove60: input.hasTwelfthMathPhysicsAbove60 !== undefined ? Boolean(input.hasTwelfthMathPhysicsAbove60) : false,
    isEnrolledInPhd: Boolean(input.isEnrolledInPhd),
    isEnrolledInVidyaniketan: Boolean(input.isEnrolledInVidyaniketan),
    familyBeneficiaryCountUnderTwo: input.familyBeneficiaryCountUnderTwo !== undefined ? Boolean(input.familyBeneficiaryCountUnderTwo) : true,
    attendanceAboveFiftyPercent: input.attendanceAboveFiftyPercent !== undefined ? Boolean(input.attendanceAboveFiftyPercent) : true
  };
}

// Lazy Gemini client helper
let genAiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAiClient && process.env.GEMINI_API_KEY) {
    genAiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return genAiClient;
}

// ---------------------------------------------------------------------------
// API ROUTES FIRST
// ---------------------------------------------------------------------------

app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    service: 'Autonomous Scheme-Bundle Optimizer',
    version: '2.0.0',
    decision_principle: 'Deterministic: Rules -> Eligibility -> Exclusions -> Conflicts -> PuLP Optimization'
  });
});

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Autonomous Scheme-Bundle Optimizer',
    version: '2.0.0'
  });
});

app.get('/api/v1/schemes', (_req, res) => {
  res.json(MASTER_SCHEMES);
});

app.post('/api/v1/optimize', (req, res) => {
  try {
    const startedAt = Date.now();
    const profile = normalizeCitizenProfile(req.body.profile);
    const declaredDocs: string[] = Array.isArray(req.body.declared_document_ids)
      ? req.body.declared_document_ids
      : [];

    const evaluations = evaluateAllSchemes(profile);
    const eligibleSchemes: Scheme[] = evaluations
      .filter((ev) => ev.status === 'ELIGIBLE' || ev.status === 'POSSIBLY_ELIGIBLE')
      .map((ev) => ev.scheme);

    const conflicts = detectSchemeConflicts(eligibleSchemes);
    const readiness = evaluateDocumentReadiness(eligibleSchemes, declaredDocs);
    const bundle = optimizeSchemeBundle(
      eligibleSchemes,
      declaredDocs,
      readiness.readySchemes.map((s) => s.id)
    );

    const selectedIds = bundle.selectedSchemes.map((s) => s.id);
    const potentialIds = bundle.potentialSelectedSchemes.map((s) => s.id);
    const documentBlockedIds = bundle.documentBlockedSchemes.map((d) => d.scheme.id);
    const conflictCount = conflicts.length;
    const excludedCount = evaluations.filter((ev) => ev.status === 'INELIGIBLE').length;

    res.json({
      success: true,
      bundle: {
        selected_scheme_ids: selectedIds,
        potential_selected_scheme_ids: potentialIds,
        document_blocked_scheme_ids: documentBlockedIds
      },
      audit: {
        catalog_version: 'v2026.2-PS16',
        catalog_size: MASTER_SCHEMES.length,
        eligible_count: eligibleSchemes.length,
        excluded_count: excludedCount,
        conflict_count: conflictCount,
        declared_document_count: declaredDocs.length,
        ready_scheme_count: selectedIds.length,
        document_blocked_count: documentBlockedIds.length,
        solver: `PuLP/CBC deterministic formulation (${bundle.solverStatus})`,
        execution_time_ms: Math.max(1, Date.now() - startedAt),
        trace: [
          'Validated citizen profile.',
          `Evaluated ${MASTER_SCHEMES.length} curated scheme rules.`,
          `Applied negative exclusions to ${excludedCount} schemes.`,
          `Built conflict graph with ${conflictCount} active conflict edge(s).`,
          'Evaluated document readiness across all eligible schemes before optimization.',
          'Solved potential and ready-now bundles with deterministic constraint satisfaction.',
          `Selected ${selectedIds.length} ready-now scheme(s) and ${potentialIds.length} potential scheme(s).`
        ]
      }
    });
  } catch (error) {
    res.status(500).json({ detail: error instanceof Error ? error.message : 'Optimization failed' });
  }
});

// Admin Auth & Registry Endpoints
app.post('/api/v1/admin/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    res.status(400).json({ detail: 'Username and password required' });
    return;
  }
  const token = authenticateAdmin(username, password);
  if (!token) {
    res.status(401).json({ detail: 'Invalid admin credentials' });
    return;
  }
  res.json({ token, username, expiresIn: 28800 });
});

app.get('/api/v1/admin/catalog', requireAdmin, (_req, res) => {
  const records = Array.from(adminCatalog.values());
  res.json(records);
});

app.post('/api/v1/admin/catalog', requireAdmin, (req, res) => {
  const payload = req.body?.payload;
  const actor = (req as unknown as { adminUser: string }).adminUser;
  if (!payload || !payload.id || !payload.name) {
    res.status(422).json({ detail: 'id, name, and officialSourceUrl are required' });
    return;
  }
  const now = new Date().toISOString();
  const version = payload.kbVersion || 'registry-2026.1';
  const record = {
    ...payload,
    status: 'REVIEW_REQUIRED',
    version,
    updatedAt: now
  };
  adminCatalog.set(payload.id, record);

  auditLog.unshift({
    id: auditIdCounter++,
    action: 'SAVE_DRAFT',
    actor,
    scheme_id: payload.id,
    version,
    details: 'Scheme saved for review',
    created_at: now
  });

  res.json(record);
});

app.post('/api/v1/admin/catalog/:schemeId/publish', requireAdmin, (req, res) => {
  const { schemeId } = req.params;
  const actor = (req as unknown as { adminUser: string }).adminUser;
  const record = adminCatalog.get(schemeId);
  if (!record) {
    res.status(404).json({ detail: 'Scheme not found' });
    return;
  }
  const now = new Date().toISOString();
  record.status = 'PUBLISHED';
  record.updatedAt = now;
  adminCatalog.set(schemeId, record);

  auditLog.unshift({
    id: auditIdCounter++,
    action: 'PUBLISH',
    actor,
    scheme_id: schemeId,
    version: String(record.version || 'registry-2026.1'),
    details: 'Scheme published after review',
    created_at: now
  });

  res.json(record);
});

app.get('/api/v1/admin/audit', requireAdmin, (_req, res) => {
  res.json(auditLog.slice(0, 100));
});

// Optional AI Explanation endpoint
app.post('/api/v1/explain', async (req, res) => {
  try {
    const ai = getGenAI();
    if (!ai) {
      res.json({
        available: false,
        explanation: 'Gemini API key is not configured; deterministic explanations remain active.'
      });
      return;
    }
    const { prompt } = req.body || {};
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt || 'Explain citizen welfare scheme eligibility criteria clearly.'
    });
    res.json({
      available: true,
      explanation: response.text
    });
  } catch (error) {
    res.status(500).json({ detail: error instanceof Error ? error.message : 'AI explanation failed' });
  }
});

// ---------------------------------------------------------------------------
// VITE MIDDLEWARE SETUP
// ---------------------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Autonomous Scheme-Bundle Optimizer running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
