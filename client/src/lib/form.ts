import type {
  AssessmentInput,
  DurationUnit,
  Sex,
  SpecialtyId,
  VitalId,
} from '../../../shared/types';

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

const RANGES: Record<VitalId, { min: number; max: number; label: string }> = {
  systolicBP: { min: 50, max: 300, label: 'ضغط الدم الانقباضي' },
  diastolicBP: { min: 30, max: 200, label: 'ضغط الدم الانبساطي' },
  heartRate: { min: 20, max: 250, label: 'نبضات القلب' },
  temperature: { min: 30, max: 45, label: 'حرارة الجسم' },
  spo2: { min: 50, max: 100, label: 'نسبة الأكسجين' },
};

export function validateForm(form: FormState, maxSymptoms: number): FormErrors {
  const errors: FormErrors = {};

  const age = Number(form.age);
  if (form.age.trim() === '') errors.age = 'العمر مطلوب';
  else if (!Number.isInteger(age) || age < 0 || age > 120) errors.age = 'أدخل عمراً بالأعوام بين 0 و120';

  if (!form.sex) errors.sex = 'اختر الجنس';
  if (!form.specialty) errors.specialty = 'اختر التخصص';

  const duration = Number(form.durationValue);
  if (form.durationValue.trim() === '') errors.duration = 'مدة الأعراض مطلوبة';
  else if (!Number.isFinite(duration) || duration <= 0) errors.duration = 'أدخل مدة أكبر من صفر';

  if (form.symptoms.length === 0) errors.symptoms = 'اختر عرضاً واحداً على الأقل';
  else if (form.symptoms.length > maxSymptoms) errors.symptoms = `الحد الأقصى ${maxSymptoms} عرضاً`;

  for (const [id, raw] of Object.entries(form.vitals) as [VitalId, string][]) {
    const range = RANGES[id];
    if (raw.trim() === '') {
      errors[id] = `${range.label} مطلوب`;
      continue;
    }
    const value = Number(raw);
    if (!Number.isFinite(value) || value < range.min || value > range.max) {
      errors[id] = `القيمة يجب أن تكون بين ${range.min} و${range.max}`;
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
    errors.diastolicBP = 'الضغط الانبساطي يجب أن يكون أقل من الانقباضي';
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
