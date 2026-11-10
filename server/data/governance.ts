/**
 * Clinical governance metadata.
 *
 * The knowledge base is educational and has not yet been signed off by the
 * reviewing physician. Nothing here may claim clinical approval: a disease entry
 * becomes `approved` only when it carries a named reviewer and review date, and
 * the aggregate status is derived from the entries themselves.
 */

export const KNOWLEDGE_BASE_SCHEMA_VERSION = '2.0.0';

/** Age from which the adult-oriented scoring in this tool may be applied. */
export const MIN_ADULT_AGE = 16;

/**
 * Limits that apply to every assessment. They are returned with each result so
 * the UI can never present a simplified heuristic as a validated score.
 */
export const CLINICAL_LIMITATIONS: readonly string[] = [
  'قاعدة المعرفة تعليمية ولم تُعتمد بعد من الطبيب المراجع؛ لا تُستخدم سريرياً قبل اكتمال المراجعة والتوقيع.',
  'درجات الاحتمالية نسبية داخل هذه الأداة وليست احتمالات سريرية معايَرة ولا تشخيصاً مؤكداً.',
  'درجة الإنذار المبكر حساب مبسّط من خمس علامات حيوية وليست NEWS2؛ لا تشمل معدل التنفس أو مستوى الوعي أو مقياس الأكسجين.',
  'التقييم موجّه للبالغين (16 سنة فأكثر)؛ لا تُطبَّق قواعد البالغين على الأطفال أو الحوامل دون مسار مخصّص.',
  'لا تُراجع الأداة التفاعلات الدوائية ولا تعدّل الجرعات حسب الوزن أو وظائف الكلى والكبد أو الحمل؛ كل دواء يحتاج تحققاً مستقلاً.',
  'لا تُدخل نتائج مخبرية أو صوراً؛ التقييم يعتمد فقط على الأعراض والعلامات الحيوية المُدخلة.',
] as const;

export const CLINICAL_GOVERNANCE_NOTICE_AR =
  'المحتوى السريري في هذه النسخة غير مُراجع من طبيب بعد، ويُعرض للاستخدام التعليمي فقط.';
