/**
 * Sequenced Application Roadmap Engine
 * Topological ordering of prerequisite documents, missing certificates, and scheme applications.
 * Kurukshetra 2.0 HACKFEST 2026 PS16
 */
import { Scheme, DocumentReadiness, RoadmapStep } from '../types';
import { MASTER_DOCUMENTS } from '../data/documents';
import { evaluateDocumentReadiness } from './documents';

export function generateApplicationRoadmap(
  readinessOrSchemes: DocumentReadiness | Scheme[],
  schemesOrDeclaredDocs?: Scheme[] | string[]
): RoadmapStep[] {
  let readiness: DocumentReadiness;
  let bundleSchemes: Scheme[];

  if (Array.isArray(readinessOrSchemes)) {
    bundleSchemes = readinessOrSchemes;
    const declaredDocs: string[] = Array.isArray(schemesOrDeclaredDocs)
      ? schemesOrDeclaredDocs.filter((x): x is string => typeof x === 'string')
      : [];
    readiness = evaluateDocumentReadiness(bundleSchemes, declaredDocs);
  } else {
    readiness = readinessOrSchemes;
    bundleSchemes = Array.isArray(schemesOrDeclaredDocs)
      ? (schemesOrDeclaredDocs as Scheme[])
      : [];
  }

  const steps: RoadmapStep[] = [];
  let stepIndex = 1;
  const declaredSet = new Set(Array.isArray(readiness?.declaredDocumentIds) ? readiness.declaredDocumentIds : []);
  const missingDocumentIds = Array.isArray(readiness?.missingDocumentIds) ? readiness.missingDocumentIds : [];
  const readySchemes = Array.isArray(readiness?.readySchemes) ? readiness.readySchemes : [];
  const documentMissingSchemes = Array.isArray(readiness?.documentMissingSchemes) ? readiness.documentMissingSchemes : [];

  // 1. Identify any missing prerequisite documents first
  const missingPrereqsSet = new Set<string>();
  for (const missingDocId of missingDocumentIds) {
    const doc = MASTER_DOCUMENTS[missingDocId];
    if (doc) {
      for (const pId of doc.prerequisites) {
        if (!declaredSet.has(pId)) {
          missingPrereqsSet.add(pId);
        }
      }
    }
  }

  // Add Prerequisite steps
  for (const pId of missingPrereqsSet) {
    const prereqDoc = MASTER_DOCUMENTS[pId];
    if (prereqDoc) {
      steps.push({
        id: `step_prereq_${pId}`,
        stepNumber: stepIndex++,
        phase: 'Prerequisite',
        title: `Obtain Foundational Document: ${prereqDoc.name}`,
        description: `This document is required as a prerequisite before you can apply for other certificates (${prereqDoc.description}). Issuing authority: ${prereqDoc.issuingAuthority}.`,
        targetDocument: prereqDoc,
        estimatedTimeline: `${prereqDoc.typicalProcessingDays} day(s)`,
        actionUrl: prereqDoc.applicationPortal,
        isCompleted: false
      });
    }
  }

  // 2. Add Missing Document Acquisition steps
  for (const docId of missingDocumentIds) {
    if (missingPrereqsSet.has(docId)) continue; // Already added in phase 1
    const doc = MASTER_DOCUMENTS[docId];
    if (doc) {
      const impactedSchemeNames = bundleSchemes
        .filter(s => s.requiredDocumentIds.includes(docId))
        .map(s => s.shortName)
        .join(', ');

      steps.push({
        id: `step_doc_${docId}`,
        stepNumber: stepIndex++,
        phase: 'Document Acquisition',
        title: `Procure ${doc.name}`,
        description: `Apply via ${doc.issuingAuthority} (${doc.applicationPortal ? 'portal available' : 'local office'}). Unlocks application for: ${impactedSchemeNames}.`,
        targetDocument: doc,
        estimatedTimeline: `${doc.typicalProcessingDays} day(s)`,
        actionUrl: doc.applicationPortal,
        isCompleted: false,
        criticalDependency: doc.prerequisites.length > 0 
          ? `Requires: ${doc.prerequisites.map(p => MASTER_DOCUMENTS[p]?.name || p).join(' + ')}` 
          : undefined
      });
    }
  }

  // 3. Add Scheme Application steps for "Ready to Pursue" schemes
  for (const scheme of readySchemes) {
    steps.push({
      id: `step_scheme_${scheme.id}`,
      stepNumber: stepIndex++,
      phase: 'Scheme Application',
      title: `Submit Online Application for ${scheme.name}`,
      description: `All required documents are ready. File online at ${scheme.ministry} portal. ${scheme.applicationSteps[0]?.instructions || ''}`,
      targetScheme: scheme,
      applicationDeadline: scheme.applicationDeadline,
      validityNote: scheme.validityNote,
      estimatedTimeline: 'Immediate (All documents ready)',
      actionUrl: scheme.officialSourceUrl,
      isCompleted: false
    });
  }

  // 4. Add Scheme Application steps for schemes with missing documents (deferred)
  for (const item of documentMissingSchemes) {
    const missingNames = item.missingDocuments.map(d => d.name).join(', ');
    steps.push({
      id: `step_scheme_deferred_${item.scheme.id}`,
      stepNumber: stepIndex++,
      phase: 'Scheme Application',
      title: `Submit Application for ${item.scheme.name}`,
      description: `Eligible! Complete submission once ${missingNames} is issued. Benefit: ${item.scheme.benefit.displayAmount}.`,
      targetScheme: item.scheme,
      applicationDeadline: item.scheme.applicationDeadline,
      validityNote: item.scheme.validityNote,
      estimatedTimeline: 'After document issuance',
      actionUrl: item.scheme.officialSourceUrl,
      isCompleted: false,
      criticalDependency: `Waiting on: ${missingNames}`
    });
  }

  return steps;
}
