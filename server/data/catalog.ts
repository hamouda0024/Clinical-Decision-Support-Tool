import type {
  DurationUnit,
  SpecialtyDefinition,
  SymptomDefinition,
  SymptomGroup,
  VitalDefinition,
} from '../../shared/types.js';

/**
 * The symptom catalogue. Every symptom id referenced by the knowledge base must
 * exist here (enforced at startup by `knowledge-base.ts`).
 */
export const SYMPTOMS: SymptomDefinition[] = [
  // General
  { id: 'fever', labelAr: 'حرارة مرتفعة', labelEn: 'Fever', group: 'general' },
  { id: 'chills', labelAr: 'رجفة / قشعريرة', labelEn: 'Chills / rigors', group: 'general' },
  { id: 'fatigue', labelAr: 'تعب عام وإجهاد', labelEn: 'Fatigue', group: 'general' },
  { id: 'weight_loss', labelAr: 'نقص وزن غير مفسر', labelEn: 'Unintentional weight loss', group: 'general' },
  { id: 'night_sweats', labelAr: 'تعرق ليلي', labelEn: 'Night sweats', group: 'general' },
  { id: 'myalgia', labelAr: 'آلام عضلية', labelEn: 'Myalgia', group: 'general' },

  // Cardiovascular
  { id: 'chest_pain', labelAr: 'ألم في الصدر', labelEn: 'Chest pain', group: 'cardiovascular', redFlag: true },
  { id: 'chest_pain_tearing', labelAr: 'ألم صدري تمزقي مفاجئ', labelEn: 'Sudden tearing chest pain', group: 'cardiovascular', redFlag: true },
  { id: 'palpitations', labelAr: 'خفقان', labelEn: 'Palpitations', group: 'cardiovascular' },
  { id: 'dyspnea', labelAr: 'ضيق في التنفس', labelEn: 'Dyspnea', group: 'cardiovascular', redFlag: true },
  { id: 'orthopnea', labelAr: 'ضيق نفس عند الاستلقاء', labelEn: 'Orthopnea', group: 'cardiovascular' },
  { id: 'edema', labelAr: 'تورّم الأطراف', labelEn: 'Peripheral edema', group: 'cardiovascular' },
  { id: 'syncope', labelAr: 'إغماء / فقدان وعي', labelEn: 'Syncope', group: 'cardiovascular', redFlag: true },
  { id: 'diaphoresis', labelAr: 'تعرق بارد', labelEn: 'Cold diaphoresis', group: 'cardiovascular' },

  // Respiratory
  { id: 'cough', labelAr: 'سعال', labelEn: 'Cough', group: 'respiratory' },
  { id: 'sputum', labelAr: 'بلغم / قشع', labelEn: 'Sputum production', group: 'respiratory' },
  { id: 'hemoptysis', labelAr: 'نفث دم', labelEn: 'Hemoptysis', group: 'respiratory', redFlag: true },
  { id: 'wheeze', labelAr: 'أزيز / صفير تنفسي', labelEn: 'Wheezing', group: 'respiratory' },
  { id: 'pleuritic_pain', labelAr: 'ألم صدري جنبي تنفسي', labelEn: 'Pleuritic chest pain', group: 'respiratory' },
  { id: 'sore_throat', labelAr: 'التهاب الحلق', labelEn: 'Sore throat', group: 'respiratory' },
  { id: 'runny_nose', labelAr: 'رشح أنفي', labelEn: 'Rhinorrhea', group: 'respiratory' },

  // Gastrointestinal
  { id: 'nausea', labelAr: 'غثيان', labelEn: 'Nausea', group: 'gastrointestinal' },
  { id: 'vomiting', labelAr: 'قيء', labelEn: 'Vomiting', group: 'gastrointestinal' },
  { id: 'diarrhea', labelAr: 'إسهال', labelEn: 'Diarrhea', group: 'gastrointestinal' },
  { id: 'abdominal_pain', labelAr: 'ألم بطني', labelEn: 'Abdominal pain', group: 'gastrointestinal' },
  { id: 'epigastric_burning', labelAr: 'حرقة في فم المعدة', labelEn: 'Epigastric burning', group: 'gastrointestinal' },
  { id: 'anorexia', labelAr: 'فقدان الشهية', labelEn: 'Anorexia', group: 'gastrointestinal' },
  { id: 'hematemesis', labelAr: 'تقيؤ دم', labelEn: 'Hematemesis', group: 'gastrointestinal', redFlag: true },
  { id: 'melena', labelAr: 'براز أسود (ميلينا)', labelEn: 'Melena', group: 'gastrointestinal', redFlag: true },
  { id: 'constipation', labelAr: 'إمساك', labelEn: 'Constipation', group: 'gastrointestinal' },

  // Genitourinary
  { id: 'dysuria', labelAr: 'حرقة عند التبول', labelEn: 'Dysuria', group: 'genitourinary' },
  { id: 'frequency', labelAr: 'تكرار التبول', labelEn: 'Urinary frequency', group: 'genitourinary' },
  { id: 'hematuria', labelAr: 'دم في البول', labelEn: 'Hematuria', group: 'genitourinary' },
  { id: 'flank_pain', labelAr: 'ألم في الخاصرة', labelEn: 'Flank pain', group: 'genitourinary' },
  { id: 'polyuria', labelAr: 'كثرة التبول', labelEn: 'Polyuria', group: 'genitourinary' },
  { id: 'polydipsia', labelAr: 'عطش شديد', labelEn: 'Polydipsia', group: 'genitourinary' },

  // Neurological
  { id: 'headache', labelAr: 'صداع', labelEn: 'Headache', group: 'neurological' },
  { id: 'sudden_headache', labelAr: 'صداع مفاجئ شديد', labelEn: 'Sudden severe headache', group: 'neurological', redFlag: true },
  { id: 'photophobia', labelAr: 'رهاب الضوء', labelEn: 'Photophobia', group: 'neurological' },
  { id: 'neck_stiffness', labelAr: 'تيبّس الرقبة', labelEn: 'Neck stiffness', group: 'neurological', redFlag: true },
  { id: 'focal_weakness', labelAr: 'ضعف شقي / شلل', labelEn: 'Focal weakness', group: 'neurological', redFlag: true },
  { id: 'facial_droop', labelAr: 'انحراف زاوية الفم', labelEn: 'Facial droop', group: 'neurological', redFlag: true },
  { id: 'speech_difficulty', labelAr: 'تعتّم الكلام', labelEn: 'Speech difficulty', group: 'neurological', redFlag: true },
  { id: 'confusion', labelAr: 'تغير مستوى الوعي / تخليط', labelEn: 'Altered mental status', group: 'neurological', redFlag: true },
  { id: 'dizziness', labelAr: 'دوار', labelEn: 'Dizziness', group: 'neurological' },
  { id: 'tremor', labelAr: 'رعاش', labelEn: 'Tremor', group: 'neurological' },
  { id: 'paresthesia', labelAr: 'تنميل', labelEn: 'Paresthesia', group: 'neurological' },
  { id: 'aura', labelAr: 'هالة بصرية قبل الصداع', labelEn: 'Visual aura', group: 'neurological' },

  // Musculoskeletal
  { id: 'back_pain', labelAr: 'ألم في الظهر', labelEn: 'Back pain', group: 'musculoskeletal' },
  { id: 'joint_pain', labelAr: 'ألم مفاصل', labelEn: 'Joint pain', group: 'musculoskeletal' },
  { id: 'calf_pain', labelAr: 'ألم وتورّم الساق', labelEn: 'Calf pain / swelling', group: 'musculoskeletal' },

  // Skin
  { id: 'rash', labelAr: 'طفح جلدي', labelEn: 'Rash', group: 'skin' },
  { id: 'urticaria', labelAr: 'أرتيكاريا (شرى)', labelEn: 'Urticaria', group: 'skin' },
  { id: 'angioedema', labelAr: 'تورّم وجهي / لساني', labelEn: 'Angioedema', group: 'skin', redFlag: true },

  // Psychiatric
  { id: 'anxiety', labelAr: 'قلق', labelEn: 'Anxiety', group: 'psychiatric' },
  { id: 'fear_of_death', labelAr: 'خوف من الموت', labelEn: 'Fear of dying', group: 'psychiatric' },

  // Contextual
  { id: 'recent_immobility', labelAr: 'عدم حركة مطوّل / سفر حديث', labelEn: 'Recent immobility', group: 'context' },
  { id: 'recent_surgery', labelAr: 'جراحة حديثة', labelEn: 'Recent surgery', group: 'context' },
];

