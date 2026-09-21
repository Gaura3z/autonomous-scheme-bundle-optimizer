import { PDFDocument, PDFFont, PDFPage, rgb, StandardFonts } from 'pdf-lib';
import { CitizenProfile, OptimizedBundle, RoadmapStep } from '../types';

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const MARGIN = 44;
const TEXT_WIDTH = PAGE_WIDTH - MARGIN * 2;

function sanitizeText(value: string): string {
  if (!value) return '';
  return value
    .replace(/₹/g, 'Rs ')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[^\x20-\x7E\n]/g, '');
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const clean = sanitizeText(text);
  const words = clean.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth || !line) {
      line = candidate;
    } else {
      lines.push(line);
      line = word;
    }
  }

  if (line) lines.push(line);
  return lines.length > 0 ? lines : [''];
}

export async function createRoadmapPdfBytes(
  steps: RoadmapStep[],
  profile: CitizenProfile,
  bundle?: OptimizedBundle
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const pages: PDFPage[] = [];
  let page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  pages.push(page);
  let y = PAGE_HEIGHT - MARGIN;

  const addPage = () => {
    page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    pages.push(page);
    y = PAGE_HEIGHT - MARGIN;
  };

  const ensureSpace = (height: number) => {
    if (y - height < MARGIN + 25) addPage();
  };

  const write = (
    text: string,
    options: { size?: number; font?: PDFFont; color?: ReturnType<typeof rgb>; gap?: number; indent?: number } = {}
  ) => {
    const size = options.size ?? 9.5;
    const font = options.font ?? regular;
    const gap = options.gap ?? 3;
    const indent = options.indent ?? 0;
    const lines = wrapText(text, font, size, TEXT_WIDTH - indent);
    ensureSpace(lines.length * (size + 3) + gap);

    for (const line of lines) {
      page.drawText(line, {
        x: MARGIN + indent,
        y,
        size,
        font,
        color: options.color ?? rgb(0.12, 0.16, 0.22)
      });
      y -= size + 3;
    }
    y -= gap;
  };

  const divider = () => {
    ensureSpace(12);
    page.drawLine({
      start: { x: MARGIN, y },
      end: { x: PAGE_WIDTH - MARGIN, y },
      thickness: 0.8,
      color: rgb(0.82, 0.85, 0.90)
    });
    y -= 10;
  };

  // Header Banner
  page.drawText('GOVERNMENT SCHOLARSHIP & WELFARE ADVISORY ROADMAP', {
    x: MARGIN,
    y,
    size: 9,
    font: bold,
    color: rgb(0.06, 0.22, 0.48)
  });
  y -= 16;

  write('SchemeWise Verified Application Roadmap', { size: 18, font: bold, color: rgb(0.04, 0.10, 0.22), gap: 2 });
  write(`Generated: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}  |  Official Advisory Reference: SW-${Date.now().toString().slice(-6)}`, {
    size: 8.5,
    color: rgb(0.40, 0.45, 0.52),
    gap: 8
  });
  divider();

  // Citizen Profile Summary Box
  write('CITIZEN APPLICANT PROFILE SUMMARY', { size: 10, font: bold, color: rgb(0.15, 0.23, 0.35), gap: 4 });
  const profileDetails = [
    `Category: ${profile.socialCategory}  |  State: ${profile.state}  |  Area: ${profile.areaType}`,
    `Education: ${profile.educationLevel} (${profile.isStudent ? 'Enrolled Student' : profile.employmentStatus})  |  Age: ${profile.age} Yrs  |  Gender: ${profile.gender}`,
    `Annual Family Income: Rs ${profile.annualFamilyIncome.toLocaleString('en-IN')}${profile.hasBPLCard ? ' (BPL Card Holder)' : ''}${profile.hasCasteValidity ? '  |  Caste Validity: Verified' : ''}`
  ];
  for (const line of profileDetails) {
    write(line, { size: 9, color: rgb(0.25, 0.30, 0.38), indent: 4, gap: 2 });
  }
  y -= 4;

  if (bundle) {
    divider();
    write(`OPTIMIZED BENEFIT BUNDLE: ${bundle.selectedSchemes.length} SCHEME(S) SELECTED`, {
      size: 11,
      font: bold,
      color: rgb(0.04, 0.38, 0.22),
      gap: 3
    });
    write(`Total Estimated Annual Value: Rs ${bundle.totalMonetaryAnnual.toLocaleString('en-IN')} / year  |  Non-Monetary: ${bundle.nonMonetaryBenefits.join(', ') || 'Direct tuition credit & hosteller grants'}`, {
      size: 9,
      font: bold,
      color: rgb(0.08, 0.25, 0.18),
      gap: 6
    });

    for (const scheme of bundle.selectedSchemes) {
      write(`* ${scheme.name} (${scheme.shortName})`, { size: 9.5, font: bold, indent: 6, gap: 1 });
      write(`  Benefit: ${scheme.benefit.displayAmount}  |  Ministry/Dept: ${scheme.ministry}`, { size: 8.5, color: rgb(0.30, 0.35, 0.42), indent: 12, gap: 1 });
      write(`  Official Portal: ${scheme.officialSourceUrl}`, { size: 8, color: rgb(0.06, 0.25, 0.55), indent: 12, gap: 4 });
    }
  }

  divider();
  write(`SEQUENCED APPLICATION ACTION STEPS (${steps.length} ACTIONABLE STEPS)`, {
    size: 11,
    font: bold,
    color: rgb(0.05, 0.20, 0.45),
    gap: 6
  });

  for (const step of steps) {
    ensureSpace(50);
    const phaseColor = step.phase === 'Prerequisite' ? rgb(0.65, 0.35, 0.05) : step.phase === 'Document Acquisition' ? rgb(0.05, 0.35, 0.55) : rgb(0.05, 0.45, 0.25);
    write(`Step ${step.stepNumber}: [${step.phase}] ${step.title}`, { size: 10, font: bold, color: phaseColor, indent: 4, gap: 2 });
    write(step.description, { size: 8.5, color: rgb(0.20, 0.25, 0.32), indent: 12, gap: 2 });
    
    const metaParts = [`Timeline: ${step.estimatedTimeline}`];
    if (step.applicationDeadline) metaParts.push(`Deadline: ${step.applicationDeadline}`);
    if (step.actionUrl) metaParts.push(`Portal: ${step.actionUrl}`);
    write(metaParts.join('  |  '), { size: 8, color: rgb(0.40, 0.45, 0.52), indent: 12, gap: 5 });
  }

  // Statutory Advisory & Disclaimer Section
  divider();
  ensureSpace(80);
  write('STATUTORY ADVISORY & ELIGIBILITY DISCLAIMER (TERMS OF ADVISORY)', {
    size: 9.5,
    font: bold,
    color: rgb(0.60, 0.15, 0.15),
    gap: 4
  });
  const disclaimers = [
    '1. Algorithmic Guidance Notice: SchemeWise provides automated eligibility estimation based on published Government Resolutions (GRs), official scheme guidelines (MahaDBT, NSP, Central Ministries), and candidate self-declared data.',
    '2. No Guarantee of Sanction: Inclusion of any scheme in this roadmap does NOT constitute a legal guarantee or sanction of government financial disbursement. Final approval and fund release are strictly subject to scrutiny by College Nodal Officers, District Social Welfare Authorities, and portal verification.',
    '3. Document & Deadline Contingency: Applicants must possess authentic, certified certificates (Aadhaar, Domicile, Income, Caste Scrutiny Validity, Non-Creamy Layer) and must submit their online applications prior to notified cut-off dates.',
    '4. Dynamic Government Rules: State and Central Departments reserve the right to revise income thresholds, quota caps, and circulars without prior notice. Applicants are advised to verify details directly on the official portals linked above.'
  ];
  for (const item of disclaimers) {
    write(item, { size: 7.5, color: rgb(0.40, 0.42, 0.46), indent: 4, gap: 2 });
  }

  // Footer for each page
  for (let index = 0; index < pages.length; index += 1) {
    const footerPage = pages[index];
    footerPage.drawText(
      `SchemeWise Citizen Roadmap (PS16)  |  Confidential & Personal  |  Page ${index + 1} of ${pages.length}`,
      {
        x: MARGIN,
        y: 20,
        size: 7.5,
        font: regular,
        color: rgb(0.45, 0.50, 0.58)
      }
    );
  }

  return pdf.save();
}

