import { describe, expect, it } from 'vitest';
import { assessmentSchema } from './validation.js';

const validPayload = {
  age: 54,
  sex: 'male',
  specialty: 'emergency',
  duration: { value: 3, unit: 'hours' },
  symptoms: ['chest_pain', 'dyspnea'],
  vitals: {
    systolicBP: 138,
    diastolicBP: 86,
    heartRate: 92,
    temperature: 37.2,
    spo2: 96,
  },
};

describe('assessmentSchema', () => {
  it('accepts a valid payload', () => {
    expect(assessmentSchema.safeParse(validPayload).success).toBe(true);
  });

  it('rejects unknown symptom ids', () => {
    const result = assessmentSchema.safeParse({
      ...validPayload,
      symptoms: ['not_a_symptom'],
    });
    expect(result.success).toBe(false);
  });

  it('rejects duplicated symptoms', () => {
    const result = assessmentSchema.safeParse({
      ...validPayload,
      symptoms: ['dyspnea', 'dyspnea'],
    });
    expect(result.success).toBe(false);
  });

  it('rejects extra fields (mass-assignment protection)', () => {
    const result = assessmentSchema.safeParse({ ...validPayload, patientName: 'Test' });
    expect(result.success).toBe(false);
  });

  it('rejects out-of-range vitals', () => {
    const result = assessmentSchema.safeParse({
      ...validPayload,
      vitals: { ...validPayload.vitals, spo2: 140 },
    });
    expect(result.success).toBe(false);
  });

  it('rejects a diastolic pressure greater than the systolic pressure', () => {
    const result = assessmentSchema.safeParse({
      ...validPayload,
      vitals: { ...validPayload.vitals, systolicBP: 80, diastolicBP: 120 },
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid age and sex values', () => {
    expect(assessmentSchema.safeParse({ ...validPayload, age: -2 }).success).toBe(false);
    expect(assessmentSchema.safeParse({ ...validPayload, age: 121 }).success).toBe(false);
    expect(assessmentSchema.safeParse({ ...validPayload, sex: 'unknown' }).success).toBe(false);
  });

  it('rejects an excessive number of symptoms', () => {
    const result = assessmentSchema.safeParse({
      ...validPayload,
      symptoms: Array.from({ length: 30 }, () => 'fever'),
    });
    expect(result.success).toBe(false);
  });
});