export const SYMPTOM_GROUPS: SymptomGroup[] = [
  { id: 'general', labelAr: 'أعراض عامة' },
  { id: 'cardiovascular', labelAr: 'القلب والأوعية' },
  { id: 'respiratory', labelAr: 'الجهاز التنفسي' },
  { id: 'gastrointestinal', labelAr: 'الجهاز الهضمي' },
  { id: 'genitourinary', labelAr: 'الجهاز البولي' },
  { id: 'neurological', labelAr: 'الأعصاب' },
  { id: 'musculoskeletal', labelAr: 'العظام والمفاصل' },
  { id: 'skin', labelAr: 'الجلد والحساسية' },
  { id: 'psychiatric', labelAr: 'الحالة النفسية' },
  { id: 'context', labelAr: 'عوامل سياقية' },
];

export const SPECIALTIES: SpecialtyDefinition[] = [
  { id: 'emergency', labelAr: 'طوارئ', labelEn: 'Emergency Medicine' },
  { id: 'internal', labelAr: 'باطنية', labelEn: 'Internal Medicine' },
  { id: 'cardiology', labelAr: 'قلبية', labelEn: 'Cardiology' },
  { id: 'pulmonology', labelAr: 'صدرية', labelEn: 'Pulmonology' },
  { id: 'gastroenterology', labelAr: 'جهاز هضمي', labelEn: 'Gastroenterology' },
  { id: 'neurology', labelAr: 'أعصاب', labelEn: 'Neurology' },
  { id: 'urology', labelAr: 'مسالك بولية', labelEn: 'Urology' },
  { id: 'general_surgery', labelAr: 'جراحة عامة', labelEn: 'General Surgery' },
  { id: 'endocrinology', labelAr: 'غدد صماء', labelEn: 'Endocrinology' },
  { id: 'psychiatry', labelAr: 'نفسية', labelEn: 'Psychiatry' },
  { id: 'family_medicine', labelAr: 'طب أسري', labelEn: 'Family Medicine' },
];

