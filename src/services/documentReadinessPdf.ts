import { PDFDocument, PDFFont, PDFPage, rgb, StandardFonts } from 'pdf-lib';
import { DocumentReadiness } from '../types';

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const MARGIN = 44;
const TEXT_WIDTH = PAGE_WIDTH - MARGIN * 2;

function pdfText(value: string): string {
  return value
    .replace(/₹/g, 'Rs ')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[^\x20-\x7E\n]/g, '');
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = pdfText(text).split(/\s+/).filter(Boolean);
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

export async function createDocumentReadinessPdf(readiness: DocumentReadiness): Promise<Uint8Array> {
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
    if (y - height < MARGIN) addPage();
  };

  const write = (
    text: string,
    options: { size?: number; font?: PDFFont; color?: ReturnType<typeof rgb>; gap?: number; indent?: number } = {}
  ) => {
    const size = options.size ?? 10;
    const font = options.font ?? regular;
    const gap = options.gap ?? 4;
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
      color: rgb(0.78, 0.82, 0.87)
    });
    y -= 12;
  };

  page.drawText('AUTONOMOUS SCHEME-BUNDLE OPTIMIZER (PS16)', {
    x: MARGIN,
    y,
    size: 9,
    font: bold,
    color: rgb(0.06, 0.22, 0.48)
  });
  y -= 18;
  write('Document Readiness Assessment', { size: 20, font: bold, color: rgb(0.04, 0.10, 0.20), gap: 3 });
  write(`Generated: ${new Date().toLocaleDateString('en-IN')}`, { size: 9, color: rgb(0.35, 0.40, 0.48), gap: 10 });
  divider();

  const readySchemes = readiness.readySchemes ?? [];
  const documentMissingSchemes = readiness.documentMissingSchemes ?? (readiness as any).blockedSchemes ?? [];

  write(
    `Summary: ${readySchemes.length} scheme(s) ready to pursue and ${documentMissingSchemes.length} scheme(s) eligible but waiting for documents. Missing documents are readiness gaps, not eligibility rejections.`,
    { size: 10, font: bold, color: rgb(0.08, 0.25, 0.18), gap: 12 }
  );

  write(`READY TO PURSUE (${readySchemes.length} scheme(s))`, {
    size: 13,
    font: bold,
    color: rgb(0.04, 0.38, 0.22),
    gap: 6
  });
  if (readySchemes.length === 0) {
    write('No schemes currently have all required documents available.', { size: 10, color: rgb(0.35, 0.40, 0.48), gap: 8 });
  } else {
    for (const scheme of readySchemes) {
      write(`${scheme.name} - ${scheme.benefit?.displayAmount || 'Government Grant'}`, { size: 11, font: bold, indent: 8, gap: 2 });
      write(`Category: ${scheme.category}. Official portal: ${scheme.officialSourceUrl}`, { size: 9, indent: 20, color: rgb(0.28, 0.33, 0.40), gap: 8 });
    }
  }

  divider();
  write(`ELIGIBLE, BUT DOCUMENT MISSING (${documentMissingSchemes.length} scheme(s))`, {
    size: 13,
    font: bold,
    color: rgb(0.55, 0.32, 0.03),
    gap: 6
  });
  if (documentMissingSchemes.length === 0) {
    write('All required documents are available for the current bundle.', { size: 10, color: rgb(0.12, 0.38, 0.24), gap: 8 });
  } else {
    for (const item of documentMissingSchemes) {
      const scheme = item.scheme;
      const missingDocs = item.missingDocuments ?? [];
      const docNames = missingDocs.map((document: any) => document?.name || String(document)).join(', ') || 'Pending certificates';
      write(`${scheme.name} - ${scheme.benefit?.displayAmount || 'Government Grant'}`, { size: 11, font: bold, indent: 8, gap: 2 });
      write(`Missing documents: ${docNames}`, {
        size: 9,
        indent: 20,
        color: rgb(0.48, 0.29, 0.03),
        gap: 2
      });
      write(`Official portal: ${scheme.officialSourceUrl}`, { size: 9, indent: 20, color: rgb(0.28, 0.33, 0.40), gap: 8 });
    }
  }

  for (let index = 0; index < pages.length; index += 1) {
    const footerPage = pages[index];
    footerPage.drawText(`PS16 Document Readiness Assessment  |  Page ${index + 1}`, {
      x: MARGIN,
      y: 22,
      size: 8,
      font: regular,
      color: rgb(0.42, 0.46, 0.52)
    });
  }

  return pdf.save();
}
