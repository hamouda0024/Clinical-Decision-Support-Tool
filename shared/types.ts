/**
 * Shared contracts between the client and the API.
 * Changing these types is a breaking change for both sides.
 */

export const SEXES = ['male', 'female', 'other'] as const;
export type Sex = (typeof SEXES)[number];

export const DURATION_UNITS = ['hours', 'days', 'weeks'] as const;
export type DurationUnit = (typeof DURATION_UNITS)[number];

export const VITAL_IDS = [
  'systolicBP',
  'diastolicBP',
  'heartRate',
  'temperature',
  'spo2',
] as const;
export type VitalId = (typeof VITAL_IDS)[number];

/** Vitals as submitted by the clinician (all required, validated server-side). */
export type Vitals = Record<VitalId, number>;

export interface AssessmentInput {
  age: number;
  sex: Sex;
  /** Selected medical specialty / department. */
  specialty: SpecialtyId;
  /** Symptom duration at presentation. */
  duration: { value: number; unit: DurationUnit };
  /** Symptom ids from `GET /api/catalog`. */
  symptoms: string[];
  vitals: Vitals;
}

export interface SymptomDefinition {
  id: string;
  labelAr: string;
  labelEn: string;
  group: SymptomGroupId;
  /** Marks symptoms that may indicate a time-critical condition. */
  redFlag?: boolean;
}

export interface SymptomGroup {
  id: SymptomGroupId;
  labelAr: string;
}

export type SymptomGroupId =
  | 'general'
  | 'cardiovascular'
  | 'respiratory'
  | 'gastrointestinal'
  | 'genitourinary'
  | 'neurological'
  | 'musculoskeletal'
  | 'skin'
  | 'psychiatric'
  | 'context';

export interface SpecialtyDefinition {
  id: SpecialtyId;
  labelAr: string;
  labelEn: string;
}

export type SpecialtyId =
  | 'emergency'
  | 'internal'
  | 'cardiology'
  | 'pulmonology'
  | 'gastroenterology'
  | 'neurology'
  | 'urology'
  | 'general_surgery'
  | 'endocrinology'
  | 'psychiatry'
  | 'family_medicine';

export interface VitalDefinition {
  id: VitalId;
  labelAr: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  /** Optional educational reference range for adults. */
  referenceAr: string;
}

export interface CatalogResponse {
  symptoms: SymptomDefinition[];
  symptomGroups: SymptomGroup[];
  specialties: SpecialtyDefinition[];
  vitals: VitalDefinition[];
  durationUnits: { id: DurationUnit; labelAr: string }[];
  limits: { minAge: number; maxAge: number; maxSymptoms: number };
}

export type TriageLevel = 'emergency' | 'urgent' | 'semi_urgent' | 'routine';

export interface TriageAssessment {
  level: TriageLevel;
  labelAr: string;
  descriptionAr: string;
  /** Human-readable reasons behind the triage level. */
  reasons: string[];
  /** Simplified early-warning score (0–7 per NEWS2-style aggregation, max 15 here). */
  earlyWarningScore: number;
}

export type VitalStatus = 'critical_low' | 'low' | 'normal' | 'high' | 'critical_high';

export interface VitalEvaluation {
  id: VitalId;
  labelAr: string;
  value: number;
  unit: string;
  status: VitalStatus;
  noteAr: string;
}

export interface MedicationSuggestion {
  name: string;
  noteAr: string;
}

export interface RecommendedActions {
  labs: string[];
  imaging: string[];
  immediate: string[];
  medications: MedicationSuggestion[];
  alerts: string[];
}

export interface DifferentialDiagnosis {
  id: string;
  nameAr: string;
  nameEn: string;
  /** 0–100, relative certainty of the hypothesis given the entered data. */
  confidence: number;
  specialty: SpecialtyDefinition;
  summaryAr: string;
  matchedEvidence: string[];
  missingKeyFindings: string[];
  /** Entered findings that argue against this hypothesis. */
  discouragingFindings: string[];
  redFlags: string[];
  actions: RecommendedActions;
}

export interface AssessmentResult {
  triage: TriageAssessment;
  vitals: VitalEvaluation[];
  differentials: DifferentialDiagnosis[];
  meta: {
    engineVersion: string;
    generatedAt: string;
    knowledgeBaseEntries: number;
    /** True when too few findings were supplied for a meaningful ranking. */
    lowInformation: boolean;
    disclaimerAr: string;
    disclaimerEn: string;
  };
}

export interface ApiError {
  error: {
    code: string;
    messageAr: string;
    issues?: { path: string; messageAr: string }[];
  };
}
