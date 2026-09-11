"""
Kurukshetra 2.0 HACKFEST 2026 PS16
Autonomous Scheme-Bundle Optimizer - Pydantic v2 Data Models
"""
from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

class CitizenProfile(BaseModel):
    age: int = Field(..., ge=0, le=120, description="Citizen age in years")
    gender: str = Field(..., description="'Male', 'Female', 'Transgender', 'Other'")
    state: str = Field(..., description="Indian State or Union Territory")
    socialCategory: str = Field(..., description="'General', 'OBC', 'SC', 'ST', 'EWS'")
    annualFamilyIncome: float = Field(..., ge=0, description="Annual family income in INR")
    occupationCategory: Optional[str] = Field(None, description="Primary occupation category")
    landHoldingAcres: Optional[float] = Field(0.0, ge=0, description="Agricultural land ownership in acres")
    isStudent: Optional[bool] = False
    isDisability: Optional[bool] = False
    disabilityPercentage: Optional[int] = Field(0, ge=0, le=100)
    maritalStatus: Optional[str] = "Married"
    residenceType: Optional[str] = "Rural"
    isBPL: Optional[bool] = False
    isFarmer: Optional[bool] = False
    isTaxPayer: Optional[bool] = False
    isGovernmentEmployee: Optional[bool] = False
    hasInstitutionalLand: Optional[bool] = False

class SchemeBenefit(BaseModel):
    type: str  # Direct Benefit Transfer, Subsidized Credit, Insurance, Scholarship, Pension
    amount: float
    frequency: str  # Annual, One-Time, Monthly, Per Trimester
    displayAmount: str

class Scheme(BaseModel):
    id: str
    name: str
    shortName: str
    ministry: str
    level: str  # Central, State
    category: str
    tagline: str
    description: str
    benefit: SchemeBenefit
    applicableStates: List[str]
    requiredDocuments: List[str]
    officialSourceUrl: str
    conflictingSchemeIds: Optional[List[str]] = []
    weight: Optional[float] = 1.0

class SchemeEvaluation(BaseModel):
    scheme_id: str
    scheme_name: str
    status: str  # 'ELIGIBLE', 'INELIGIBLE', 'BLOCKED_BY_EXCLUSION', 'CONFLICT_REJECTED'
    met_criteria: List[str] = []
    unmet_reasons: List[str] = []
    exclusion_reasons: List[str] = []
    monetary_value: float = 0.0

class OptimizedBundle(BaseModel):
    selected_scheme_ids: List[str]
    selected_schemes: List[Scheme]
    total_monetary_benefit: str
    total_annual_value_inr: float
    rejected_alternatives: List[Dict[str, Any]] = []
    execution_time_ms: float = 0.0
    solver_status: str = "Optimal"
    potential_selected_scheme_ids: List[str] = []
    potential_selected_schemes: List[Scheme] = []
    potential_annual_value_inr: float = 0.0
    document_blocked_scheme_ids: List[str] = []

class DocumentReadinessResult(BaseModel):
    ready_scheme_ids: List[str]
    missing_docs_by_scheme: Dict[str, List[str]]
    overall_readiness_score: float

class RoadmapStep(BaseModel):
    step_number: int
    title: str
    phase: str
    estimated_timeline: str
    description: str
    critical_dependency: Optional[str] = None
    action_url: Optional[str] = None

class OptimizationRequest(BaseModel):
    profile: CitizenProfile
    declared_document_ids: List[str] = []

class OptimizationResponse(BaseModel):
    success: bool
    evaluations: List[SchemeEvaluation]
    bundle: OptimizedBundle
    readiness: DocumentReadinessResult
    roadmap: List[RoadmapStep]
    architectural_note: str = (
        "AI does NOT decide eligibility. Deterministic execution: "
        "Rules -> Eligibility -> Exclusions -> Conflicts -> PuLP Optimization -> Documents -> Roadmap."
    )
