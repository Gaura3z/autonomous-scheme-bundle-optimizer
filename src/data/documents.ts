/**
 * Master Verified Document Knowledge Base & Dependency Map
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 */
import { DocumentInfo } from '../types';

export const MASTER_DOCUMENTS: Record<string, DocumentInfo> = {
  aadhaar: {
    id: 'aadhaar',
    name: 'Aadhaar Card (UIDAI)',
    category: 'Identity',
    issuingAuthority: 'Unique Identification Authority of India (UIDAI)',
    description: '12-digit individual biometric & demographic identification number.',
    typicalProcessingDays: 0,
    isImmediateDigital: true,
    prerequisites: [],
    applicationPortal: 'https://myaadhaar.uidai.gov.in'
  },
  bank_passbook: {
    id: 'bank_passbook',
    name: 'Bank Passbook / Aadhaar-Seeded Account',
    category: 'Banking & Health',
    issuingAuthority: 'Scheduled Commercial / Regional Rural Bank',
    description: 'Bank passbook front page with IFSC, Account number, and NPCI Direct Benefit Transfer (DBT) linkage active.',
    typicalProcessingDays: 2,
    isImmediateDigital: false,
    prerequisites: ['aadhaar'],
    applicationPortal: 'https://www.npci.org.in'
  },
  income_certificate: {
    id: 'income_certificate',
    name: 'Annual Income Certificate',
    category: 'Income',
    issuingAuthority: 'Revenue Department / Tahsildar / SDM',
    description: 'Official revenue certificate validating annual family income, issued within the last 12 months.',
    typicalProcessingDays: 7,
    isImmediateDigital: false,
    prerequisites: ['aadhaar', 'ration_card'],
    applicationPortal: 'https://serviceonline.gov.in'
  },
  ration_card: {
    id: 'ration_card',
    name: 'Ration Card (NFSA / BPL / PHH)',
    category: 'Income',
    issuingAuthority: 'Department of Food, Civil Supplies & Consumer Affairs',
    description: 'National Food Security Act card categorizing the family economic group (BPL/AAY/PHH).',
    typicalProcessingDays: 14,
    isImmediateDigital: false,
    prerequisites: ['aadhaar'],
    applicationPortal: 'https://nfsa.gov.in'
  },
  caste_certificate: {
    id: 'caste_certificate',
    name: 'Caste / Social Category Certificate',
    category: 'Caste & Category',
    issuingAuthority: 'Sub-Divisional Magistrate (SDM) / Revenue Division',
    description: 'Valid non-creamy layer (OBC) or SC/ST certificate establishing social category claim.',
    typicalProcessingDays: 10,
    isImmediateDigital: false,
    prerequisites: ['aadhaar', 'domicile_certificate'],
    applicationPortal: 'https://serviceonline.gov.in'
  },
  domicile_certificate: {
    id: 'domicile_certificate',
    name: 'State Domicile / Residence Certificate',
    category: 'Identity',
    issuingAuthority: 'District Magistrate / Executive Magistrate',
    description: 'Proof of permanent residency in the respective State for a minimum specified duration.',
    typicalProcessingDays: 5,
    isImmediateDigital: false,
    prerequisites: ['aadhaar'],
    applicationPortal: 'https://serviceonline.gov.in'
  },
  student_id_bonafide: {
    id: 'student_id_bonafide',
    name: 'College Bonafide Certificate & Fee Receipt',
    category: 'Education',
    issuingAuthority: 'Recognized College / University Registrar Office',
    description: 'Certificate of ongoing regular enrollment with academic course code and current semester payment receipt.',
    typicalProcessingDays: 2,
    isImmediateDigital: false,
    prerequisites: ['aadhaar'],
    applicationPortal: 'https://scholarships.gov.in'
  },
  land_records_7_12: {
    id: 'land_records_7_12',
    name: 'Land Record Extract (7/12 / RoR / Khasra)',
    category: 'Livelihood & Land',
    issuingAuthority: 'State Revenue & Land Records Portal',
    description: 'Record of Rights verifying cultivable agricultural land parcel ownership and mutation entry.',
    typicalProcessingDays: 1,
    isImmediateDigital: true,
    prerequisites: ['aadhaar'],
    applicationPortal: 'https://bhulekh.gov.in'
  },
  vending_certificate: {
    id: 'vending_certificate',
    name: 'Urban Vendor ID Card / Letter of Recommendation (LoR)',
    category: 'Livelihood & Land',
    issuingAuthority: 'Urban Local Body (Town Vending Committee / Municipality)',
    description: 'Official survey token or Certificate of Vending acknowledging stationary or mobile street vending.',
    typicalProcessingDays: 6,
    isImmediateDigital: false,
    prerequisites: ['aadhaar'],
    applicationPortal: 'https://pmsvanidhi.mohua.gov.in'
  },
  msme_udyam_registration: {
    id: 'msme_udyam_registration',
    name: 'Udyam MSME Registration Certificate',
    category: 'Livelihood & Land',
    issuingAuthority: 'Ministry of Micro, Small and Medium Enterprises',
    description: 'Self-declaration portal registration providing unique 19-digit enterprise ID for manufacturing or service enterprise.',
    typicalProcessingDays: 0,
    isImmediateDigital: true,
    prerequisites: ['aadhaar', 'bank_passbook'],
    applicationPortal: 'https://udyamregistration.gov.in'
  },
  disability_udid: {
    id: 'disability_udid',
    name: 'Unique Disability ID (UDID) Card',
    category: 'Banking & Health',
    issuingAuthority: 'District Medical Board / Dept. of Empowerment of Persons with Disabilities',
    description: 'Medical board assessment establishing 40% or higher permanent benchmark disability.',
    typicalProcessingDays: 15,
    isImmediateDigital: false,
    prerequisites: ['aadhaar'],
    applicationPortal: 'https://www.swavlambancard.gov.in'
  }
};
