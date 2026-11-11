import type {
  DurationUnitDefinition,
  SpecialtyDefinition,
  SymptomDefinition,
  SymptomGroup,
  VitalDefinition,
} from '../../shared/types.js';

/**
 * The symptom catalogue. Every symptom id referenced by the knowledge base must
 * exist here (enforced at startup by `knowledge-base.ts`).
 *
 * French and English labels are catalogue terminology, not reviewed clinical
 * narratives. They follow the interface language and fall back to Arabic when a
 * translation is absent. Any term whose translation is ambiguous is listed in
 * `docs/QUESTIONS_FOR_DOCTOR.md` for physician review.
 */
export const SYMPTOMS: SymptomDefinition[] = [
  // General
  { id: 'fever', labelAr: 'حرارة مرتفعة', labelFr: 'Fièvre', labelEn: 'Fever', group: 'general' },
  { id: 'chills', labelAr: 'رجفة / قشعريرة', labelFr: 'Frissons', labelEn: 'Chills / rigors', group: 'general' },
  { id: 'fatigue', labelAr: 'تعب عام وإجهاد', labelFr: 'Fatigue', labelEn: 'Fatigue', group: 'general' },
  { id: 'weight_loss', labelAr: 'نقص وزن غير مفسر', labelFr: 'Perte de poids involontaire', labelEn: 'Unintentional weight loss', group: 'general' },
  { id: 'night_sweats', labelAr: 'تعرق ليلي', labelFr: 'Sueurs nocturnes', labelEn: 'Night sweats', group: 'general' },
  { id: 'myalgia', labelAr: 'آلام عضلية', labelFr: 'Myalgies', labelEn: 'Myalgia', group: 'general' },

  // Cardiovascular
  { id: 'chest_pain', labelAr: 'ألم في الصدر', labelFr: 'Douleur thoracique', labelEn: 'Chest pain', group: 'cardiovascular', redFlag: true },
  { id: 'chest_pain_tearing', labelAr: 'ألم صدري تمزقي مفاجئ', labelFr: 'Douleur thoracique déchirante d’apparition brutale', labelEn: 'Sudden tearing chest pain', group: 'cardiovascular', redFlag: true },
  { id: 'palpitations', labelAr: 'خفقان', labelFr: 'Palpitations', labelEn: 'Palpitations', group: 'cardiovascular' },
  { id: 'dyspnea', labelAr: 'ضيق في التنفس', labelFr: 'Dyspnée', labelEn: 'Dyspnea', group: 'cardiovascular', redFlag: true },
  { id: 'orthopnea', labelAr: 'ضيق نفس عند الاستلقاء', labelFr: 'Orthopnée', labelEn: 'Orthopnea', group: 'cardiovascular' },
  { id: 'edema', labelAr: 'تورّم الأطراف', labelFr: 'Œdèmes périphériques', labelEn: 'Peripheral edema', group: 'cardiovascular' },
  { id: 'syncope', labelAr: 'إغماء / فقدان وعي', labelFr: 'Syncope', labelEn: 'Syncope', group: 'cardiovascular', redFlag: true },
  { id: 'diaphoresis', labelAr: 'تعرق بارد', labelFr: 'Sueurs froides', labelEn: 'Cold diaphoresis', group: 'cardiovascular' },

  // Respiratory
  { id: 'cough', labelAr: 'سعال', labelFr: 'Toux', labelEn: 'Cough', group: 'respiratory' },
  { id: 'sputum', labelAr: 'بلغم / قشع', labelFr: 'Expectoration', labelEn: 'Sputum production', group: 'respiratory' },
  { id: 'hemoptysis', labelAr: 'نفث دم', labelFr: 'Hémoptysie', labelEn: 'Hemoptysis', group: 'respiratory', redFlag: true },
  { id: 'wheeze', labelAr: 'أزيز / صفير تنفسي', labelFr: 'Sibilances', labelEn: 'Wheezing', group: 'respiratory' },
  { id: 'pleuritic_pain', labelAr: 'ألم صدري جنبي تنفسي', labelFr: 'Douleur thoracique pleurétique', labelEn: 'Pleuritic chest pain', group: 'respiratory' },
  { id: 'sore_throat', labelAr: 'التهاب الحلق', labelFr: 'Mal de gorge', labelEn: 'Sore throat', group: 'respiratory' },
  { id: 'runny_nose', labelAr: 'رشح أنفي', labelFr: 'Rhinorrhée', labelEn: 'Rhinorrhea', group: 'respiratory' },

  // Gastrointestinal
  { id: 'nausea', labelAr: 'غثيان', labelFr: 'Nausées', labelEn: 'Nausea', group: 'gastrointestinal' },
  { id: 'vomiting', labelAr: 'قيء', labelFr: 'Vomissements', labelEn: 'Vomiting', group: 'gastrointestinal' },
  { id: 'diarrhea', labelAr: 'إسهال', labelFr: 'Diarrhée', labelEn: 'Diarrhea', group: 'gastrointestinal' },
  { id: 'abdominal_pain', labelAr: 'ألم بطني', labelFr: 'Douleur abdominale', labelEn: 'Abdominal pain', group: 'gastrointestinal' },
  { id: 'epigastric_burning', labelAr: 'حرقة في فم المعدة', labelFr: 'Brûlure épigastrique', labelEn: 'Epigastric burning', group: 'gastrointestinal' },
  { id: 'anorexia', labelAr: 'فقدان الشهية', labelFr: 'Anorexie', labelEn: 'Anorexia', group: 'gastrointestinal' },
  { id: 'hematemesis', labelAr: 'تقيؤ دم', labelFr: 'Hématémèse', labelEn: 'Hematemesis', group: 'gastrointestinal', redFlag: true },
  { id: 'melena', labelAr: 'براز أسود (ميلينا)', labelFr: 'Méléna', labelEn: 'Melena', group: 'gastrointestinal', redFlag: true },
  { id: 'constipation', labelAr: 'إمساك', labelFr: 'Constipation', labelEn: 'Constipation', group: 'gastrointestinal' },

  // Genitourinary
  { id: 'dysuria', labelAr: 'حرقة عند التبول', labelFr: 'Dysurie', labelEn: 'Dysuria', group: 'genitourinary' },
  { id: 'frequency', labelAr: 'تكرار التبول', labelFr: 'Pollakiurie', labelEn: 'Urinary frequency', group: 'genitourinary' },
  { id: 'hematuria', labelAr: 'دم في البول', labelFr: 'Hématurie', labelEn: 'Hematuria', group: 'genitourinary' },
  { id: 'flank_pain', labelAr: 'ألم في الخاصرة', labelFr: 'Douleur du flanc', labelEn: 'Flank pain', group: 'genitourinary' },
  { id: 'polyuria', labelAr: 'كثرة التبول', labelFr: 'Polyurie', labelEn: 'Polyuria', group: 'genitourinary' },
  { id: 'polydipsia', labelAr: 'عطش شديد', labelFr: 'Polydipsie', labelEn: 'Polydipsia', group: 'genitourinary' },

  // Neurological
  { id: 'headache', labelAr: 'صداع', labelFr: 'Céphalée', labelEn: 'Headache', group: 'neurological' },
  { id: 'sudden_headache', labelAr: 'صداع مفاجئ شديد', labelFr: 'Céphalée brutale intense', labelEn: 'Sudden severe headache', group: 'neurological', redFlag: true },
  { id: 'photophobia', labelAr: 'رهاب الضوء', labelFr: 'Photophobie', labelEn: 'Photophobia', group: 'neurological' },
  { id: 'neck_stiffness', labelAr: 'تيبّس الرقبة', labelFr: 'Raideur de la nuque', labelEn: 'Neck stiffness', group: 'neurological', redFlag: true },
  { id: 'focal_weakness', labelAr: 'ضعف شقي / شلل', labelFr: 'Déficit moteur focal', labelEn: 'Focal weakness', group: 'neurological', redFlag: true },
  { id: 'facial_droop', labelAr: 'انحراف زاوية الفم', labelFr: 'Asymétrie faciale', labelEn: 'Facial droop', group: 'neurological', redFlag: true },
  { id: 'speech_difficulty', labelAr: 'تعتّم الكلام', labelFr: 'Trouble de la parole', labelEn: 'Speech difficulty', group: 'neurological', redFlag: true },
  { id: 'confusion', labelAr: 'تغير مستوى الوعي / تخليط', labelFr: 'Altération de l’état mental', labelEn: 'Altered mental status', group: 'neurological', redFlag: true },
  { id: 'dizziness', labelAr: 'دوار', labelFr: 'Vertige', labelEn: 'Dizziness', group: 'neurological' },
  { id: 'tremor', labelAr: 'رعاش', labelFr: 'Tremblement', labelEn: 'Tremor', group: 'neurological' },
  { id: 'paresthesia', labelAr: 'تنميل', labelFr: 'Paresthésie', labelEn: 'Paresthesia', group: 'neurological' },
  { id: 'aura', labelAr: 'هالة بصرية قبل الصداع', labelFr: 'Aura visuelle', labelEn: 'Visual aura', group: 'neurological' },

  // Musculoskeletal
  { id: 'back_pain', labelAr: 'ألم في الظهر', labelFr: 'Douleur dorsale', labelEn: 'Back pain', group: 'musculoskeletal' },
  { id: 'joint_pain', labelAr: 'ألم مفاصل', labelFr: 'Douleur articulaire', labelEn: 'Joint pain', group: 'musculoskeletal' },
  { id: 'calf_pain', labelAr: 'ألم وتورّم الساق', labelFr: 'Douleur et gonflement du mollet', labelEn: 'Calf pain / swelling', group: 'musculoskeletal' },

  // Skin
  { id: 'rash', labelAr: 'طفح جلدي', labelFr: 'Éruption cutanée', labelEn: 'Rash', group: 'skin' },
  { id: 'urticaria', labelAr: 'أرتيكاريا (شرى)', labelFr: 'Urticaire', labelEn: 'Urticaria', group: 'skin' },
  { id: 'angioedema', labelAr: 'تورّم وجهي / لساني', labelFr: 'Œdème facial / lingual', labelEn: 'Angioedema', group: 'skin', redFlag: true },

  // Psychiatric
  { id: 'anxiety', labelAr: 'قلق', labelFr: 'Anxiété', labelEn: 'Anxiety', group: 'psychiatric' },
  { id: 'fear_of_death', labelAr: 'خوف من الموت', labelFr: 'Peur de mourir', labelEn: 'Fear of dying', group: 'psychiatric' },

  // Contextual
  { id: 'recent_immobility', labelAr: 'عدم حركة مطوّل / سفر حديث', labelFr: 'Immobilité prolongée récente / voyage récent', labelEn: 'Recent prolonged immobility / travel', group: 'context' },
  { id: 'recent_surgery', labelAr: 'جراحة حديثة', labelFr: 'Chirurgie récente', labelEn: 'Recent surgery', group: 'context' },
];

