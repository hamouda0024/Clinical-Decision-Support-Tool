/**
 * Technical extension contracts for content that has not arrived yet.
 *
 * These types deliberately describe *structure and governance metadata only*.
 * They define no clinical rule, threshold, priority meaning, dose, interaction
 * or population-specific guidance. All current registries are empty and every
 * capability is disabled until the reviewing physician supplies and approves
 * the content.
 */

export const CONTENT_LIFECYCLE = [
  'pending_medical_content',
  'draft',
  'in_review',
  'approved',
] as const;
export type ContentLifecycle = (typeof CONTENT_LIFECYCLE)[number];

/** Placeholder fields for a future, reviewed translation. */
export interface LocalizedClinicalText {
  ar: string;
  fr?: string;
  en?: string;
}

export interface GovernedReference {
  id: string;
  title: string;
  organization: string;
  year?: number;
  url?: string;
  section?: string;
  evidenceLevel?: string;
}

export interface ReviewAttestation {
  status: ContentLifecycle;
  contentVersion: string;
  reviewerId?: string;
  reviewerRole?: string;
  /** ISO-8601 date. Required for `approved` content. */
  reviewedAt?: string;
  /** Identifier of the signed source document, not a URL to fabricated content. */
  sourceDocumentId?: string;
  notes?: string;
}

/**
 * P1–P4 are authoring buckets only. Their clinical meaning, ordering and
 * obligations are intentionally undefined in this phase.
 */
export const ACTION_PRIORITIES = ['P1', 'P2', 'P3', 'P4'] as const;
export type ActionPriority = (typeof ACTION_PRIORITIES)[number];

export const ACTION_TYPES = [
  'diagnostic',
  'monitoring',
  'treatment',
  'referral',
  'safety',
] as const;
export type ActionType = (typeof ACTION_TYPES)[number];

export interface GovernedClinicalAction {
  id: string;
  priority: ActionPriority;
  priorityDefinition: 'pending_medical_definition';
  type: ActionType;
  title: LocalizedClinicalText;
  rationale?: LocalizedClinicalText;
  evidenceRefIds: string[];
  review: ReviewAttestation;
}

export const PATHWAY_NODE_KINDS = ['question', 'finding', 'action', 'terminal'] as const;
export type PathwayNodeKind = (typeof PATHWAY_NODE_KINDS)[number];

export interface PathwayNode {
  id: string;
  kind: PathwayNodeKind;
  nextNodeIds: string[];
}

export interface GovernedPathway {
  id: string;
  title: LocalizedClinicalText;
  contentVersion: string;
  review: ReviewAttestation;
  entryNodeId?: string;
  nodes: PathwayNode[];
  evidenceRefIds: string[];
}

/** A rule envelope; the rule parameters remain undefined until medical review. */
export interface LabInterpretationEnvelope {
  id: string;
  analyteCode: string;
  title: LocalizedClinicalText;
  review: ReviewAttestation;
  rules: {
    id: string;
    sourceRefIds: string[];
    review: ReviewAttestation;
  }[];
}

export interface MedicationSafetyEnvelope {
  id: string;
  title: LocalizedClinicalText;
  review: ReviewAttestation;
  ingredientRefIds: string[];
  safetyRuleIds: string[];
  doseRuleIds: string[];
}

export const POPULATION_IDS = [
  'paediatric',
  'pregnancy',
  'renal',
  'hepatic',
  'geriatric',
  'other',
] as const;
export type PopulationId = (typeof POPULATION_IDS)[number];

export interface PopulationPathwayEnvelope {
  id: string;
  population: PopulationId;
  title: LocalizedClinicalText;
  review: ReviewAttestation;
  pathwayId?: string;
}

export const EXPORT_FORMATS = ['pdf', 'print', 'json'] as const;
export type ExportFormat = (typeof EXPORT_FORMATS)[number];

export interface ExportProfile {
  id: string;
  format: ExportFormat;
  /** Patient identifiers are forbidden in this phase. */
  includePatientIdentifiers: false;
  includeClinicalNarrative: boolean;
  review: ReviewAttestation;
}

export interface OfflineCapability {
  enabled: false;
  storage: 'none';
  requiresNetwork: true;
  review: ReviewAttestation;
}
