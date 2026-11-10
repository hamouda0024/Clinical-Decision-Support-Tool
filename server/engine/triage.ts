import type { AssessmentInput, TriageAssessment, TriageLevel } from '../../shared/types.js';
import type { VitalsAnalysis } from './vitals.js';

const LEVEL_RANK: Record<TriageLevel, number> = {
  routine: 0,
  semi_urgent: 1,
  urgent: 2,
  emergency: 3,
};

const LABELS: Record<TriageLevel, Omit<TriageAssessment, 'level' | 'reasons' | 'earlyWarningScore'>> = {
  emergency: {
    labelAr: 'حالة طارئة — تدخل فوري',
    descriptionAr: 'توجد علامات تهدد الحياة. يجب تفعيل فريق الطوارئ والتقييم والتدخل دون تأخير.',
  },
  urgent: {
    labelAr: 'عاجل — تقييم خلال دقائق',
    descriptionAr: 'يُستحسن تقييم طبي عاجل ومراقبة العلامات الحيوية بشكل متكرر.',
  },
  semi_urgent: {
    labelAr: 'شبه عاجل — تقييم خلال ساعة',
    descriptionAr: 'الحالة تحتاج تقييماً طبياً في وقت قريب مع عدم إهمال أي تدهور.',
  },
  routine: {
    labelAr: 'روتيني — متابعة عادية',
    descriptionAr: 'لا توجد حالياً علامات إنذار واضحة، مع أهمية استمرار التقييم السريري.',
  },
};

/**
 * Rule-based triage. Deliberately conservative: any single red flag raises the
 * level to at least "urgent" so that the tool never under-triages.
 */
export function assessTriage(input: AssessmentInput, vitals: VitalsAnalysis): TriageAssessment {
  const symptoms = new Set(input.symptoms);
  const has = (id: string) => symptoms.has(id);
  const reasons: string[] = [];
  let level: TriageLevel = 'routine';

  const raise = (next: TriageLevel, reason: string) => {
    reasons.push(reason);
    if (LEVEL_RANK[next] > LEVEL_RANK[level]) level = next;
  };

  // ---- Vital-sign driven escalation -------------------------------------
  if (vitals.earlyWarningScore >= 7) {
    raise('emergency', `درجة الإنذار المبكر مرتفعة (${vitals.earlyWarningScore})`);
  } else if (vitals.earlyWarningScore >= 5) {
    raise('urgent', `درجة الإنذار المبكر متوسطة إلى مرتفعة (${vitals.earlyWarningScore})`);
  } else if (vitals.earlyWarningScore >= 2) {
    raise('semi_urgent', `وجود تغيّرات في العلامات الحيوية (درجة الإنذار ${vitals.earlyWarningScore})`);
  }

  if (input.vitals.spo2 < 90) raise('emergency', 'تشبّع الأكسجين أقل من 90%');
  else if (input.vitals.spo2 < 94) raise('urgent', 'تشبّع الأكسجين أقل من 94%');

  if (input.vitals.systolicBP < 90) raise('emergency', 'ضغط الدم الانقباضي أقل من 90 مم زئبق');
  else if (input.vitals.systolicBP < 100) raise('urgent', 'ضغط دم انقباضي منخفض');

  if (input.vitals.heartRate > 130) raise('emergency', 'تسرّع قلب شديد (أكثر من 130/دقيقة)');
  else if (input.vitals.heartRate < 40) raise('emergency', 'تباطؤ قلب شديد (أقل من 40/دقيقة)');
  else if (input.vitals.heartRate > 110) raise('urgent', 'تسرّع قلب واضح');

  if (input.vitals.temperature >= 40) raise('emergency', 'حرارة الجسم 40°م أو أعلى');
  else if (input.vitals.temperature < 35) raise('emergency', 'انخفاض حرارة الجسم دون 35°م');
  else if (input.vitals.temperature >= 38.5) raise('urgent', 'حرارة مرتفعة');

  // ---- Red-flag symptom patterns ----------------------------------------
  if (has('chest_pain') && (has('diaphoresis') || has('dyspnea') || has('syncope'))) {
    raise('emergency', 'ألم صدري مع تعرّق/ضيق نفس — اشتباه متلازمة تاجية حادة');
  }
  if (has('chest_pain_tearing')) raise('emergency', 'ألم صدري تمزقي مفاجئ — اشتباه تسلّخ أبهر');
  if (has('sudden_headache')) raise('emergency', 'صداع مفاجئ شديد — استبعاد نزف دماغي');
  if ((has('focal_weakness') || has('facial_droop') || has('speech_difficulty')) && input.age >= 18) {
    raise('emergency', 'أعراض عصبية بؤرية مفاجئة — اشتباه سكتة دماغية');
  }
  if (has('neck_stiffness') && has('fever')) raise('emergency', 'حرارة مع تيبّس رقبة — اشتباه التهاب سحايا');
  if (has('angioedema')) raise('emergency', 'تورّم وجهي/لساني — خطر انسداد مجرى الهواء');
  if (has('hematemesis') || has('melena')) raise('emergency', 'نزف هضمي علوي');
  if (has('hemoptysis')) raise('urgent', 'نفث دم');
  if (has('confusion') && (has('fever') || input.age >= 65)) {
    raise('urgent', 'تغيّر في مستوى الوعي — يستدعي تقييماً عاجلاً');
  }
  if (has('dyspnea') && input.vitals.spo2 < 94) raise('urgent', 'ضيق نفس مع نقص أكسجة');
  if (has('syncope') && (has('palpitations') || has('chest_pain'))) {
    raise('urgent', 'إغماء مع خفقان/ألم صدري — يستدعي تقييماً عاجلاً');
  }

  // Any catalogue red flag that did not match a specific rule above.
  if (level === 'routine' && input.symptoms.length > 0) {
    const redFlagRule = has('dyspnea') || has('syncope') || has('confusion');
    if (redFlagRule) raise('semi_urgent', 'وجود أعراض تستدعي مراقبة سريرية');
  }

  if (reasons.length === 0) {
    reasons.push('جميع العلامات الحيوية المُدخلة ضمن المدى المقبول');
    reasons.push('لم تُسجَّل أعراض إنذارية في النموذج');
  }

  const base = LABELS[level];
  return {
    level,
    ...base,
    reasons: reasons.slice(0, 8),
    earlyWarningScore: vitals.earlyWarningScore,
  };
}
