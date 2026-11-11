import { describe, expect, it } from 'vitest';
import type { AssessmentInput, TriageLevel } from '../../shared/types.js';
import { runAssessment } from './assessment.js';

/**
 * Synthetic cases only — not real patient data.
 *
 * Expected values are the current engine's traced output. Cases 27 and 28
 * intentionally document known clinical limitations (isolated red flag and
 * extreme systolic pressure) until the reviewing physician decides the fix.
 */
interface ManualCase {
  name: string;
  input: AssessmentInput;
  triage: TriageLevel;
  ews: number;
  top: string[];
  pediatric?: boolean;
  lowInformation?: boolean;
}

const CASES: ManualCase[] = [
  {
    name: '1 emergency ACS',
    input: { age: 58, sex: 'male', specialty: 'emergency', duration: { value: 2, unit: 'hours' }, symptoms: ['chest_pain', 'diaphoresis', 'dyspnea', 'nausea'], vitals: { systolicBP: 150, diastolicBP: 95, heartRate: 108, temperature: 37.1, spo2: 93 } },
    triage: 'emergency', ews: 3, top: ['acute_coronary_syndrome', 'renal_colic'],
  },
  {
    name: '2 urgent PE',
    input: { age: 52, sex: 'female', specialty: 'emergency', duration: { value: 6, unit: 'hours' }, symptoms: ['dyspnea', 'pleuritic_pain', 'calf_pain', 'recent_immobility'], vitals: { systolicBP: 118, diastolicBP: 76, heartRate: 112, temperature: 37.2, spo2: 90 } },
    triage: 'urgent', ews: 5, top: ['pulmonary_embolism', 'asthma_exacerbation'],
  },
  {
    name: '3 emergency CAP',
    input: { age: 67, sex: 'male', specialty: 'internal', duration: { value: 4, unit: 'days' }, symptoms: ['fever', 'cough', 'sputum', 'dyspnea', 'fatigue'], vitals: { systolicBP: 110, diastolicBP: 70, heartRate: 112, temperature: 39.1, spo2: 88 } },
    triage: 'emergency', ews: 8, top: ['copd_exacerbation', 'community_acquired_pneumonia'],
  },
  {
    name: '4 urgent asthma',
    input: { age: 28, sex: 'female', specialty: 'emergency', duration: { value: 3, unit: 'hours' }, symptoms: ['wheeze', 'dyspnea', 'cough'], vitals: { systolicBP: 122, diastolicBP: 78, heartRate: 118, temperature: 37, spo2: 92 } },
    triage: 'urgent', ews: 4, top: ['asthma_exacerbation', 'copd_exacerbation'],
  },
  {
    name: '5 emergency COPD',
    input: { age: 70, sex: 'male', specialty: 'pulmonology', duration: { value: 3, unit: 'days' }, symptoms: ['dyspnea', 'cough', 'sputum', 'wheeze'], vitals: { systolicBP: 130, diastolicBP: 80, heartRate: 102, temperature: 37.8, spo2: 88 } },
    triage: 'emergency', ews: 4, top: ['copd_exacerbation', 'asthma_exacerbation'],
  },
  {
    name: '6 urgent heart failure',
    input: { age: 72, sex: 'male', specialty: 'cardiology', duration: { value: 5, unit: 'days' }, symptoms: ['dyspnea', 'orthopnea', 'edema', 'fatigue'], vitals: { systolicBP: 145, diastolicBP: 90, heartRate: 105, temperature: 36.8, spo2: 91 } },
    triage: 'urgent', ews: 4, top: ['heart_failure_decompensation', 'copd_exacerbation'],
  },
  {
    name: '7 emergency aortic dissection',
    input: { age: 60, sex: 'male', specialty: 'emergency', duration: { value: 1, unit: 'hours' }, symptoms: ['chest_pain_tearing', 'chest_pain', 'diaphoresis'], vitals: { systolicBP: 170, diastolicBP: 100, heartRate: 110, temperature: 37, spo2: 96 } },
    triage: 'emergency', ews: 1, top: ['aortic_dissection', 'acute_coronary_syndrome'],
  },
  {
    name: '8 emergency sepsis',
    input: { age: 64, sex: 'female', specialty: 'internal', duration: { value: 2, unit: 'days' }, symptoms: ['fever', 'confusion', 'dyspnea'], vitals: { systolicBP: 88, diastolicBP: 54, heartRate: 124, temperature: 39.4, spo2: 92 } },
    triage: 'emergency', ews: 9, top: ['sepsis', 'bacterial_meningitis'],
  },
  {
    name: '9 emergency anaphylaxis',
    input: { age: 30, sex: 'female', specialty: 'emergency', duration: { value: 1, unit: 'hours' }, symptoms: ['angioedema', 'urticaria', 'dyspnea'], vitals: { systolicBP: 92, diastolicBP: 60, heartRate: 128, temperature: 37, spo2: 91 } },
    triage: 'emergency', ews: 7, top: ['anaphylaxis', 'asthma_exacerbation'],
  },
  {
    name: '10 semi-urgent appendicitis',
    input: { age: 24, sex: 'female', specialty: 'general_surgery', duration: { value: 1, unit: 'days' }, symptoms: ['abdominal_pain', 'anorexia', 'nausea', 'vomiting', 'fever'], vitals: { systolicBP: 118, diastolicBP: 76, heartRate: 96, temperature: 38.2, spo2: 99 } },
    triage: 'semi_urgent', ews: 2, top: ['acute_appendicitis', 'acute_cholecystitis'],
  },
  {
    name: '11 semi-urgent cholecystitis',
    input: { age: 45, sex: 'female', specialty: 'general_surgery', duration: { value: 2, unit: 'days' }, symptoms: ['abdominal_pain', 'nausea', 'vomiting', 'fever'], vitals: { systolicBP: 126, diastolicBP: 80, heartRate: 98, temperature: 38.3, spo2: 98 } },
    triage: 'semi_urgent', ews: 2, top: ['acute_cholecystitis', 'acute_appendicitis'],
  },
  {
    name: '12 semi-urgent gastroenteritis',
    input: { age: 30, sex: 'male', specialty: 'family_medicine', duration: { value: 2, unit: 'days' }, symptoms: ['diarrhea', 'vomiting', 'abdominal_pain', 'fever'], vitals: { systolicBP: 116, diastolicBP: 74, heartRate: 92, temperature: 38.1, spo2: 99 } },
    triage: 'semi_urgent', ews: 2, top: ['acute_gastroenteritis', 'acute_cholecystitis'],
  },
  {
    name: '13 routine GERD',
    input: { age: 40, sex: 'female', specialty: 'family_medicine', duration: { value: 4, unit: 'weeks' }, symptoms: ['epigastric_burning', 'chest_pain'], vitals: { systolicBP: 120, diastolicBP: 78, heartRate: 80, temperature: 36.8, spo2: 99 } },
    triage: 'routine', ews: 0, top: ['gerd', 'acute_coronary_syndrome'],
  },
  {
    name: '14 routine renal colic',
    input: { age: 35, sex: 'male', specialty: 'urology', duration: { value: 6, unit: 'hours' }, symptoms: ['flank_pain', 'hematuria', 'nausea'], vitals: { systolicBP: 138, diastolicBP: 86, heartRate: 96, temperature: 37.2, spo2: 99 } },
    triage: 'routine', ews: 1, top: ['renal_colic', 'acute_appendicitis'],
  },
  {
    name: '15 urgent pyelonephritis',
    input: { age: 32, sex: 'female', specialty: 'urology', duration: { value: 3, unit: 'days' }, symptoms: ['fever', 'flank_pain', 'dysuria', 'nausea'], vitals: { systolicBP: 112, diastolicBP: 70, heartRate: 104, temperature: 38.8, spo2: 98 } },
    triage: 'urgent', ews: 2, top: ['pyelonephritis', 'renal_colic'],
  },
  {
    name: '16 routine cystitis',
    input: { age: 26, sex: 'female', specialty: 'urology', duration: { value: 2, unit: 'days' }, symptoms: ['dysuria', 'frequency'], vitals: { systolicBP: 118, diastolicBP: 76, heartRate: 84, temperature: 37.4, spo2: 99 } },
    triage: 'routine', ews: 0, top: ['acute_cystitis', 'pyelonephritis'],
  },
  {
    name: '17 emergency stroke',
    input: { age: 70, sex: 'male', specialty: 'neurology', duration: { value: 2, unit: 'hours' }, symptoms: ['focal_weakness', 'facial_droop', 'speech_difficulty'], vitals: { systolicBP: 160, diastolicBP: 90, heartRate: 88, temperature: 36.8, spo2: 97 } },
    triage: 'emergency', ews: 0, top: ['acute_ischemic_stroke', 'aortic_dissection'],
  },
  {
    name: '18 emergency meningitis',
    input: { age: 22, sex: 'male', specialty: 'emergency', duration: { value: 1, unit: 'days' }, symptoms: ['fever', 'neck_stiffness', 'headache', 'photophobia'], vitals: { systolicBP: 118, diastolicBP: 76, heartRate: 104, temperature: 39, spo2: 98 } },
    triage: 'emergency', ews: 2, top: ['bacterial_meningitis', 'acute_appendicitis'],
  },
  {
    name: '19 routine migraine',
    input: { age: 28, sex: 'female', specialty: 'family_medicine', duration: { value: 1, unit: 'days' }, symptoms: ['headache', 'photophobia', 'nausea'], vitals: { systolicBP: 115, diastolicBP: 72, heartRate: 70, temperature: 36.8, spo2: 99 } },
    triage: 'routine', ews: 0, top: ['migraine', 'renal_colic'],
  },
  {
    name: '20 urgent DKA',
    input: { age: 22, sex: 'male', specialty: 'endocrinology', duration: { value: 1, unit: 'days' }, symptoms: ['polyuria', 'polydipsia', 'nausea', 'vomiting', 'abdominal_pain', 'confusion'], vitals: { systolicBP: 102, diastolicBP: 64, heartRate: 112, temperature: 37, spo2: 99 } },
    triage: 'urgent', ews: 3, top: ['diabetic_ketoacidosis', 'acute_appendicitis'],
  },
  {
    name: '21 semi-urgent hypoglycemia',
    input: { age: 55, sex: 'female', specialty: 'endocrinology', duration: { value: 2, unit: 'hours' }, symptoms: ['confusion', 'diaphoresis', 'palpitations'], vitals: { systolicBP: 138, diastolicBP: 84, heartRate: 100, temperature: 36.5, spo2: 98 } },
    triage: 'semi_urgent', ews: 1, top: ['hypoglycemia', 'acute_coronary_syndrome'],
  },
  {
    name: '22 emergency panic attack',
    input: { age: 25, sex: 'female', specialty: 'psychiatry', duration: { value: 1, unit: 'hours' }, symptoms: ['palpitations', 'chest_pain', 'dyspnea', 'anxiety', 'fear_of_death'], vitals: { systolicBP: 128, diastolicBP: 80, heartRate: 102, temperature: 37, spo2: 99 } },
    triage: 'emergency', ews: 1, top: ['panic_attack', 'iron_deficiency_anemia'],
  },
  {
    name: '23 routine viral URI',
    input: { age: 30, sex: 'female', specialty: 'family_medicine', duration: { value: 3, unit: 'days' }, symptoms: ['sore_throat', 'runny_nose', 'cough', 'fever', 'myalgia'], vitals: { systolicBP: 118, diastolicBP: 76, heartRate: 88, temperature: 38.2, spo2: 98 } },
    triage: 'routine', ews: 1, top: ['viral_upper_respiratory_infection', 'acute_cystitis'],
  },
  {
    name: '24 semi-urgent anemia',
    input: { age: 35, sex: 'female', specialty: 'family_medicine', duration: { value: 4, unit: 'weeks' }, symptoms: ['fatigue', 'dyspnea', 'dizziness'], vitals: { systolicBP: 110, diastolicBP: 70, heartRate: 96, temperature: 36.8, spo2: 98 } },
    triage: 'semi_urgent', ews: 2, top: ['iron_deficiency_anemia', 'asthma_exacerbation'],
  },
  {
    name: '25 paediatric gate',
    input: { age: 8, sex: 'male', specialty: 'emergency', duration: { value: 1, unit: 'days' }, symptoms: ['chest_pain', 'fever'], vitals: { systolicBP: 110, diastolicBP: 70, heartRate: 100, temperature: 38, spo2: 97 } },
    triage: 'semi_urgent', ews: 2, top: [], pediatric: true, lowInformation: true,
  },
  {
    name: '26 low information',
    input: { age: 45, sex: 'male', specialty: 'internal', duration: { value: 1, unit: 'days' }, symptoms: ['fatigue'], vitals: { systolicBP: 120, diastolicBP: 80, heartRate: 80, temperature: 37, spo2: 98 } },
    triage: 'routine', ews: 0, top: ['diabetic_ketoacidosis', 'iron_deficiency_anemia'], lowInformation: true,
  },
  {
    name: '27 isolated red flag (known limitation)',
    input: { age: 50, sex: 'male', specialty: 'emergency', duration: { value: 1, unit: 'hours' }, symptoms: ['chest_pain'], vitals: { systolicBP: 135, diastolicBP: 85, heartRate: 92, temperature: 37, spo2: 97 } },
    triage: 'routine', ews: 1, top: ['acute_coronary_syndrome', 'pulmonary_embolism'], lowInformation: true,
  },
  {
    name: '28 extreme systolic (known limitation)',
    input: { age: 55, sex: 'male', specialty: 'emergency', duration: { value: 1, unit: 'hours' }, symptoms: ['chest_pain'], vitals: { systolicBP: 219, diastolicBP: 110, heartRate: 90, temperature: 37, spo2: 98 } },
    triage: 'routine', ews: 0, top: ['acute_coronary_syndrome', 'pulmonary_embolism'], lowInformation: true,
  },
];

describe('manual clinical regression cases', () => {
  it.each(CASES)('$name', ({ input, triage, ews, top, pediatric, lowInformation }) => {
    const result = runAssessment(input);
    expect(result.triage.level).toBe(triage);
    expect(result.triage.earlyWarningScore).toBe(ews);
    expect(result.differentials.slice(0, 2).map((entry) => entry.id)).toEqual(top);
    expect(result.meta.pediatricUnsupported).toBe(pediatric ?? false);
    if (lowInformation !== undefined) {
      expect(result.meta.lowInformation).toBe(lowInformation);
    }
    if (pediatric) {
      expect(result.differentials).toEqual([]);
    }
  });
});
