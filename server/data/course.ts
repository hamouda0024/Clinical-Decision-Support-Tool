import type { DurationUnit } from '../../shared/types.js';

export type ClinicalCourse = 'hyperacute' | 'acute' | 'subacute' | 'chronic';

/**
 * Expected tempo of each presentation. Used only as a small modifier: a
 * six-week history of chest pain should not rank acute coronary syndrome as
 * highly as a two-hour history does.
 */
export const DISEASE_COURSE: Record<string, ClinicalCourse> = {
  acute_coronary_syndrome: 'hyperacute',
  pulmonary_embolism: 'hyperacute',
  aortic_dissection: 'hyperacute',
  acute_ischemic_stroke: 'hyperacute',
  anaphylaxis: 'hyperacute',
  hypoglycemia: 'hyperacute',
  renal_colic: 'hyperacute',

  community_acquired_pneumonia: 'subacute',
  pyelonephritis: 'subacute',
  migraine: 'subacute',

  gerd: 'chronic',
  iron_deficiency_anemia: 'chronic',

  asthma_exacerbation: 'acute',
  copd_exacerbation: 'acute',
  heart_failure_decompensation: 'acute',
  sepsis: 'acute',
  acute_appendicitis: 'acute',
  acute_cholecystitis: 'acute',
  acute_gastroenteritis: 'acute',
  acute_cystitis: 'acute',
  bacterial_meningitis: 'acute',
  diabetic_ketoacidosis: 'acute',
  panic_attack: 'acute',
  viral_upper_respiratory_infection: 'acute',
};

const UNIT_HOURS: Record<DurationUnit, number> = { hours: 1, days: 24, weeks: 168 };
const ORDER: ClinicalCourse[] = ['hyperacute', 'acute', 'subacute', 'chronic'];

export const COURSE_LABEL_AR: Record<ClinicalCourse, string> = {
  hyperacute: 'حاد جداً (ساعات)',
  acute: 'حاد (أيام)',
  subacute: 'تحت الحاد (أيام إلى أسبوعين)',
  chronic: 'مزمن (أسابيع أو أكثر)',
};

export function durationInHours(value: number, unit: DurationUnit): number {
  return value * UNIT_HOURS[unit];
}

export function durationToCourse(hours: number): ClinicalCourse {
  if (hours <= 24) return 'hyperacute';
  if (hours <= 72) return 'acute';
  if (hours <= 24 * 14) return 'subacute';
  return 'chronic';
}

export function courseDistance(a: ClinicalCourse, b: ClinicalCourse): number {
  return Math.abs(ORDER.indexOf(a) - ORDER.indexOf(b));
}
