import { describe, expect, it } from 'vitest';
import type { AssessmentInput } from '../../shared/types.js';
import { runAssessment } from './assessment.js';

function makeInput(overrides: Partial<AssessmentInput> = {}): AssessmentInput {
  return {
    age: 45,
    sex: 'male',
    specialty: 'emergency',
    duration: { value: 2, unit: 'hours' },
    symptoms: [],
    vitals: {
      systolicBP: 125,
      diastolicBP: 80,
      heartRate: 82,
      temperature: 37,
      spo2: 98,
    },
    ...overrides,
  };
}

describe('runAssessment', () => {
  it('ranks acute coronary syndrome first for a classic chest pain presentation', () => {
    const result = runAssessment(
      makeInput({
        age: 58,
        symptoms: ['chest_pain', 'diaphoresis', 'dyspnea', 'nausea'],
        vitals: {
          systolicBP: 150,
          diastolicBP: 95,
          heartRate: 108,
          temperature: 37.1,
          spo2: 93,
        },
      }),
    );

    expect(result.differentials[0]?.id).toBe('acute_coronary_syndrome');
    expect(result.triage.level).toBe('emergency');
    expect(result.differentials[0]?.confidence).toBeGreaterThan(40);
    expect(result.differentials[0]?.actions.labs.length).toBeGreaterThan(0);
  });

  it('escalates to emergency when oxygen saturation is critical', () => {
    const result = runAssessment(
      makeInput({
        symptoms: ['cough', 'fever'],
        vitals: {
          systolicBP: 118,
          diastolicBP: 74,
          heartRate: 96,
          temperature: 38.4,
          spo2: 87,
        },
      }),
    );

    expect(result.triage.level).toBe('emergency');
    expect(result.triage.reasons.join(' ')).toContain('90%');
  });

  it('identifies a viral upper respiratory infection for a mild presentation', () => {
    const result = runAssessment(
      makeInput({
        age: 30,
        sex: 'female',
        specialty: 'family_medicine',
        symptoms: ['sore_throat', 'runny_nose', 'myalgia', 'fever', 'cough'],
        vitals: {
          systolicBP: 118,
          diastolicBP: 76,
          heartRate: 88,
          temperature: 38.2,
          spo2: 98,
        },
      }),
    );

    expect(result.differentials[0]?.id).toBe('viral_upper_respiratory_infection');
    expect(result.triage.level).toBe('routine');
    expect(result.meta.lowInformation).toBe(false);
  });

  it('never returns an absolute certainty and keeps results sorted', () => {
    const result = runAssessment(
      makeInput({
        symptoms: ['fever', 'cough', 'sputum', 'dyspnea', 'chills'],
        vitals: {
          systolicBP: 92,
          diastolicBP: 58,
          heartRate: 118,
          temperature: 39.2,
          spo2: 90,
        },
      }),
    );

    for (const diagnosis of result.differentials) {
      expect(diagnosis.confidence).toBeLessThanOrEqual(92);
      expect(diagnosis.confidence).toBeGreaterThan(0);
    }
    const confidences = result.differentials.map((d) => d.confidence);
    expect(confidences).toEqual([...confidences].sort((a, b) => b - a));
  });

  it('returns no differential when no symptom is entered', () => {
    const result = runAssessment(makeInput({ symptoms: [] }));
    expect(result.differentials).toHaveLength(0);
    expect(result.meta.lowInformation).toBe(true);
  });

  it('flags missing key findings and matched evidence for explainability', () => {
    const result = runAssessment(
      makeInput({ symptoms: ['chest_pain'], specialty: 'cardiology' }),
    );
    const acs = result.differentials.find((d) => d.id === 'acute_coronary_syndrome');
    expect(acs).toBeDefined();
    expect(acs?.matchedEvidence).toContain('ألم في الصدر');
    expect(acs?.missingKeyFindings).toEqual(
      expect.arrayContaining(['تعرق بارد', 'ضيق في التنفس']),
    );
  });

  it('records findings that argue against a hypothesis (negative evidence)', () => {
    const result = runAssessment(
      makeInput({
        symptoms: ['fatigue', 'dyspnea'],
        vitals: {
          systolicBP: 112,
          diastolicBP: 70,
          heartRate: 104,
          temperature: 36.9,
          spo2: 88,
        },
      }),
    );

    const anemia = result.differentials.find((d) => d.id === 'iron_deficiency_anemia');
    expect(anemia).toBeDefined();
    expect(anemia?.discouragingFindings.join(' ')).toContain('نقص أكسجة');
    expect(anemia?.confidence).toBeLessThan(45);
    expect(result.differentials[0]?.id).not.toBe('iron_deficiency_anemia');
  });

  it('uses symptom duration as clinical tempo evidence', () => {
    const acute = runAssessment(
      makeInput({
        symptoms: ['chest_pain'],
        duration: { value: 2, unit: 'hours' },
      }),
    );
    const acuteAcs = acute.differentials.find((d) => d.id === 'acute_coronary_syndrome');
    expect(acuteAcs?.matchedEvidence).toContain('مدة الأعراض متوافقة مع المسار السريري');

    const chronic = runAssessment(
      makeInput({
        symptoms: ['chest_pain'],
        duration: { value: 8, unit: 'weeks' },
      }),
    );
    const chronicAcs = chronic.differentials.find((d) => d.id === 'acute_coronary_syndrome');
    expect(chronicAcs?.discouragingFindings.join(' ')).toContain('لا تتفق');
    expect(chronicAcs!.confidence).toBeLessThan(acuteAcs!.confidence);
  });

  it('lower triage level for a stable patient without red flags', () => {
    const result = runAssessment(
      makeInput({
        age: 28,
        sex: 'female',
        specialty: 'family_medicine',
        symptoms: ['headache', 'photophobia', 'nausea'],
        vitals: {
          systolicBP: 115,
          diastolicBP: 72,
          heartRate: 70,
          temperature: 36.8,
          spo2: 99,
        },
      }),
    );
    expect(result.triage.level).toBe('routine');
    expect(result.differentials[0]?.id).toBe('migraine');
  });
});
