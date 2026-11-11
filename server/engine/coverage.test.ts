import { describe, expect, it } from 'vitest';
import type { AssessmentInput } from '../../shared/types.js';
import { DISEASES } from '../data/knowledge-base.js';
import { runAssessment } from './assessment.js';

const NORMAL_VITALS = {
  systolicBP: 120,
  diastolicBP: 80,
  heartRate: 80,
  temperature: 37,
  spo2: 98,
} as const;

describe('knowledge base coverage', () => {
  it('keeps all 24 conditions reachable with their own documented findings', () => {
    expect(DISEASES).toHaveLength(24);
    const unreachable: string[] = [];

    for (const disease of DISEASES) {
      const input: AssessmentInput = {
        age: 45,
        sex: 'male',
        specialty: disease.specialties[0] ?? 'internal',
        duration: { value: 2, unit: 'days' },
        symptoms: disease.symptoms.map((symptom) => symptom.id),
        vitals: { ...NORMAL_VITALS },
      };
      const result = runAssessment(input);
      if (!result.differentials.some((entry) => entry.id === disease.id)) {
        unreachable.push(disease.id);
      }
    }

    expect(unreachable).toEqual([]);
  });
});
