import type { VitalDefinition, VitalId } from '../../../shared/types';
import { useI18n } from '../i18n';
import { vitalLabel, vitalUnit } from '../i18n/clinical';
import type { FormErrors } from '../lib/form';

interface Props {
  definitions: VitalDefinition[];
  values: Record<VitalId, string>;
  errors: FormErrors;
  onChange: (id: VitalId, value: string) => void;
}

export function VitalsFields({ definitions, values, errors, onChange }: Props) {
  const { language, t } = useI18n();

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {definitions.map((vital) => {
        const error = errors[vital.id];
        const inputId = `vital-${vital.id}`;
        const hintId = `${inputId}-hint`;
        return (
          <div key={vital.id} className={vital.id === 'spo2' ? 'sm:col-span-2' : undefined}>
            <label htmlFor={inputId} className="label">
              {vitalLabel(vital, language)}
            </label>
            <div className="relative">
              <input
                id={inputId}
                name={vital.id}
                type="number"
                inputMode="decimal"
                min={vital.min}
                max={vital.max}
                step={vital.step}
                value={values[vital.id]}
                onChange={(event) => onChange(vital.id, event.target.value)}
                className={`input pe-20 ${error ? 'input-error' : ''}`}
                placeholder={`${vital.min}–${vital.max}`}
                aria-invalid={Boolean(error)}
                aria-describedby={hintId}
                required
              />
              <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10.5px] font-medium text-slate-500">
                {vitalUnit(vital, language)}
              </span>
            </div>
            <p id={hintId} className={error ? 'field-error' : 'help'}>
              {error ?? t('vitals.normalRange', { range: vital.referenceAr })}
            </p>
            {language !== 'ar' && !error && (
              <p className="mt-0.5 text-[9.5px] text-slate-400">{vital.referenceAr}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
