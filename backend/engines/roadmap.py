"""
Roadmap Engine: Generates an actionable chronological execution plan.
Orders steps topologically so prerequisites come before applications.
"""
from typing import List
from ..models import Scheme, RoadmapStep

def generate_roadmap(
    bundle_schemes: List[Scheme],
    missing_docs_by_scheme: dict
) -> List[RoadmapStep]:
    steps: List[RoadmapStep] = []
    step_counter = 1

    # Phase 1: Foundational Identity & e-KYC Verification
    steps.append(RoadmapStep(
        step_number=step_counter,
        title="Verify Aadhaar-Mobile Linkage & Active Bank NPCI Seeding",
        phase="Prerequisite Phase",
        estimated_timeline="1-2 Days",
        description="Ensure your Aadhaar is linked to your current mobile number and bank account is NPCI-seeded for Direct Benefit Transfer (DBT) credit.",
        critical_dependency="Must be completed before filing any central DBT application.",
        action_url="https://myaadhaar.uidai.gov.in"
    ))
    step_counter += 1

    # Phase 2: Missing Document Procurement
    all_missing_docs = set()
    for doc_list in missing_docs_by_scheme.values():
        for d in doc_list:
            all_missing_docs.add(d)

    if all_missing_docs:
        steps.append(RoadmapStep(
            step_number=step_counter,
            title=f"Procure Essential Certificates: {', '.join(sorted(list(all_missing_docs))[:3])}",
            phase="Document Acquisition",
            estimated_timeline="5-7 Days",
            description="Visit your nearest Common Service Center (CSC) or state e-District portal to obtain pending statutory proof documents.",
            critical_dependency="Required for final application acceptance.",
            action_url="https://edistrict.gov.in"
        ))
        step_counter += 1

    # Phase 3: High-Yield Application Submissions
    for s in bundle_schemes:
        steps.append(RoadmapStep(
            step_number=step_counter,
            title=f"Submit Online Application for {s.shortName}",
            phase="Application Filing",
            estimated_timeline="Immediate (1 Day)",
            description=f"Submit registration for {s.name} ({s.benefit.displayAmount}) on the official ministry portal.",
            action_url=s.officialSourceUrl
        ))
        step_counter += 1

    # Phase 4: DBT Account Disbursal & SMS Tracking
    steps.append(RoadmapStep(
        step_number=step_counter,
        title="Track Application Status & DBT Disbursal Notification",
        phase="Tracking & Verification",
        estimated_timeline="7-15 Days",
        description="Monitor status updates via PFMS (Public Financial Management System) or scheme helpline SMS.",
        action_url="https://pfms.nic.in"
    ))

    return steps
