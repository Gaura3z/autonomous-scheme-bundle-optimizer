/**
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 * Demonstration Documents Inventory & Dependency Graph
 * Clean separation of identity, income, education, residence, agriculture, and banking.
 */
import { DemoDocument, Dependency } from '../types/assessment';

export const DEMO_DOCUMENTS: DemoDocument[] = [
  {
    id: 'aadhaar',
    name: 'Aadhaar Card (UIDAI)',
    group: 'Identity',
    description: '12-digit individual biometric identity number with mobile linkage.',
    issuingAuthority: 'Unique Identification Authority of India (UIDAI)',
    typicalProcessingDays: 0,
    isImmediateDigital: true,
    prerequisites: [],
    relevantSchemeIds: ['pm_kisan', 'pmfby', 'kcc', 'post_matric_scholarship', 'naps_apprenticeship', 'state_merit_scholarship', 'pm_svanidhi', 'standup_india', 'pm_mudra_kishore', 'pmjay', 'pm_suraksha_bima', 'pm_jeevan_jyoti', 'ssy', 'pmay_g'],
    portalUrl: 'https://myaadhaar.uidai.gov.in (Official Portal Placeholder)'
  },
  {
    id: 'bank_passbook',
    name: 'Bank Passbook / Aadhaar-Seeded Account',
    group: 'Banking',
    description: 'Bank passbook front page with IFSC, Account number, and active NPCI Direct Benefit Transfer (DBT) mandate.',
    issuingAuthority: 'Scheduled Commercial / Regional Rural Bank',
    typicalProcessingDays: 2,
    isImmediateDigital: false,
    prerequisites: ['aadhaar'],
    relevantSchemeIds: ['pm_kisan', 'kcc', 'post_matric_scholarship', 'naps_apprenticeship', 'pm_svanidhi', 'pm_suraksha_bima', 'pm_jeevan_jyoti', 'pmay_g'],
    portalUrl: 'https://www.npci.org.in (Official Portal Placeholder)'
  },
  {
    id: 'income_certificate',
    name: 'Annual Income Certificate',
    group: 'Income',
    description: 'Official revenue certificate certifying total annual family income, issued within the last 12 months.',
    issuingAuthority: 'Revenue Department / Tahsildar / Sub-Divisional Magistrate',
    typicalProcessingDays: 7,
    isImmediateDigital: false,
    prerequisites: ['aadhaar', 'ration_card'],
    relevantSchemeIds: ['post_matric_scholarship', 'state_merit_scholarship'],
    portalUrl: 'https://serviceonline.gov.in (Official Portal Placeholder)'
  },
  {
    id: 'ration_card',
    name: 'Ration Card (NFSA / BPL / PHH)',
    group: 'Income',
    description: 'National Food Security Act card categorizing the family economic tier (BPL/AAY/PHH).',
    issuingAuthority: 'Department of Food, Civil Supplies & Consumer Protection',
    typicalProcessingDays: 14,
    isImmediateDigital: false,
    prerequisites: ['aadhaar'],
    relevantSchemeIds: ['pmjay', 'pmay_g', 'income_certificate'],
    portalUrl: 'https://nfsa.gov.in (Official Portal Placeholder)'
  },
  {
    id: 'caste_certificate',
    name: 'Caste / Social Category Certificate',
    group: 'Identity',
    description: 'Valid non-creamy layer (OBC) or SC/ST certificate establishing social reservation entitlement.',
    issuingAuthority: 'Revenue Division / Sub-Divisional Officer (SDO)',
    typicalProcessingDays: 10,
    isImmediateDigital: false,
    prerequisites: ['aadhaar', 'domicile_certificate'],
    relevantSchemeIds: ['post_matric_scholarship', 'standup_india'],
    portalUrl: 'https://serviceonline.gov.in (Official Portal Placeholder)'
  },
  {
    id: 'domicile_certificate',
    name: 'State Domicile / Residence Proof',
    group: 'Residence',
    description: 'Statutory certificate validating resident status in the respective state for 10+ years.',
    issuingAuthority: 'District Magistrate / Tehsildar',
    typicalProcessingDays: 7,
    isImmediateDigital: false,
    prerequisites: ['aadhaar'],
    relevantSchemeIds: ['state_merit_scholarship', 'caste_certificate'],
    portalUrl: 'https://serviceonline.gov.in (Official Portal Placeholder)'
  },
  {
    id: 'student_id_bonafide',
    name: 'College Bonafide Student Certificate',
    group: 'Education',
    description: 'Current academic year bonafide certificate issued by accredited college principal or registrar.',
    issuingAuthority: 'Academic Institution / University Registrar',
    typicalProcessingDays: 2,
    isImmediateDigital: false,
    prerequisites: ['aadhaar'],
    relevantSchemeIds: ['post_matric_scholarship', 'state_merit_scholarship'],
    portalUrl: 'Issued by college administration office'
  },
  {
    id: 'educational_marksheet',
    name: '10th / 12th / Degree Marksheet',
    group: 'Education',
    description: 'Certified mark sheet establishing minimum educational eligibility.',
    issuingAuthority: 'State Education Board / University',
    typicalProcessingDays: 0,
    isImmediateDigital: true,
    prerequisites: [],
    relevantSchemeIds: ['naps_apprenticeship', 'post_matric_scholarship'],
    portalUrl: 'https://digilocker.gov.in (DigiLocker Verified)'
  },
  {
    id: 'land_records_7_12',
    name: 'Agricultural Land Title (7/12 RoR / Khatian)',
    group: 'Agriculture',
    description: 'Certified Record of Rights extract evidencing cultivable land parcel ownership.',
    issuingAuthority: 'State Land Records Department / e-Bhoomi Portal',
    typicalProcessingDays: 1,
    isImmediateDigital: true,
    prerequisites: ['aadhaar'],
    relevantSchemeIds: ['pm_kisan', 'pmfby', 'kcc', 'pmay_g'],
    portalUrl: 'https://anyror.gujarat.gov.in or https://bhulekh.gov.in'
  },
  {
    id: 'sowing_certificate',
    name: 'Crop Sowing Certificate (Girdawari)',
    group: 'Agriculture',
    description: 'Village Patwari / Talathi certification of notified crops sown in the active agricultural season.',
    issuingAuthority: 'Village Revenue Officer (Talathi / Patwari)',
    typicalProcessingDays: 3,
    isImmediateDigital: false,
    prerequisites: ['land_records_7_12'],
    relevantSchemeIds: ['pmfby'],
    portalUrl: 'Local Gram Panchayat / Tehsil Office'
  },
  {
    id: 'udyam_msme_registration',
    name: 'Udyam MSME Registration Certificate',
    group: 'Banking',
    description: 'Self-declared zero-cost digital registration certificate for Micro, Small & Medium Enterprises.',
    issuingAuthority: 'Ministry of MSME, Government of India',
    typicalProcessingDays: 1,
    isImmediateDigital: true,
    prerequisites: ['aadhaar', 'bank_passbook'],
    relevantSchemeIds: ['standup_india', 'pm_mudra_kishore'],
    portalUrl: 'https://udyamregistration.gov.in (Official Portal Placeholder)'
  },
  {
    id: 'child_birth_certificate',
    name: 'Child Official Birth Certificate',
    group: 'Identity',
    description: 'Statutory birth registration certificate validating child identity and date of birth.',
    issuingAuthority: 'Municipal Corporation / Registrar of Births & Deaths',
    typicalProcessingDays: 3,
    isImmediateDigital: false,
    prerequisites: ['aadhaar'],
    relevantSchemeIds: ['ssy'],
    portalUrl: 'https://crsorgi.gov.in (Civil Registration System)'
  },
  {
    id: 'vending_certificate_or_lor',
    name: 'Street Vending Certificate / Letter of Recommendation',
    group: 'Identity',
    description: 'Urban Local Body (ULB) vending identity card or Town Vending Committee (TVC) Letter of Recommendation.',
    issuingAuthority: 'Municipal Corporation / Town Vending Committee (TVC)',
    typicalProcessingDays: 7,
    isImmediateDigital: false,
    prerequisites: ['aadhaar'],
    relevantSchemeIds: ['pm_svanidhi'],
    portalUrl: 'Local Urban Local Body / Municipal Ward Office'
  }
];

