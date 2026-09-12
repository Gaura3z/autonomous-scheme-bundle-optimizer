"""
Kurukshetra 2.0 HACKFEST 2026 PS16
Autonomous Scheme-Bundle Optimizer - FastAPI REST API
"""
from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Any
from pydantic import BaseModel
from .admin_store import authenticate, verify_token, list_schemes, save_scheme, publish_scheme, audit_log
from .models import (
    CitizenProfile,
    Scheme,
    OptimizationRequest,
    OptimizationResponse
)
from .orchestrator import BenefitStrategistOrchestrator
from .expanded_catalog import build_additional_catalog

app = FastAPI(
    title="Autonomous Scheme-Bundle Optimizer (PS16)",
    description="Deterministic multi-scheme optimization API using PuLP/CBC and rule engines.",
    version="2.0.0"
)

# Enable CORS for React Vite Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Curated Scheme Catalog for Indian Citizens
DEFAULT_CATALOG: List[Scheme] = [
    Scheme(
        id="pm_kisan",
        name="PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
        shortName="PM-KISAN",
        ministry="Ministry of Agriculture & Farmers Welfare",
        level="Central",
        category="Agriculture",
        tagline="INR 6,000/yr direct income support in 3 equal installments",
        description="Provides assured direct financial assistance to cultivable landholding farmer families.",
        benefit={"type": "Direct Benefit Transfer", "amount": 6000.0, "frequency": "Annual", "displayAmount": "INR 6,000/yr"},
        applicableStates=["All States"],
        requiredDocuments=["aadhaar", "land_712", "bank_passbook"],
        officialSourceUrl="https://pmkisan.gov.in",
        conflictingSchemeIds=["institutional_land"]
    ),
    Scheme(
        id="ayushman_bharat",
        name="Ayushman Bharat PM-JAY",
        shortName="PM-JAY",
        ministry="National Health Authority",
        level="Central",
        category="Healthcare",
        tagline="Cashless health cover up to INR 5,00,000 per family per year",
        description="Covers secondary and tertiary hospitalisation for bottom 40% vulnerable citizen families.",
        benefit={"type": "Cashless Health Insurance", "amount": 500000.0, "frequency": "Annual Floater", "displayAmount": "INR 5,00,000 Cover"},
        applicableStates=["All States"],
        requiredDocuments=["aadhaar", "ration_card"],
        officialSourceUrl="https://pmjay.gov.in"
    ),
    Scheme(
        id="pmmy_shishu",
        name="Pradhan Mantri MUDRA Yojana (Shishu)",
        shortName="PMMY Shishu",
        ministry="Ministry of Finance",
        level="Central",
        category="Business & Enterprise",
        tagline="Collateral-free micro-credit up to INR 50,000 for micro-enterprises",
        description="Refinances micro-business loans with zero physical collateral for artisans and small businesses.",
        benefit={"type": "Subsidized Credit", "amount": 50000.0, "frequency": "One-Time Credit", "displayAmount": "INR 50,000 Loan"},
        applicableStates=["All States"],
        requiredDocuments=["aadhaar", "pan_card", "bank_passbook"],
        officialSourceUrl="https://mudra.org.in"
    ),
    Scheme(
        id="pm_awas_gramin",
        name="Pradhan Mantri Awaas Yojana - Gramin",
        shortName="PMAY-G",
        ministry="Ministry of Rural Development",
        level="Central",
        category="Housing",
        tagline="INR 1,20,000 financial grant for pucca house construction",
        description="Provides direct capital subsidy to houseless families and those living in kutcha houses.",
        benefit={"type": "Direct Capital Subsidy", "amount": 120000.0, "frequency": "Milestone-Linked", "displayAmount": "INR 1,20,000 Grant"},
        applicableStates=["All States"],
        requiredDocuments=["aadhaar", "income_cert", "bank_passbook", "ration_card"],
        officialSourceUrl="https://pmayg.nic.in"
    ),
    Scheme(
        id="post_matric_scholarship",
        name="Post-Matric Scholarship for SC Students",
        shortName="SC Scholarship",
        ministry="Ministry of Social Justice & Empowerment",
        level="Central",
        category="Education",
        tagline="Full tuition fee reimbursement and monthly maintenance allowance",
        description="Financial assistance to Scheduled Caste students studying at post-matriculation stage.",
        benefit={"type": "Direct DBT Scholarship", "amount": 48000.0, "frequency": "Annual", "displayAmount": "INR 48,000/yr"},
        applicableStates=["All States"],
        requiredDocuments=["aadhaar", "caste_cert", "income_cert", "marksheet"],
        officialSourceUrl="https://scholarships.gov.in",
        conflictingSchemeIds=["state_higher_ed_stipend"]
    ),
    Scheme(
        id="state_higher_ed_stipend",
        name="National Merit-cum-Means Scholarship",
        shortName="NMMSS",
        ministry="Ministry of Education",
        level="State",
        category="Education",
        tagline="Annual scholarship support for eligible school students",
        description="A curated demonstration record for merit-cum-means scholarship evaluation.",
        benefit={"type": "Scholarship", "amount": 12000.0, "frequency": "Annual", "displayAmount": "INR 12,000/yr"},
        applicableStates=["Maharashtra"],
        requiredDocuments=["aadhaar", "income_cert", "marksheet"],
        officialSourceUrl="https://scholarships.gov.in",
        conflictingSchemeIds=["post_matric_scholarship"]
    ),
    Scheme(
        id="pension_apy",
        name="Atal Pension Yojana",
        shortName="APY",
        ministry="Ministry of Finance",
        level="Central",
        category="Social Security",
        tagline="Pension-linked social security for eligible workers",
        description="A curated demonstration record for age and livelihood-based pension planning.",
        benefit={"type": "Social Security", "amount": 60000.0, "frequency": "Annual Equivalent", "displayAmount": "Pension planning support"},
        applicableStates=["All States"],
        requiredDocuments=["aadhaar", "bank_passbook"],
        officialSourceUrl="https://www.npscra.nsdl.co.in/scheme-details.php"
    ),
    Scheme(
        id="standup_india",
        name="Stand-Up India Scheme",
        shortName="Stand-Up India",
        ministry="Department of Financial Services",
        level="Central",
        category="Business & Enterprise",
        tagline="Greenfield enterprise credit for women and SC/ST entrepreneurs",
        description="A curated demonstration record for enterprise-finance eligibility and document planning.",
        benefit={"type": "Enterprise Credit", "amount": 1000000.0, "frequency": "Credit Ceiling", "displayAmount": "INR 10 Lakh+ credit access"},
        applicableStates=["All States"],
        requiredDocuments=["aadhaar", "pan_card", "bank_passbook"],
        officialSourceUrl="https://www.standupmitra.in"
    ),
    Scheme(
        id="pm_svanidhi",
        name="PM SVANidhi",
        shortName="PM SVANidhi",
        ministry="Ministry of Housing and Urban Affairs",
        level="Central",
        category="Livelihood",
        tagline="Collateral-free working capital for street vendors",
        description="A curated demonstration record for informal livelihood and vendor-credit planning.",
        benefit={"type": "Working Capital", "amount": 50000.0, "frequency": "Credit Ceiling", "displayAmount": "Up to INR 50,000 credit"},
        applicableStates=["All States"],
        requiredDocuments=["aadhaar", "bank_passbook"],
        officialSourceUrl="https://pmsvanidhi.mohua.gov.in"
    )
]

