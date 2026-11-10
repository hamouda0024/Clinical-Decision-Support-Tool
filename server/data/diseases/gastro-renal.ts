import type { Disease } from '../../engine/types.js';

/** Gastrointestinal, hepatobiliary and genitourinary presentations. */
export const GASTRO_RENAL_DISEASES: Disease[] = [
  {
    id: 'acute_appendicitis',
    nameAr: 'التهاب الزائدة الدودية الحاد',
    nameEn: 'Acute Appendicitis',
    icd10: ['K35.80'],
    specialties: ['general_surgery', 'emergency', 'gastroenterology'],
    summaryAr:
      'التهاب حاد في الزائدة الدودية يبدأ عادة بألم حول السرة ينتقل إلى الربع السفلي الأيمن، وقد يتعقد بالانثقاب.',
    symptoms: [
      { id: 'abdominal_pain', weight: 3 },
      { id: 'anorexia', weight: 2 },
      { id: 'nausea', weight: 2 },
      { id: 'fever', weight: 2 },
      { id: 'vomiting', weight: 1 },
      { id: 'constipation', weight: 1 },
    ],
    keyFindings: ['abdominal_pain', 'anorexia', 'nausea'],
    vitals: [
      { vital: 'temperature', op: 'gt', value: 37.8, weight: 2, labelAr: 'حرارة مرتفعة قليلاً' },
      { vital: 'heartRate', op: 'gt', value: 100, weight: 1, labelAr: 'تسرّع القلب' },
    ],
    riskFactors: [{ labelAr: 'العمر 10–40 سنة', weight: 1, minAge: 10, maxAge: 40 }],
    redFlags: ['ألم شديد في الربع السفلي الأيمن', 'علامات تهيّج بريتواني', 'حرارة مرتفعة'],
    actions: {
      labs: [
        'تعداد دم كامل (ارتفاع الكريات البيضاء)',
        'CRP ووظائف كلى',
        'تحليل بول لاستبعاد التهاب المسالك',
        'اختبار حمل عند الإناث في سن الإنجاب',
      ],
      imaging: [
        'تخطيط صدى البطن أو CT بطن وحوض',
        'التصوير بالموجات فوق الصوتية مفضل عند النساء والأطفال',
      ],
      immediate: [
        'إبقاء المريض صائماً (NPO)',
        'تسكين الألم ومكافحة الغثيان',
        'استشارة الجراحة العامة عاجلة',
        'مراقبة علامات الانثقاب (تصلب البطن، تدهور)',
      ],
      medications: [
        { name: 'Ceftriaxone + Metronidazole', noteAr: 'مضادات حيوية وريدية قبل الجراحة' },
        { name: 'Paracetamol / Ketorolac', noteAr: 'تسكين الألم لا يؤخر التشخيص' },
      ],
      alerts: [
        'تحذير: لا تُستخدم المسكنات لتأخير التقييم الجراحي.',
        'تحذير: الإمساك أو الإسهال قد يخدعان التشخيص — التقييم السريري هو الأساس.',
        'تحذير: عند النساء استبعد الحمل الهاجر والتهاب الحوض.',
      ],
    },
  },
  {
    id: 'acute_cholecystitis',
    nameAr: 'التهاب المرارة الحاد',
    nameEn: 'Acute Cholecystitis',
    icd10: ['K81.0'],
    specialties: ['general_surgery', 'gastroenterology', 'emergency'],
    summaryAr:
      'التهاب المرارة غالباً بسبب حصوة معسرة، يسبب ألماً في الربع العلوي الأيمن وحرارة وغثياناً، ويحتاج مضادات حيوية وتقييماً جراحياً.',
    symptoms: [
      { id: 'abdominal_pain', weight: 3 },
      { id: 'nausea', weight: 2 },
      { id: 'fever', weight: 2 },
      { id: 'vomiting', weight: 1 },
      { id: 'anorexia', weight: 1 },
    ],
    keyFindings: ['abdominal_pain', 'nausea', 'fever'],
    vitals: [
      { vital: 'temperature', op: 'gt', value: 38, weight: 2, labelAr: 'حرارة مرتفعة' },
      { vital: 'heartRate', op: 'gt', value: 100, weight: 1, labelAr: 'تسرّع القلب' },
    ],
    riskFactors: [
      { labelAr: 'أنثى في سن الإنجاب', weight: 1, sex: 'female' },
      { labelAr: 'العمر ≥ 40 سنة', weight: 1, minAge: 40 },
    ],
    redFlags: ['ألم مستمر في الربع العلوي الأيمن', 'علامة Murphy إيجابية', 'حرارة مرتفعة'],
    actions: {
      labs: [
        'تعداد دم كامل، CRP',
        'وظائف كبد (ALT/AST/ALP/Bilirubin)',
        'إنزيمات البنكرياس (Lipase)',
        'تحليل بول',
      ],
      imaging: ['تخطيط صدى البطن (الفحص الأولي)', 'CT بطن عند التعقيد أو عدم الوضوح', 'HIDA scan عند التشخيص غير المؤكد'],
      immediate: [
        'صيام عن الطعام والتسكين',
        'مضادات حيوية وريدية تغطي البكتيريا المعوية',
        'استشارة الجراحة لاستئصال المرارة',
      ],
      medications: [
        { name: 'Ceftriaxone + Metronidazole', noteAr: 'أو Piperacillin-Tazobactam حسب الشدة' },
        { name: 'Ketorolac / Paracetamol', noteAr: 'لتسكين الألم' },
        { name: 'Ondansetron', noteAr: 'لمكافحة الغثيان' },
      ],
      alerts: [
        'تحذير: لا تؤخّر التصوير في المرضى المسنين أو السكريين (قد يغيب ألم البطن).',
        'تحذير: ارتفاع البيليروبين مع توسّع القناة الصفراوية يستدعي تقييماً للانسداد.',
        'تحذير: عدّل جرعة المضادات حسب وظائف الكلى.',
      ],
    },
  },
  {
    id: 'acute_gastroenteritis',
    nameAr: 'التهاب معوي معدي حاد',
    nameEn: 'Acute Gastroenteritis',
    icd10: ['A09', 'K52.9'],
    specialties: ['internal', 'family_medicine', 'gastroenterology', 'emergency'],
    summaryAr:
      'التهاب فيروسي أو بكتيري في الجهاز الهضمي يسبب إسهالاً وقيئاً، وأهم خطر هو التجفاف وانخفاض السوائل.',
    symptoms: [
      { id: 'diarrhea', weight: 3 },
      { id: 'vomiting', weight: 2 },
      { id: 'abdominal_pain', weight: 2 },
      { id: 'nausea', weight: 2 },
      { id: 'fever', weight: 1 },
      { id: 'fatigue', weight: 1 },
    ],
    keyFindings: ['diarrhea', 'vomiting', 'abdominal_pain'],
    vitals: [
      { vital: 'temperature', op: 'gt', value: 38, weight: 1, labelAr: 'حرارة مرتفعة قليلاً' },
      { vital: 'systolicBP', op: 'lt', value: 100, weight: 1, labelAr: 'انخفاض ضغط الدم (تجفاف)' },
      { vital: 'heartRate', op: 'gt', value: 100, weight: 1, labelAr: 'تسرّع القلب (تجفاف)' },
    ],
    riskFactors: [
      { labelAr: 'العمر ≥ 65 سنة', weight: 1, minAge: 65 },
      { labelAr: 'العمر ≤ 5 سنوات', weight: 1, maxAge: 5 },
    ],
    redFlags: ['تجفاف شديد', 'إسهال دموي', 'هبوط ضغط'],
    actions: {
      labs: [
        'وظائف كلى، شوارد، سكر (تقييم التجفاف والحماض)',
        'تعداد دم و CRP عند الشدة',
        'زرع براز عند الاشتباه بعدوى بكتيرية أو وجود إسهال دموي',
      ],
      imaging: ['لا تصوير روتيني', 'أشعة بطن عند الاشتباه بطبل/انثقاب'],
      immediate: [
        'محاليل فموية ORS (الخط الأساسي للعلاج)',
        'سوائل وريدية عند التجفاف الشديد أو الغثيان المستمر',
        'تقييم علامات التجفاف والحالة النشاطية',
      ],
      medications: [
        { name: 'Oral Rehydration Salts', noteAr: 'العلاج الأساسي — كميات صغيرة متكررة' },
        { name: 'Ondansetron', noteAr: 'لمكافحة القيء وتسهيل الإمهاء الفموي' },
        { name: 'Loperamide', noteAr: 'ممنوع عند الإسهال الدموي أو الحرارة العالية' },
      ],
      alerts: [
        'تحذير: لا تُعطَ المضادات الحيوية في الإسهال الفيروسي.',
        'تحذير: تجنّب Loperamide في الإسهال الدموي أو الاشتباه بالتهاب القولون.',
        'تحذير: الأطفال وكبار السن معرّضون للتجفاف السريع.',
      ],
    },
  },
  {
    id: 'gerd',
    nameAr: 'الارتداد المعدي المريئي / التهاب المعدة',
    nameEn: 'GERD / Dyspepsia',
    icd10: ['K21.9', 'K30'],
    specialties: ['gastroenterology', 'internal', 'family_medicine'],
    summaryAr:
      'حرقة وارتداد حمضي من المعدة إلى المريء، يُشخَّص غالباً سريرياً ويستدعي استبعاد الأعراض الخطرة.',
    symptoms: [
      { id: 'epigastric_burning', weight: 3 },
      { id: 'abdominal_pain', weight: 1 },
      { id: 'nausea', weight: 1 },
      { id: 'cough', weight: 1 },
      { id: 'chest_pain', weight: 1 },
    ],
    keyFindings: ['epigastric_burning'],
    vitals: [],
    against: [
      {
        vital: 'temperature',
        op: 'gt',
        value: 38.5,
        weight: 8,
        labelAr: 'حرارة مرتفعة — لا تتفق مع الارتداد المعدي المريئي وحده',
      },
    ],
    riskFactors: [{ labelAr: 'العمر ≥ 40 سنة', weight: 1, minAge: 40 }],
    redFlags: ['أعراض إنذارية: عسر بلع، نزف، فقدان وزن'],
    actions: {
      labs: [
        'لا تحاليل روتينية',
        'اختبار H. pylori وعلاجه عند الإيجابية',
        'تعداد دم عند الاشتباه بنزف',
      ],
      imaging: [
        'منظار هضمي علوي عند الأعراض الإنذارية أو العمر فوق 55 مع أعراض جديدة',
        'ECG لاستبعاد ألم قلبي في ألم الصدر',
      ],
      immediate: [
        'مراجعة الأدوية المهيّجة (NSAIDs)',
        'تعديل نمط الحياة: وجبات صغيرة، تجنب الليل، رفع رأس السرير',
        'متابعة الاستجابة لمثبطات مضخة البروتون',
      ],
      medications: [
        { name: 'Omeprazole 20–40 mg', noteAr: 'لمدة 4–8 أسابيع ثم مراجعة' },
        { name: 'Antacids / Alginates', noteAr: 'للتخفيف السريع' },
      ],
      alerts: [
        'تحذير: ألم الصدر يجب أن يُستبعد فيه التشخيص القلبي أولاً.',
        'تحذير: لا تعالج الأعراض الإنذارية دوائياً دون تقييم منظاري.',
        'تحذير: استخدام PPI طويل الأمد يستدعي مراجعة دورية.',
      ],
    },
  },
  {
    id: 'renal_colic',
    nameAr: 'مغص كلوي (حصوة الحالب)',
    nameEn: 'Renal Colic / Ureteric Stone',
    icd10: ['N23', 'N20.1'],
    specialties: ['urology', 'emergency', 'internal'],
    summaryAr:
      'ألم شديد متقطع في الخاصرة ينشأ من انحصار حصوة في المسالك البولية، وغالباً يُصحبه دم في البول وغثيان.',
    symptoms: [
      { id: 'flank_pain', weight: 3 },
      { id: 'hematuria', weight: 2 },
      { id: 'nausea', weight: 2 },
      { id: 'vomiting', weight: 1 },
      { id: 'dysuria', weight: 1 },
      { id: 'back_pain', weight: 1 },
    ],
    keyFindings: ['flank_pain', 'hematuria', 'nausea'],
    vitals: [
      { vital: 'heartRate', op: 'gt', value: 100, weight: 1, labelAr: 'تسرّع القلب (ألم)' },
      { vital: 'systolicBP', op: 'gt', value: 140, weight: 1, labelAr: 'ارتفاع ضغط الدم (ألم)' },
    ],
    riskFactors: [{ labelAr: 'العمر 20–55 سنة', weight: 1, minAge: 20, maxAge: 55 }],
    redFlags: ['حرارة مع ألم خاصرة (التهاب كلوي)', 'ألم مع انقطاع البول', 'قصور كلوي'],
    actions: {
      labs: [
        'تحليل بول (دم، كريات، نتريت)',
        'وظائف كلى وكرياتينين',
        'تعداد دم و CRP عند الحرارة',
        'تحليل حصوة عند إخراجها',
      ],
      imaging: [
        'CT بدون صبغة للمسالك (الفحص المرجعي)',
        'تخطيط صدى الكلى كبديل عند الحمل',
      ],
      immediate: [
        'تسكين الألم (NSAIDs أولاً عند عدم وجود موانع)',
        'إمهاء مناسب وتصفية البول',
        'استشارة مسالك عند وجود عدوى أو انسداد أو قصور كلوي',
      ],
      medications: [
        { name: 'Ketorolac / Diclofenac', noteAr: 'الخط الأول للألم — يُمنع في القصور الكلوي والقرحة النشطة' },
        { name: 'Ondansetron', noteAr: 'لمكافحة الغثيان' },
        { name: 'Tamsulosin', noteAr: 'قد يساعد في تمرير الحصوات الصغيرة حسب التقييم' },
      ],
      alerts: [
        'تحذير: لا تُستخدم NSAIDs في القصور الكلوي أو الحمل أو القرحة النشطة.',
        'تحذير: حصوة مع حرارة تعني التهاباً كلوياً طارئاً يحتاج تصريفاً عاجلاً.',
        'تحذير: الألم الشديد المترافق مع فقر دم يستدعي استبعاد أسباب أخرى.',
      ],
    },
  },
  {
    id: 'pyelonephritis',
    nameAr: 'التهاب الكلية والحويضة (التهاب بولي علوي)',
    nameEn: 'Acute Pyelonephritis',
    icd10: ['N10'],
    specialties: ['urology', 'internal', 'emergency', 'family_medicine'],
    summaryAr:
      'عدوى بكتيرية تصيب الكلية والحويضة، تسبب حرارة وألماً في الخاصرة وأعراضاً بولية، وتحتاج مضادات حيوية مناسبة.',
    symptoms: [
      { id: 'flank_pain', weight: 3 },
      { id: 'fever', weight: 3 },
      { id: 'dysuria', weight: 2 },
      { id: 'frequency', weight: 2 },
      { id: 'chills', weight: 2 },
      { id: 'nausea', weight: 2 },
      { id: 'vomiting', weight: 1 },
    ],
    keyFindings: ['flank_pain', 'fever', 'dysuria'],
    vitals: [
      { vital: 'temperature', op: 'gt', value: 38.3, weight: 2, labelAr: 'حرارة مرتفعة' },
      { vital: 'heartRate', op: 'gt', value: 100, weight: 1, labelAr: 'تسرّع القلب' },
      { vital: 'systolicBP', op: 'lt', value: 100, weight: 1, labelAr: 'انخفاض ضغط الدم' },
    ],
    riskFactors: [{ labelAr: 'أنثى', weight: 1, sex: 'female' }],
    redFlags: ['حرارة عالية مع رجفة', 'انخفاض ضغط الدم', 'غثيان وقيء متكرر'],
    actions: {
      labs: [
        'تحليل بول ومزرعة بول قبل المضادات',
        'تعداد دم، CRP، وظائف كلى',
        'زرع دم عند الحرارة العالية أو العجز المناعي',
      ],
      imaging: [
        'تخطيط صدى الكلى أو CT عند عدم الاستجابة بعد 48–72 ساعة',
        'استبعاد انسداد أو خراج كلوي',
      ],
      immediate: [
        'مضادات حيوية وريدية في الحالات المتوسطة والشديدة',
        'سوائل وريدية وتخفيف الألم',
        'تصريف الانسداد فوراً إن وجد',
      ],
      medications: [
        { name: 'Ceftriaxone', noteAr: 'خيار وريدي شائع في المرضى المنوّمين' },
        { name: 'Ciprofloxacin', noteAr: 'حسب حساسية المزرعة وأنماط المقاومة المحلية' },
        { name: 'Nitrofurantoin', noteAr: 'غير مناسب لالتهاب الكلية (لا يصل لتركيز كافٍ في النسيج)' },
      ],
      alerts: [
        'تحذير: لا تُستخدم Nitrofurantoin لعلاج التهاب الكلية.',
        'تحذير: Fluoroquinolones لها تحذيرات خطيرة وتُحفظ للحالات المحددة.',
        'تحذير: عدّل الجرعات حسب وظائف الكلى.',
      ],
    },
  },
  {
    id: 'acute_cystitis',
    nameAr: 'التهاب المثانة الحاد (التهاب بولي سفلي)',
    nameEn: 'Acute Cystitis',
    icd10: ['N30.00'],
    specialties: ['urology', 'internal', 'family_medicine'],
    summaryAr:
      'عدوى بكتيرية غير معقدة في المثانة تسبب حرقة وتكرار التبول، وتُعالَج غالباً بالمضادات الفموية.',
    symptoms: [
      { id: 'dysuria', weight: 3 },
      { id: 'frequency', weight: 3 },
      { id: 'abdominal_pain', weight: 1 },
      { id: 'hematuria', weight: 1 },
      { id: 'fever', weight: 1 },
    ],
    keyFindings: ['dysuria', 'frequency'],
    vitals: [
      { vital: 'temperature', op: 'gt', value: 37.8, weight: 1, labelAr: 'حرارة مرتفعة قليلاً' },
    ],
    against: [
      {
        vital: 'temperature',
        op: 'gt',
        value: 38.5,
        weight: 8,
        labelAr: 'حرارة عالية — توجّه نحو عدوى بولية علوية',
      },
    ],
    riskFactors: [{ labelAr: 'أنثى', weight: 1, sex: 'female' }],
    redFlags: ['حرارة عالية (قد تعني التهاب كلية)', 'ألم خاصرة', 'قيء'],
    actions: {
      labs: ['تحليل بول بالشرائح أو المجهر', 'مزرعة بول عند التكرار أو الحمل أو الفشل العلاجي'],
      imaging: ['لا تصوير روتيني في الحالات غير المعقدة'],
      immediate: [
        'مضادات حيوية فموية قصيرة المدى حسب الخيارات المحلية',
        'إمهاء مناسب',
        'تقييم الأعراض للتفريق عن التهاب الكلية',
      ],
      medications: [
        { name: 'Nitrofurantoin', noteAr: '5 أيام — يُمنع في القصور الكلوي (CrCl < 30)' },
        { name: 'Fosfomycin', noteAr: 'جرعة واحدة' },
        { name: 'Trimethoprim-Sulfamethoxazole', noteAr: 'حسب المقاومة المحلية' },
      ],
      alerts: [
        'تحذير: الحرقة والتكرار مع حرارة عالية وألم خاصرة تعني التهاب كلية وليس مثانة.',
        'تحذير: Nitrofurantoin غير فعّال في التهاب الكلية.',
        'تحذير: عند الحمل تُختار المضادات بعناية (تجنّب الفلوروكينولون).',
      ],
    },
  },
];
