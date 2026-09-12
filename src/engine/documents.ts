/**
 * Document Readiness & Prerequisite Dependency Engine
 * Distinguishes "Ready to Pursue" from "Eligible, Document Missing"
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 */
import { Scheme, DocumentReadiness, DocumentInfo } from '../types';
import { MASTER_DOCUMENTS } from '../data/documents';

export interface DocumentRequest {
  document: DocumentInfo;
  requiredBy: Scheme[];
  isDeclared: boolean;
  missingForSchemeIds: string[];
  priority: number;
}

/** Plans only the documents required by the current scheme set, deduplicated
 * and ranked by the number of candidate schemes they can unlock. */
export function planDocumentRequests(schemes: Scheme[], declaredDocumentIds: string[]): DocumentRequest[] {
  const declared = new Set(declaredDocumentIds);
  const byDocument = new Map<string, Scheme[]>();
  schemes.forEach((scheme) => scheme.requiredDocumentIds.forEach((documentId) => {
    const requiredBy = byDocument.get(documentId) ?? [];
    if (!requiredBy.some((item) => item.id === scheme.id)) requiredBy.push(scheme);
    byDocument.set(documentId, requiredBy);
  }));
  return Array.from(byDocument.entries()).map(([documentId, requiredBy]) => ({
    document: MASTER_DOCUMENTS[documentId] ?? {
      id: documentId, name: documentId, category: 'Identity', issuingAuthority: 'Government Authority', description: 'Required official proof.', typicalProcessingDays: 7, isImmediateDigital: false, prerequisites: []
    },
    requiredBy,
    isDeclared: declared.has(documentId),
    missingForSchemeIds: requiredBy.filter((scheme) => !declared.has(documentId)).map((scheme) => scheme.id),
    priority: requiredBy.length
  })).sort((left, right) => right.priority - left.priority || left.document.name.localeCompare(right.document.name));
}

export function evaluateDocumentReadiness(
  schemes: Scheme[],
  declaredDocumentIds: string[]
): DocumentReadiness {
  const declaredSet = new Set(declaredDocumentIds);
  const requiredSet = new Set<string>();

  for (const s of schemes) {
    for (const docId of s.requiredDocumentIds) {
      requiredSet.add(docId);
    }
  }

  const requiredDocumentIds = Array.from(requiredSet);
  const missingDocumentIds = requiredDocumentIds.filter(id => !declaredSet.has(id));

  const readySchemes: Scheme[] = [];
  const documentMissingSchemes: { scheme: Scheme; missingDocuments: DocumentInfo[] }[] = [];

  for (const scheme of schemes) {
    const missingForScheme = scheme.requiredDocumentIds.filter(id => !declaredSet.has(id));
    if (missingForScheme.length === 0) {
      readySchemes.push(scheme);
    } else {
      const missingDocObjs = missingForScheme
        .map(id => MASTER_DOCUMENTS[id])
        .filter((d): d is DocumentInfo => Boolean(d));

      documentMissingSchemes.push({
        scheme,
        missingDocuments: missingDocObjs
      });
    }
  }

  return {
    requiredDocumentIds,
    declaredDocumentIds,
    missingDocumentIds,
    readySchemes,
    documentMissingSchemes
  };
}

export interface DocumentDependencyNode {
  document: DocumentInfo;
  prerequisites: DocumentInfo[];
  isAvailable: boolean;
  missingPrerequisites: DocumentInfo[];
  impactedSchemes: Scheme[];
}

export function getDocumentDependencyGraph(
  missingDocIds: string[],
  declaredDocIds: string[],
  bundleSchemes: Scheme[]
): DocumentDependencyNode[] {
  const declaredSet = new Set(declaredDocIds);

  return missingDocIds.map(docId => {
    const doc = MASTER_DOCUMENTS[docId] || {
      id: docId,
      name: docId,
      category: 'Identity',
      issuingAuthority: 'Government Authority',
      description: 'Required official proof.',
      typicalProcessingDays: 7,
      isImmediateDigital: false,
      prerequisites: []
    };

    const prereqDocs = doc.prerequisites
      .map(pId => MASTER_DOCUMENTS[pId])
      .filter((d): d is DocumentInfo => Boolean(d));

    const missingPrereqs = prereqDocs.filter(p => !declaredSet.has(p.id));

    const impactedSchemes = bundleSchemes.filter(s =>
      s.requiredDocumentIds.includes(docId)
    );

    return {
      document: doc,
      prerequisites: prereqDocs,
      isAvailable: declaredSet.has(docId),
      missingPrerequisites: missingPrereqs,
      impactedSchemes
    };
  });
}

export function buildDocumentDependencyGraph(
  bundleSchemes: Scheme[],
  declaredDocIds: string[]
): DocumentDependencyNode[] {
  const readiness = evaluateDocumentReadiness(bundleSchemes, declaredDocIds);
  return getDocumentDependencyGraph(readiness.missingDocumentIds, declaredDocIds, bundleSchemes);
}
