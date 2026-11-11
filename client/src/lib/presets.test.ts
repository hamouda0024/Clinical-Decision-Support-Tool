import { describe, expect, it } from 'vitest';
import { VITALS } from '../../../server/data/catalog';
import { translate } from '../i18n';
import { validateForm, type FormState } from './form';
import { PRESETS } from './presets';

const vitalLabels = Object.fromEntries(VITALS.map((vital) => [vital.id, vital.labelAr])) as Record<
  keyof FormState['vitals'],
  string
>;

describe('quick presets', () => {
  it('keeps the three documented examples and distinct ids', () => {
    expect(PRESETS.map((preset) => preset.id)).toEqual(['chest', 'respiratory', 'abdominal']);
    expect(new Set(PRESETS.map((preset) => preset.id)).size).toBe(3);
  });

  it('keeps every preset valid under the same form rules', () => {
    for (const preset of PRESETS) {
      const errors = validateForm(
        preset.form,
        25,
        (key, vars) => translate('ar', key, vars),
        vitalLabels,
      );
      expect(errors, preset.id).toEqual({});
    }
  });

  it('keeps synthetic demo data only, with no patient identifiers', () => {
    for (const preset of PRESETS) {
      expect(Number(preset.form.age)).toBeGreaterThan(0);
      expect(preset.form.symptoms.length).toBeGreaterThan(0);
      expect(preset.form.symptoms.length).toBeLessThanOrEqual(25);
      expect(Object.keys(preset.form)).not.toContain('name');
      expect(Object.keys(preset.form)).not.toContain('patientId');
    }
  });
});
