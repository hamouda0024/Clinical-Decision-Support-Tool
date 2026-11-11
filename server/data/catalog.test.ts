import { describe, expect, it } from 'vitest';
import {
  DURATION_UNITS,
  SPECIALTIES,
  SYMPTOMS,
  SYMPTOM_GROUPS,
  VITALS,
} from './catalog.js';

interface LocalizedEntry {
  id: string;
  labelAr?: string;
  labelFr?: string;
  labelEn?: string;
}

const COLLECTIONS: [string, readonly LocalizedEntry[]][] = [
  ['symptoms', SYMPTOMS],
  ['symptom groups', SYMPTOM_GROUPS],
  ['specialties', SPECIALTIES],
  ['vital signs', VITALS],
  [
    'vital units',
    VITALS.map((vital) => ({
      id: vital.id,
      labelAr: vital.unit,
      labelFr: vital.unitFr,
      labelEn: vital.unitEn,
    })),
  ],
  ['duration units', DURATION_UNITS],
];

describe('catalogue translations', () => {
  for (const [collection, entries] of COLLECTIONS) {
    it(`has Arabic, French and English labels for every ${collection} entry`, () => {
      for (const entry of entries) {
        expect(entry.labelAr?.trim(), `${collection}/${entry.id}: Arabic`).toBeTruthy();
        expect(entry.labelFr?.trim(), `${collection}/${entry.id}: French`).toBeTruthy();
        expect(entry.labelEn?.trim(), `${collection}/${entry.id}: English`).toBeTruthy();
      }
    });
  }
});
