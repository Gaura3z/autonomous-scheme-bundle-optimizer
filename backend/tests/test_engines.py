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
from backend.engines.documents import analyze_document_readiness

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

def test_document_aware_bundle_separates_ready_and_potential_schemes():
    ready = Scheme(
        id="ready", name="Ready Scheme", shortName="Ready", ministry="M1", level="Central",
        category="Health", tagline="Ready", description="Ready", benefit={"type": "DBT", "amount": 100.0, "frequency": "Annual", "displayAmount": "100"},
        applicableStates=["All States"], requiredDocuments=["aadhaar"], officialSourceUrl="https://gov.in"
    )
    gated = Scheme(
        id="gated", name="Gated Scheme", shortName="Gated", ministry="M1", level="Central",
        category="Housing", tagline="Gated", description="Gated", benefit={"type": "DBT", "amount": 200.0, "frequency": "Annual", "displayAmount": "200"},
        applicableStates=["All States"], requiredDocuments=["income_cert"], officialSourceUrl="https://gov.in"
    )
    bundle = optimize_bundle([ready, gated], {"ready": set(), "gated": set()}, ["aadhaar"])
    assert bundle.selected_scheme_ids == ["ready"]
    assert bundle.potential_selected_scheme_ids == ["gated", "ready"]
    assert bundle.document_blocked_scheme_ids == ["gated"]

def test_orchestrator_returns_decision_audit():
    scheme = Scheme(
        id="audit_scheme", name="Audit Scheme", shortName="Audit", ministry="M1", level="Central",
        category="Health", tagline="Audit", description="Audit", benefit={"type": "DBT", "amount": 10.0, "frequency": "Annual", "displayAmount": "10"},
        applicableStates=["All States"], requiredDocuments=[], officialSourceUrl="https://gov.in"
    )
    orchestrator = BenefitStrategistOrchestrator([scheme])
    response = orchestrator.process(OptimizationRequest(profile=CitizenProfile(age=30, gender="Female", state="MH", socialCategory="General", annualFamilyIncome=100000), declared_document_ids=[]))
    assert response.audit.catalog_size == 1
    assert response.audit.eligible_count == 1
    assert response.audit.trace

def test_document_readiness_runs_before_ready_now_selection():
    ready = Scheme(
        id="ready_first", name="Ready First", shortName="Ready", ministry="M1", level="Central",
        category="Health", tagline="Ready", description="Ready", benefit={"type": "DBT", "amount": 100.0, "frequency": "Annual", "displayAmount": "100"},
        applicableStates=["All States"], requiredDocuments=["aadhaar"], officialSourceUrl="https://gov.in"
    )
    gated = Scheme(
        id="gated_first", name="Gated First", shortName="Gated", ministry="M1", level="Central",
        category="Housing", tagline="Gated", description="Gated", benefit={"type": "DBT", "amount": 300.0, "frequency": "Annual", "displayAmount": "300"},
        applicableStates=["All States"], requiredDocuments=["income_cert"], officialSourceUrl="https://gov.in"
    )
    readiness = analyze_document_readiness([ready, gated], ["aadhaar"])
    assert readiness.ready_scheme_ids == ["ready_first"]
    bundle = optimize_bundle([ready, gated], {"ready_first": set(), "gated_first": set()}, ["aadhaar"], readiness.ready_scheme_ids)
    assert bundle.selected_scheme_ids == ["ready_first"]
    assert bundle.potential_selected_scheme_ids == ["gated_first", "ready_first"]

def test_conflict_matrix_is_symmetric():
    a = Scheme(
        id="a", name="A", shortName="A", ministry="M1", level="Central", category="Finance", tagline="A", description="A",
        benefit={"type": "DBT", "amount": 1.0, "frequency": "Annual", "displayAmount": "1"}, applicableStates=["All States"],
        requiredDocuments=[], officialSourceUrl="https://gov.in", conflictingSchemeIds=["b"]
    )
    b = Scheme(
        id="b", name="B", shortName="B", ministry="M1", level="Central", category="Finance", tagline="B", description="B",
        benefit={"type": "DBT", "amount": 1.0, "frequency": "Annual", "displayAmount": "1"}, applicableStates=["All States"],
        requiredDocuments=[], officialSourceUrl="https://gov.in"
    )
    matrix = build_conflict_matrix([a, b])
    assert "b" in matrix["a"]
    assert "a" in matrix["b"]
