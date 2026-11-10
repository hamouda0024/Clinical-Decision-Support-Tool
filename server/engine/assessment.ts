import type {
  AssessmentInput,
  AssessmentResult,
  DifferentialDiagnosis,
} from '../../shared/types.js';
import { SPECIALTIES, SYMPTOMS } from '../data/catalog.js';
import {
  COURSE_LABEL_AR,
  DISEASE_COURSE,
  courseDistance,
  durationInHours,
  durationToCourse,
} from '../data/course.js';
import {
  CLINICAL_LIMITATIONS,
  CLINICAL_GOVERNANCE_NOTICE_AR,
  MIN_ADULT_AGE,
} from '../data/governance.js';
import {
  DISEASES,
  KNOWLEDGE_BASE_GOVERNANCE,
  KNOWLEDGE_BASE_SIZE,
} from '../data/knowledge-base.js';
import type { Disease, VitalCriterion } from './types.js';
import { assessTriage } from './triage.js';
import { analyseVitals } from './vitals.js';

export const ENGINE_VERSION = '1.1.0';

export const DISCLAIMER_AR =
  'هذه الأداة تعليمية لدعم القرار السريري فقط، ولا تُعدّ تشخيصاً نهائياً ولا بديلاً عن التقييم السريري المباشر والفحص البدني والاستشارة الطبية المتخصصة. النتائج احتمالية ومبنية على قاعدة معرفة مبسطة، ويجب التحقق منها دائماً وفق المعايير السريرية المعتمدة وحالة المريض الفردية.';

export const DISCLAIMER_EN =
  'This tool is for educational clinical decision support only. It is not a diagnosis and does not replace direct clinical assessment, physical examination, or specialist consultation. Outputs are probabilistic, based on a simplified knowledge base, and must always be verified against validated guidelines and the individual patient.';

/** Kept separate so the UI can show the governance notice without duplicating it. */
export const GOVERNANCE_NOTICE_AR = CLINICAL_GOVERNANCE_NOTICE_AR;

const SYMPTOM_LABEL = new Map(SYMPTOMS.map((s) => [s.id, s.labelAr]));
const SPECIALTY_LABEL = new Map(SPECIALTIES.map((s) => [s.id, s]));

/** Weights of the three evidence channels (risk weight is redistributed when absent). */
const BASE_WEIGHTS = { symptom: 0.6, vital: 0.28, risk: 0.12 };
const SPECIALTY_BONUS = 0.05;
const MAX_CONFIDENCE = 92;
const MIN_CONFIDENCE = 8;
const MAX_DIFFERENTIALS = 6;

function matchesCriterion(value: number, criterion: VitalCriterion): boolean {
  switch (criterion.op) {
    case 'lt':
      return value < criterion.value;
    case 'lte':
      return value <= criterion.value;
    case 'gt':
      return value > criterion.value;
    case 'gte':
      return value >= criterion.value;
  }
}

function riskMatches(
  risk: { minAge?: number; maxAge?: number; sex?: string },
  input: AssessmentInput,
): boolean {
  if (risk.minAge !== undefined && input.age < risk.minAge) return false;
  if (risk.maxAge !== undefined && input.age > risk.maxAge) return false;
  if (risk.sex !== undefined && risk.sex !== input.sex) return false;
  return true;
}

interface Scored {
  disease: Disease;
  confidence: number;
  matchedEvidence: string[];
  missingKeyFindings: string[];
  discouragingFindings: string[];
}

