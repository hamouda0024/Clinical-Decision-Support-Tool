import type {
  RecommendedActions,
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
}