export const SYMPTOM_GROUPS: SymptomGroup[] = [
  { id: 'general', labelAr: 'أعراض عامة', labelFr: 'Signes généraux', labelEn: 'General symptoms' },
  { id: 'cardiovascular', labelAr: 'القلب والأوعية', labelFr: 'Cardiovasculaire', labelEn: 'Cardiovascular' },
  { id: 'respiratory', labelAr: 'الجهاز التنفسي', labelFr: 'Respiratoire', labelEn: 'Respiratory' },
  { id: 'gastrointestinal', labelAr: 'الجهاز الهضمي', labelFr: 'Gastro-intestinal', labelEn: 'Gastrointestinal' },
  { id: 'genitourinary', labelAr: 'الجهاز البولي', labelFr: 'Génito-urinaire', labelEn: 'Genitourinary' },
  { id: 'neurological', labelAr: 'الأعصاب', labelFr: 'Neurologique', labelEn: 'Neurological' },
  { id: 'musculoskeletal', labelAr: 'العظام والمفاصل', labelFr: 'Musculo-squelettique', labelEn: 'Musculoskeletal' },
  { id: 'skin', labelAr: 'الجلد والحساسية', labelFr: 'Peau et allergies', labelEn: 'Skin and allergy' },
  { id: 'psychiatric', labelAr: 'الحالة النفسية', labelFr: 'Psychiatrique', labelEn: 'Psychiatric' },
  { id: 'context', labelAr: 'عوامل سياقية', labelFr: 'Facteurs contextuels', labelEn: 'Contextual factors' },
];

