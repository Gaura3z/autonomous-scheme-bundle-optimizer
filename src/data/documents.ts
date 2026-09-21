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
  },
  educational_marksheet: {
    id: 'educational_marksheet',
    name: 'Previous Year Marksheet (10th / 12th / Degree)',
    category: 'Education',
    issuingAuthority: 'State Education Board / University / Examination Authority',
    description: 'Official marks memo verifying passing grade, percentage, and minimum qualification criteria.',
    typicalProcessingDays: 0,
    isImmediateDigital: true,
    prerequisites: [],
    applicationPortal: 'https://digilocker.gov.in'
  },
  caste_validity: {
    id: 'caste_validity',
    name: 'Caste Validity Certificate',
    category: 'Caste & Category',
    issuingAuthority: 'Divisional Caste Scrutiny Committee (Social Welfare Dept / BARTI / TRTI)',
    description: 'Mandatory statutory scrutiny verification certificate confirming genuine caste claim for professional admissions and scholarships in Maharashtra.',
    typicalProcessingDays: 21,
    isImmediateDigital: false,
    prerequisites: ['aadhaar', 'caste_certificate', 'leaving_certificate'],
    applicationPortal: 'https://barti.maharashtra.gov.in'
  },
  non_creamy_layer: {
    id: 'non_creamy_layer',
    name: 'Non-Creamy Layer Certificate (NCL)',
    category: 'Caste & Category',
    issuingAuthority: 'Sub-Divisional Officer (SDO) / Tahsildar / Revenue Department',
    description: 'Mandatory statutory certificate for OBC/VJNT/SBC students confirming family income does not exceed ₹8.0 Lakhs in preceding 3 financial years.',
    typicalProcessingDays: 7,
    isImmediateDigital: false,
    prerequisites: ['aadhaar', 'income_certificate', 'caste_certificate'],
    applicationPortal: 'https://aaplesarkar.maharashtra.gov.in'
  },
  cap_allotment_letter: {
    id: 'cap_allotment_letter',
    name: 'CAP Round Admission Allotment Letter',
    category: 'Education',
    issuingAuthority: 'State Common Entrance Test Cell (CET Cell) / Directorate of Technical Education',
    description: 'Official Centralized Admission Process (CAP) allotment receipt proving merit-based admission into government/aided/un-aided college.',
    typicalProcessingDays: 0,
    isImmediateDigital: true,
    prerequisites: ['educational_marksheet'],
    applicationPortal: 'https://cetcell.mahacet.org'
  },
  hostel_certificate: {
    id: 'hostel_certificate',
    name: 'Hostel Warden Certificate / Rent Agreement',
    category: 'Education',
    issuingAuthority: 'College Hostel Rector / Registered Landlord & Notary',
    description: 'Proof of residential stay in college hostel or private rented accommodation away from native district (for Swadhar and Panjabrao Deshmukh hostel allowances).',
    typicalProcessingDays: 2,
    isImmediateDigital: false,
    prerequisites: ['student_id_bonafide'],
    applicationPortal: 'https://mahadbt.maharashtra.gov.in'
  },
  alpabhudharak_certificate: {
    id: 'alpabhudharak_certificate',
    name: 'Marginal Farmer Certificate (Alpabhudharak Dakhla)',
    category: 'Livelihood & Land',
    issuingAuthority: 'Talathi / Tahsildar Office',
    description: 'Official revenue document verifying parents hold small/marginal agricultural land (under 2 hectares) for Dr. Panjabrao Deshmukh hostel allowance.',
    typicalProcessingDays: 5,
    isImmediateDigital: false,
    prerequisites: ['aadhaar', 'land_records_7_12'],
    applicationPortal: 'https://aaplesarkar.maharashtra.gov.in'
  },
  fee_receipt: {
    id: 'fee_receipt',
    name: 'College Fee Receipt (Current Academic Year)',
    category: 'Education',
    issuingAuthority: 'College Accounts / Cashier Section',
    description: 'Paid receipt specifying tuition fee, library fee, gymkhana fee, and development charges breakdown.',
    typicalProcessingDays: 1,
    isImmediateDigital: true,
    prerequisites: ['student_id_bonafide'],
    applicationPortal: 'https://mahadbt.maharashtra.gov.in'
  },
  leaving_certificate: {
    id: 'leaving_certificate',
    name: 'School / College Leaving Certificate (TC / LC)',
    category: 'Education',
    issuingAuthority: 'Headmaster / College Principal',
    description: 'Transfer / Leaving certificate noting date of birth, mother tongue, religion, and caste entry.',
    typicalProcessingDays: 1,
    isImmediateDigital: false,
    prerequisites: [],
    applicationPortal: 'https://digilocker.gov.in'
  },
  mahadbt_registration: {
    id: 'mahadbt_registration',
    name: 'Aaple Sarkar MahaDBT Registered Profile',
    category: 'Identity',
    issuingAuthority: 'Maharashtra Information Technology Corporation (MahaIT)',
    description: 'Verified student Aadhaar-authenticated user profile on Government of Maharashtra MahaDBT Portal.',
    typicalProcessingDays: 1,
    isImmediateDigital: true,
    prerequisites: ['aadhaar', 'bank_passbook'],
    applicationPortal: 'https://mahadbt.maharashtra.gov.in'
  },
  iti_admission_receipt: {
    id: 'iti_admission_receipt',
    name: 'Government ITI Admission & Enrollment Receipt',
    category: 'Education',
    issuingAuthority: 'Government Industrial Training Institute (DVET Maharashtra)',
    description: 'Valid enrollment letter or fee receipt in a Government ITI under the Craftsman Training Scheme.',
    typicalProcessingDays: 1,
    isImmediateDigital: true,
    prerequisites: ['student_id_bonafide'],
    applicationPortal: 'https://admission.dvet.gov.in'
  },
  upsc_mpsc_admit_card_proof: {
    id: 'upsc_mpsc_admit_card_proof',
    name: 'UPSC / MPSC Stage Clearance Proof (Scorecard / Admit Card)',
    category: 'Education',
    issuingAuthority: 'Union Public Service Commission (UPSC) / MPSC',
    description: 'Official roll number, scorecard or interview call letter confirming passing of Prelims / Mains / Interview stage.',
    typicalProcessingDays: 0,
    isImmediateDigital: true,
    prerequisites: [],
    applicationPortal: 'https://mpsc.gov.in'
  },
  freedom_fighter_certificate: {
    id: 'freedom_fighter_certificate',
    name: 'Freedom Fighter Dependent Certificate',
    category: 'Identity',
    issuingAuthority: 'District Collectorate / General Administration Dept (GoM)',
    description: 'Sanad / Official recognition certificate of freedom fighter along with relationship declaration certificate.',
    typicalProcessingDays: 15,
    isImmediateDigital: false,
    prerequisites: ['aadhaar', 'domicile_certificate'],
    applicationPortal: 'https://aaplesarkar.maharashtra.gov.in'
  },
  attendance_undertaking: {
    id: 'attendance_undertaking',
    name: 'Student Attendance & Family Beneficiary Undertaking',
    category: 'Education',
    issuingAuthority: 'Self-Declaration / Verified by College Principal',
    description: 'Signed affidavit confirming attendance criteria (≥50% for colleges, ≥80% for ITI) and compliance with maximum 2 siblings rule.',
    typicalProcessingDays: 1,
    isImmediateDigital: true,
    prerequisites: ['student_id_bonafide'],
    applicationPortal: 'https://mahadbt.maharashtra.gov.in'
  }
};
