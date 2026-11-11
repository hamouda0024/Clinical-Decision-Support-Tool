import type {
  DurationUnitDefinition,
  SymptomDefinition,
  SymptomGroup,
  SpecialtyDefinition,
  VitalDefinition,
  VitalId,
  VitalStatus,
} from '../../../shared/types';
import { VITALS } from '../../../server/data/catalog';
import type { Language } from './index';

/**
 * Medical content policy for the current phase.
 *
 * Catalogue terminology (symptoms, groups, specialties, vital signs and units)
 * is translated so the input form follows the selected interface language.
 * Translations are still pending physician review. Condition names, summaries,
 * findings and recommendations remain Arabic-only because they are clinical
 * narrative content and have not been translated or reviewed.
 */
export const CLINICAL_CONTENT_POLICY = {
  catalogueLabelsTranslated: true,
  narrativeLanguage: 'ar',
  translationStatus: 'pending_medical_review',
} as const;

function localizedLabel(
  language: Language,
  ar: string,
  fr?: string,
  en?: string,
): string {
  if (language === 'fr' && fr?.trim()) return fr;
  if (language === 'en' && en?.trim()) return en;
  return ar;
}

const VITAL_BY_ID = new Map(VITALS.map((vital) => [vital.id, vital]));

const VITAL_STATUS_LABELS_AR: Record<VitalStatus, string> = {
  critical_low: 'منخفض جداً',
  low: 'منخفض',
  normal: 'طبيعي',
  high: 'مرتفع',
  critical_high: 'مرتفع جداً',
};

export function symptomLabel(symptom: SymptomDefinition, language: Language): string {
  return localizedLabel(language, symptom.labelAr, symptom.labelFr, symptom.labelEn);
}

export function symptomGroupLabel(group: SymptomGroup, language: Language): string {
  return localizedLabel(language, group.labelAr, group.labelFr, group.labelEn);
}

export function specialtyLabel(
  specialty: SpecialtyDefinition,
  language: Language,
): string {
  return localizedLabel(language, specialty.labelAr, specialty.labelFr, specialty.labelEn);
}

export function vitalLabel(vital: VitalDefinition, language: Language): string {
  return localizedLabel(language, vital.labelAr, vital.labelFr, vital.labelEn);
}

export function vitalLabelById(
  id: VitalId,
  language: Language,
  fallback: string,
): string {
  const vital = VITAL_BY_ID.get(id);
  return vital ? vitalLabel(vital, language) : fallback;
}

/** Units are notation; Arabic remains the fallback when no translation exists. */
export function vitalUnit(vital: VitalDefinition, language: Language): string {
  return localizedLabel(language, vital.unit, vital.unitFr, vital.unitEn);
}

export function vitalUnitById(id: VitalId, language: Language, fallback: string): string {
  const vital = VITAL_BY_ID.get(id);
  return vital ? vitalUnit(vital, language) : fallback;
}

export function vitalStatusLabel(status: VitalStatus): string {
  return VITAL_STATUS_LABELS_AR[status];
}

/** Duration units are interface copy, not clinical terminology. */
export function durationUnitLabel(
  unit: DurationUnitDefinition,
  language: Language,
): string {
  return localizedLabel(language, unit.labelAr, unit.labelFr, unit.labelEn);
}

/**
 * Condition names remain the Arabic source until a reviewed translation is
 * supplied. `nameEn` is retained in the API contract for future use only.
 */
export function conditionName(
  diagnosis: { id: string; nameAr: string; nameEn: string },
  _language: Language,
): string {
  return diagnosis.nameAr;
}

/**
 * Evidence returned by the engine is already Arabic. Do not translate it here:
 * it is clinical narrative content, not interface copy.
 */
export function localizeFinding(
  text: string,
  _language: Language,
  _symptoms: SymptomDefinition[],
): string {
  return text;
}
