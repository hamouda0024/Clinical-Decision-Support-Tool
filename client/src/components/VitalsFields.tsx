import type { VitalDefinition, VitalId } from '../../../shared/types';
import type { FormErrors } from '../lib/form';

interface Props {
  definitions: VitalDefinition[];
  values: Record<VitalId, string>;
  errors: FormErrors;
  onChange: (id: VitalId, value: string) => void;
}

export function VitalsFields({ definitions, values, errors, onChange }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {definitions.map((vital) => {
        const error = errors[vital.id];
        const inputId = `vital-${vital.id}`;
        const hintId = `${inputId}-hint`;
        return (
          <div key={vital.id} className={vital.id === 'spo2' ? 'sm:col-span-2' : undefined}>
            <label htmlFor={inputId} className="label">
              {vital.labelAr}
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
                {vital.unit}
              </span>
            </div>
            <p id={hintId} className={error ? 'field-error' : 'help'}>
              {error ?? `المدى الطبيعي المرجعي للبالغين: ${vital.referenceAr}`}
            </p>
          </div>
        );
      })}
    </div>
  );
}
