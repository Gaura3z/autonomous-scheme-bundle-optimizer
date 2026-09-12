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

    elif s_id == "pmmy_shishu":
        if profile.age >= 18:
            met.append(f"Age threshold satisfied ({profile.age} yrs >= 18)")
        else:
            unmet.append("Minimum age for business credit is 18 years")

    elif s_id == "post_matric_scholarship":
        if profile.socialCategory == "SC" and profile.isStudent and profile.annualFamilyIncome <= 250000:
            met.append("SC category, active student enrollment, and income <= 2.5L verified")
        else:
            unmet.append("Requires SC category, enrolled student status, and income <= 2.5L")

    elif s_id == "pension_apy":
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

    elif s_id in {"pm_kusum", "kisan_credit_card", "soil_health_card", "pm_krishi_sinchayee", "pmfby"}:
        if profile.isFarmer or profile.occupationCategory in {"Farmer", "Farmer / Agriculture"}:
            met.append("Farmer or agriculture occupation verified")
        else:
            unmet.append("Requires a farmer or agriculture-related profile")
        if (profile.landHoldingAcres or 0) > 0:
            met.append(f"Agricultural land information available ({profile.landHoldingAcres} acres)")
        else:
            unmet.append("Requires agricultural land information for this prototype screening")

    elif s_id == "pm_surya_ghar":
        if profile.residenceType in {"Urban", "Semi-Urban", "Rural"}:
            met.append("Residential area profile provided")
        else:
            unmet.append("Requires a residential area profile")

    elif s_id == "pm_vishwakarma":
        artisan_categories = {
            "Artisan / Handicraft", "Skilled Worker", "Business Owner", "Shop Owner",
            "Trader", "Professional Services", "Other Self-Employment"
        }
        if profile.selfEmploymentCategory in artisan_categories or profile.occupationCategory in {"Artisan", "Skilled Worker"}:
            met.append("Artisan or self-employment profile provided")
        else:
            unmet.append("Requires a traditional artisan or self-employment profile")

    elif s_id in {"pmkvy", "national_apprenticeship", "deendayal_upadhyaya_gky"}:
        if profile.isStudent or profile.employmentStatus in {"Unemployed", "Job Seeker", "Daily Wage", "Self-Employed"}:
            met.append("Applicant has a training-seeking student or worker profile")
        else:
            unmet.append("Requires a student, job-seeking, or worker profile for training discovery")

    elif s_id == "pm_egp":
        if profile.age >= 18:
            met.append("Age threshold for enterprise application satisfied")
        else:
            unmet.append("Requires an adult applicant for enterprise support")
        if profile.selfEmploymentCategory or profile.selfEmploymentDetails or profile.occupationCategory in {"Business Owner", "Shop Owner", "Trader"}:
            met.append("Enterprise or self-employment intent provided")
        else:
            unmet.append("Requires a proposed or existing micro-enterprise profile")

    elif s_id == "sukanya_samriddhi":
        if profile.gender == "Female" or profile.maritalStatus in {"Unmarried / Single", "Unmarried"}:
            met.append("Girl-child savings profile indicated")
        else:
            unmet.append("Requires a girl-child beneficiary profile to be confirmed")

    elif s_id == "pmay_urban":
        if profile.residenceType in {"Urban", "Semi-Urban"}:
            met.append("Urban or semi-urban residence profile verified")
        else:
            unmet.append("Requires an urban or semi-urban residence profile")
        if profile.annualFamilyIncome <= 1200000:
            met.append("Family income is within the prototype PMAY-U screening band")
        else:
            unmet.append("Family income exceeds the prototype PMAY-U screening band")

    elif s_id == "pm_ujjwala":
        if profile.gender == "Female":
            met.append("Female applicant profile verified")
        else:
            unmet.append("This prototype record is targeted to women applicants")
        if profile.isBPL:
            met.append("BPL indicator provided")
        else:
            unmet.append("Requires BPL or equivalent household eligibility verification")

    elif s_id == "pm_jan_dhan":
        if profile.age >= 10:
            met.append("Age is within the basic account-opening screening band")
        else:
            unmet.append("Applicant is below the prototype minimum age of 10")

    elif s_id == "pmjjby":
        if 18 <= profile.age <= 50:
            met.append("Age is within the 18-50 entry band")
        else:
            unmet.append("Age is outside the 18-50 entry band")

    elif s_id == "pmsby":
        if 18 <= profile.age <= 70:
            met.append("Age is within the 18-70 entry band")
        else:
            unmet.append("Age is outside the 18-70 entry band")

    elif s_id == "nsap":
        if profile.age >= 60:
            met.append("Age is within the senior-support screening band")
        else:
            unmet.append("Requires age 60 or above for this prototype screening")
        if profile.isBPL:
            met.append("BPL indicator provided")
        else:
            unmet.append("Requires BPL or equivalent household eligibility verification")

    elif s_id == "pm_matru_vandana":
        if profile.gender == "Female" and 18 <= profile.age <= 55:
            met.append("Female applicant is within the prototype age band")
        else:
            unmet.append("Requires a female applicant within the prototype age band")

    elif s_id == "eshram":
        if profile.employmentStatus in {"Unemployed", "Self-Employed", "Daily Wage", "Informal"} or profile.occupationCategory in {"Daily Wage", "Informal Worker"}:
            met.append("Unorganised-worker profile provided")
        else:
            unmet.append("Requires an unorganised or informal-worker profile")

    elif s_id == "nrlm":
        if profile.gender == "Female":
            met.append("Woman applicant profile verified")
        else:
            unmet.append("This prototype record targets women-led rural livelihood groups")
        if profile.residenceType == "Rural":
            met.append("Rural residence profile verified")
        else:
            unmet.append("Requires a rural residence profile")

    elif s_id == "pmfme":
        if profile.selfEmploymentCategory or profile.selfEmploymentDetails or profile.occupationCategory in {"Business Owner", "Shop Owner", "Trader"}:
            met.append("Micro-enterprise or self-employment profile provided")
        else:
            unmet.append("Requires a micro-enterprise or self-employment profile")

    elif s_id in {"central_sector_scholarship", "state_higher_ed_stipend", "top_class_education_sc", "post_matric_obc", "national_overseas_scholarship"}:
        if profile.isStudent:
            met.append("Student status verified")
        else:
            unmet.append("Requires active student status")
        if s_id == "top_class_education_sc" and profile.socialCategory != "SC":
            unmet.append("Requires Scheduled Caste category")
        elif s_id == "post_matric_obc" and profile.socialCategory != "OBC":
            unmet.append("Requires Other Backward Class category")
        elif s_id == "national_overseas_scholarship" and profile.socialCategory not in {"SC", "ST"}:
            unmet.append("Requires Scheduled Caste or Scheduled Tribe category")
        elif s_id in {"central_sector_scholarship", "state_higher_ed_stipend"}:
            met.append("General higher-education scholarship screening applies")

    elif s_id == "pm_daksh":
        if profile.socialCategory in {"SC", "OBC", "EWS"} or profile.isDisability:
            met.append("Target social category or disability profile provided")
        else:
            unmet.append("Requires a target social category or disability profile")

    else:
        # General scheme check
        met.append("Basic criteria satisfied")

    is_eligible = len(unmet) == 0
    return is_eligible, met, unmet
