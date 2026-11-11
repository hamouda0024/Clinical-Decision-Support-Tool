// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import type { DifferentialDiagnosis } from '../../../shared/types';
import { runAssessment } from '../../../server/engine/assessment';
import { LanguageProvider } from '../i18n';
import { DiagnosisCard } from './DiagnosisCard';
import { ResultsPanel } from './ResultsPanel';

afterEach(cleanup);

const diagnosis: DifferentialDiagnosis = {
  id: 'acute_coronary_syndrome',
  nameAr: 'متلازمة الشريان التاجي الحادة (احتشاء عضلة القلب)',
  nameEn: 'Acute Coronary Syndrome / Myocardial Infarction',
  confidence: 65,
  specialty: { id: 'cardiology', labelAr: 'قلبية', labelEn: 'Cardiology' },
  summaryAr: 'ملخص سريري.',
  matchedEvidence: [],
  missingKeyFindings: [],
  discouragingFindings: [],
  redFlags: [],
  actions: {
    labs: [],
    imaging: [],
    immediate: [],
    medications: [{ name: 'Aspirin', noteAr: '162–325 مغ' }],
    alerts: [],
  },
};

function renderCard(withheld: boolean) {
  return render(
    <LanguageProvider initialLanguage="en">
      <DiagnosisCard
        diagnosis={diagnosis}
        rank={1}
        symptoms={[]}
        medicationsWithheld={withheld}
      />
    </LanguageProvider>,
  );
}

describe('medication safety gate', () => {
  it('does not render unreviewed drug names or dosages', () => {
    renderCard(true);
    expect(screen.queryByText('Aspirin')).toBeNull();
    expect(screen.queryByText('162–325 مغ')).toBeNull();
    expect(screen.getByText('Medication content withheld')).toBeTruthy();
    // English UI must not expose the English condition name either.
    expect(screen.queryByText(diagnosis.nameEn)).toBeNull();
    expect(screen.getByText(diagnosis.nameAr)).toBeTruthy();
  });

  it('renders medication content only when it is not withheld', () => {
    renderCard(false);
    expect(screen.getByText('Aspirin')).toBeTruthy();
  });
});

describe('paediatric safety gate', () => {
  it('shows the paediatric notice instead of adult differentials', () => {
    const child = runAssessment({
      age: 8,
      sex: 'male',
      specialty: 'emergency',
      duration: { value: 1, unit: 'days' },
      symptoms: ['chest_pain', 'fever'],
      vitals: {
        systolicBP: 110,
        diastolicBP: 70,
        heartRate: 100,
        temperature: 38,
        spo2: 97,
      },
    });

    render(
      <LanguageProvider initialLanguage="en">
        <ResultsPanel
          result={child}
          loading={false}
          error={null}
          onDismissError={() => undefined}
          symptoms={[]}
        />
      </LanguageProvider>,
    );

    expect(screen.getByText('The adult pathway is not applied to children')).toBeTruthy();
    expect(screen.queryByText('Differential diagnoses')).toBeNull();
    expect(child.differentials).toEqual([]);
  });
});
