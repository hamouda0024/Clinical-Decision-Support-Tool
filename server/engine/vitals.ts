import type { VitalEvaluation, Vitals, VitalStatus } from '../../shared/types.js';
import { VITALS } from '../data/catalog.js';

interface Band {
  min: number;
  status: VitalStatus;
  noteAr: string;
}

interface VitalRule {
  bands: Band[];
  /**
   * Points (0–3) of this tool's own simplified early-warning score. The rules are
   * inspired by common early-warning systems but are not NEWS2: respiratory rate,
   * consciousness and oxygen delivery are not collected.
   */
  points: (value: number) => number;
  /** Maximum points this parameter can contribute. */
  maxPoints: number;
}

const RULES: Record<keyof Vitals, VitalRule> = {
  systolicBP: {
    bands: [
      { min: 0, status: 'critical_low', noteAr: 'انخفاض شديد في ضغط الدم — احتمال صدمة، يحتاج تدخلاً عاجلاً' },
      { min: 90, status: 'low', noteAr: 'ضغط دم منخفض' },
      { min: 100, status: 'normal', noteAr: 'ضمن المدى المقبول' },
      { min: 140, status: 'high', noteAr: 'ارتفاع في ضغط الدم' },
      { min: 180, status: 'critical_high', noteAr: 'ارتفاع شديد في ضغط الدم — يستدعي تقييماً عاجلاً' },
    ],
    points: (v) => (v <= 90 ? 3 : v <= 100 ? 2 : v <= 110 ? 1 : v <= 219 ? 0 : 3),
    maxPoints: 3,
  },
  diastolicBP: {
    bands: [
      { min: 0, status: 'critical_low', noteAr: 'انخفاض شديد في الضغط الانبساطي' },
      { min: 50, status: 'low', noteAr: 'ضغط انبساطي منخفض' },
      { min: 60, status: 'normal', noteAr: 'ضمن المدى المقبول' },
      { min: 90, status: 'high', noteAr: 'ارتفاع في الضغط الانبساطي' },
      { min: 110, status: 'critical_high', noteAr: 'ارتفاع شديد في الضغط الانبساطي' },
    ],
    points: () => 0,
    maxPoints: 0,
  },
  heartRate: {
    bands: [
      { min: 0, status: 'critical_low', noteAr: 'تباطؤ شديد في النبض — قد يحتاج تدخلاً فورياً' },
      { min: 40, status: 'low', noteAr: 'تباطؤ في النبض' },
      { min: 60, status: 'normal', noteAr: 'ضمن المدى المقبول' },
      { min: 101, status: 'high', noteAr: 'تسرّع في النبض' },
      { min: 131, status: 'critical_high', noteAr: 'تسرّع شديد في النبض — يستدعي تقييماً عاجلاً' },
    ],
    points: (v) => (v <= 40 ? 3 : v <= 50 ? 1 : v <= 90 ? 0 : v <= 110 ? 1 : v <= 130 ? 2 : 3),
    maxPoints: 3,
  },
  temperature: {
    bands: [
      { min: 0, status: 'critical_low', noteAr: 'انخفاض شديد في حرارة الجسم — احتمال إنتان أو تعرض' },
      { min: 35, status: 'low', noteAr: 'انخفاض في حرارة الجسم' },
      { min: 36.1, status: 'normal', noteAr: 'ضمن المدى المقبول' },
      { min: 37.6, status: 'high', noteAr: 'حرارة مرتفعة' },
      { min: 40, status: 'critical_high', noteAr: 'حرارة شديدة الارتفاع — تدبير عاجل' },
    ],
    points: (v) => (v <= 35 ? 3 : v <= 36 ? 1 : v <= 38 ? 0 : v <= 39 ? 1 : 2),
    maxPoints: 2,
  },
  spo2: {
    bands: [
      { min: 0, status: 'critical_low', noteAr: 'نقص أكسجة شديد — يحتاج أكسجين وتقييماً فورياً' },
      { min: 90, status: 'low', noteAr: 'نقص في تشبّع الأكسجين' },
      { min: 94, status: 'normal', noteAr: 'ضمن المدى المقبول' },
    ],
    points: (v) => (v >= 96 ? 0 : v >= 94 ? 1 : v >= 92 ? 2 : 3),
    maxPoints: 3,
  },
};

const STATUS_WEIGHT: Record<VitalStatus, number> = {
  critical_low: 3,
  low: 1,
  normal: 0,
  high: 1,
  critical_high: 3,
};

function evaluateOne(id: keyof Vitals, value: number): VitalEvaluation {
  const definition = VITALS.find((v) => v.id === id);
  const rule = RULES[id];
  let band = rule.bands[0]!;
  for (const candidate of rule.bands) {
    if (value >= candidate.min) band = candidate;
  }
  return {
    id,
    labelAr: definition?.labelAr ?? id,
    value,
    unit: definition?.unit ?? '',
    status: band.status,
    noteAr: band.noteAr,
  };
}

export interface VitalsAnalysis {
  evaluations: VitalEvaluation[];
  /** Simplified early-warning score across measured parameters. */
  earlyWarningScore: number;
  /** Highest reachable value of the simplified score (11 with the current rules). */
  earlyWarningMax: number;
  /** Number of clearly abnormal parameters. */
  abnormalCount: number;
  /** Highest severity weight across single parameters (0–3). */
  peakSeverity: number;
}

export function analyseVitals(vitals: Vitals): VitalsAnalysis {
  const ids = Object.keys(RULES) as (keyof Vitals)[];
  const evaluations = ids.map((id) => evaluateOne(id, vitals[id]));
  const earlyWarningScore = ids.reduce((sum, id) => sum + RULES[id].points(vitals[id]), 0);
  const earlyWarningMax = ids.reduce((sum, id) => sum + RULES[id].maxPoints, 0);
  const abnormalCount = evaluations.filter((e) => e.status !== 'normal').length;
  const peakSeverity = evaluations.reduce(
    (peak, evaluation) => Math.max(peak, STATUS_WEIGHT[evaluation.status]),
    0,
  );
  return { evaluations, earlyWarningScore, earlyWarningMax, abnormalCount, peakSeverity };
}