export const VITALS: VitalDefinition[] = [
  {
    id: 'systolicBP',
    labelAr: 'ضغط الدم الانقباضي',
    unit: 'mmHg',
    min: 50,
    max: 300,
    step: 1,
    referenceAr: '90–140',
  },
  {
    id: 'diastolicBP',
    labelAr: 'ضغط الدم الانبساطي',
    unit: 'mmHg',
    min: 30,
    max: 200,
    step: 1,
    referenceAr: '60–90',
  },
  {
    id: 'heartRate',
    labelAr: 'نبضات القلب',
    unit: 'نبضة/د',
    min: 20,
    max: 250,
    step: 1,
    referenceAr: '60–100',
  },
  {
    id: 'temperature',
    labelAr: 'حرارة الجسم',
    unit: '°C',
    min: 30,
    max: 45,
    step: 0.1,
    referenceAr: '36.1–37.5',
  },
  {
    id: 'spo2',
    labelAr: 'تشبّع الأكسجين (SpO₂)',
    unit: '%',
    min: 50,
    max: 100,
    step: 1,
    referenceAr: '≥ 94%',
  },
];

export const DURATION_UNITS: { id: DurationUnit; labelAr: string }[] = [
  { id: 'hours', labelAr: 'ساعة' },
  { id: 'days', labelAr: 'يوم' },
  { id: 'weeks', labelAr: 'أسبوع' },
];

export const LIMITS = {
  minAge: 0,
  maxAge: 120,
  maxSymptoms: 25,
  maxDurationValue: 365,
} as const;