export const DEMO_DEPENDENCIES: Dependency[] = [
  {
    from: 'aadhaar',
    to: 'bank_passbook',
    fromName: 'Aadhaar Card (UIDAI)',
    toName: 'Bank Passbook / Aadhaar-Seeded Account',
    note: 'Mandatory Aadhaar KYC is statutory prerequisite for opening or seeding a DBT bank account.',
    relevantSchemeId: 'all',
    relevantSchemeName: 'All Direct Benefit Transfer Schemes'
  },
  {
    from: 'aadhaar',
    to: 'ration_card',
    fromName: 'Aadhaar Card (UIDAI)',
    toName: 'Ration Card (NFSA / BPL / PHH)',
    note: 'All family members listed in the NFSA ration card database must have authenticated Aadhaar seeds.',
    relevantSchemeId: 'pmjay',
    relevantSchemeName: 'Ayushman Bharat PM-JAY & Food Security'
  },
  {
    from: 'ration_card',
    to: 'income_certificate',
    fromName: 'Ration Card (NFSA / BPL / PHH)',
    toName: 'Annual Income Certificate',
    note: 'The Sub-Divisional Revenue Officer inspects the active Ration Card tier during income inquiries.',
    relevantSchemeId: 'post_matric_scholarship',
    relevantSchemeName: 'Post-Matric Scholarship'
  },
  {
    from: 'domicile_certificate',
    to: 'caste_certificate',
    fromName: 'State Domicile / Residence Proof',
    toName: 'Caste / Social Category Certificate',
    note: 'Caste validation requires proof of ancestral residence in the state prior to the presidential order cut-off year.',
    relevantSchemeId: 'post_matric_scholarship',
    relevantSchemeName: 'Post-Matric Scholarship & Stand-Up India'
  },
  {
    from: 'land_records_7_12',
    to: 'sowing_certificate',
    fromName: 'Agricultural Land Title (7/12 RoR)',
    toName: 'Crop Sowing Certificate (Girdawari)',
    note: 'Village Patwari must physically inspect the survey parcel recorded on the 7/12 extract before issuing crop sowing proof.',
    relevantSchemeId: 'pmfby',
    relevantSchemeName: 'PM Fasal Bima Yojana'
  }
];
