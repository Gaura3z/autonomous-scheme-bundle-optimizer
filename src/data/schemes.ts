/**
 * Master Verified Schemes Knowledge Base
 * Source-backed active welfare schemes for the PS16 prototype catalog
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 */
import { Scheme } from '../types';
import { ADDITIONAL_SCHEMES } from './additionalSchemes';
import { MAHARASHTRA_STUDENT_SCHEMES } from './maharashtraStudentSchemes';

export const CATALOG_VERSION = 'v2026.2-PS16';

const CURATED_SCHEMES: Scheme[] = [
  {
    id: 'pm_kisan',
    code: 'PM-KISAN',
    name: 'Pradhan Mantri Kisan Samman Nidhi',
    shortName: 'PM-KISAN',
    tagline: '₹6,000 yearly direct income transfer for landholding farmer families',
    description: 'Central sector scheme with 100% funding from Government of India providing income support to all landholding farmer families across the country.',
    category: 'Agriculture & Allied',
    jurisdiction: 'Central',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    officialSourceUrl: 'https://pmkisan.gov.in',
    lastVerifiedDate: '2026-02-15',
    kbVersion: 'v2026.1-PS16',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 600000, // ₹6,000 / yr
      displayAmount: '₹6,000 / year',
      frequency: 'Annual'
    },
    requiredDocumentIds: ['aadhaar', 'bank_passbook', 'land_records_7_12'],
    rules: {
      id: 'rule_pm_kisan',
      all: [
        { field: 'isFarmer', op: 'eq', value: true, label: 'Must be actively engaged in farming' },
        { field: 'landholdingHectares', op: 'gte', min: 0.1, label: 'Must hold cultivable landholding' },
        { field: 'annualFamilyIncome', op: 'lte', max: 600000, label: 'Must not belong to institutional exclusion category' }
      ]
    },
    applicationSteps: [
      {
        sequence: 1,
        title: 'New Farmer e-Registration',
        instructions: 'Visit the PM-KISAN portal "Farmers Corner" and submit 12-digit Aadhaar and active mobile number.',
        portalName: 'PM-KISAN Official Portal',
        portalUrl: 'https://pmkisan.gov.in'
      },
      {
        sequence: 2,
        title: 'Upload Land 7/12 & Bank Passbook',
        instructions: 'Enter Khatauni / survey number and verify that bank account is NPCI Aadhaar-seeded for DBT.',
        portalName: 'State Revenue / PM-KISAN nodal desk',
        portalUrl: 'https://pmkisan.gov.in'
      },
      {
        sequence: 3,
        title: 'eKYC Biometric / OTP Verification',
        instructions: 'Complete Aadhaar OTP verification to enable the four-monthly ₹2,000 direct installments.',
        portalName: 'UIDAI OTP Gateway',
        portalUrl: 'https://pmkisan.gov.in'
      }
    ]
  },
  {
    id: 'pmfby',
    code: 'PMFBY',
    name: 'Pradhan Mantri Fasal Bima Yojana',
    shortName: 'Fasal Bima (Crop Insurance)',
    tagline: 'Comprehensive crop insurance shield against non-preventable natural calamities',
    description: 'Financial support to farmers suffering crop loss/damage arising out of unforeseen events like drought, flood, pests, and unseasonal rains at minimal premium rates (1.5% - 2%).',
    category: 'Agriculture & Allied',
    jurisdiction: 'Central',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    officialSourceUrl: 'https://pmfby.gov.in',
    lastVerifiedDate: '2026-02-10',
    kbVersion: 'v2026.1-PS16',
    benefit: {
      type: 'Hybrid',
      monetaryValueAnnualPaise: 1800000, // Estimated average claim support buffer ~₹18,000
      displayAmount: 'Up to ₹50,000 / hectare risk claim cover',
      frequency: 'Coverage',
      nonMonetaryDescription: '100% loss compensation against localized calamities & post-harvest damage'
    },
    requiredDocumentIds: ['aadhaar', 'bank_passbook', 'land_records_7_12'],
    rules: {
      id: 'rule_pmfby',
      all: [
        { field: 'isFarmer', op: 'eq', value: true, label: 'Must be a farmer growing notified seasonal crops' },
        { field: 'landholdingHectares', op: 'gte', min: 0.1, label: 'Cultivable agricultural parcel required' }
      ]
    },
    applicationSteps: [
      {
        sequence: 1,
        title: 'Check Notified Crop & Cutoff Date',
        instructions: 'Verify seasonal Kharif/Rabi crop notification window at local bank branch or PMFBY portal.',
        portalName: 'PMFBY Portal',
        portalUrl: 'https://pmfby.gov.in'
      },
      {
        sequence: 2,
        title: 'Submit Sowing Declaration & Land RoR',
        instructions: 'Provide Land Record (7/12) and sowing certificate to CSC or affiliated rural bank.',
        portalName: 'National Crop Insurance Portal',
        portalUrl: 'https://pmfby.gov.in'
      }
    ]
  },
  {
    id: 'post_matric_scholarship',
    code: 'PMS-OBC-SC-ST',
    name: 'Post-Matric Scholarship for SC/ST/OBC Students',
    shortName: 'Post-Matric Scholarship',
    tagline: '100% tuition waiver + ₹12,000 annual maintenance allowance for college students',
    description: 'Centrally sponsored scholarship enabling students from socially disadvantaged categories to complete post-matriculation or post-secondary education without financial distress.',
    category: 'Education & Skill',
    jurisdiction: 'Central',
    ministry: 'Ministry of Social Justice and Empowerment',
    officialSourceUrl: 'https://scholarships.gov.in',
    lastVerifiedDate: '2026-02-18',
    kbVersion: 'v2026.1-PS16',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 4200000, // Full tuition waiver + maintenance ~ ₹42,000 / yr
      displayAmount: '₹42,000 / year (Fee Waiver + ₹12k Stipend)',
      frequency: 'Annual'
    },
    requiredDocumentIds: ['aadhaar', 'bank_passbook', 'caste_certificate', 'income_certificate', 'student_id_bonafide', 'domicile_certificate'],
    rules: {
      id: 'rule_post_matric',
      all: [
        { field: 'isStudent', op: 'eq', value: true, label: 'Must be actively enrolled in recognized college' },
        { field: 'annualFamilyIncome', op: 'lte', max: 250000, label: 'Annual family income must be under ₹2.5 Lakhs' },
        { field: 'socialCategory', op: 'in', value: ['OBC', 'SC', 'ST'], label: 'Social category must be OBC, SC, or ST' }
      ]
    },
    applicationSteps: [
      {
        sequence: 1,
        title: 'National Scholarship Portal (NSP) Registration',
        instructions: 'Register with Aadhaar OTR (One-Time Registration) on NSP.',
        portalName: 'National Scholarship Portal',
        portalUrl: 'https://scholarships.gov.in'
      },
      {
        sequence: 2,
        title: 'Attach Income & Caste Verification',
        instructions: 'Upload digital verification tokens for Revenue Income and SDM Caste certificates.',
        portalName: 'NSP Student Dashboard',
        portalUrl: 'https://scholarships.gov.in'
      },
      {
        sequence: 3,
        title: 'College Nodal Officer e-Verification',
        instructions: 'Notify your college scholarship nodal desk for online level-1 verification.',
        portalName: 'Institute Verification Desk',
        portalUrl: 'https://scholarships.gov.in'
      }
    ]
  },
  {
    id: 'state_higher_ed_stipend',
    code: 'ST-MAHA-SCHOLAR',
    name: 'State Merit-cum-Means Higher Education Stipend',
    shortName: 'State Merit Stipend',
    tagline: '₹25,000 annual education grant for state domicile students',
    description: 'State government financial assistance for underprivileged meritorious students enrolled in recognized polytechnic, undergraduate, or post-graduate degree courses.',
    category: 'Education & Skill',
    jurisdiction: 'State-Specific',
    targetStates: ['MH', 'GJ', 'RJ', 'KA'],
    ministry: 'State Department of Higher and Technical Education',
    officialSourceUrl: 'https://mahadbt.maharashtra.gov.in',
    lastVerifiedDate: '2026-02-12',
    kbVersion: 'v2026.1-PS16',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 2500000, // ₹25,000 / yr
      displayAmount: '₹25,000 / year',
      frequency: 'Annual'
    },
    requiredDocumentIds: ['aadhaar', 'bank_passbook', 'income_certificate', 'student_id_bonafide', 'domicile_certificate'],
    rules: {
      id: 'rule_state_scholarship',
      all: [
        { field: 'isStudent', op: 'eq', value: true, label: 'Must be actively enrolled student' },
        { field: 'annualFamilyIncome', op: 'lte', max: 300000, label: 'Family income must not exceed ₹3,00,000' }
      ]
    },
    applicationSteps: [
      {
        sequence: 1,
        title: 'State DBT Portal Signup',
        instructions: 'Log in to state scholarship portal using Aadhaar authentication.',
        portalName: 'State DBT Portal',
        portalUrl: 'https://mahadbt.maharashtra.gov.in'
      },
      {
        sequence: 2,
        title: 'Provide Bonafide & Previous Marksheet',
        instructions: 'Submit current semester bonafide and previous academic year passed marksheet.',
        portalName: 'State DBT Desk',
        portalUrl: 'https://mahadbt.maharashtra.gov.in'
      }
    ]
  },
  {
    id: 'pm_svanidhi',
    code: 'PM-SVANIDHI',
    name: "PM SVANidhi (Street Vendor's AtmaNirbhar Nidhi)",
    shortName: 'PM SVANidhi',
    tagline: 'Collateral-free working capital loan (₹10,000 to ₹50,000) with 7% interest subsidy',
    description: 'Micro-credit scheme providing working capital loans to urban and peri-urban street vendors affected during lockdown to resume their livelihoods.',
    category: 'Business & Self-Employment',
    jurisdiction: 'Central',
    ministry: 'Ministry of Housing and Urban Affairs (MoHUA)',
    officialSourceUrl: 'https://pmsvanidhi.mohua.gov.in',
    lastVerifiedDate: '2026-02-14',
    kbVersion: 'v2026.1-PS16',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 1000000, // ₹10,000 initial collateral free credit
      displayAmount: '₹10,000 First Tranche + 7% Interest Cashback',
      frequency: 'One-Time'
    },
    requiredDocumentIds: ['aadhaar', 'bank_passbook', 'vending_certificate'],
    rules: {
      id: 'rule_pm_svanidhi',
      all: [
        { field: 'hasStreetVendingActivity', op: 'eq', value: true, label: 'Engaged in street vending / informal retail' },
        { field: 'areaType', op: 'in', value: ['Urban', 'Semi-Urban'], label: 'Operating in urban or peri-urban location' }
      ]
    },
    applicationSteps: [
      {
        sequence: 1,
        title: 'Verify Vending Survey ID or ULB LOR',
        instructions: 'Check vendor registration number in municipal survey or apply for Letter of Recommendation.',
        portalName: 'PM SVANidhi Urban Portal',
        portalUrl: 'https://pmsvanidhi.mohua.gov.in'
      },
      {
        sequence: 2,
        title: 'Apply for First Tranche ₹10k Loan',
        instructions: 'Select preferred public sector or regional rural bank and submit digital application.',
        portalName: 'SVANidhi Portal / Bank Desk',
        portalUrl: 'https://pmsvanidhi.mohua.gov.in'
      }
    ]
  },
  {
    id: 'standup_india',
    code: 'STANDUP-INDIA',
    name: 'Stand-Up India Scheme',
    shortName: 'Stand-Up India',
    tagline: 'Bank loans ₹10 Lakhs to ₹1 Crore for SC/ST and Women Entrepreneurs',
    description: 'Facilitates bank loans between ₹10 Lakh and ₹1 Crore to at least one SC or ST borrower and at least one woman borrower per bank branch for greenfield enterprises.',
    category: 'Business & Self-Employment',
    jurisdiction: 'Central',
    ministry: 'Ministry of Finance (Department of Financial Services)',
    officialSourceUrl: 'https://www.standupmitra.in',
    lastVerifiedDate: '2026-02-16',
    kbVersion: 'v2026.1-PS16',
    benefit: {
      type: 'Hybrid',
      monetaryValueAnnualPaise: 15000000, // Subsidized debt capital access equivalent
      displayAmount: '₹10 Lakh to ₹1 Crore Greenfield Capital',
      frequency: 'One-Time',
      nonMonetaryDescription: 'Handholding support via SIDBI, credit guarantee cover & margin money support'
    },
    requiredDocumentIds: ['aadhaar', 'bank_passbook', 'caste_certificate', 'msme_udyam_registration', 'income_certificate'],
    rules: {
      id: 'rule_standup_india',
      all: [
        { field: 'age', op: 'gte', min: 18, label: 'Applicant must be above 18 years' }
      ],
      any: [
        { field: 'gender', op: 'eq', value: 'Female', label: 'Woman entrepreneur' },
        { field: 'socialCategory', op: 'in', value: ['SC', 'ST'], label: 'Belongs to SC or ST community' }
      ]
    },
    applicationSteps: [
      {
        sequence: 1,
        title: 'Prepare Detailed Project Report (DPR)',
        instructions: 'Formulate business plan for manufacturing, services, or trading greenfield enterprise.',
        portalName: 'StandUp Mitra Handholding Desk',
        portalUrl: 'https://www.standupmitra.in'
      },
      {
        sequence: 2,
        title: 'Submit Digital Loan Proposal',
        instructions: 'Apply online and route to preferred scheduled commercial bank branch.',
        portalName: 'StandUp Mitra Portal',
        portalUrl: 'https://www.standupmitra.in'
      }
    ]
  },
  {
    id: 'pmmy_shishu',
    code: 'PMMY-MUDRA',
    name: 'Pradhan Mantri Mudra Yojana (PMMY)',
    shortName: 'Mudra Micro-Loan',
    tagline: 'Collateral-free institutional micro-credit up to ₹50,000 (Shishu) to ₹5 Lakh (Kishore)',
    description: 'Provides micro-finance to non-corporate, non-farm small/micro enterprises to initiate or scale productive self-employment ventures.',
    category: 'Business & Self-Employment',
    jurisdiction: 'Central',
    ministry: 'Ministry of Finance',
    officialSourceUrl: 'https://www.mudra.org.in',
    lastVerifiedDate: '2026-02-14',
    kbVersion: 'v2026.1-PS16',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 5000000, // ₹50,000 Shishu micro-capital
      displayAmount: 'Up to ₹50,000 Collateral-Free Credit',
      frequency: 'One-Time'
    },
    requiredDocumentIds: ['aadhaar', 'bank_passbook', 'msme_udyam_registration'],
    rules: {
      id: 'rule_mudra',
      all: [
        { field: 'age', op: 'gte', min: 18, label: 'Must be 18 years or older' },
        { field: 'employmentStatus', op: 'in', value: ['Self-Employed', 'Employed', 'Unemployed'], label: 'Engaged in or planning non-farm enterprise' }
      ]
    },
    applicationSteps: [
      {
        sequence: 1,
        title: 'Complete Udyam MSME Registration',
        instructions: 'Obtain instant free Udyam registration using Aadhaar.',
        portalName: 'Udyam Registration Portal',
        portalUrl: 'https://udyamregistration.gov.in'
      },
      {
        sequence: 2,
        title: 'Submit Mudra Loan Form to Bank / MFI',
        instructions: 'Apply via JanSamarth portal or designated member lending institution (MLI).',
        portalName: 'JanSamarth Unified Portal',
        portalUrl: 'https://www.jansamarth.in'
      }
    ]
  },
  {
    id: 'pm_egp',
    code: 'PMEGP',
    name: "Prime Minister's Employment Generation Programme",
    shortName: 'PMEGP Enterprise Subsidy',
    tagline: 'Government margin money subsidy (15% - 35%) for new micro-enterprises',
    description: 'Major credit-linked subsidy programme administered by KVIC to establish micro-enterprises in manufacturing (up to ₹50 Lakh) and service sectors (up to ₹20 Lakh).',
    category: 'Business & Self-Employment',
    jurisdiction: 'Central',
    ministry: 'Ministry of Micro, Small and Medium Enterprises',
    officialSourceUrl: 'https://www.kviconline.gov.in/pmegpeportal',
    lastVerifiedDate: '2026-02-11',
    kbVersion: 'v2026.1-PS16',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 17500000, // Up to 35% subsidy on ₹5L project ~ ₹1.75 Lakhs grant
      displayAmount: 'Up to 35% Govt Subsidy (₹1.75L - ₹7L Grant)',
      frequency: 'One-Time'
    },
    requiredDocumentIds: ['aadhaar', 'bank_passbook', 'caste_certificate', 'income_certificate', 'msme_udyam_registration', 'domicile_certificate'],
    rules: {
      id: 'rule_pmegp',
      all: [
        { field: 'age', op: 'gte', min: 18, label: 'Applicant must be at least 18 years old' },
        { field: 'isStudent', op: 'eq', value: false, label: 'Cannot be active full-time student' }
      ]
    },
    applicationSteps: [
      {
        sequence: 1,
        title: 'Online Application on KVIC Portal',
        instructions: 'Fill online PMEGP form and select implementing agency (KVIC / KVIB / DIC).',
        portalName: 'KVIC e-Portal',
        portalUrl: 'https://www.kviconline.gov.in/pmegpeportal'
      },
      {
        sequence: 2,
        title: 'District Task Force Committee Interview',
        instructions: 'Present project proposal to District Level Task Force Committee (DLTFC).',
        portalName: 'District Industries Centre (DIC)',
        portalUrl: 'https://www.kviconline.gov.in'
      }
    ]
  },
  {
    id: 'ayushman_bharat',
    code: 'PM-JAY',
    name: 'Ayushman Bharat PM Jan Arogya Yojana',
    shortName: 'Ayushman Bharat (PM-JAY)',
    tagline: '₹5,00,000 yearly cashless health cover for secondary & tertiary hospital treatment',
    description: "World's largest government-funded healthcare assurance scheme covering over 12 crore vulnerable and economically disadvantaged families.",
    category: 'Health & Social Security',
    jurisdiction: 'Central',
    ministry: 'Ministry of Health and Family Welfare (National Health Authority)',
    officialSourceUrl: 'https://pmjay.gov.in',
    lastVerifiedDate: '2026-02-17',
    kbVersion: 'v2026.1-PS16',
    benefit: {
      type: 'Non-Monetary',
      monetaryValueAnnualPaise: 0,
      displayAmount: '₹5,00,000 / year cashless health cover',
      frequency: 'Coverage',
      nonMonetaryDescription: 'Free cashless inpatient care across 27,000+ empaneled public & private hospitals nationwide'
    },
    requiredDocumentIds: ['aadhaar', 'ration_card'],
    rules: {
      id: 'rule_ayushman',
      all: [
        { field: 'annualFamilyIncome', op: 'lte', max: 300000, label: 'Household income must fall under vulnerable bracket' }
      ]
    },
    applicationSteps: [
      {
        sequence: 1,
        title: 'Check SECC / Ration Card Eligibility',
        instructions: 'Search beneficiary list using mobile number or Ration card on Mera PMJAY portal.',
        portalName: 'Mera PMJAY Beneficiary Portal',
        portalUrl: 'https://beneficiary.nha.gov.in'
      },
      {
        sequence: 2,
        title: 'Instant Ayushman Golden Card Generation',
        instructions: 'Complete Aadhaar e-KYC at nearest CSC or empaneled hospital Arogya Mitra desk.',
        portalName: 'National Health Authority e-KYC',
        portalUrl: 'https://beneficiary.nha.gov.in'
      }
    ]
  },
  {
    id: 'pension_apy',
    code: 'APY',
    name: 'Atal Pension Yojana',
    shortName: 'Atal Pension Yojana',
    tagline: 'Guaranteed monthly pension (₹1,000 to ₹5,000) from age 60',
    description: 'Government-backed pension scheme aimed at unorganized sector workers with co-contribution incentives and guaranteed return on retirement.',
    category: 'Health & Social Security',
    jurisdiction: 'Central',
    ministry: 'Ministry of Finance (PFRDA)',
    officialSourceUrl: 'https://www.npscra.nsdl.co.in',
    lastVerifiedDate: '2026-02-15',
    kbVersion: 'v2026.1-PS16',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 3600000, // ₹3,000/mo guaranteed annuity ~ ₹36,000/yr post-60
      displayAmount: 'Guaranteed ₹36,000 - ₹60,000 / yr Pension',
      frequency: 'Annual'
    },
    requiredDocumentIds: ['aadhaar', 'bank_passbook'],
    rules: {
      id: 'rule_apy',
      all: [
        { field: 'age', op: 'between', min: 18, max: 40, label: 'Age must be between 18 and 40 years' },
        { field: 'employmentStatus', op: 'in', value: ['Self-Employed', 'Unemployed', 'Farmer', 'Daily Wage Worker', 'Employed'], label: 'Open to unorganized/informal workers' }
      ]
    },
    applicationSteps: [
      {
        sequence: 1,
        title: 'Submit APY Subscriber Form to Bank',
        instructions: 'Authorize auto-debit of monthly premium linked to savings bank account.',
        portalName: 'e-NPS APY Module',
        portalUrl: 'https://www.npscra.nsdl.co.in'
      },
      {
        sequence: 2,
        title: 'Receive Permanent PRAN Card',
        instructions: 'Track subscriber contribution status and download e-PRAN.',
        portalName: 'NSDL APY Dashboard',
        portalUrl: 'https://www.npscra.nsdl.co.in'
      }
    ]
  },
  {
    id: 'sukanya_samriddhi',
    code: 'SSY',
    name: 'Sukanya Samriddhi Yojana',
    shortName: 'Sukanya Samriddhi',
    tagline: 'Highest government-backed interest (8.2%) savings account for girl child',
    description: 'Small deposit scheme under Beti Bachao Beti Padhao campaign offering highest sovereign interest rate and triple tax exemption (EEE).',
    category: 'Women & Child Welfare',
    jurisdiction: 'Central',
    ministry: 'Ministry of Finance',
    officialSourceUrl: 'https://www.indiapost.gov.in',
    lastVerifiedDate: '2026-02-16',
    kbVersion: 'v2026.1-PS16',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 4000000, // Average annual compound interest accumulation bonus
      displayAmount: '8.2% Compounded Sovereign Return (EEE Tax Free)',
      frequency: 'Annual'
    },
    requiredDocumentIds: ['aadhaar', 'bank_passbook'],
    rules: {
      id: 'rule_ssy',
      all: [
        { field: 'hasGirlChildUnder10', op: 'eq', value: true, label: 'Must have biological/adopted girl child below 10 years' }
      ]
    },
    applicationSteps: [
      {
        sequence: 1,
        title: 'Open Account at Post Office / Bank',
        instructions: 'Submit girl child birth certificate and parents identity proof at nearest Post Office or authorized bank.',
        portalName: 'India Post Savings Bank',
        portalUrl: 'https://www.indiapost.gov.in'
      }
    ]
  },
  {
    id: 'pm_awas_gramin',
    code: 'PMAY-G',
    name: 'Pradhan Mantri Awas Yojana (Gramin)',
    shortName: 'PM Awas Yojana (Gramin)',
    tagline: '₹1,20,000 direct financial grant for construction of pucca house',
    description: 'Flagship mission to provide pucca houses with basic amenities to all houseless households and those living in kutcha and dilapidated houses in rural areas.',
    category: 'Housing & Living',
    jurisdiction: 'Central',
    ministry: 'Ministry of Rural Development',
    officialSourceUrl: 'https://pmayg.nic.in',
    lastVerifiedDate: '2026-02-13',
    kbVersion: 'v2026.1-PS16',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 12000000, // ₹1,20,000 grant
      displayAmount: '₹1,20,000 Direct Pucca House Grant',
      frequency: 'One-Time'
    },
    requiredDocumentIds: ['aadhaar', 'bank_passbook', 'ration_card', 'income_certificate'],
    rules: {
      id: 'rule_pmayg',
      all: [
        { field: 'areaType', op: 'eq', value: 'Rural', label: 'Must reside in designated rural village/panchayat' },
        { field: 'annualFamilyIncome', op: 'lte', max: 200000, label: 'Economically weaker household without pucca house' }
      ]
    },
    applicationSteps: [
      {
        sequence: 1,
        title: 'Gram Panchayat Beneficiary Inscription',
        instructions: 'Verify household name in PMAY-G Awaas+ waitlist verified by Gram Sabha.',
        portalName: 'PMAY-G AwaasSoft',
        portalUrl: 'https://pmayg.nic.in'
      },
      {
        sequence: 2,
        title: 'Geo-tagged Milestone Installments',
        instructions: 'Receive installments directly into Aadhaar-seeded bank account upon geo-tagged foundation and lintel verification.',
        portalName: 'AwaasApp Verification Desk',
        portalUrl: 'https://pmayg.nic.in'
      }
    ]
  },
  {
    id: 'national_apprenticeship',
    code: 'NAPS',
    name: 'National Apprenticeship Promotion Scheme',
    shortName: 'NAPS Apprenticeship',
    tagline: 'Government stipend sharing of 25% up to ₹1,500/month with industry placement',
    description: 'Promotes apprenticeship training and incentivizes employers to engage apprentices with financial stipend reimbursement from the government.',
    category: 'Education & Skill',
    jurisdiction: 'Central',
    ministry: 'Ministry of Skill Development and Entrepreneurship',
    officialSourceUrl: 'https://www.apprenticeshipindia.gov.in',
    lastVerifiedDate: '2026-02-15',
    kbVersion: 'v2026.1-PS16',
    benefit: {
      type: 'Monetary',
      monetaryValueAnnualPaise: 1800000, // ₹1,500/mo stipend contribution ~ ₹18,000/yr
      displayAmount: '₹18,000 / year Stipend Sharing + Certification',
      frequency: 'Annual'
    },
    requiredDocumentIds: ['aadhaar', 'bank_passbook', 'student_id_bonafide'],
    rules: {
      id: 'rule_naps',
      all: [
        { field: 'age', op: 'between', min: 16, max: 35, label: 'Age between 16 and 35 years' },
        { field: 'pursuingApprenticeship', op: 'eq', value: true, label: 'Interested in or actively pursuing vocational/industry apprenticeship' }
      ]
    },
    applicationSteps: [
      {
        sequence: 1,
        title: 'Register on Apprenticeship India Portal',
        instructions: 'Create candidate profile and upload 10th/12th/ITI/Diploma certificate.',
        portalName: 'Apprenticeship India Portal',
        portalUrl: 'https://www.apprenticeshipindia.gov.in'
      },
      {
        sequence: 2,
        title: 'Apply to Notified Industry Opportunities',
        instructions: 'Sign apprenticeship contract with approved establishment.',
        portalName: 'MSDE Apprenticeship Gateway',
        portalUrl: 'https://www.apprenticeshipindia.gov.in'
      }
    ]
  },
  {
    id: 'deendayal_upadhyaya_gky',
    code: 'DDU-GKY',
    name: 'Deen Dayal Upadhyaya Grameen Kaushalya Yojana',
    shortName: 'DDU-GKY Skill Training',
    tagline: '100% free residential skill training course + assured placement for rural youth',
    description: 'Demand-driven placement-linked skill training initiative for rural poor youth (ages 15-35) with guaranteed minimum 70% placement.',
    category: 'Education & Skill',
    jurisdiction: 'Central',
    ministry: 'Ministry of Rural Development',
    officialSourceUrl: 'https://ddugky.gov.in',
    lastVerifiedDate: '2026-02-14',
    kbVersion: 'v2026.1-PS16',
    benefit: {
      type: 'Hybrid',
      monetaryValueAnnualPaise: 3000000, // Residential training value + uniform + post-placement stipend ~ ₹30,000
      displayAmount: '₹30,000 Free Residential Training + Job Placement',
      frequency: 'One-Time',
      nonMonetaryDescription: 'Free boarding, lodging, uniform, tablet computers, and NCVT recognized skilling'
    },
    requiredDocumentIds: ['aadhaar', 'bank_passbook', 'ration_card', 'income_certificate'],
    rules: {
      id: 'rule_ddugky',
      all: [
        { field: 'age', op: 'between', min: 15, max: 35, label: 'Age must be between 15 and 35 years' },
        { field: 'areaType', op: 'eq', value: 'Rural', label: 'Candidate must belong to rural household' },
        { field: 'annualFamilyIncome', op: 'lte', max: 200000, label: 'Family belongs to rural poor / BPL category' }
      ]
    },
    applicationSteps: [
      {
        sequence: 1,
        title: 'Skill Registration at Kaushal Panjee',
        instructions: 'Register on Kaushal Panjee or visit local Project Implementing Agency (PIA) center.',
        portalName: 'Kaushal Panjee Portal',
        portalUrl: 'https://kaushalpanjee.nic.in'
      },
      {
        sequence: 2,
        title: 'Counseling and Batch Admission',
        instructions: 'Enroll in residential course (Hospitality, IT-ITes, Healthcare, Retail) with zero fees.',
        portalName: 'DDU-GKY Center',
        portalUrl: 'https://ddugky.gov.in'
      }
    ]
  },
  ...ADDITIONAL_SCHEMES,
  ...MAHARASHTRA_STUDENT_SCHEMES
];

// This is deliberately labelled as a planning window. It is not presented as
// an official government deadline until an admin verifies and replaces it.
export const MASTER_SCHEMES: Scheme[] = CURATED_SCHEMES.map((scheme) => ({
  ...scheme,
  applicationDeadline: scheme.applicationDeadline ?? '2026-12-31',
  validityNote: scheme.validityNote ?? 'Statutory planning window — verify current academic term and intake notifications on the official portal before filing.'
}));
