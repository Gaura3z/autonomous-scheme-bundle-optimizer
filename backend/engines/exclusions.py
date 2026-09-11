"""
Exclusion Engine: Evaluates explicit statutory negative conditions.
Even if a citizen meets all positive criteria, an exclusion rule
permanently blocks the scheme.
"""
from typing import List
from ..models import CitizenProfile, Scheme

def evaluate_exclusions(profile: CitizenProfile, scheme: Scheme) -> List[str]:
    """
    Returns a list of exclusion triggers. If empty, the citizen is not excluded.
    """
    exclusions = []

    s_id = scheme.id

    # 1. Income Tax exclusion (e.g. PM-Kisan)
    if s_id == "pm_kisan":
        if profile.isTaxPayer:
            exclusions.append("Exclusion Clause: Income-tax paying individuals or family members are disqualified under PM-Kisan statutory guidelines.")
        if profile.isGovernmentEmployee:
            exclusions.append("Exclusion Clause: Serving or retired government/public enterprise officers are disqualified.")
        if profile.hasInstitutionalLand:
            exclusions.append("Exclusion Clause: Institutional landholders are strictly excluded.")

    # 2. Existing Housing Ownership exclusion (PMAY-G)
    elif s_id == "pm_awas_gramin":
        if profile.annualFamilyIncome > 200000:
            exclusions.append("Exclusion Clause: Ownership of pucca housing or high income category disqualifies candidate from PMAY-G.")

    # 3. EPF/Organized Sector exclusion for unorganized pensions
    elif s_id == "pm_sym":  # PM Shram Yogi Maandhan
        if profile.isTaxPayer or profile.isGovernmentEmployee:
            exclusions.append("Exclusion Clause: Beneficiary must belong exclusively to unorganized sector with no EPF/ESIC/NPS membership.")

    # 4. Age Cap Exclusions (e.g. Atal Pension Yojana)
    elif s_id == "atal_pension":
        if profile.isTaxPayer:
            exclusions.append("Exclusion Clause: Subscribing to APY is restricted for income tax filers per recent finance ministry gazette.")

    return exclusions