function scoreDisease(disease: Disease, input: AssessmentInput): Scored | null {
  const selected = new Set(input.symptoms);

  const matchedSymptoms = disease.symptoms.filter((s) => selected.has(s.id));
  if (matchedSymptoms.length === 0) return null;

  const symptomTotal = disease.symptoms.reduce((sum, s) => sum + s.weight, 0);
  const symptomScore =
    symptomTotal > 0 ? matchedSymptoms.reduce((sum, s) => sum + s.weight, 0) / symptomTotal : 0;

  const matchedVitals = disease.vitals.filter((c) => matchesCriterion(input.vitals[c.vital], c));
  const vitalTotal = disease.vitals.reduce((sum, c) => sum + c.weight, 0);
  const vitalScore =
    vitalTotal > 0 ? matchedVitals.reduce((sum, c) => sum + c.weight, 0) / vitalTotal : 0;

  const matchedRisks = disease.riskFactors.filter((r) => riskMatches(r, input));
  const riskTotal = disease.riskFactors.reduce((sum, r) => sum + r.weight, 0);
  const riskScore =
    riskTotal > 0 ? matchedRisks.reduce((sum, r) => sum + r.weight, 0) / riskTotal : 0;

  // Findings that make the hypothesis less likely.
  const matchedAgainst = (disease.against ?? []).filter((criterion) =>
    matchesCriterion(input.vitals[criterion.vital], criterion),
  );
  const penalty = matchedAgainst.reduce((sum, criterion) => sum + criterion.weight, 0) / 100;

  // Tempo compatibility: acute presentations gain a little weight when the history
  // is short, chronic ones when it is long, and clearly discordant tempos are penalised.
  const expectedCourse = DISEASE_COURSE[disease.id];
  const observedCourse = durationToCourse(
    durationInHours(input.duration.value, input.duration.unit),
  );
  const tempoDistance = expectedCourse ? courseDistance(observedCourse, expectedCourse) : 0;
  const tempoModifier = tempoDistance === 0 ? 0.03 : tempoDistance >= 2 ? -0.03 : 0;

  // Redistribute the risk weight when a disease has no risk factors.
  const weights = {
    symptom: BASE_WEIGHTS.symptom + (riskTotal === 0 ? BASE_WEIGHTS.risk : 0),
    vital: BASE_WEIGHTS.vital,
    risk: riskTotal > 0 ? BASE_WEIGHTS.risk : 0,
  };

  // Hallmark coverage: a hypothesis missing its defining findings is discounted,
  // so diseases with short symptom lists do not dominate by construction.
  const matchedKeyFindings = disease.keyFindings.filter((id) => selected.has(id)).length;
  const keyCoverage =
    disease.keyFindings.length > 0 ? matchedKeyFindings / disease.keyFindings.length : 1;
  const keyFactor = 0.75 + 0.25 * keyCoverage;

  const composite =
    (weights.symptom * symptomScore + weights.vital * vitalScore + weights.risk * riskScore) *
      keyFactor +
    (disease.specialties.includes(input.specialty) ? SPECIALTY_BONUS : 0) +
    tempoModifier -
    penalty;

  const confidence = Math.max(
    1,
    Math.min(MAX_CONFIDENCE, Math.round(composite * 100)),
  );

  const matchedEvidence = [
    ...matchedSymptoms
      .sort((a, b) => b.weight - a.weight)
      .map((s) => SYMPTOM_LABEL.get(s.id) ?? s.id),
    ...matchedVitals.map((c) => c.labelAr),
    ...matchedRisks.map((r) => r.labelAr),
    ...(tempoDistance === 0 ? ['مدة الأعراض متوافقة مع المسار السريري'] : []),
  ];

  const missingKeyFindings = disease.keyFindings
    .filter((id) => !selected.has(id))
    .map((id) => SYMPTOM_LABEL.get(id) ?? id);

  const discouragingFindings = [
    ...matchedAgainst.map((criterion) => criterion.labelAr),
    ...(tempoDistance >= 2 && expectedCourse
      ? [`مدة الأعراض لا تتفق مع المسار المتوقع (${COURSE_LABEL_AR[expectedCourse]})`]
      : []),
  ];

  return { disease, confidence, matchedEvidence, missingKeyFindings, discouragingFindings };
}

function toDifferential(scored: Scored): DifferentialDiagnosis {
  const specialtyId = scored.disease.specialties[0] ?? 'internal';
  const specialty = SPECIALTY_LABEL.get(specialtyId) ?? {
    id: specialtyId,
    labelAr: specialtyId,
    labelEn: specialtyId,
  };
  return {
    id: scored.disease.id,
    nameAr: scored.disease.nameAr,
    nameEn: scored.disease.nameEn,
    confidence: scored.confidence,
    specialty,
    summaryAr: scored.disease.summaryAr,
    matchedEvidence: scored.matchedEvidence,
    missingKeyFindings: scored.missingKeyFindings,
    discouragingFindings: scored.discouragingFindings,
    redFlags: scored.disease.redFlags,
    actions: scored.disease.actions,
  };
}

export function runAssessment(input: AssessmentInput): AssessmentResult {
  const vitalsAnalysis = analyseVitals(input.vitals);
  const triage = assessTriage(input, vitalsAnalysis);

  const scored = DISEASES.map((disease) => scoreDisease(disease, input))
    .filter((entry): entry is Scored => entry !== null)
    .sort((a, b) => b.confidence - a.confidence);

  const strong = scored.filter((entry) => entry.confidence >= MIN_CONFIDENCE);
  const selected = (strong.length > 0 ? strong : scored.slice(0, 3))
    .slice(0, MAX_DIFFERENTIALS)
    .map(toDifferential);

  const limitations = [...CLINICAL_LIMITATIONS];
  if (input.age < MIN_ADULT_AGE) {
    limitations.unshift(
      `عمر المريض (${input.age}) أقل من ${MIN_ADULT_AGE} سنة: قواعد البالغين غير مُتحقَّق منها لهذه الفئة، ولا يوجد مسار أطفال في هذه النسخة.`,
    );
  }

  return {
    triage,
    vitals: vitalsAnalysis.evaluations,
    differentials: selected,
    meta: {
      engineVersion: ENGINE_VERSION,
      generatedAt: new Date().toISOString(),
      knowledgeBaseEntries: KNOWLEDGE_BASE_SIZE,
      lowInformation: input.symptoms.length < 2,
      disclaimerAr: DISCLAIMER_AR,
      disclaimerEn: DISCLAIMER_EN,
      governance: KNOWLEDGE_BASE_GOVERNANCE,
      limitations,
    },
  };
}

/** Exposed for tests and for future "why this score" tooling. */
export const __internal = {
  scoreDisease,
  matchesCriterion,
  weights: BASE_WEIGHTS,
  maxConfidence: MAX_CONFIDENCE,
};
