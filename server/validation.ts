import { z } from 'zod';
import {
  DURATION_UNITS,
  SEXES,
  type AssessmentInput,
  type SpecialtyId,
} from '../shared/types.js';
import { LIMITS, SPECIALTIES, SYMPTOMS } from './data/catalog.js';

const SYMPTOM_IDS = new Set(SYMPTOMS.map((s) => s.id));
const SPECIALTY_IDS = SPECIALTIES.map((s) => s.id) as [SpecialtyId, ...SpecialtyId[]];

const durationValueLimit = (unit: 'hours' | 'days' | 'weeks'): number =>
  unit === 'hours' ? 24 * 30 : unit === 'days' ? 365 : 52;

/**
 * Strict request schema. Unknown keys are rejected so that clients cannot smuggle
 * extra fields into the engine or future persistence layers.
 */
export const assessmentSchema = z
  .strictObject({
    age: z
      .number({ error: 'العمر مطلوب كرقم' })
      .int('يجب أن يكون العمر عدداً صحيحاً')
      .min(LIMITS.minAge, `العمر لا يمكن أن يقل عن ${LIMITS.minAge}`)
      .max(LIMITS.maxAge, `العمر لا يمكن أن يزيد عن ${LIMITS.maxAge}`),
    sex: z.enum(SEXES, { error: 'الجنس غير صالح' }),
    specialty: z.enum(SPECIALTY_IDS, { error: 'التخصص الطبي غير صالح' }),
    duration: z.strictObject({
      value: z
        .number({ error: 'مدة الأعراض مطلوبة كرقم' })
        .positive('مدة الأعراض يجب أن تكون أكبر من صفر')
        .max(24 * 365, 'مدة الأعراض خارج النطاق المسموح'),
      unit: z.enum(DURATION_UNITS, { error: 'وحدة المدة غير صالحة' }),
    }),
    symptoms: z
      .array(z.string().min(1).max(64), { error: 'قائمة الأعراض غير صالحة' })
      .max(LIMITS.maxSymptoms, `لا يمكن اختيار أكثر من ${LIMITS.maxSymptoms} عرضاً`)
      .refine((ids) => new Set(ids).size === ids.length, 'لا يمكن تكرار العرض نفسه')
      .refine((ids) => ids.every((id) => SYMPTOM_IDS.has(id)), 'يوجد عرض غير معروف في القائمة'),
    vitals: z.strictObject({
      systolicBP: z
        .number({ error: 'ضغط الدم الانقباضي مطلوب' })
        .min(50, 'ضغط الدم الانقباضي خارج النطاق (50–300)')
        .max(300, 'ضغط الدم الانقباضي خارج النطاق (50–300)'),
      diastolicBP: z
        .number({ error: 'ضغط الدم الانبساطي مطلوب' })
        .min(30, 'ضغط الدم الانبساطي خارج النطاق (30–200)')
        .max(200, 'ضغط الدم الانبساطي خارج النطاق (30–200)'),
      heartRate: z
        .number({ error: 'نبضات القلب مطلوبة' })
        .int('نبضات القلب يجب أن تكون عدداً صحيحاً')
        .min(20, 'نبضات القلب خارج النطاق (20–250)')
        .max(250, 'نبضات القلب خارج النطاق (20–250)'),
      temperature: z
        .number({ error: 'حرارة الجسم مطلوبة' })
        .min(30, 'حرارة الجسم خارج النطاق (30–45)')
        .max(45, 'حرارة الجسم خارج النطاق (30–45)'),
      spo2: z
        .number({ error: 'نسبة الأكسجين مطلوبة' })
        .int('نسبة الأكسجين يجب أن تكون عدداً صحيحاً')
        .min(50, 'نسبة الأكسجين خارج النطاق (50–100)')
        .max(100, 'نسبة الأكسجين لا تتجاوز 100%'),
    }),
  })
  .superRefine((data, ctx) => {
    if (data.duration.value > durationValueLimit(data.duration.unit)) {
      ctx.addIssue({
        code: 'custom',
        path: ['duration', 'value'],
        message: 'مدة الأعراض طويلة بشكل غير منطقي لهذه الوحدة',
      });
    }
    if (data.vitals.diastolicBP >= data.vitals.systolicBP) {
      ctx.addIssue({
        code: 'custom',
        path: ['vitals', 'diastolicBP'],
        message: 'الضغط الانبساطي يجب أن يكون أقل من الانقباضي',
      });
    }
  });

export type AssessmentPayload = z.infer<typeof assessmentSchema> & AssessmentInput;

/** Converts Zod issues into the small, safe shape returned by the API. */
export function formatIssues(error: z.ZodError): { path: string; messageAr: string }[] {
  return error.issues.slice(0, 12).map((issue) => ({
    path: issue.path.join('.') || 'body',
    messageAr: issue.message,
  }));
}
