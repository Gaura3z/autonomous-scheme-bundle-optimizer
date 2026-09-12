"""
Benefit Strategist Orchestrator:
    The central control plane coordinating the decision pipeline:
Rules -> Eligibility -> Exclusions -> Conflicts -> Documents -> PuLP Optimization -> Roadmap.
"""
from typing import List, Dict, Tuple
import time
from .models import (
    CitizenProfile,
    Scheme,
    SchemeEvaluation,
    OptimizationResponse,
    OptimizationRequest
    ,DecisionAudit
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
        started_at = time.time()
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

        # Step 3: Document readiness runs on every eligible scheme before the
        # final actionable optimization. This keeps document gating explicit.
        readiness = analyze_document_readiness(eligible_schemes, declared_docs)

        # Step 4: PuLP/CBC returns two views:
        # - potential bundle: maximum compatible value across all eligible schemes
        # - ready-now bundle: maximum compatible value among document-ready schemes
        bundle = optimize_bundle(
            eligible_schemes,
            self.conflict_map,
            declared_docs,
            ready_scheme_ids=readiness.ready_scheme_ids,
        )

        # Step 5: Roadmap Engine (Actionable topological checklist)
        roadmap = generate_roadmap(bundle.potential_selected_schemes, readiness.missing_docs_by_scheme)

        conflict_count = sum(
            1 for scheme_id, conflicts in self.conflict_map.items()
            if scheme_id in {s.id for s in eligible_schemes}
            for conflict_id in conflicts
            if conflict_id in {s.id for s in eligible_schemes}
        ) // 2
        excluded_count = sum(1 for item in evaluations if item.status in {"INELIGIBLE", "BLOCKED_BY_EXCLUSION"})
        audit = DecisionAudit(
            catalog_version=self.catalog[0].kbVersion if self.catalog else "v2026.2-PS16",
            catalog_size=len(self.catalog),
            eligible_count=len(eligible_schemes),
            excluded_count=excluded_count,
            conflict_count=conflict_count,
            declared_document_count=len(declared_docs),
            ready_scheme_count=len(bundle.selected_schemes),
            document_blocked_count=len(bundle.document_blocked_scheme_ids),
            solver=f"PuLP/CBC when available; deterministic fallback otherwise ({bundle.solver_status})",
            execution_time_ms=round((time.time() - started_at) * 1000, 2),
            trace=[
                "Validated citizen profile with Pydantic.",
                f"Evaluated {len(self.catalog)} curated scheme rules.",
                f"Applied negative exclusions to {excluded_count} schemes.",
                f"Built conflict graph with {conflict_count} active conflict edge(s).",
                "Evaluated document readiness across all eligible schemes before optimization.",
                "Solved potential and ready-now bundles with PuLP/CBC constraints.",
                "Generated document readiness and dependency-aware roadmap."
            ]
        )

        return OptimizationResponse(
            success=True,
            evaluations=evaluations,
            bundle=bundle,
            readiness=readiness,
            roadmap=roadmap
            ,audit=audit
        )