export const SPECIALTIES: SpecialtyDefinition[] = [
  { id: 'emergency', labelAr: 'طوارئ', labelFr: 'Médecine d’urgence', labelEn: 'Emergency Medicine' },
  { id: 'internal', labelAr: 'باطنية', labelFr: 'Médecine interne', labelEn: 'Internal Medicine' },
  { id: 'cardiology', labelAr: 'قلبية', labelFr: 'Cardiologie', labelEn: 'Cardiology' },
  { id: 'pulmonology', labelAr: 'صدرية', labelFr: 'Pneumologie', labelEn: 'Pulmonology' },
  { id: 'gastroenterology', labelAr: 'جهاز هضمي', labelFr: 'Gastro-entérologie', labelEn: 'Gastroenterology' },
  { id: 'neurology', labelAr: 'أعصاب', labelFr: 'Neurologie', labelEn: 'Neurology' },
  { id: 'urology', labelAr: 'مسالك بولية', labelFr: 'Urologie', labelEn: 'Urology' },
  { id: 'general_surgery', labelAr: 'جراحة عامة', labelFr: 'Chirurgie générale', labelEn: 'General Surgery' },
  { id: 'endocrinology', labelAr: 'غدد صماء', labelFr: 'Endocrinologie', labelEn: 'Endocrinology' },
  { id: 'psychiatry', labelAr: 'نفسية', labelFr: 'Psychiatrie', labelEn: 'Psychiatry' },
  { id: 'family_medicine', labelAr: 'طب أسري', labelFr: 'Médecine générale', labelEn: 'Family Medicine' },
];

