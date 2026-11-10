import type {
  ClinicalReference,
  RecommendedActions,
  ReviewStatus,
  Sex,
  SpecialtyId,
  VitalId,
} from '../../shared/types.js';

export interface VitalCriterion {
  vital: VitalId;
  op: 'lt' | 'lte' | 'gt' | 'gte';
  value: number;
  /** Contribution to the disease score (1 = weak, 3 = strong). */
  weight: number;
  labelAr: string;
}

export interface DiscouragingCriterion extends VitalCriterion {
  /** Points (percent) subtracted from the composite score when present. */
  weight: number;
}

export interface RiskFactor {
  labelAr: string;
  weight: number;
  minAge?: number;
  maxAge?: number;
  sex?: Sex;
}

export interface DiseaseSymptom {
  id: string;
  /** 1 = minor, 2 = supportive, 3 = hallmark. */
  weight: number;
}

export interface ClinicalReview {
  status: ReviewStatus;
  /** Named physician who signed off; required once status is `approved`. */
  reviewer?: string;
  /** ISO date of the last review; required once status is `approved`. */
  lastReviewedAt?: string;
}

export interface Disease {
  id: string;
  nameAr: string;
  nameEn: string;
  icd10?: string[];
  specialties: SpecialtyId[];
  summaryAr: string;
  symptoms: DiseaseSymptom[];
  /** Hallmark symptom ids; used to explain what is missing. */
  keyFindings: string[];
  vitals: VitalCriterion[];
  /** Findings that make this hypothesis less likely (negative evidence). */
  against?: DiscouragingCriterion[];
  riskFactors: RiskFactor[];
  redFlags: string[];
  actions: RecommendedActions;
  /**
   * Physician review state. Optional in code so a new entry can be added without
   * pretending it was reviewed; the engine treats a missing review as
   * `unreviewed` and validation forbids claiming `approved` without a signer.
   */
  review?: ClinicalReview;
  /** Authoritative sources backing this entry, never generated automatically. */
  references?: ClinicalReference[];
}
