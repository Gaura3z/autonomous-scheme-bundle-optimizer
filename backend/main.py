"""
Kurukshetra 2.0 HACKFEST 2026 PS16
Autonomous Scheme-Bundle Optimizer - FastAPI REST API
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from .models import (
    CitizenProfile,
    Scheme,
    OptimizationRequest,
    OptimizationResponse
)
from .orchestrator import BenefitStrategistOrchestrator

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
        id="pm_mudra_shishu",
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
        id="post_matric_sc",
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
        conflictingSchemeIds=["national_merit_scholarship"]
    )
]

orchestrator = BenefitStrategistOrchestrator(DEFAULT_CATALOG)

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