export const VITALS: VitalDefinition[] = [
  {
    id: 'systolicBP',
    labelAr: 'ضغط الدم الانقباضي',
    labelFr: 'Pression artérielle systolique',
    labelEn: 'Systolic blood pressure',
    unit: 'mmHg',
    unitFr: 'mmHg',
    unitEn: 'mmHg',
    min: 50,
    max: 300,
    step: 1,
    referenceAr: '90–140',
  },
  {
    id: 'diastolicBP',
    labelAr: 'ضغط الدم الانبساطي',
    labelFr: 'Pression artérielle diastolique',
    labelEn: 'Diastolic blood pressure',
    unit: 'mmHg',
    unitFr: 'mmHg',
    unitEn: 'mmHg',
    min: 30,
    max: 200,
    step: 1,
    referenceAr: '60–90',
  },
  {
    id: 'heartRate',
    labelAr: 'نبضات القلب',
    labelFr: 'Fréquence cardiaque',
    labelEn: 'Heart rate',
    unit: 'نبضة/د',
    unitFr: 'bpm',
    unitEn: 'bpm',
    min: 20,
    max: 250,
    step: 1,
    referenceAr: '60–100',
  },
  {
    id: 'temperature',
    labelAr: 'حرارة الجسم',
    labelFr: 'Température corporelle',
    labelEn: 'Body temperature',
    unit: '°C',
    unitFr: '°C',
    unitEn: '°C',
    min: 30,
    max: 45,
    step: 0.1,
    referenceAr: '36.1–37.5',
  },
  {
    id: 'spo2',
    labelAr: 'تشبّع الأكسجين (SpO₂)',
    labelFr: 'Saturation en oxygène (SpO₂)',
    labelEn: 'Oxygen saturation (SpO₂)',
    unit: '%',
    unitFr: '%',
    unitEn: '%',
    min: 50,
    max: 100,
    step: 1,
    referenceAr: '≥ 94%',
  },
];

export const DURATION_UNITS: DurationUnitDefinition[] = [
  { id: 'hours', labelAr: 'ساعة', labelFr: 'Heures', labelEn: 'Hours' },
  { id: 'days', labelAr: 'يوم', labelFr: 'Jours', labelEn: 'Days' },
  { id: 'weeks', labelAr: 'أسبوع', labelFr: 'Semaines', labelEn: 'Weeks' },
];

export const LIMITS = {
  minAge: 0,
  maxAge: 120,
  maxSymptoms: 25,
  maxDurationValue: 365,
} as const;
