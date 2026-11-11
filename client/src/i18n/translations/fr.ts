import type { TranslationKey } from './ar';

/** French interface dictionary. Clinical narratives are intentionally not translated here. */
export const fr: Record<TranslationKey, string> = {
  'header.title': 'Clinical Decision Support',
  'header.subtitle': 'Aide à la décision clinique pour médecins et praticiens',
  'header.version': 'Version 1.3',
  'header.educational': 'Usage pédagogique',
  'header.language': 'Langue de l’interface',

  'language.ar': 'العربية',
  'language.fr': 'Français',
  'language.en': 'English',

  'disclaimer.title': 'Avertissement médical',
  'disclaimer.body':
    'Cet outil est destiné uniquement à l’aide pédagogique à la décision clinique. Il ne constitue pas un diagnostic et ne remplace ni l’évaluation clinique directe, ni l’examen physique, ni l’avis d’un spécialiste. Les résultats sont probabilistes, reposent sur une base de connaissances simplifiée et doivent toujours être vérifiés au regard des recommandations validées et de chaque patient.',

  'footer.brand': 'Clinical Decision Support Tool',
  'footer.blurb':
    'Outil pédagogique d’aide à la décision clinique destiné aux médecins et praticiens. Il ne stocke aucune donnée patient et ne remplace pas le jugement clinique.',
  'footer.ipTitle': 'Propriété intellectuelle',
  'footer.rights': '© 2026 — Tous droits réservés.',
  'footer.supervision': 'Supervision médicale et scientifique :',
  'footer.development': 'Développement et ingénierie :',
  'footer.supervisor': 'Dr Taher Anfal',
  'footer.developer': 'Zarqine Ahmed Islam',
  'footer.legal':
    'La copie ou la réutilisation de cette application ou de son contenu sans autorisation écrite des titulaires est interdite. La révision du contenu clinique relève de l’équipe médicale superviseuse.',

  'app.badge': 'Aide à la décision clinique',
  'app.audience': 'Destiné aux médecins et praticiens',
  'app.governanceBadge': 'Contenu non revu cliniquement',
  'app.title': 'Évaluation clinique structurée et diagnostics différentiels explicables',
  'app.intro':
    'Saisissez les symptômes principaux et les signes vitaux du patient pour obtenir une liste classée de diagnostics possibles avec les examens, les gestes immédiats, les médicaments et les mises en garde associés.',
  'app.feature.explainable': 'Moteur logique explicable',
  'app.feature.tests': 'Examens et gestes pour chaque diagnostic',
  'app.feature.noStorage': 'Aucune donnée patient stockée',
  'common.retry': 'Réessayer',
  'app.catalogErrorTitle': 'Impossible de charger l’outil',
  'app.catalogErrorFallback':
    'Impossible de charger le catalogue de saisie. Vérifiez la connexion puis réessayez.',
  'app.resultsLabel': 'Panneau des résultats de l’évaluation',
  'app.assessmentErrorFallback': 'L’analyse n’a pas pu être terminée.',

  'form.cardTitle': 'Formulaire d’évaluation du patient',
  'form.examples': 'Exemples rapides :',
  'form.errorsSummary':
    'L’analyse est impossible : vérifiez les champs signalés en rouge puis réessayez.',
  'form.section.patient': 'Données du patient',
  'form.age.label': 'Âge (années)',
  'form.age.placeholder': 'ex. 45',
  'form.age.help': 'Plage prise en charge : 0–120 ans (l’adulte est la cible principale).',
  'form.specialty.label': 'Catégorie médicale / spécialité',
  'form.specialty.placeholder': '— Choisir une spécialité —',
  'form.sex.label': 'Sexe',
  'form.sex.male': 'Homme',
  'form.sex.female': 'Femme',
  'form.sex.other': 'Autre',
  'form.duration.label': 'Durée des symptômes',
  'form.duration.placeholder': 'ex. 3',
  'form.duration.unitAria': 'Unité de durée des symptômes',
  'form.section.symptoms': 'Symptômes principaux',
  'form.section.vitals': 'Signes vitaux',
  'form.symptom.help':
    'Un point rouge signale un symptôme pouvant être associé à une situation nécessitant une évaluation urgente. Sélectionnez tout ce qui s’applique au patient.',
  'form.submit': 'Analyser le cas',
  'form.submitting': 'Analyse en cours…',
  'form.reset': 'Réinitialiser',
  'form.privacy':
    'Ne saisissez pas de données identifiantes (nom ou numéro de dossier). L’outil n’en a pas besoin et ne les stocke pas.',

  'symptoms.selected': 'Sélectionnés :',
  'symptoms.clear': 'Effacer la sélection',
  'symptoms.selectedAria': 'Symptômes sélectionnés',
  'symptoms.remove': 'Retirer {name}',
  'symptoms.searchPlaceholder': 'Rechercher dans la liste des symptômes…',
  'symptoms.searchAria': 'Rechercher dans la liste des symptômes',
  'symptoms.empty': 'Aucun symptôme ne correspond à votre recherche. Essayez un autre terme.',
  'symptoms.redFlagTitle': 'Peut indiquer une situation nécessitant une évaluation urgente',

  'vitals.normalRange': 'Valeurs de référence chez l’adulte : {range}',
  'vitals.summaryTitle': 'Évaluation des signes vitaux',

  'results.emptyTitle': 'Les résultats de l’évaluation apparaîtront ici',
  'results.emptyBody':
    'Renseignez les données du patient, les symptômes et les signes vitaux, puis choisissez « Analyser le cas » pour obtenir les diagnostics différentiels et les gestes recommandés.',
  'results.emptyItem1': 'Diagnostics classés par score de probabilité',
  'results.emptyItem2': 'Arguments en faveur et signes manquants pour chaque diagnostic',
  'results.emptyItem3': 'Niveau de triage, mises en garde et contre-indications',
  'results.loading': 'Analyse clinique des données…',
  'results.governanceTitle': 'Contenu clinique non encore approuvé',
  'results.governanceBody':
    'La base de connaissances n’a pas reçu de validation médicale : {reviewed} cas sur {total} revus. Les résultats sont réservés à l’enseignement et à la relecture, et ne doivent pas servir au diagnostic ni à une décision thérapeutique.',
  'results.lowInformation':
    'Peu de symptômes ont été saisis ; le classement peut donc manquer de précision. Ajoutez d’autres signes cliniques pour une meilleure évaluation.',
  'results.pediatricTitle': 'Le parcours adulte n’est pas appliqué aux enfants',
  'results.pediatricBody':
    'Le patient a moins de 16 ans. Cette version ne dispose pas d’une base de connaissances pédiatrique revue cliniquement ; les recommandations et posologies adultes ne sont donc pas affichées. Utilisez le parcours pédiatrique validé de votre établissement.',
  'results.differentialsTitle': 'Diagnostics différentiels',
  'results.differentialsCount': '{count} diagnostics · classés par score de probabilité',
  'results.noDifferentials':
    'Aucun diagnostic ne correspond aux symptômes saisis. Vérifiez les symptômes sélectionnés ou ajoutez-en d’autres.',
  'results.disclaimer':
    'Les scores de probabilité sont relatifs à cet outil ; ce ne sont ni des probabilités absolues ni un diagnostic. La décision finale appartient au médecin traitant et chaque recommandation doit être vérifiée au regard des recommandations cliniques validées.',
  'results.limitations': 'Limites de cette version ({count})',
  'results.limitationsNote':
    'Le détail des limites reste en arabe jusqu’à validation de sa traduction.',
  'results.footerMeta':
    'Moteur d’analyse v{version} · Base de connaissances : {entries} cas · Généré : {time}',
  'results.dismissError': 'Fermer l’alerte',
  'contentPolicy.notice':
    'Les libellés des symptômes, groupes, spécialités et signes vitaux suivent la langue de l’interface et restent en attente de validation médicale. Les noms de pathologies, résumés, examens, gestes et mises en garde restent en arabe uniquement.',
  'results.narrativeNotice':
    'Les noms de pathologies, résumés, examens, gestes et mises en garde restent en arabe uniquement jusqu’à validation d’une traduction clinique revue.',

  'diagnosis.evidence': 'Arguments issus de la saisie',
  'diagnosis.missing': 'Signes clés non renseignés',
  'diagnosis.against': 'Éléments contre ce diagnostic',
  'diagnosis.redFlags': 'Signes d’alerte :',
  'diagnosis.labs': 'Examens biologiques',
  'diagnosis.imaging': 'Imagerie médicale',
  'diagnosis.immediate': 'Gestes immédiats',
  'diagnosis.medications': 'Médicaments suggérés',
  'diagnosis.noMedications': 'Aucun médicament spécifique pour ce cas.',
  'diagnosis.medicationsWithheldTitle': 'Contenu médicamenteux masqué',
  'diagnosis.medicationsWithheldBody':
    'Les noms de médicaments et les posologies ne sont pas affichés car la base de connaissances n’a pas achevé sa révision médicale documentée. N’utilisez pas cette page pour prescrire un médicament ou déterminer une dose.',
  'diagnosis.alerts': 'Mises en garde et contre-indications',
  'diagnosis.confidenceAria': 'Score de probabilité : {score} %',

  'triage.emergency': 'Urgence vitale',
  'triage.urgent': 'Urgent',
  'triage.semi_urgent': 'Semi-urgent',
  'triage.routine': 'Routine',
  'triage.desc.emergency':
    'Des signes menaçant le pronostic vital sont présents. Activez l’équipe d’urgence et intervenez sans délai.',
  'triage.desc.urgent':
    'Une évaluation médicale rapide et une surveillance fréquente des signes vitaux sont conseillées.',
  'triage.desc.semi_urgent':
    'Le patient nécessite une évaluation médicale proche ; ne négligez aucune aggravation.',
  'triage.desc.routine':
    'Aucun signe d’alerte évident actuellement, mais l’évaluation clinique doit se poursuivre.',
  'triage.ews': 'EWS simplifié',
  'triage.notNews2': 'Pas un NEWS2',
  'triage.ewsTitle': 'Score d’alerte simplifié sur cinq signes vitaux — pas un NEWS2',

  'vitalStatus.critical_low': 'Très bas',
  'vitalStatus.low': 'Bas',
  'vitalStatus.normal': 'Normal',
  'vitalStatus.high': 'Élevé',
  'vitalStatus.critical_high': 'Très élevé',

  'duration.hours.one': 'heure',
  'duration.hours.other': 'heures',
  'duration.days.one': 'jour',
  'duration.days.other': 'jours',
  'duration.weeks.one': 'semaine',
  'duration.weeks.other': 'semaines',

  'validation.ageRequired': 'L’âge est obligatoire',
  'validation.ageRange': 'Saisissez un âge en années entre 0 et 120',
  'validation.sexRequired': 'Sélectionnez le sexe',
  'validation.specialtyRequired': 'Sélectionnez une spécialité',
  'validation.durationRequired': 'La durée des symptômes est obligatoire',
  'validation.durationPositive': 'Saisissez une durée supérieure à zéro',
  'validation.symptomRequired': 'Sélectionnez au moins un symptôme',
  'validation.symptomMax': 'Maximum {max} symptômes',
  'validation.vitalRequired': '{label} est obligatoire',
  'validation.vitalRange': 'La valeur doit être comprise entre {min} et {max}',
  'validation.diastolicOrder': 'La pression diastolique doit être inférieure à la systolique',

  'error.request': 'La demande n’a pas pu aboutir. Veuillez réessayer.',
  'error.timeout': 'Le serveur ne répond pas. Vérifiez le réseau et réessayez.',
  'error.connection': 'Impossible de joindre le serveur. Vérifiez que le service est démarré.',
  'error.validation': 'Certains champs sont invalides. Vérifiez les données saisies.',
  'error.rateLimited': 'Trop de requêtes. Veuillez réessayer dans une minute.',
  'error.forbidden': 'Requête provenant d’une origine non autorisée.',
  'error.notFound': 'La route demandée est introuvable.',
  'error.internal': 'Une erreur inattendue est survenue. Veuillez réessayer plus tard.',

  'preset.chest': 'Douleur thoracique',
  'preset.chestHint': '58 ans · urgences',
  'preset.respiratory': 'Fièvre et toux',
  'preset.respiratoryHint': '67 ans · médecine interne',
  'preset.abdominal': 'Douleur abdominale',
  'preset.abdominalHint': '24 ans · chirurgie',
};
