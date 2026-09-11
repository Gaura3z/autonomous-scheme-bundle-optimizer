"""
Document Engine: Builds document dependency graphs, maps missing proofs,
and partitions applications into "Ready to Apply" vs "Procurement Required".
"""
from typing import List, Dict, Set
from ..models import Scheme, DocumentReadinessResult

# Prerequisite dependencies for common Indian documents
DOCUMENT_DEPENDENCIES: Dict[str, List[str]] = {
    "income_cert": ["aadhaar", "ration_card", "salary_slip"],
    "caste_cert": ["aadhaar", "domicile_cert"],
    "domicile_cert": ["aadhaar", "electricity_bill"],
    "land_712": ["aadhaar", "land_tax_receipt"],
    "kisan_credit_card": ["aadhaar", "land_712", "bank_passbook"]
}

def analyze_document_readiness(
    schemes: List[Scheme],
    declared_doc_ids: List[str]
) -> DocumentReadinessResult:
    declared_set = set(declared_doc_ids)
    ready_schemes = []
    missing_docs_by_scheme: Dict[str, List[str]] = {}

    total_required = 0
    total_satisfied = 0

    for s in schemes:
        req_docs = s.requiredDocuments or []
        missing = [d for d in req_docs if d not in declared_set]
        total_required += len(req_docs)
        total_satisfied += (len(req_docs) - len(missing))

        if not missing:
            ready_schemes.append(s.id)
        else:
            missing_docs_by_scheme[s.id] = missing

    score = (total_satisfied / total_required * 100.0) if total_required > 0 else 100.0

    return DocumentReadinessResult(
        ready_scheme_ids=ready_schemes,
        missing_docs_by_scheme=missing_docs_by_scheme,
        overall_readiness_score=round(score, 1)
    )