# Dates in the seeded catalog are explicitly demo planning dates. They are
# useful for the prototype roadmap, but are never presented as official legal
# deadlines until an admin verifies and replaces them in the catalog.
DEFAULT_CATALOG = [
    scheme.model_copy(update={
        "applicationDeadline": scheme.applicationDeadline or "2026-12-31",
        "validityNote": scheme.validityNote or "Demo planning window - verify the official portal before filing."
    })
    for scheme in DEFAULT_CATALOG
]

# Keep the API catalog aligned with the frontend prototype catalog expansion.
# The additional records are intentionally marked as curated demo records and
# still require official-portal verification before production use.
DEFAULT_CATALOG.extend(build_additional_catalog())
DEFAULT_CATALOG = [
    scheme.model_copy(update={"kbVersion": "v2026.2-PS16"})
    for scheme in DEFAULT_CATALOG
]

orchestrator = BenefitStrategistOrchestrator(DEFAULT_CATALOG)

class AdminLoginRequest(BaseModel):
    username: str
    password: str

class AdminSchemeRequest(BaseModel):
    payload: dict[str, Any]

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Autonomous Scheme-Bundle Optimizer",
        "version": "2.0.0",
        "decision_principle": "Deterministic: Rules -> Eligibility -> Exclusions -> Conflicts -> PuLP Optimization"
    }

@app.get("/api/v1/schemes", response_model=List[Scheme])
def get_schemes():
    return DEFAULT_CATALOG

@app.post("/api/v1/optimize", response_model=OptimizationResponse)
def optimize_citizen_bundle(request: OptimizationRequest):
    try:
        response = orchestrator.process(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def require_admin(authorization: str | None) -> str:
    username = verify_token(authorization.removeprefix("Bearer ").strip() if authorization else None)
    if not username: raise HTTPException(status_code=401, detail="Valid admin session required")
    return username

@app.post("/api/v1/admin/login")
def admin_login(request: AdminLoginRequest):
    token = authenticate(request.username, request.password)
    if not token: raise HTTPException(status_code=401, detail="Invalid admin credentials")
    return {"token": token, "username": request.username, "expiresIn": 28800}

@app.get("/api/v1/admin/catalog")
def admin_catalog(authorization: str | None = Header(default=None)):
    require_admin(authorization)
    return list_schemes()

@app.post("/api/v1/admin/catalog")
def admin_save_scheme(request: AdminSchemeRequest, authorization: str | None = Header(default=None)):
    actor = require_admin(authorization)
    try: return save_scheme(request.payload, actor)
    except ValueError as error: raise HTTPException(status_code=422, detail=str(error))

@app.post("/api/v1/admin/catalog/{scheme_id}/publish")
def admin_publish_scheme(scheme_id: str, authorization: str | None = Header(default=None)):
    actor = require_admin(authorization)
    try: return publish_scheme(scheme_id, actor)
    except KeyError: raise HTTPException(status_code=404, detail="Scheme not found")

@app.get("/api/v1/admin/audit")
def admin_audit(authorization: str | None = Header(default=None)):
    require_admin(authorization)
    return audit_log()
