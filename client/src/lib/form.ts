import type {
  AssessmentInput,
  DurationUnit,
  Sex,
  SpecialtyId,
  VitalId,
} from '../../../shared/types';
import type { TranslationKey } from '../i18n/translations/ar';

type Translate = (key: TranslationKey, vars?: Record<string, string | number>) => string;

export interface FormState {
  age: string;
  sex: '' | Sex;
  specialty: '' | SpecialtyId;
  durationValue: string;
  durationUnit: DurationUnit;
  symptoms: string[];
  vitals: Record<VitalId, string>;
}

export const EMPTY_FORM: FormState = {
  age: '',
  sex: '',
  specialty: '',
  durationValue: '',
  durationUnit: 'days',
  symptoms: [],
  vitals: {
    systolicBP: '',
    diastolicBP: '',
    heartRate: '',
    temperature: '',
    spo2: '',
  },
};

export type FormErrors = Partial<Record<'age' | 'sex' | 'specialty' | 'duration' | 'symptoms' | VitalId, string>>;

const RANGES: Record<VitalId, { min: number; max: number }> = {
  systolicBP: { min: 50, max: 300 },
  diastolicBP: { min: 30, max: 200 },
  heartRate: { min: 20, max: 250 },
  temperature: { min: 30, max: 45 },
  spo2: { min: 50, max: 100 },
};

export function validateForm(
  form: FormState,
  maxSymptoms: number,
  t: Translate,
  vitalLabels: Record<VitalId, string>,
): FormErrors {
  const errors: FormErrors = {};

  const age = Number(form.age);
  if (form.age.trim() === '') errors.age = t('validation.ageRequired');
  else if (!Number.isInteger(age) || age < 0 || age > 120) errors.age = t('validation.ageRange');

  if (!form.sex) errors.sex = t('validation.sexRequired');
  if (!form.specialty) errors.specialty = t('validation.specialtyRequired');

  const duration = Number(form.durationValue);
  if (form.durationValue.trim() === '') errors.duration = t('validation.durationRequired');
  else if (!Number.isFinite(duration) || duration <= 0)
    errors.duration = t('validation.durationPositive');

  if (form.symptoms.length === 0) errors.symptoms = t('validation.symptomRequired');
  else if (form.symptoms.length > maxSymptoms)
    errors.symptoms = t('validation.symptomMax', { max: maxSymptoms });

  for (const [id, raw] of Object.entries(form.vitals) as [VitalId, string][]) {
    const range = RANGES[id];
    if (raw.trim() === '') {
      errors[id] = t('validation.vitalRequired', { label: vitalLabels[id] });
      continue;
    }
    const value = Number(raw);
    if (!Number.isFinite(value) || value < range.min || value > range.max) {
      errors[id] = t('validation.vitalRange', { min: range.min, max: range.max });
    }
  }

  const systolic = Number(form.vitals.systolicBP);
  const diastolic = Number(form.vitals.diastolicBP);
  if (
    !errors.systolicBP &&
    !errors.diastolicBP &&
    Number.isFinite(systolic) &&
    Number.isFinite(diastolic) &&
    diastolic >= systolic
  ) {
    errors.diastolicBP = t('validation.diastolicOrder');
  }

  return errors;
}

export function toAssessmentInput(form: FormState): AssessmentInput {
  return {
    age: Number(form.age),
    sex: form.sex as Sex,
    specialty: form.specialty as SpecialtyId,
    duration: { value: Number(form.durationValue), unit: form.durationUnit },
    symptoms: form.symptoms,
    vitals: {
      systolicBP: Number(form.vitals.systolicBP),
      diastolicBP: Number(form.vitals.diastolicBP),
      heartRate: Number(form.vitals.heartRate),
      temperature: Number(form.vitals.temperature),
      spo2: Number(form.vitals.spo2),
    },
  };
}
