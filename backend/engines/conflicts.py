"""
Conflict Engine: Detects mutually incompatible schemes where claiming one
statutorily precludes or deduplicates the other.
Constructs the conflict graph.
"""
from typing import List, Dict, Set, Tuple
from ..models import Scheme

# Definitive Conflict Graph: Incompatible Pairs
STATUTORY_CONFLICT_PAIRS = [
    # Dual scholarship restriction
    ("post_matric_scholarship", "state_higher_ed_stipend", "Statutory Clause 7: Concurrent receipt of two centrally funded educational scholarships is prohibited."),
    # Dual crop input subsidy / credit subsidy duplication
    ("pm_kisan_credit_card", "state_rythu_bandhu_crop_loan", "Statutory Rule: Subsidized crop-loan interest subvention cannot be claimed concurrently for the same survey number."),
    # Solar pump dual capital subsidy
    ("pm_kusum_solar", "state_krishi_sinchayee_solar", "Statutory Rule: Central & State capital capital subsidies for micro-irrigation solarization cannot exceed 90% combined cap.")
]

def get_conflict_pairs() -> List[Tuple[str, str, str]]:
    return STATUTORY_CONFLICT_PAIRS

def build_conflict_matrix(schemes: List[Scheme]) -> Dict[str, Set[str]]:
    """
    Returns an adjacency dictionary of scheme conflicts: {scheme_id: {conflicting_scheme_ids}}
    """
    conflict_map: Dict[str, Set[str]] = {s.id: set() for s in schemes}

    # Add explicitly configured conflicting IDs
    for s in schemes:
        for c_id in (s.conflictingSchemeIds or []):
            if c_id in conflict_map:
                conflict_map[s.id].add(c_id)
                conflict_map[c_id].add(s.id)

    # Add global pairs
    for s1, s2, _ in STATUTORY_CONFLICT_PAIRS:
        if s1 in conflict_map and s2 in conflict_map:
            conflict_map[s1].add(s2)
            conflict_map[s2].add(s1)

    return conflict_map
