/**
 * Arabic interface dictionary — the reference locale.
 * Every other locale must contain exactly these keys (enforced by TypeScript).
 * Clinical narrative content (summaries, recommendations, dosages) is NOT here:
 * it lives in the reviewed-content store and must not be machine-translated.
 */
export const ar = {
  'header.title': 'Clinical Decision Support',
  'header.subtitle': 'أداة دعم القرار السريري — للأطباء والممارسين الصحيين',
  'header.version': 'الإصدار 1.3',
  'header.educational': 'للاستخدام التعليمي',
  'header.language': 'لغة الواجهة',

  'language.ar': 'العربية',
  'language.fr': 'Français',
  'language.en': 'English',

  'disclaimer.title': 'إخلاء مسؤولية طبي',
  'disclaimer.body':
    'هذه الأداة تعليمية لدعم القرار السريري فقط، ولا تُعدّ تشخيصاً نهائياً ولا بديلاً عن التقييم السريري المباشر والفحص البدني واستشارة الطبيب المختص. النتائج احتمالية ومبنية على قاعدة معرفة مبسطة، ويجب التحقق منها دائماً وفق المعايير المعتمدة وحالة كل مريض على حدة.',

  'footer.brand': 'Clinical Decision Support Tool',
  'footer.blurb':
    'أداة تعليمية لدعم القرار السريري، مخصّصة للأطباء والممارسين الصحيين. لا تحفظ بيانات المرضى ولا تستبدل الحكم السريري.',
  'footer.ipTitle': 'حقوق الملكية الفكرية',
  'footer.rights': '© 2026 — جميع الحقوق محفوظة.',
  'footer.supervision': 'الإشراف الطبي والعلمي:',
  'footer.development': 'التطوير والهندسة:',
  'footer.supervisor': 'الدكتورة طاهر أنفال',
  'footer.developer': 'زرقين أحمد إسلام',
  'footer.legal':
    'يُمنع نسخ أو إعادة استخدام هذا التطبيق أو محتواه دون إذن كتابي من أصحاب الحقوق. مراجعة المحتوى السريري مسؤولية الفريق الطبي المشرف.',

  'app.badge': 'دعم القرار السريري',
  'app.audience': 'مخصص للأطباء والممارسين الصحيين',
  'app.governanceBadge': 'محتوى غير مُراجع سريرياً',
  'app.title': 'تقييم سريري منظّم، مع تشخيصات تفاضلية قابلة للتفسير',
  'app.intro':
    'أدخل الأعراض الرئيسية والعلامات الحيوية للمريض، لتحصل على قائمة مرتّبة بالتشخيصات المحتملة مع الفحوصات المطلوبة، الإجراءات الفورية، والأدوية والتحذيرات المرتبطة بكل احتمال.',
  'app.feature.explainable': 'محرك منطقي قابل للتفسير',
  'app.feature.tests': 'فحوصات وإجراءات لكل تشخيص',
  'app.feature.noStorage': 'لا تخزين لبيانات المرضى',
  'common.retry': 'إعادة المحاولة',
  'app.catalogErrorTitle': 'تعذّر تحميل الأداة',
  'app.catalogErrorFallback':
    'تعذّر تحميل قوائم الإدخال. تحقّق من الاتصال ثم أعد المحاولة.',
  'app.resultsLabel': 'لوحة نتائج التقييم',
  'app.assessmentErrorFallback': 'تعذّر إتمام التحليل.',

  'form.cardTitle': 'نموذج تقييم المريض',
  'form.examples': 'أمثلة سريعة:',
  'form.errorsSummary': 'تعذّر تحليل الحالة: راجع الحقول المميّزة بالأحمر ثم أعد المحاولة.',
  'form.section.patient': 'بيانات المريض',
  'form.age.label': 'العمر (بالأعوام)',
  'form.age.placeholder': 'مثال: 45',
  'form.age.help': 'النطاق المدعوم: 0–120 سنة (البالغون أساس التقييم).',
  'form.specialty.label': 'الفئة الطبية / التخصص',
  'form.specialty.placeholder': '— اختر التخصص —',
  'form.sex.label': 'الجنس',
  'form.sex.male': 'ذكر',
  'form.sex.female': 'أنثى',
  'form.sex.other': 'آخر',
  'form.duration.label': 'مدة الأعراض',
  'form.duration.placeholder': 'مثال: 3',
  'form.duration.unitAria': 'وحدة مدة الأعراض',
  'form.section.symptoms': 'الأعراض الرئيسية',
  'form.section.vitals': 'العلامات الحيوية',
  'form.symptom.help':
    'النقطة الحمراء تعني عرضاً قد يرتبط بحالة تحتاج تقييماً عاجلاً. اختر كل ما ينطبق على المريض.',
  'form.submit': 'تحليل الحالة',
  'form.submitting': 'جارٍ التحليل…',
  'form.reset': 'تفريغ النموذج',
  'form.privacy':
    'لا تُدخل بيانات تعريفية (الاسم أو رقم الملف). الأداة لا تحتاجها ولا تحفظها.',

  'symptoms.selected': 'المحدد:',
  'symptoms.clear': 'مسح الاختيار',
  'symptoms.selectedAria': 'الأعراض المختارة',
  'symptoms.remove': 'إزالة {name}',
  'symptoms.searchPlaceholder': 'ابحث في قائمة الأعراض…',
  'symptoms.searchAria': 'بحث في قائمة الأعراض',
  'symptoms.empty': 'لا توجد أعراض مطابقة لبحثك. جرّب كلمة أخرى.',
  'symptoms.redFlagTitle': 'قد يشير إلى حالة تحتاج تقييماً عاجلاً',

  'vitals.normalRange': 'المدى الطبيعي المرجعي للبالغين: {range}',
  'vitals.summaryTitle': 'تقييم العلامات الحيوية',

  'results.emptyTitle': 'نتائج التقييم ستظهر هنا',
  'results.emptyBody':
    'أكمل بيانات المريض والأعراض والعلامات الحيوية، ثم اضغط «تحليل الحالة» للحصول على التشخيصات التفاضلية والإجراءات الموصى بها.',
  'results.emptyItem1': 'ترتيب التشخيصات حسب درجة الاحتمالية',
  'results.emptyItem2': 'أدلة داعمة وعلامات ناقصة لكل تشخيص',
  'results.emptyItem3': 'مستوى الفرز والتحذيرات والموانع',
  'results.loading': 'جارٍ تحليل البيانات سريرياً…',
  'results.governanceTitle': 'محتوى سريري غير مُعتمد بعد',
  'results.governanceBody':
    'لم تُوقَّع المراجعة الطبية على قاعدة المعرفة: راجع الطبيب {reviewed} من أصل {total} حالة. تُعرض النتائج للاستخدام التعليمي والمراجعة فقط، ولا تُعتمد للتشخيص أو القرار العلاجي.',
  'results.lowInformation':
    'عدد الأعراض المُدخلة قليل، لذلك قد يكون ترتيب التشخيصات محدود الدقة. أضف المزيد من الأعراض السريرية للحصول على تقييم أفضل.',
  'results.pediatricTitle': 'لا يتم تطبيق مسار البالغين على الأطفال',
  'results.pediatricBody':
    'عمر المريض أقل من 16 سنة. لا توجد في هذه النسخة قاعدة معرفة للأطفال مُراجعة سريرياً، لذلك لا تُعرض توصيات أو جرعات للبالغين. استخدم مسار الأطفال المعتمد في مؤسستك.',
  'results.differentialsTitle': 'التشخيصات التفاضلية',
  'results.differentialsCount': '{count} تشخيصات · مرتبة تنازلياً حسب درجة الاحتمالية',
  'results.noDifferentials':
    'لم يُعثر على تشخيص مطابق للأعراض المُدخلة. راجع الأعراض المختارة أو أضف أعراضاً أخرى.',
  'results.disclaimer':
    'درجات الاحتمالية نسبية داخل هذه الأداة وليست احتمالات مطلقة أو تشخيصاً. القرار النهائي مسؤولية الطبيب المعالج، ويجب التحقق من كل توصية وفق المعايير السريرية المعتمدة.',
  'results.limitations': 'حدود هذه النسخة ({count})',
  'results.limitationsNote':
    'قائمة الحدود متاحة بالعربية فقط إلى حين اعتماد ترجمتها.',
  'results.footerMeta':
    'محرك التحليل v{version} · قاعدة المعرفة: {entries} حالة · وقت التوليد: {time}',
  'results.dismissError': 'إغلاق التنبيه',
  'contentPolicy.notice':
    'تسميات الأعراض والمجموعات والتخصصات والعلامات الحيوية تتبع لغة الواجهة، وهي قيد المراجعة الطبية. أسماء الحالات والملخصات والفحوصات والإجراءات تبقى بالعربية فقط.',
  'results.narrativeNotice':
    'أسماء الحالات والملخصات والفحوصات والإجراءات والتحذيرات تبقى بالعربية فقط إلى حين اعتماد ترجمة سريرية مُراجعة.',

  'diagnosis.evidence': 'أدلة داعمة من الإدخال',
  'diagnosis.missing': 'علامات مميزة غير مُسجّلة',
  'diagnosis.against': 'عوامل لا تدعم هذا التشخيص',
  'diagnosis.redFlags': 'أعلام حمراء:',
  'diagnosis.labs': 'الفحوصات المخبرية',
  'diagnosis.imaging': 'التصوير الطبي',
  'diagnosis.immediate': 'الإجراءات الفورية',
  'diagnosis.medications': 'الأدوية المقترحة',
  'diagnosis.noMedications': 'لا توجد أدوية محددة في هذه الحالة.',
  'diagnosis.medicationsWithheldTitle': 'المحتوى الدوائي محجوب',
  'diagnosis.medicationsWithheldBody':
    'أسماء الأدوية والجرعات لا تُعرض لأن قاعدة المعرفة لم تخضع بعد لمراجعة طبية موثّقة. لا تستخدم هذه الصفحة كمصدر لوصف دواء أو تحديد جرعة.',
  'diagnosis.alerts': 'تحذيرات وموانع الاستخدام',
  'diagnosis.confidenceAria': 'درجة الاحتمالية: {score}%',

  'triage.emergency': 'طارئ',
  'triage.urgent': 'عاجل',
  'triage.semi_urgent': 'شبه عاجل',
  'triage.routine': 'روتيني',
  'triage.desc.emergency':
    'توجد علامات تهدد الحياة. يجب تفعيل فريق الطوارئ والتقييم والتدخل دون تأخير.',
  'triage.desc.urgent': 'يُستحسن تقييم طبي عاجل ومراقبة العلامات الحيوية بشكل متكرر.',
  'triage.desc.semi_urgent':
    'الحالة تحتاج تقييماً طبياً في وقت قريب مع عدم إهمال أي تدهور.',
  'triage.desc.routine':
    'لا توجد حالياً علامات إنذار واضحة، مع أهمية استمرار التقييم السريري.',
  'triage.ews': 'EWS مبسّط',
  'triage.notNews2': 'ليست NEWS2',
  'triage.ewsTitle': 'درجة إنذار مبسّطة من خمس علامات حيوية — ليست NEWS2',

  'vitalStatus.critical_low': 'منخفض جداً',
  'vitalStatus.low': 'منخفض',
  'vitalStatus.normal': 'طبيعي',
  'vitalStatus.high': 'مرتفع',
  'vitalStatus.critical_high': 'مرتفع جداً',

  'duration.hours.one': 'ساعة',
  'duration.hours.other': 'ساعات',
  'duration.days.one': 'يوم',
  'duration.days.other': 'أيام',
  'duration.weeks.one': 'أسبوع',
  'duration.weeks.other': 'أسابيع',

  'validation.ageRequired': 'العمر مطلوب',
  'validation.ageRange': 'أدخل عمراً بالأعوام بين 0 و120',
  'validation.sexRequired': 'اختر الجنس',
  'validation.specialtyRequired': 'اختر التخصص',
  'validation.durationRequired': 'مدة الأعراض مطلوبة',
  'validation.durationPositive': 'أدخل مدة أكبر من صفر',
  'validation.symptomRequired': 'اختر عرضاً واحداً على الأقل',
  'validation.symptomMax': 'الحد الأقصى {max} عرضاً',
  'validation.vitalRequired': '{label} مطلوب',
  'validation.vitalRange': 'القيمة يجب أن تكون بين {min} و{max}',
  'validation.diastolicOrder': 'الضغط الانبساطي يجب أن يكون أقل من الانقباضي',

  'error.request': 'تعذّر إتمام الطلب. الرجاء المحاولة مرة أخرى.',
  'error.timeout': 'انتهت مهلة الاتصال بالخادم. تحقّق من الشبكة وحاول مجدداً.',
  'error.connection': 'تعذّر الاتصال بالخادم. تأكّد من تشغيل الخدمة ثم أعد المحاولة.',
  'error.validation': 'بعض الحقول غير صالحة. الرجاء مراجعة البيانات المدخلة.',
  'error.rateLimited': 'عدد الطلبات كبير. الرجاء المحاولة بعد دقيقة.',
  'error.forbidden': 'طلب من مصدر غير مسموح به.',
  'error.notFound': 'المسار المطلوب غير موجود.',
  'error.internal': 'حدث خطأ غير متوقع. الرجاء المحاولة لاحقاً.',

  'preset.chest': 'ألم صدري',
  'preset.chestHint': '58 سنة · طوارئ',
  'preset.respiratory': 'حرارة وسعال',
  'preset.respiratoryHint': '67 سنة · باطنية',
  'preset.abdominal': 'ألم بطني',
  'preset.abdominalHint': '24 سنة · جراحة',
} as const;

export type TranslationKey = keyof typeof ar;
