"""
Benefit Strategist Orchestrator:
The central control plane coordinating the decision pipeline:
Rules -> Eligibility -> Exclusions -> Conflicts -> PuLP Optimization -> Documents -> Roadmap.
"""
from typing import List, Dict, Tuple
from .models import (
    CitizenProfile,
    Scheme,
    SchemeEvaluation,
    OptimizationResponse,
    OptimizationRequest
)
from .engines.eligibility import evaluate_eligibility
from .engines.exclusions import evaluate_exclusions
from .engines.conflicts import build_conflict_matrix
from .engines.optimizer import optimize_bundle
from .engines.documents import analyze_document_readiness
from .engines.roadmap import generate_roadmap

class BenefitStrategistOrchestrator:
    def __init__(self, scheme_catalog: List[Scheme]):
        self.catalog = scheme_catalog
        self.conflict_map = build_conflict_matrix(scheme_catalog)

    def process(self, request: OptimizationRequest) -> OptimizationResponse:
        profile = request.profile
        declared_docs = request.declared_document_ids

        evaluations: List[SchemeEvaluation] = []
        eligible_schemes: List[Scheme] = []

        # Step 1 & 2: Eligibility & Exclusion Evaluation
        for scheme in self.catalog:
            is_eligible, met, unmet = evaluate_eligibility(profile, scheme)
            exclusion_triggers = evaluate_exclusions(profile, scheme)

            if exclusion_triggers:
                status = "BLOCKED_BY_EXCLUSION"
            elif is_eligible:
                status = "ELIGIBLE"
                eligible_schemes.append(scheme)
            else:
                status = "INELIGIBLE"

            evaluations.append(SchemeEvaluation(
                scheme_id=scheme.id,
                scheme_name=scheme.name,
                status=status,
                met_criteria=met,
                unmet_reasons=unmet,
                exclusion_reasons=exclusion_triggers,
                monetary_value=scheme.benefit.amount
            ))

        # Step 3: Optimization Solver (PuLP + CBC under mutual conflict constraints)
        bundle = optimize_bundle(eligible_schemes, self.conflict_map, declared_docs)

        # Step 4: Document Engine (Readiness separation & missing docs)
        # Readiness is evaluated against the potential conflict-free bundle so
        # the response exposes both ready-now schemes and document-gated value.
        readiness = analyze_document_readiness(bundle.potential_selected_schemes, declared_docs)

        # Step 5: Roadmap Engine (Actionable topological checklist)
        roadmap = generate_roadmap(bundle.potential_selected_schemes, readiness.missing_docs_by_scheme)

        return OptimizationResponse(
            success=True,
            evaluations=evaluations,
            bundle=bundle,
            readiness=readiness,
            roadmap=roadmap
        )
