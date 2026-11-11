import { describe, expect, it } from 'vitest';
import {
  FUTURE_CONTENT_REGISTRY,
  FUTURE_FEATURE_FLAGS,
  clinicalActionSchema,
  futureContentRegistrySchema,
  pathwaySchema,
} from './future-schemas.js';

/**
 * All payloads in this file are synthetic technical fixtures. They are not
 * clinical guidance, a priority definition, a dose, or a recommendation.
 */

const pendingReview = {
  status: 'pending_medical_content' as const,
  contentVersion: '0.0.0',
};

const approvedReview = {
  status: 'approved' as const,
  contentVersion: '1.0.0',
  reviewerId: 'synthetic-reviewer',
  reviewedAt: '2026-01-15T00:00:00.000Z',
  sourceDocumentId: 'synthetic-source-document',
};

const syntheticAction = {
  id: 'synthetic-action',
  priority: 'P1' as const,
  priorityDefinition: 'pending_medical_definition' as const,
  type: 'diagnostic' as const,
  title: { ar: 'عنوان اصطناعي للاختبار' },
  evidenceRefIds: ['synthetic-reference'],
  review: approvedReview,
};

const syntheticReference = {
  id: 'synthetic-reference',
  title: 'Synthetic reference fixture',
  organization: 'Test organisation',
  year: 2026,
};

describe('future content registry', () => {
  it('parses with every module empty and every capability disabled', () => {
    expect(FUTURE_CONTENT_REGISTRY.actionPlans).toEqual([]);
    expect(FUTURE_CONTENT_REGISTRY.pathways).toEqual([]);
    expect(FUTURE_CONTENT_REGISTRY.references).toEqual([]);
    expect(FUTURE_CONTENT_REGISTRY.labInterpretations).toEqual([]);
    expect(FUTURE_CONTENT_REGISTRY.medications).toEqual([]);
    expect(FUTURE_CONTENT_REGISTRY.populationPathways).toEqual([]);
    expect(FUTURE_CONTENT_REGISTRY.exportProfiles).toEqual([]);
    expect(FUTURE_CONTENT_REGISTRY.offline).toMatchObject({
      enabled: false,
      storage: 'none',
      requiresNetwork: true,
    });
    expect(Object.values(FUTURE_FEATURE_FLAGS).every((enabled) => enabled === false)).toBe(true);
  });

  it('rejects an approved action without reviewer, date and signed source', () => {
    const parsed = clinicalActionSchema.safeParse({
      ...syntheticAction,
      review: { status: 'approved', contentVersion: '1.0.0' },
    });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      const paths = parsed.error.issues.map((issue) => issue.path.join('.'));
      expect(paths).toEqual(
        expect.arrayContaining(['review.reviewerId', 'review.reviewedAt', 'review.sourceDocumentId']),
      );
    }
  });

  it('accepts a fully traceable synthetic action and requires pending P1–P4 semantics', () => {
    const parsed = clinicalActionSchema.safeParse(syntheticAction);
    expect(parsed.success).toBe(true);
    expect(
      clinicalActionSchema.safeParse({
        ...syntheticAction,
        priorityDefinition: 'approved_definition',
      }).success,
    ).toBe(false);
  });

  it('rejects unknown reference ids instead of silently accepting them', () => {
    const parsed = futureContentRegistrySchema.safeParse({
      ...FUTURE_CONTENT_REGISTRY,
      references: [],
      actionPlans: [syntheticAction],
    });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues.some((issue) => issue.message.includes('unknown reference'))).toBe(
        true,
      );
    }
  });

  it('accepts a synthetic reference and action with traceable metadata', () => {
    const parsed = futureContentRegistrySchema.safeParse({
      ...FUTURE_CONTENT_REGISTRY,
      references: [syntheticReference],
      actionPlans: [syntheticAction],
    });
    expect(parsed.success).toBe(true);
  });

  it('validates pathway node integrity without defining clinical questions', () => {
    const base = {
      id: 'synthetic-pathway',
      title: { ar: 'مسار اصطناعي للاختبار' },
      contentVersion: '0.0.0',
      review: pendingReview,
      entryNodeId: 'node-a',
      nodes: [
        { id: 'node-a', kind: 'question' as const, nextNodeIds: ['missing-node'] },
      ],
      evidenceRefIds: [],
    };
    const parsed = pathwaySchema.safeParse(base);
    expect(parsed.success).toBe(false);

    const valid = pathwaySchema.safeParse({
      ...base,
      nodes: [{ id: 'node-a', kind: 'terminal' as const, nextNodeIds: [] }],
    });
    expect(valid.success).toBe(true);
  });

  it('forbids patient identifiers in future exports and any offline storage', () => {
    expect(FUTURE_CONTENT_REGISTRY.exportProfiles).toEqual([]);
    expect(FUTURE_CONTENT_REGISTRY.offline.storage).toBe('none');
    expect(FUTURE_CONTENT_REGISTRY.offline.enabled).toBe(false);
  });
});
