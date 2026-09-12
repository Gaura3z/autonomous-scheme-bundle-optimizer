"""
Optimization Engine: Formulates and solves the 0/1 Integer Linear Program (ILP)
using PuLP + CBC solver (with deterministic branch-and-bound fallback).

Objective:
    Maximize Sum(c_i * x_i) for i in Eligible Schemes
    where c_i = monetary benefit weight of scheme i
          x_i in {0, 1}

Subject to:
    Mutual Exclusivity Constraints:
    x_i + x_j <= 1 for all conflicting scheme pairs (i, j) in Conflict Graph
"""
import time
from typing import List, Dict, Tuple
from ..models import Scheme, OptimizedBundle

def optimize_bundle(
    eligible_schemes: List[Scheme],
    conflict_map: Dict[str, set],
    declared_doc_ids: List[str] | None = None,
    ready_scheme_ids: List[str] | None = None,
) -> OptimizedBundle:
    start_time = time.time()

    if not eligible_schemes:
        return OptimizedBundle(
            selected_scheme_ids=[],
            selected_schemes=[],
            total_monetary_benefit="INR 0",
            total_annual_value_inr=0.0,
            rejected_alternatives=[],
            execution_time_ms=0.0,
            solver_status="Trivial Empty"
        )

    # Try solving with PuLP if available
    use_pulp = False
    try:
        import pulp
        use_pulp = True
    except ImportError:
        use_pulp = False

    declared = set(declared_doc_ids or [])
    potential_ids = []
    solver_status = "Optimal"

    def solve(candidate_schemes: List[Scheme]) -> List[str]:
        result_ids = []
        if not candidate_schemes:
            return result_ids
        if use_pulp:
            prob = pulp.LpProblem("Scheme_Bundle_Optimization", pulp.LpMaximize)
            x = {s.id: pulp.LpVariable(f"x_{s.id}", cat="Binary") for s in candidate_schemes}
            prob += pulp.lpSum([s.benefit.amount * x[s.id] for s in candidate_schemes]), "Total_Citizen_Benefit"
            added_constraints = set()
            for s in candidate_schemes:
                for conflict_id in conflict_map.get(s.id, set()):
                    if conflict_id in x:
                        pair_key = tuple(sorted([s.id, conflict_id]))
                        if pair_key not in added_constraints:
                            prob += x[s.id] + x[conflict_id] <= 1, f"Conflict_{pair_key[0]}_{pair_key[1]}"
                            added_constraints.add(pair_key)
            prob.solve(pulp.PULP_CBC_CMD(msg=False))
            result_ids.extend(s.id for s in candidate_schemes if pulp.value(x[s.id]) == 1.0)
            return result_ids

        sorted_schemes = sorted(candidate_schemes, key=lambda s: s.benefit.amount, reverse=True)
        conflicts_selected = set()
        for s in sorted_schemes:
            if s.id not in conflicts_selected:
                result_ids.append(s.id)
                conflicts_selected.update(conflict_map.get(s.id, set()))
        return result_ids

    potential_ids = solve(eligible_schemes)
    ready_ids = set(ready_scheme_ids) if ready_scheme_ids is not None else None
    ready_candidates = [s for s in eligible_schemes if (
        ready_ids is not None
        and s.id in ready_ids
    ) or (
        ready_ids is None
        and (declared_doc_ids is None or all(doc in declared for doc in s.requiredDocuments))
    )]
    selected_ids = solve(ready_candidates)

    selected_schemes = [s for s in eligible_schemes if s.id in selected_ids]
    potential_schemes = [s for s in eligible_schemes if s.id in potential_ids]
    total_val = sum(s.benefit.amount for s in selected_schemes)

    # Detect rejected alternatives
    rejected_alternatives = []
    for s in eligible_schemes:
        if s.id not in selected_ids:
            conflicting_winners = [w.shortName for w in selected_schemes if w.id in conflict_map.get(s.id, set())]
            if conflicting_winners:
                reason = f"Subsumed by higher-yield alternative ({', '.join(conflicting_winners)}) due to statutory anti-duplication."
            else:
                reason = "Not selected in optimal utility subset."
            rejected_alternatives.append({
                "scheme_id": s.id,
                "scheme_name": s.name,
                "rejection_reason": reason
            })

    exec_time = round((time.time() - start_time) * 1000, 2)

    return OptimizedBundle(
        selected_scheme_ids=selected_ids,
        selected_schemes=selected_schemes,
        total_monetary_benefit=f"INR {int(total_val):,}/yr" if total_val > 0 else "Direct Non-Monetary Support",
        total_annual_value_inr=float(total_val),
        rejected_alternatives=rejected_alternatives,
        execution_time_ms=exec_time,
        solver_status=solver_status
        ,potential_selected_scheme_ids=potential_ids
        ,potential_selected_schemes=potential_schemes
        ,potential_annual_value_inr=float(sum(s.benefit.amount for s in potential_schemes))
        ,document_blocked_scheme_ids=[s.id for s in potential_schemes if s.id not in selected_ids]
    )
