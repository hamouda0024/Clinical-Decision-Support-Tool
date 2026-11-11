import { z } from 'zod';
import {
  ACTION_PRIORITIES,
  ACTION_TYPES,
  CONTENT_LIFECYCLE,
  EXPORT_FORMATS,
  PATHWAY_NODE_KINDS,
  POPULATION_IDS,
  type ActionPriority,
} from '../../shared/future-content.js';

/**
 * Validation for the *future* content modules.
 *
 * Nothing here defines clinical medicine: there are no thresholds, questions,
 * dosages, interactions or priority semantics. The schemas only enforce stable
 * ids, traceable review metadata and referential integrity so medically
 * reviewed content can be added safely later.
 */

const isoDate = z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
  message: 'must be an ISO-8601 date',
});

const localizedTextSchema = z.strictObject({
  ar: z.string().min(1),
  fr: z.string().min(1).optional(),
  en: z.string().min(1).optional(),
});

export const reviewAttestationSchema = z
  .strictObject({
    status: z.enum(CONTENT_LIFECYCLE),
    contentVersion: z.string().min(1),
    reviewerId: z.string().min(1).optional(),
    reviewerRole: z.string().min(1).optional(),
    reviewedAt: isoDate.optional(),
    sourceDocumentId: z.string().min(1).optional(),
    notes: z.string().min(1).optional(),
  })
  .superRefine((review, ctx) => {
    if (review.status !== 'approved') return;
    if (!review.reviewerId) {
      ctx.addIssue({ code: 'custom', path: ['reviewerId'], message: 'required for approved content' });
    }
    if (!review.reviewedAt) {
      ctx.addIssue({ code: 'custom', path: ['reviewedAt'], message: 'required for approved content' });
    }
    if (!review.sourceDocumentId) {
      ctx.addIssue({
        code: 'custom',
        path: ['sourceDocumentId'],
        message: 'required for approved content',
      });
    }
  });

export const governedReferenceSchema = z.strictObject({
  id: z.string().min(1),
  title: z.string().min(1),
  organization: z.string().min(1),
  year: z.number().int().min(1900).max(2200).optional(),
  url: z.url().optional(),
  section: z.string().min(1).optional(),
  evidenceLevel: z.string().min(1).optional(),
});

export const clinicalActionSchema = z.strictObject({
  id: z.string().min(1),
  priority: z.enum(ACTION_PRIORITIES),
  priorityDefinition: z.literal('pending_medical_definition'),
  type: z.enum(ACTION_TYPES),
  title: localizedTextSchema,
  rationale: localizedTextSchema.optional(),
  evidenceRefIds: z.array(z.string().min(1)),
  review: reviewAttestationSchema,
});

export const pathwayNodeSchema = z.strictObject({
  id: z.string().min(1),
  kind: z.enum(PATHWAY_NODE_KINDS),
  nextNodeIds: z.array(z.string().min(1)),
});

export const pathwaySchema = z
  .strictObject({
    id: z.string().min(1),
    title: localizedTextSchema,
    contentVersion: z.string().min(1),
    review: reviewAttestationSchema,
    entryNodeId: z.string().min(1).optional(),
    nodes: z.array(pathwayNodeSchema),
    evidenceRefIds: z.array(z.string().min(1)),
  })
  .superRefine((pathway, ctx) => {
    const nodeIds = new Set<string>();
    for (const [index, node] of pathway.nodes.entries()) {
      if (nodeIds.has(node.id)) {
        ctx.addIssue({ code: 'custom', path: ['nodes', index, 'id'], message: 'duplicate node id' });
      }
      nodeIds.add(node.id);
    }
    if (pathway.entryNodeId && !nodeIds.has(pathway.entryNodeId)) {
      ctx.addIssue({
        code: 'custom',
        path: ['entryNodeId'],
        message: 'entryNodeId must reference a node in this pathway',
      });
    }
    for (const [index, node] of pathway.nodes.entries()) {
      for (const nextId of node.nextNodeIds) {
        if (!nodeIds.has(nextId)) {
          ctx.addIssue({
            code: 'custom',
            path: ['nodes', index, 'nextNodeIds'],
            message: `unknown next node: ${nextId}`,
          });
        }
      }
    }
  });

export const labInterpretationSchema = z.strictObject({
  id: z.string().min(1),
  analyteCode: z.string().min(1),
  title: localizedTextSchema,
  review: reviewAttestationSchema,
  rules: z.array(
    z.strictObject({
      id: z.string().min(1),
      sourceRefIds: z.array(z.string().min(1)),
      review: reviewAttestationSchema,
    }),
  ),
});

export const medicationSafetySchema = z.strictObject({
  id: z.string().min(1),
  title: localizedTextSchema,
  review: reviewAttestationSchema,
  ingredientRefIds: z.array(z.string().min(1)),
  safetyRuleIds: z.array(z.string().min(1)),
  doseRuleIds: z.array(z.string().min(1)),
});

