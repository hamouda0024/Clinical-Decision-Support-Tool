import type { TranslationKey } from './ar';

/** English interface dictionary. Clinical narratives are intentionally not translated here. */
export const en: Record<TranslationKey, string> = {
  'header.title': 'Clinical Decision Support',
  'header.subtitle': 'Clinical decision support for physicians and practitioners',
  'header.version': 'Version 1.3',
  'header.educational': 'Educational use',
  'header.language': 'Interface language',

  'language.ar': 'العربية',
  'language.fr': 'Français',
  'language.en': 'English',

  'disclaimer.title': 'Medical disclaimer',
  'disclaimer.body':
    'This tool is for educational clinical decision support only. It is not a diagnosis and does not replace direct clinical assessment, physical examination, or specialist consultation. Outputs are probabilistic, based on a simplified knowledge base, and must always be checked against validated guidance and the individual patient.',

  'footer.brand': 'Clinical Decision Support Tool',
  'footer.blurb':
    'An educational clinical decision support tool for physicians and practitioners. It does not store patient data and does not replace clinical judgement.',
  'footer.ipTitle': 'Intellectual property',
  'footer.rights': '© 2026 — All rights reserved.',
  'footer.supervision': 'Medical and scientific supervision:',
  'footer.development': 'Development and engineering:',
  'footer.supervisor': 'Dr. Taher Anfal',
  'footer.developer': 'Zarqine Ahmed Islam',
  'footer.legal':
    'Copying or reusing this application or its content without written permission from the rights holders is prohibited. Clinical content review is the responsibility of the supervising medical team.',

  'app.badge': 'Clinical decision support',
  'app.audience': 'For physicians and practitioners',
  'app.governanceBadge': 'Not clinically reviewed',
  'app.title': 'Structured clinical assessment with explainable differential diagnoses',
  'app.intro':
    'Enter the patient’s main symptoms and vital signs to get a ranked list of possible diagnoses with the relevant tests, immediate actions, medications and warnings.',
  'app.feature.explainable': 'Explainable rule-based engine',
  'app.feature.tests': 'Tests and actions for each diagnosis',
  'app.feature.noStorage': 'No patient data stored',
  'common.retry': 'Try again',
  'app.catalogErrorTitle': 'The tool could not load',
  'app.catalogErrorFallback': 'Could not load the input catalogue. Check your connection and try again.',
  'app.resultsLabel': 'Assessment results panel',
  'app.assessmentErrorFallback': 'The assessment could not be completed.',

  'form.cardTitle': 'Patient assessment form',
  'form.examples': 'Quick examples:',
  'form.errorsSummary': 'The case could not be analysed: review the fields marked in red and try again.',
  'form.section.patient': 'Patient details',
  'form.age.label': 'Age (years)',
  'form.age.placeholder': 'e.g. 45',
  'form.age.help': 'Supported range: 0–120 years (adults are the primary use case).',
  'form.specialty.label': 'Medical category / specialty',
  'form.specialty.placeholder': '— Select a specialty —',
  'form.sex.label': 'Sex',
  'form.sex.male': 'Male',
  'form.sex.female': 'Female',
  'form.sex.other': 'Other',
  'form.duration.label': 'Symptom duration',
  'form.duration.placeholder': 'e.g. 3',
  'form.duration.unitAria': 'Symptom duration unit',
  'form.section.symptoms': 'Chief complaints',
  'form.section.vitals': 'Vital signs',
  'form.symptom.help':
    'A red dot marks a symptom that may be associated with a time-critical condition. Select everything that applies to the patient.',
  'form.submit': 'Analyse case',
  'form.submitting': 'Analysing…',
  'form.reset': 'Clear form',
  'form.privacy':
    'Do not enter identifying details (name or record number). The tool neither needs nor stores them.',

  'symptoms.selected': 'Selected:',
  'symptoms.clear': 'Clear selection',
  'symptoms.selectedAria': 'Selected symptoms',
  'symptoms.remove': 'Remove {name}',
  'symptoms.searchPlaceholder': 'Search the symptom list…',
  'symptoms.searchAria': 'Search the symptom list',
  'symptoms.empty': 'No symptoms match your search. Try another term.',
  'symptoms.redFlagTitle': 'May indicate a condition that needs urgent assessment',

  'vitals.normalRange': 'Adult reference range: {range}',
  'vitals.summaryTitle': 'Vital sign assessment',

  'results.emptyTitle': 'Assessment results will appear here',
  'results.emptyBody':
    'Complete the patient details, symptoms and vital signs, then choose “Analyse case” to see differential diagnoses and recommended actions.',
  'results.emptyItem1': 'Diagnoses ranked by likelihood score',
  'results.emptyItem2': 'Supporting evidence and missing findings for each diagnosis',
  'results.emptyItem3': 'Triage level, warnings and contraindications',
  'results.loading': 'Analysing the data clinically…',
  'results.governanceTitle': 'Clinical content not yet approved',
  'results.governanceBody':
    'The knowledge base has not received medical sign-off: {reviewed} of {total} conditions reviewed. Results are for education and review only and must not be used for diagnosis or treatment decisions.',
  'results.lowInformation':
    'Few symptoms were entered, so the ranking may be imprecise. Add more clinical findings for a better assessment.',
  'results.pediatricTitle': 'The adult pathway is not applied to children',
  'results.pediatricBody':
    'The patient is under 16. This version has no clinically reviewed paediatric knowledge base, so adult recommendations and dosages are not shown. Use your institution’s approved paediatric pathway.',
  'results.differentialsTitle': 'Differential diagnoses',
  'results.differentialsCount': '{count} diagnoses · ranked by likelihood score',
  'results.noDifferentials':
    'No diagnosis matched the entered symptoms. Review the selected symptoms or add others.',
  'results.disclaimer':
    'Likelihood scores are relative within this tool; they are not absolute probabilities or a diagnosis. The final decision rests with the treating physician, and every recommendation must be checked against validated clinical guidance.',
  'results.limitations': 'Limits of this version ({count})',
  'results.limitationsNote':
    'The detailed safety limits are currently available in Arabic only until their translation is approved.',
  'results.footerMeta':
    'Analysis engine v{version} · Knowledge base: {entries} conditions · Generated: {time}',
  'results.dismissError': 'Dismiss alert',
  'contentPolicy.notice':
    'Symptom, group, specialty and vital-sign labels follow the interface language and remain pending medical validation. Condition names, summaries, tests, actions and warnings remain Arabic-only.',
  'results.narrativeNotice':
    'Condition names, summaries, tests, actions and warnings remain Arabic-only until a reviewed clinical translation is approved.',

  'diagnosis.evidence': 'Supporting evidence from the input',
  'diagnosis.missing': 'Key findings not recorded',
  'diagnosis.against': 'Findings that argue against this diagnosis',
  'diagnosis.redFlags': 'Red flags:',
  'diagnosis.labs': 'Laboratory tests',
  'diagnosis.imaging': 'Medical imaging',
  'diagnosis.immediate': 'Immediate actions',
  'diagnosis.medications': 'Suggested medications',
  'diagnosis.noMedications': 'No specific medications for this condition.',
  'diagnosis.medicationsWithheldTitle': 'Medication content withheld',
  'diagnosis.medicationsWithheldBody':
    'Drug names and dosages are not shown because the knowledge base has not completed documented medical review. Do not use this page to prescribe a drug or determine a dose.',
  'diagnosis.alerts': 'Warnings and contraindications',
  'diagnosis.confidenceAria': 'Likelihood score: {score}%',

  'triage.emergency': 'Emergency',
  'triage.urgent': 'Urgent',
  'triage.semi_urgent': 'Semi-urgent',
  'triage.routine': 'Routine',
  'triage.desc.emergency':
    'Life-threatening features are present. Activate the emergency team and assess and intervene without delay.',
  'triage.desc.urgent': 'Prompt medical assessment and frequent vital-sign monitoring are advised.',
  'triage.desc.semi_urgent':
    'The patient needs medical assessment soon; do not ignore any deterioration.',
  'triage.desc.routine':
    'No clear warning features at present, but clinical assessment should continue.',
  'triage.ews': 'Simplified EWS',
  'triage.notNews2': 'Not NEWS2',
  'triage.ewsTitle': 'Simplified warning score from five vital signs — not NEWS2',

  'vitalStatus.critical_low': 'Critically low',
  'vitalStatus.low': 'Low',
  'vitalStatus.normal': 'Normal',
  'vitalStatus.high': 'High',
  'vitalStatus.critical_high': 'Critically high',

  'duration.hours.one': 'hour',
  'duration.hours.other': 'hours',
  'duration.days.one': 'day',
  'duration.days.other': 'days',
  'duration.weeks.one': 'week',
  'duration.weeks.other': 'weeks',

  'validation.ageRequired': 'Age is required',
  'validation.ageRange': 'Enter an age in years between 0 and 120',
  'validation.sexRequired': 'Select sex',
  'validation.specialtyRequired': 'Select a specialty',
  'validation.durationRequired': 'Symptom duration is required',
  'validation.durationPositive': 'Enter a duration greater than zero',
  'validation.symptomRequired': 'Select at least one symptom',
  'validation.symptomMax': 'Maximum {max} symptoms',
  'validation.vitalRequired': '{label} is required',
  'validation.vitalRange': 'The value must be between {min} and {max}',
  'validation.diastolicOrder': 'Diastolic pressure must be lower than systolic pressure',

  'error.request': 'The request could not be completed. Please try again.',
  'error.timeout': 'The server timed out. Check your network and try again.',
  'error.connection': 'Could not reach the server. Make sure the service is running and try again.',
  'error.validation': 'Some fields are invalid. Review the entered data.',
  'error.rateLimited': 'Too many requests. Please try again in a minute.',
  'error.forbidden': 'Request from a disallowed origin.',
  'error.notFound': 'The requested route was not found.',
  'error.internal': 'An unexpected error occurred. Please try again later.',

  'preset.chest': 'Chest pain',
  'preset.chestHint': '58 years · emergency',
  'preset.respiratory': 'Fever and cough',
  'preset.respiratoryHint': '67 years · internal medicine',
  'preset.abdominal': 'Abdominal pain',
  'preset.abdominalHint': '24 years · surgery',
};
