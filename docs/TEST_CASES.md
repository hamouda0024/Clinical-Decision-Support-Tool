# حالات الاختبار اليدوي — Test Cases

> **النتيجة المتوقعة محسوبة من الكود الحالي** (`runAssessment`)، وليست حكماً على
> الصحة السريرية. عمود «النتيجة الفعلية» متروك فارغاً عمداً للتنفيذ اليدوي.
> البيانات اصطناعية وليست حالات مرضى حقيقية.
>
> EWS هنا هو مجموع نقاط الأداة المبسّطة (حد أقصى 11)، وليس NEWS2.

## جدول الحالات

| # | الفئة | المدخلات الكاملة | المتوقع: الفرز / EWS / أول تشخيصين | الفعلي | ✔/✘ |
| --- | --- | --- | --- | --- | --- |
| 1 | طارئ — ACS | 58/M/emergency؛ 2h؛ `chest_pain, diaphoresis, dyspnea, nausea`؛ 150/95؛ HR 108؛ 37.1؛ SpO₂ 93 | emergency / 3 / `acute_coronary_syndrome`, `renal_colic` |  | ☐ |
| 2 | عاجل — PE | 52/F/emergency؛ 6h؛ `dyspnea, pleuritic_pain, calf_pain, recent_immobility`؛ 118/76؛ HR 112؛ 37.2؛ SpO₂ 90 | urgent / 5 / `pulmonary_embolism`, `asthma_exacerbation` |  | ☐ |
| 3 | طارئ — CAP | 67/M/internal؛ 4d؛ `fever, cough, sputum, dyspnea, fatigue`؛ 110/70؛ HR 112؛ 39.1؛ SpO₂ 88 | emergency / 8 / `copd_exacerbation`, `community_acquired_pneumonia` |  | ☐ |
| 4 | عاجل — ربو | 28/F/emergency؛ 3h؛ `wheeze, dyspnea, cough`؛ 122/78؛ HR 118؛ 37.0؛ SpO₂ 92 | urgent / 4 / `asthma_exacerbation`, `copd_exacerbation` |  | ☐ |
| 5 | طارئ — COPD | 70/M/pulmonology؛ 3d؛ `dyspnea, cough, sputum, wheeze`؛ 130/80؛ HR 102؛ 37.8؛ SpO₂ 88 | emergency / 4 / `copd_exacerbation`, `asthma_exacerbation` |  | ☐ |
| 6 | عاجل — قصور قلب | 72/M/cardiology؛ 5d؛ `dyspnea, orthopnea, edema, fatigue`؛ 145/90؛ HR 105؛ 36.8؛ SpO₂ 91 | urgent / 4 / `heart_failure_decompensation`, `copd_exacerbation` |  | ☐ |
| 7 | طارئ — تسلّخ أبهر | 60/M/emergency؛ 1h؛ `chest_pain_tearing, chest_pain, diaphoresis`؛ 170/100؛ HR 110؛ 37.0؛ SpO₂ 96 | emergency / 1 / `aortic_dissection`, `acute_coronary_syndrome` |  | ☐ |
| 8 | طارئ — إنتان | 64/F/internal؛ 2d؛ `fever, confusion, dyspnea`؛ 88/54؛ HR 124؛ 39.4؛ SpO₂ 92 | emergency / 9 / `sepsis`, `bacterial_meningitis` |  | ☐ |
| 9 | طارئ — تأق | 30/F/emergency؛ 1h؛ `angioedema, urticaria, dyspnea`؛ 92/60؛ HR 128؛ 37.0؛ SpO₂ 91 | emergency / 7 / `anaphylaxis`, `asthma_exacerbation` |  | ☐ |
| 10 | شبه عاجل — زائدة | 24/F/general_surgery؛ 1d؛ `abdominal_pain, anorexia, nausea, vomiting, fever`؛ 118/76؛ HR 96؛ 38.2؛ SpO₂ 99 | semi_urgent / 2 / `acute_appendicitis`, `acute_cholecystitis` |  | ☐ |
| 11 | شبه عاجل — مرارة | 45/F/general_surgery؛ 2d؛ `abdominal_pain, nausea, vomiting, fever`؛ 126/80؛ HR 98؛ 38.3؛ SpO₂ 98 | semi_urgent / 2 / `acute_cholecystitis`, `acute_appendicitis` |  | ☐ |
| 12 | شبه عاجل — معوي | 30/M/family_medicine؛ 2d؛ `diarrhea, vomiting, abdominal_pain, fever`؛ 116/74؛ HR 92؛ 38.1؛ SpO₂ 99 | semi_urgent / 2 / `acute_gastroenteritis`, `acute_cholecystitis` |  | ☐ |
| 13 | روتيني — GERD | 40/F/family_medicine؛ 4w؛ `epigastric_burning, chest_pain`؛ 120/78؛ HR 80؛ 36.8؛ SpO₂ 99 | routine / 0 / `gerd`, `acute_coronary_syndrome` |  | ☐ |
| 14 | روتيني — مغص كلوي | 35/M/urology؛ 6h؛ `flank_pain, hematuria, nausea`؛ 138/86؛ HR 96؛ 37.2؛ SpO₂ 99 | routine / 1 / `renal_colic`, `acute_appendicitis` |  | ☐ |
| 15 | عاجل — التهاب كلية | 32/F/urology؛ 3d؛ `fever, flank_pain, dysuria, nausea`؛ 112/70؛ HR 104؛ 38.8؛ SpO₂ 98 | urgent / 2 / `pyelonephritis`, `renal_colic` |  | ☐ |
| 16 | روتيني — مثانة | 26/F/urology؛ 2d؛ `dysuria, frequency`؛ 118/76؛ HR 84؛ 37.4؛ SpO₂ 99 | routine / 0 / `acute_cystitis`, `pyelonephritis` |  | ☐ |
| 17 | طارئ — سكتة | 70/M/neurology؛ 2h؛ `focal_weakness, facial_droop, speech_difficulty`؛ 160/90؛ HR 88؛ 36.8؛ SpO₂ 97 | emergency / 0 / `acute_ischemic_stroke`, `aortic_dissection` |  | ☐ |
| 18 | طارئ — سحايا | 22/M/emergency؛ 1d؛ `fever, neck_stiffness, headache, photophobia`؛ 118/76؛ HR 104؛ 39.0؛ SpO₂ 98 | emergency / 2 / `bacterial_meningitis`, `acute_appendicitis` |  | ☐ |
| 19 | روتيني — شقيقة | 28/F/family_medicine؛ 1d؛ `headache, photophobia, nausea`؛ 115/72؛ HR 70؛ 36.8؛ SpO₂ 99 | routine / 0 / `migraine`, `renal_colic` |  | ☐ |
| 20 | عاجل — DKA | 22/M/endocrinology؛ 1d؛ `polyuria, polydipsia, nausea, vomiting, abdominal_pain, confusion`؛ 102/64؛ HR 112؛ 37.0؛ SpO₂ 99 | urgent / 3 / `diabetic_ketoacidosis`, `acute_appendicitis` |  | ☐ |
| 21 | شبه عاجل — نقص سكر | 55/F/endocrinology؛ 2h؛ `confusion, diaphoresis, palpitations`؛ 138/84؛ HR 100؛ 36.5؛ SpO₂ 98 | semi_urgent / 1 / `hypoglycemia`, `acute_coronary_syndrome` |  | ☐ |
| 22 | طارئ — هلع | 25/F/psychiatry؛ 1h؛ `palpitations, chest_pain, dyspnea, anxiety, fear_of_death`؛ 128/80؛ HR 102؛ 37.0؛ SpO₂ 99 | emergency / 1 / `panic_attack`, `iron_deficiency_anemia` |  | ☐ |
| 23 | روتيني — فيروسي | 30/F/family_medicine؛ 3d؛ `sore_throat, runny_nose, cough, fever, myalgia`؛ 118/76؛ HR 88؛ 38.2؛ SpO₂ 98 | routine / 1 / `viral_upper_respiratory_infection`, `acute_cystitis` |  | ☐ |
| 24 | شبه عاجل — فقر دم | 35/F/family_medicine؛ 4w؛ `fatigue, dyspnea, dizziness`؛ 110/70؛ HR 96؛ 36.8؛ SpO₂ 98 | semi_urgent / 2 / `iron_deficiency_anemia`, `asthma_exacerbation` |  | ☐ |
| 25 | طفل < 16 | 8/M/emergency؛ 1d؛ `chest_pain, fever`؛ 110/70؛ HR 100؛ 38.0؛ SpO₂ 97 | semi_urgent / 2 / **لا تفاضليات** |  | ☐ |
| 26 | معلومات قليلة | 45/M/internal؛ 1d؛ `fatigue`؛ 120/80؛ HR 80؛ 37.0؛ SpO₂ 98 | routine / 0 / `diabetic_ketoacidosis`, `iron_deficiency_anemia` |  | ☐ |
| 27 | علامة إنذارية منفردة | 50/M/emergency؛ 1h؛ `chest_pain`؛ 135/85؛ HR 92؛ 37.0؛ SpO₂ 97 | routine / 1 / `acute_coronary_syndrome`, `pulmonary_embolism` |  | ☐ |
| 28 | ضغط مرتفع جداً | 55/M/emergency؛ 1h؛ `chest_pain`؛ 219/110؛ HR 90؛ 37.0؛ SpO₂ 98 | routine / 0 / `acute_coronary_syndrome`, `pulmonary_embolism` |  | ☐ |

