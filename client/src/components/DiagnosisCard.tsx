import type { ReactNode } from 'react';
import type { DifferentialDiagnosis, SymptomDefinition } from '../../../shared/types';
import { useI18n } from '../i18n';
import { conditionName, localizeFinding, specialtyLabel } from '../i18n/clinical';
import { confidenceBarClass, confidenceTextClass } from '../lib/format';
import { Bolt, ChevronDown, Flask, Pill, Scan, ShieldAlert } from './Icons';

interface Props {
  diagnosis: DifferentialDiagnosis;
  rank: number;
  defaultOpen?: boolean;
  symptoms: SymptomDefinition[];
  medicationsWithheld: boolean;
}

function ActionList({
  title,
  icon,
  items,
  tone = 'default',
}: {
  title: string;
  icon: ReactNode;
  items: string[];
  tone?: 'default' | 'danger';
}) {
  if (items.length === 0) return null;
  return (
    <div
      className={`rounded-xl border p-3 ${
        tone === 'danger' ? 'border-rose-200 bg-rose-50/60' : 'border-slate-200 bg-slate-50/50'
      }`}
    >
      <h5
        className={`mb-2 flex items-center gap-1.5 text-[11.5px] font-bold ${
          tone === 'danger' ? 'text-rose-800' : 'text-slate-700'
        }`}
      >
        <span className={tone === 'danger' ? 'text-rose-600' : 'text-brand-700'}>{icon}</span>
        {title}
      </h5>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li
            key={item}
            className={`flex items-start gap-1.5 text-[11.5px] leading-relaxed ${
              tone === 'danger' ? 'text-rose-900' : 'text-slate-600'
            }`}
          >
            <span
              className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${
                tone === 'danger' ? 'bg-rose-400' : 'bg-brand-400'
              }`}
              aria-hidden
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DiagnosisCard({
  diagnosis,
  rank,
  defaultOpen = false,
  symptoms,
  medicationsWithheld,
}: Props) {
  const { language, t } = useI18n();
  const { actions } = diagnosis;
  const name = conditionName(diagnosis, language);
  const evidence = diagnosis.matchedEvidence.map((item) =>
    localizeFinding(item, language, symptoms),
  );
  const missing = diagnosis.missingKeyFindings.map((item) =>
    localizeFinding(item, language, symptoms),
  );

  return (
    <details className="card group overflow-hidden" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-start gap-3 p-4 transition hover:bg-slate-50/70">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[11.5px] font-bold text-brand-700 ring-1 ring-brand-200">
          {rank}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h4 className="text-[13.5px] font-bold text-slate-900">{name}</h4>
            <span className="badge bg-slate-100 text-slate-600">
              {specialtyLabel(diagnosis.specialty, language)}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <div
              className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100"
              role="progressbar"
              aria-valuenow={diagnosis.confidence}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={t('diagnosis.confidenceAria', { score: diagnosis.confidence })}
            >
              <div
                className={`h-full rounded-full ${confidenceBarClass(diagnosis.confidence)}`}
                style={{ width: `${diagnosis.confidence}%` }}
              />
            </div>
            <span
              className={`text-[11.5px] font-bold tabular-nums ${confidenceTextClass(diagnosis.confidence)}`}
            >
              {diagnosis.confidence}%
            </span>
          </div>
        </div>

        <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
      </summary>

      <div className="space-y-3 border-t border-slate-100 p-4">
        <p className="text-[12px] leading-relaxed text-slate-600">{diagnosis.summaryAr}</p>

        <div className="grid gap-2 sm:grid-cols-2">
          {diagnosis.matchedEvidence.length > 0 && (
            <div>
              <p className="mb-1 text-[10.5px] font-semibold text-slate-500">
                {t('diagnosis.evidence')}
              </p>
              <ul className="flex flex-wrap gap-1">
                {evidence.map((item) => (
                  <li
                    key={item}
                    className="rounded-md bg-brand-50 px-1.5 py-0.5 text-[10.5px] font-medium text-brand-800 ring-1 ring-brand-100"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {diagnosis.missingKeyFindings.length > 0 && (
            <div>
              <p className="mb-1 text-[10.5px] font-semibold text-slate-500">
                {t('diagnosis.missing')}
              </p>
              <ul className="flex flex-wrap gap-1">
                {missing.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border border-dashed border-slate-300 px-1.5 py-0.5 text-[10.5px] text-slate-500"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {diagnosis.discouragingFindings.length > 0 && (
          <div>
            <p className="mb-1 text-[10.5px] font-semibold text-slate-500">
              {t('diagnosis.against')}
            </p>
            <ul className="flex flex-wrap gap-1">
              {diagnosis.discouragingFindings.map((item) => (
                <li
                  key={item}
                  className="rounded-md border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10.5px] text-amber-800"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {diagnosis.redFlags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10.5px] font-semibold text-rose-700">
              {t('diagnosis.redFlags')}
            </span>
            {diagnosis.redFlags.map((flag) => (
              <span key={flag} className="badge bg-rose-50 text-rose-700 ring-1 ring-rose-200">
                {flag}
              </span>
            ))}
          </div>
        )}

        <div className="grid gap-2 sm:grid-cols-2">
          <ActionList
            title={t('diagnosis.labs')}
            icon={<Flask className="h-3.5 w-3.5" />}
            items={actions.labs}
          />
          <ActionList
            title={t('diagnosis.imaging')}
            icon={<Scan className="h-3.5 w-3.5" />}
            items={actions.imaging}
          />
          <ActionList
            title={t('diagnosis.immediate')}
            icon={<Bolt className="h-3.5 w-3.5" />}
            items={actions.immediate}
          />
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
            <h5 className="mb-2 flex items-center gap-1.5 text-[11.5px] font-bold text-slate-700">
              <Pill className="h-3.5 w-3.5 text-brand-700" />
              {t('diagnosis.medications')}
            </h5>
            {medicationsWithheld ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-2.5">
                <p className="text-[11px] font-bold text-amber-900">
                  {t('diagnosis.medicationsWithheldTitle')}
                </p>
                <p className="mt-1 text-[10.5px] leading-relaxed text-amber-900/90">
                  {t('diagnosis.medicationsWithheldBody')}
                </p>
              </div>
            ) : actions.medications.length === 0 ? (
              <p className="text-[11.5px] text-slate-500">{t('diagnosis.noMedications')}</p>
            ) : (
              <ul className="space-y-2">
                {actions.medications.map((medication) => (
                  <li key={medication.name} className="text-[11.5px] leading-relaxed">
                    <p className="font-semibold text-slate-800" dir="ltr">
                      {medication.name}
                    </p>
                    <p className="text-[11px] text-slate-500">{medication.noteAr}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <ActionList
          title={t('diagnosis.alerts')}
          tone="danger"
          icon={<ShieldAlert className="h-3.5 w-3.5" />}
          items={actions.alerts}
        />
      </div>
    </details>
  );
}
