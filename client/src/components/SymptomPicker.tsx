import { useMemo, useState } from 'react';
import type { SymptomDefinition, SymptomGroup } from '../../../shared/types';
import { useI18n } from '../i18n';
import { symptomGroupLabel, symptomLabel } from '../i18n/clinical';
import { Search, X } from './Icons';

interface Props {
  symptoms: SymptomDefinition[];
  groups: SymptomGroup[];
  selected: string[];
  onToggle: (id: string) => void;
  onClear: () => void;
  max: number;
  error?: string;
}

export function SymptomPicker({ symptoms, groups, selected, onToggle, onClear, max, error }: Props) {
  const { language, t } = useI18n();
  const [query, setQuery] = useState('');
  const selectedSet = useMemo(() => new Set(selected), [selected]);
  const selectedDefs = useMemo(
    () => symptoms.filter((symptom) => selectedSet.has(symptom.id)),
    [symptoms, selectedSet],
  );

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!normalizedQuery) return symptoms;
    return symptoms.filter((symptom) =>
      symptomLabel(symptom, language).toLowerCase().includes(normalizedQuery),
    );
  }, [symptoms, normalizedQuery, language]);

  const grouped = useMemo(
    () =>
      groups
        .map((group) => ({
          group,
          items: filtered.filter((symptom) => symptom.group === group.id),
        }))
        .filter((entry) => entry.items.length > 0),
    [groups, filtered],
  );

  const atLimit = selected.length >= max;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-[11.5px] text-slate-500">
          {t('symptoms.selected')}{' '}
          <span className="font-bold text-slate-700">{selected.length}</span> / {max}
        </span>
        {selected.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-[11.5px] font-medium text-brand-700 underline decoration-brand-300 underline-offset-2 hover:text-brand-900"
          >
            {t('symptoms.clear')}
          </button>
        )}
      </div>

      {selectedDefs.length > 0 && (
        <ul className="mb-3 flex flex-wrap gap-1.5" aria-label={t('symptoms.selectedAria')}>
          {selectedDefs.map((symptom) => {
            const label = symptomLabel(symptom, language);
            return (
              <li key={symptom.id}>
                <button
                  type="button"
                  onClick={() => onToggle(symptom.id)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-3 py-1.5 text-[12px] font-medium text-white transition hover:bg-brand-700"
                  aria-label={t('symptoms.remove', { name: label })}
                >
                  {label}
                  <X className="h-3 w-3" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="relative">
        <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="input ps-9"
          placeholder={t('symptoms.searchPlaceholder')}
          aria-label={t('symptoms.searchAria')}
        />
      </div>

      <div className="mt-4 max-h-[22rem] space-y-4 overflow-y-auto pe-1">
        {grouped.map(({ group, items }) => (
          <fieldset key={group.id}>
            <legend className="mb-1.5 text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
              {symptomGroupLabel(group, language)}
            </legend>
            <div className="flex flex-wrap gap-1.5">
              {items.map((symptom) => {
                const isSelected = selectedSet.has(symptom.id);
                const disabled = atLimit && !isSelected;
                return (
                  <button
                    key={symptom.id}
                    type="button"
                    onClick={() => onToggle(symptom.id)}
                    aria-pressed={isSelected}
                    disabled={disabled}
                    className={`chip ${isSelected ? 'chip-selected' : ''} ${
                      disabled ? 'cursor-not-allowed opacity-50' : ''
                    }`}
                  >
                    {symptomLabel(symptom, language)}
                    {symptom.redFlag && (
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isSelected ? 'bg-rose-200' : 'bg-rose-500'
                        }`}
                        title={t('symptoms.redFlagTitle')}
                        aria-hidden
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}

        {grouped.length === 0 && (
          <p className="py-6 text-center text-sm text-slate-500">{t('symptoms.empty')}</p>
        )}
      </div>

      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