## حالات تبدو غير منطقية سريرياً (تحتاج قرار الطبيبة)

| # | الملاحظة | لماذا لم تُصلح |
| --- | --- | --- |
| 3 | الأول `copd_exacerbation` بثقة 90 مقابل 84 للالتهاب الرئوي، رغم أن المدخلات التهاب رئوي كلاسيكي | تغيير الأوزان ممنوع بلا قرار موثق؛ يحتاج تفسير/مراجعة أوزان |
| 7 | EWS = 1 فقط رغم تسلّخ أبهر مشتبه؛ الفرز طارئ بسبب العلامة الإنذارية وليس EWS | EWS لا يشمل هذا النمط؛ لا أغيّر الحساب بلا اعتماد |
| 8 | EWS = 9 وفرز طارئ، لكن التشخيص الأول إنتان بثقة 56 فقط | يحتاج مراجعة أوزان/حدود الثقة |
| 14 | مغص كلوي بفرز روتيني مع EWS 1 وألم حاد | قد يكون مقبولاً إذا كانت العلامات مستقرة؛ يحتاج سياسة ألم/فرز |
| 17 | سكتة بفرز طارئ مع EWS 0 (علامات حيوية طبيعية) | صحيح لأن العلامة العصبية هي التي رفعت الفرز، ويجب ألا يعتمد الفرز على EWS وحده |
| 18 | سحايا بثقة 79 وفرز طارئ، لكن EWS 2 فقط | العلامة الإنذارية رفعت الفرز؛ يحتاج تأكيد أن هذا كافٍ |
| 21 | تخليط + نقص سكر → `semi_urgent` فقط، وثقة 36% | خلل محتمل في رفع مستوى التخليط؛ يحتاج قراراً طبياً |
| 22 | هلع → `emergency` بسبب ألم صدر + ضيق نفس، رغم أن التشخيص الأول هلع | قاعدة السلامة تفرط في الفرز؛ قرار سريري مطلوب |
| 27 | ألم صدري منفرد → `routine` رغم أنه علامة إنذارية في الكتالوج | تعليق الكود يقول إن أي علامة إنذارية ترفع المستوى؛ التنفيذ لا يطابقه. يحتاج إصلاحاً معتمداً |
| 28 | ضغط 219/110 → EWS 0 وفرز `routine` | تعارض صريح بين نطاق «مرتفع جداً» ونقاط EWS؛ يحتاج قراراً طبياً قبل التعديل |

## ملاحظات تنفيذ

- كل المدخلات صالحة لمخطط Zod (العمر، الجنس، التخصص، المدة، الأعراض، العلامات).
- الحالة 9 استُخدمت مدة ساعة بدل «30 دقيقة» لأن الوحدات المسموحة ساعات/أيام/أسابيع.
- الحالات 27 و28 اختبارات انحدار للسلوك الحالي، وليست تأكيداً على صحته السريرية.
- الحالة 25 يجب أن تعيد `pediatricUnsupported=true` و`differentials=[]`.
- الحالة 26 يجب أن تعيد `lowInformation=true`.
