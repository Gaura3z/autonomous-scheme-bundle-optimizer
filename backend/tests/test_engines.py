"""
Unit & Integration Tests for PS16 Autonomous Scheme-Bundle Optimizer
Demonstrates deterministic engine correctness and PuLP solver constraints.
"""
from backend.models import CitizenProfile, Scheme, OptimizationRequest
from backend.orchestrator import BenefitStrategistOrchestrator
from backend.engines.eligibility import evaluate_eligibility
from backend.engines.exclusions import evaluate_exclusions
from backend.engines.conflicts import build_conflict_matrix
from backend.engines.optimizer import optimize_bundle

def test_farmer_eligibility_and_exclusion():
    # Ramesh Patel: Small farmer with 2.5 acres, non-taxpayer
    farmer = CitizenProfile(
        age=48,
        gender="Male",
        state="Maharashtra",
        socialCategory="OBC",
        annualFamilyIncome=140000,
        occupationCategory="Farmer",
        landHoldingAcres=2.5,
        isFarmer=True,
        isTaxPayer=False
    )
    
    test_scheme = Scheme(
        id="pm_kisan",
        name="PM-KISAN",
        shortName="PM-KISAN",
        ministry="Ministry of Agriculture",
        level="Central",
        category="Agriculture",
        tagline="INR 6,000",
        description="Assistance",
        benefit={"type": "DBT", "amount": 6000.0, "frequency": "Annual", "displayAmount": "INR 6,000"},
        applicableStates=["All States"],
        requiredDocuments=["aadhaar", "land_712"],
        officialSourceUrl="https://pmkisan.gov.in"
    )

    is_eligible, met, unmet = evaluate_eligibility(farmer, test_scheme)
    assert is_eligible is True
    assert len(unmet) == 0

    # Negative exclusion check: If farmer becomes tax payer, PM-KISAN must be blocked
    farmer.isTaxPayer = True
    exclusions = evaluate_exclusions(farmer, test_scheme)
    assert len(exclusions) > 0
    assert "disqualified" in exclusions[0].lower()

def test_pulp_conflict_solver():
    # Two schemes that mutually conflict
    s1 = Scheme(
        id="scheme_a",
        name="Scheme A",
        shortName="A",
        ministry="M1",
        level="Central",
        category="Finance",
        tagline="10k",
        description="Desc",
        benefit={"type": "DBT", "amount": 10000.0, "frequency": "Annual", "displayAmount": "10k"},
        applicableStates=["All States"],
        requiredDocuments=[],
        officialSourceUrl="https://gov.in"
    )
    s2 = Scheme(
        id="scheme_b",
        name="Scheme B (Subsumed)",
        shortName="B",
        ministry="M1",
        level="Central",
        category="Finance",
        tagline="5k",
        description="Desc",
        benefit={"type": "DBT", "amount": 5000.0, "frequency": "Annual", "displayAmount": "5k"},
        applicableStates=["All States"],
        requiredDocuments=[],
        officialSourceUrl="https://gov.in"
    )

    # Conflict: scheme_a conflicts with scheme_b
    conflict_map = {"scheme_a": {"scheme_b"}, "scheme_b": {"scheme_a"}}
    bundle = optimize_bundle([s1, s2], conflict_map)

    # Optimizer must choose scheme_a (10,000) and reject scheme_b (5,000)
    assert "scheme_a" in bundle.selected_scheme_ids
    assert "scheme_b" not in bundle.selected_scheme_ids
    assert bundle.total_annual_value_inr == 10000.0
    assert len(bundle.rejected_alternatives) == 1
