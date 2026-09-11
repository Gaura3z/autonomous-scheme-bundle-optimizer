"""
Eligibility Engine: Evaluates citizen demographic & socioeconomic criteria
against statutory eligibility thresholds.
Deterministic - no AI in the decision path.
"""
from typing import Dict, List, Tuple
from ..models import CitizenProfile, Scheme

def evaluate_eligibility(profile: CitizenProfile, scheme: Scheme) -> Tuple[bool, List[str], List[str]]:
    """
    Returns (is_eligible, met_criteria, unmet_reasons).
    """
    met = []
    unmet = []

    # 1. Geographic State Scope Check
    if scheme.level == "State":
        if "All States" not in scheme.applicableStates and profile.state not in scheme.applicableStates:
            unmet.append(f"Scheme restricted to residents of {', '.join(scheme.applicableStates)} (Citizen is in {profile.state})")
        else:
            met.append(f"Geographic jurisdiction verified for {profile.state}")
    else:
        met.append("Central scheme available nationwide")

    # 2. Scheme-Specific Thresholds
    s_id = scheme.id

    if s_id == "pm_kisan":
        if (profile.isFarmer or profile.occupationCategory == "Farmer") and (profile.landHoldingAcres or 0) > 0:
            met.append(f"Cultivable agricultural land verified ({profile.landHoldingAcres} acres)")
        else:
            unmet.append("Requires cultivable agricultural land ownership")

    elif s_id == "pm_awas_gramin":
        if profile.annualFamilyIncome <= 180000:
            met.append("Income within Rural Housing threshold (<= INR 1.8 Lakh)")
        else:
            unmet.append("Family income exceeds PMAY-G ceiling of INR 1.8 Lakh")

    elif s_id == "ayushman_bharat":
        if profile.isBPL or profile.annualFamilyIncome <= 250000 or profile.socialCategory in ["SC", "ST"]:
            met.append("Eligible under SECC deprivation / income criteria")
        else:
            unmet.append("Does not meet Ayushman PM-JAY deprivation criteria (Income > 2.5L)")

    elif s_id == "pm_mudra_shishu":
        if profile.age >= 18:
            met.append(f"Age threshold satisfied ({profile.age} yrs >= 18)")
        else:
            unmet.append("Minimum age for business credit is 18 years")

    elif s_id == "post_matric_sc":
        if profile.socialCategory == "SC" and profile.isStudent and profile.annualFamilyIncome <= 250000:
            met.append("SC category, active student enrollment, and income <= 2.5L verified")
        else:
            unmet.append("Requires SC category, enrolled student status, and income <= 2.5L")

    elif s_id == "atal_pension":
        if 18 <= profile.age <= 40:
            met.append(f"Age within entry band (18-40 years, citizen is {profile.age})")
        else:
            unmet.append(f"Age {profile.age} outside entry window of 18-40 years")

    elif s_id == "standup_india":
        if (profile.gender == "Female" or profile.socialCategory in ["SC", "ST"]) and profile.age >= 18:
            met.append("SC/ST or Woman entrepreneur affirmative qualification met")
        else:
            unmet.append("Reserved exclusively for SC/ST or Women entrepreneurs")

    elif s_id == "pm_svanidhi":
        if profile.occupationCategory in ["Street Vendor", "Artisan", "Informal Trade"]:
            met.append("Informal urban vendor / micro-entrepreneur status verified")
        else:
            unmet.append("Targeted exclusively at street vendors and informal micro-traders")

    else:
        # General scheme check
        met.append("Basic criteria satisfied")

    is_eligible = len(unmet) == 0
    return is_eligible, met, unmet
