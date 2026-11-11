import type {
  DurationUnit,
  SymptomDefinition,
  SymptomGroup,
  SpecialtyDefinition,
  VitalDefinition,
  VitalId,
  VitalStatus,
} from '../../../shared/types';
import type { Language } from './index';

/**
 * Medical content policy for the current phase.
 *
 * The clinical knowledge base has not been translated or reviewed in French or
 * English. Medical terms and narratives are therefore always rendered from the
 * Arabic source, whatever the interface language is. The language argument is
 * kept on these helpers so a future, physician-approved translation can be
 * introduced in one place without changing ids, scoring or components.
 *
 * Do not add machine-translated medical content here.
 */
export const CLINICAL_CONTENT_POLICY = {
  contentLanguage: 'ar',
  translationsAvailable: false,
  translationStatus: 'pending_medical_review',
} as const;

const VITAL_STATUS_LABELS_AR: Record<VitalStatus, string> = {
  critical_low: 'منخفض جداً',
  low: 'منخفض',
  normal: 'طبيعي',
  high: 'مرتفع',
  critical_high: 'مرتفع جداً',
};

/** Symptom terms are part of the unreviewed medical content: Arabic only. */
export function symptomLabel(symptom: SymptomDefinition, _language: Language): string {
  return symptom.labelAr;
}

export function symptomGroupLabel(group: SymptomGroup, _language: Language): string {
  return group.labelAr;
}

/** Specialty labels are clinical taxonomy, so they follow the same policy. */
export function specialtyLabel(
  specialty: SpecialtyDefinition,
  _language: Language,
): string {
  return specialty.labelAr;
}

export function vitalLabel(vital: VitalDefinition, _language: Language): string {
  return vital.labelAr;
}

export function vitalLabelById(
  _id: VitalId,
  _language: Language,
  fallback: string,
): string {
  return fallback;
}

/** Units are notation rather than medical text; bpm is clearer for LTR layouts. */
export function vitalUnit(vital: VitalDefinition, language: Language): string {
  if (vital.id === 'heartRate' && language !== 'ar') return 'bpm';
  return vital.unit;
}

export function vitalUnitById(id: VitalId, language: Language, fallback: string): string {
  return id === 'heartRate' && language !== 'ar' ? 'bpm' : fallback;
}

export function vitalStatusLabel(status: VitalStatus): string {
  return VITAL_STATUS_LABELS_AR[status];
}

/** Duration units are interface copy, not clinical terminology. */
export function durationUnitLabel(id: DurationUnit, language: Language): string {
  if (language === 'ar') {
    return id === 'hours' ? 'ساعة' : id === 'days' ? 'يوم' : 'أسبوع';
  }
  return id === 'hours' ? (language === 'fr' ? 'heures' : 'hours')
    : id === 'days' ? (language === 'fr' ? 'jours' : 'days')
      : language === 'fr' ? 'semaines' : 'weeks';
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
 * it is clinical content, not interface copy.
 */
export function localizeFinding(
  text: string,
  _language: Language,
  _symptoms: SymptomDefinition[],
): string {
  return text;
}
