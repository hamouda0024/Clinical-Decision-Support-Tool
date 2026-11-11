import type { TranslationKey } from '../i18n/translations/ar';
import type { FormState } from './form';

export interface Preset {
  id: string;
  labelKey: TranslationKey;
  hintKey: TranslationKey;
  form: FormState;
}

const baseVitals = { systolicBP: '', diastolicBP: '', heartRate: '', temperature: '', spo2: '' };

/** Demo cases for orientation only — never real patient data. */
export const PRESETS: Preset[] = [
  {
    id: 'chest',
    labelKey: 'preset.chest',
    hintKey: 'preset.chestHint',
    form: {
      age: '58',
      sex: 'male',
      specialty: 'emergency',
      durationValue: '2',
      durationUnit: 'hours',
      symptoms: ['chest_pain', 'diaphoresis', 'dyspnea', 'nausea'],
      vitals: { ...baseVitals, systolicBP: '150', diastolicBP: '95', heartRate: '108', temperature: '37.1', spo2: '93' },
    },
  },
  {
    id: 'respiratory',
    labelKey: 'preset.respiratory',
    hintKey: 'preset.respiratoryHint',
    form: {
      age: '67',
      sex: 'male',
      specialty: 'internal',
      durationValue: '4',
      durationUnit: 'days',
      symptoms: ['fever', 'cough', 'sputum', 'dyspnea', 'fatigue'],
      vitals: { ...baseVitals, systolicBP: '110', diastolicBP: '70', heartRate: '112', temperature: '39.1', spo2: '88' },
    },
  },
  {
    id: 'abdominal',
    labelKey: 'preset.abdominal',
    hintKey: 'preset.abdominalHint',
    form: {
      age: '24',
      sex: 'female',
      specialty: 'general_surgery',
      durationValue: '1',
      durationUnit: 'days',
      symptoms: ['abdominal_pain', 'anorexia', 'nausea', 'vomiting', 'fever'],
      vitals: { ...baseVitals, systolicBP: '118', diastolicBP: '76', heartRate: '96', temperature: '38.2', spo2: '99' },
    },
  },
];