export async function downloadRoadmapPdfFile(
  steps: RoadmapStep[],
  profile: CitizenProfile,
  bundle?: OptimizedBundle
): Promise<void> {
  const pdfBytes = await createRoadmapPdfBytes(steps, profile, bundle);
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `SchemeWise_Application_Roadmap_${profile.state}_${profile.socialCategory}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function downloadBundlePdfFile(
  bundle: OptimizedBundle,
  profile: CitizenProfile
): Promise<void> {
  // Convert bundle to simple roadmap steps for printing
  const steps: RoadmapStep[] = bundle.selectedSchemes.map((scheme, idx) => ({
    id: `bundle_step_${scheme.id}`,
    stepNumber: idx + 1,
    phase: 'Scheme Application',
    title: `Apply for ${scheme.name}`,
    description: `${scheme.tagline}. Verification required at ${scheme.ministry}.`,
    targetScheme: scheme,
    estimatedTimeline: '10-20 days',
    actionUrl: scheme.officialSourceUrl,
    isCompleted: false
  }));

  await downloadRoadmapPdfFile(steps, profile, bundle);
}

/**
 * Universal safe print function:
 * Attempts window.print(), and if blocked or throws an exception in iframe sandbox,
 * automatically falls back to downloading the genuine PDF without crashing.
 */
export async function safePrintOrDownloadRoadmap(
  steps: RoadmapStep[],
  profile: CitizenProfile,
  bundle?: OptimizedBundle,
  onNotify?: (message: string) => void
): Promise<void> {
  let printSucceeded = false;
  try {
    if (window && window.print) {
      window.print();
      printSucceeded = true;
    }
  } catch (err) {
    printSucceeded = false;
  }

  // Always generate and download the PDF if window.print failed or on mobile
  if (!printSucceeded || window.innerWidth < 768) {
    if (onNotify) {
      onNotify('Generating and downloading your official PDF roadmap...');
    }
    await downloadRoadmapPdfFile(steps, profile, bundle);
  }
}
