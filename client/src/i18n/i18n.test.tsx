// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { DISEASES } from '../../../server/data/knowledge-base';
import { SYMPTOMS } from '../../../server/data/catalog';
import { Header } from '../components/Header';
import {
  LANGUAGE_STORAGE_KEY,
  LanguageProvider,
  directionFor,
  formatDateTimeForLanguage,
  resolveInitialLanguage,
  translate,
  useI18n,
} from '.';
import { CLINICAL_CONTENT_POLICY, conditionName, symptomLabel } from './clinical';
import { ar } from './translations/ar';
import { en } from './translations/en';
import { fr } from './translations/fr';

afterEach(() => {
  cleanup();
  document.documentElement.lang = '';
  document.documentElement.dir = '';
  window.localStorage.clear();
});

function DirProbe() {
  const { language, dir } = useI18n();
  return <span data-testid="probe">{`${language}:${dir}`}</span>;
}

describe('translation dictionaries', () => {
  it('keeps every locale in sync with the Arabic reference dictionary', () => {
    const reference = Object.keys(ar).sort();
    expect(Object.keys(en).sort()).toEqual(reference);
    expect(Object.keys(fr).sort()).toEqual(reference);
  });

  it('translates a key and interpolates placeholders', () => {
    expect(translate('en', 'results.governanceBody', { reviewed: 0, total: 24 })).toContain(
      '0 of 24',
    );
    expect(translate('fr', 'results.governanceBody', { reviewed: 0, total: 24 })).toContain(
      '0 cas sur 24',
    );
    expect(translate('ar', 'triage.ews')).toBe('EWS مبسّط');
  });

  it('formats dates with the active locale without Arabic-Indic digits', () => {
    const iso = '2026-11-10T10:30:00.000Z';
    expect(formatDateTimeForLanguage(iso, 'en')).toMatch(/2026/);
    expect(formatDateTimeForLanguage(iso, 'ar')).toMatch(/2026/);
    expect(formatDateTimeForLanguage(iso, 'ar')).not.toMatch(/[٠-٩]/);
  });
});

describe('language resolution and direction', () => {
  it('prefers a valid stored language, then the browser language, then Arabic', () => {
    expect(resolveInitialLanguage('fr', ['en-US'])).toBe('fr');
    expect(resolveInitialLanguage('de', ['fr-CA', 'en'])).toBe('fr');
    expect(resolveInitialLanguage(null, ['en-GB'])).toBe('en');
    expect(resolveInitialLanguage(null, ['de-DE'])).toBe('ar');
    expect(resolveInitialLanguage('invalid', [])).toBe('ar');
  });

  it('maps Arabic to RTL and French/English to LTR', () => {
    expect(directionFor('ar')).toBe('rtl');
    expect(directionFor('fr')).toBe('ltr');
    expect(directionFor('en')).toBe('ltr');
  });
});

describe('medical content policy', () => {
  it('keeps symptoms and condition names in Arabic in every interface language', () => {
    expect(CLINICAL_CONTENT_POLICY).toEqual({
      contentLanguage: 'ar',
      translationsAvailable: false,
      translationStatus: 'pending_medical_review',
    });

    const fever = SYMPTOMS.find((symptom) => symptom.id === 'fever')!;
    expect(symptomLabel(fever, 'ar')).toBe(fever.labelAr);
    expect(symptomLabel(fever, 'en')).toBe(fever.labelAr);
    expect(symptomLabel(fever, 'fr')).toBe(fever.labelAr);

    const es = DISEASES.find((disease) => disease.id === 'acute_coronary_syndrome')!;
    expect(conditionName(es, 'ar')).toBe(es.nameAr);
    expect(conditionName(es, 'en')).toBe(es.nameAr);
    expect(conditionName(es, 'fr')).toBe(es.nameAr);
  });

  it('keeps the 24 condition ids and 58 symptom ids stable', () => {
    expect(DISEASES).toHaveLength(24);
    expect(SYMPTOMS).toHaveLength(58);
    expect(DISEASES.map((disease) => disease.id)).toEqual(
      expect.arrayContaining([
        'acute_coronary_syndrome',
        'pulmonary_embolism',
        'sepsis',
        'acute_ischemic_stroke',
        'bacterial_meningitis',
        'diabetic_ketoacidosis',
      ]),
    );
    expect(new Set(DISEASES.map((disease) => disease.id)).size).toBe(24);
    expect(new Set(SYMPTOMS.map((symptom) => symptom.id)).size).toBe(58);
  });
});

describe('language switching and document direction', () => {
  it('renders LTR initially in English and persists the preference', async () => {
    render(
      <LanguageProvider initialLanguage="en">
        <DirProbe />
      </LanguageProvider>,
    );

    expect(screen.getByTestId('probe').textContent).toBe('en:ltr');
    await waitFor(() => {
      expect(document.documentElement.lang).toBe('en');
      expect(document.documentElement.dir).toBe('ltr');
    });
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('en');
  });

  it('switches direction and interface copy through the selector', async () => {
    render(
      <LanguageProvider initialLanguage="en">
        <Header />
      </LanguageProvider>,
    );

    const selector = screen.getByLabelText('Interface language') as HTMLSelectElement;
    expect(selector.value).toBe('en');
    expect(document.documentElement.dir).toBe('ltr');

    fireEvent.change(selector, { target: { value: 'ar' } });

    await waitFor(() => {
      expect(document.documentElement.lang).toBe('ar');
      expect(document.documentElement.dir).toBe('rtl');
      expect(selector.value).toBe('ar');
    });
    expect(screen.getByText('للاستخدام التعليمي')).toBeTruthy();

    fireEvent.change(selector, { target: { value: 'fr' } });

    await waitFor(() => {
      expect(document.documentElement.dir).toBe('ltr');
      expect(screen.getByText('Usage pédagogique')).toBeTruthy();
    });
  });
});