export const populationPathwaySchema = z.strictObject({
  id: z.string().min(1),
  population: z.enum(POPULATION_IDS),
  title: localizedTextSchema,
  review: reviewAttestationSchema,
  pathwayId: z.string().min(1).optional(),
});

export const exportProfileSchema = z.strictObject({
  id: z.string().min(1),
  format: z.enum(EXPORT_FORMATS),
  includePatientIdentifiers: z.literal(false),
  includeClinicalNarrative: z.boolean(),
  review: reviewAttestationSchema,
});

export const offlineCapabilitySchema = z.strictObject({
  enabled: z.literal(false),
  storage: z.literal('none'),
  requiresNetwork: z.literal(true),
  review: reviewAttestationSchema,
});

function assertUniqueIds(
  entries: readonly { id: string }[],
  path: string,
  ctx: z.RefinementCtx,
): void {
  const seen = new Set<string>();
  for (const [index, entry] of entries.entries()) {
    if (seen.has(entry.id)) {
      ctx.addIssue({ code: 'custom', path: [path, index, 'id'], message: 'duplicate id' });
    }
    seen.add(entry.id);
  }
}

export const futureContentRegistrySchema = z
  .strictObject({
    schemaVersion: z.string().min(1),
    status: z.literal('pending_medical_content'),
    actionPlans: z.array(clinicalActionSchema),
    pathways: z.array(pathwaySchema),
    references: z.array(governedReferenceSchema),
    labInterpretations: z.array(labInterpretationSchema),
    medications: z.array(medicationSafetySchema),
    populationPathways: z.array(populationPathwaySchema),
    exportProfiles: z.array(exportProfileSchema),
    offline: offlineCapabilitySchema,
  })
  .superRefine((registry, ctx) => {
    const collections = [
      ['actionPlans', registry.actionPlans],
      ['pathways', registry.pathways],
      ['references', registry.references],
      ['labInterpretations', registry.labInterpretations],
      ['medications', registry.medications],
      ['populationPathways', registry.populationPathways],
      ['exportProfiles', registry.exportProfiles],
    ] as const;
    for (const [name, entries] of collections) assertUniqueIds(entries, name, ctx);

    const referenceIds = new Set(registry.references.map((reference) => reference.id));
    const pathwayIds = new Set(registry.pathways.map((pathway) => pathway.id));

    for (const [index, action] of registry.actionPlans.entries()) {
      for (const refId of action.evidenceRefIds) {
        if (!referenceIds.has(refId)) {
          ctx.addIssue({
            code: 'custom',
            path: ['actionPlans', index, 'evidenceRefIds'],
            message: `unknown reference: ${refId}`,
          });
        }
      }
    }
    for (const [index, pathway] of registry.pathways.entries()) {
      for (const refId of pathway.evidenceRefIds) {
        if (!referenceIds.has(refId)) {
          ctx.addIssue({
            code: 'custom',
            path: ['pathways', index, 'evidenceRefIds'],
            message: `unknown reference: ${refId}`,
          });
        }
      }
    }
    for (const [index, population] of registry.populationPathways.entries()) {
      if (population.pathwayId && !pathwayIds.has(population.pathwayId)) {
        ctx.addIssue({
          code: 'custom',
          path: ['populationPathways', index, 'pathwayId'],
          message: `unknown pathway: ${population.pathwayId}`,
        });
      }
    }
  });

export type FutureContentRegistry = z.infer<typeof futureContentRegistrySchema>;

/**
 * Every module is deliberately empty. Adding entries requires medically
 * reviewed content; the schema is the gate, not an invitation to invent it.
 */
export const FUTURE_CONTENT_REGISTRY: FutureContentRegistry =
  futureContentRegistrySchema.parse({
    schemaVersion: '0.1.0',
    status: 'pending_medical_content',
    actionPlans: [],
    pathways: [],
    references: [],
    labInterpretations: [],
    medications: [],
    populationPathways: [],
    exportProfiles: [],
    offline: {
      enabled: false,
      storage: 'none',
      requiresNetwork: true,
      review: {
        status: 'pending_medical_content',
        contentVersion: '0.0.0',
      },
    },
  });

/**
 * Capabilities exposed to future clients. All are off until the content and
 * review metadata exist; the API must not imply that a feature is usable.
 */
export const FUTURE_FEATURE_FLAGS = {
  orderedActionPlans: false,
  adaptivePathways: false,
  labInterpretations: false,
  medicationSafety: false,
  populationPathways: false,
  pdfExport: false,
  printView: false,
  offlineMode: false,
} as const;

export type FutureFeatureFlag = keyof typeof FUTURE_FEATURE_FLAGS;

export function isPriority(value: string): value is ActionPriority {
  return (ACTION_PRIORITIES as readonly string[]).includes(value);
}
