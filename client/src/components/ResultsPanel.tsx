import type { AssessmentResult, SymptomDefinition } from '../../../shared/types';
import { useI18n } from '../i18n';
import { DiagnosisCard } from './DiagnosisCard';
import { AlertTriangle, ClipboardList, InfoCircle, Sparkles, Stethoscope, X } from './Icons';
import { TriageBanner } from './TriageBanner';
import { VitalsSummary } from './VitalsSummary';

interface Props {
  result: AssessmentResult | null;
  loading: boolean;
  error: string | null;
  onDismissError: () => void;
  symptoms: SymptomDefinition[];
}

function EmptyState() {
  const { t } = useI18n();
  return (
    <div className="card flex flex-col items-center px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 ring-1 ring-brand-100">
        <Stethoscope className="h-7 w-7 text-brand-600" />
      </div>
      <h2 className="mt-4 text-[14.5px] font-bold text-slate-800">{t('results.emptyTitle')}</h2>
      <p className="mt-1.5 max-w-xs text-[12px] leading-relaxed text-slate-500">
        {t('results.emptyBody')}
      </p>

      <ul className="mt-6 w-full space-y-2 text-start">
        {[
          { icon: <ClipboardList className="h-4 w-4" />, text: t('results.emptyItem1') },
          { icon: <Sparkles className="h-4 w-4" />, text: t('results.emptyItem2') },
          { icon: <AlertTriangle className="h-4 w-4" />, text: t('results.emptyItem3') },
        ].map((item) => (
          <li
            key={item.text}
            className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-[11.5px] text-slate-600"
          >
            <span className="text-brand-600">{item.icon}</span>
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

function LoadingState() {
  const { t } = useI18n();
  return (
    <div className="card space-y-4 p-5" aria-live="polite" aria-busy="true">
      <div className="flex items-center gap-2">
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-brand-200 border-t-brand-700"
          aria-hidden
        />
        <p className="text-[13px] font-semibold text-slate-700">{t('results.loading')}</p>
      </div>
      <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
      <div className="grid grid-cols-2 gap-2">
        {[0, 1, 2, 3].map((key) => (
          <div key={key} className="h-16 animate-pulse rounded-xl bg-slate-100" />
        ))}
      </div>
      <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
      <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
    </div>
  );
}

export function ResultsPanel({ result, loading, error, onDismissError, symptoms }: Props) {
  const { language, t, formatDateTime } = useI18n();
  if (loading) return <LoadingState />;

  const medicationsWithheld = result?.meta.medicationContentHidden ?? true;

  return (
    <div className="space-y-4">
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-[12.5px] text-rose-800"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p className="flex-1 leading-relaxed">{error}</p>
          <button
            type="button"
            onClick={onDismissError}
            className="rounded-md p-0.5 text-rose-500 transition hover:bg-rose-100 hover:text-rose-700"
            aria-label={t('results.dismissError')}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {!result ? (
        <EmptyState />
      ) : (
        <>
          <TriageBanner triage={result.triage} />

          {result.meta.governance.clinicalReviewRequired && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[11.5px] leading-relaxed text-amber-900">
              <p className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {t('results.governanceTitle')}
              </p>
              <p className="mt-1">
                {t('results.governanceBody', {
                  reviewed: result.meta.governance.reviewedEntries,
                  total: result.meta.governance.totalEntries,
                })}
              </p>
            </div>
          )}

          {result.meta.pediatricUnsupported && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-3 text-[11.5px] leading-relaxed text-rose-900">
              <p className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {t('results.pediatricTitle')}
              </p>
              <p className="mt-1">{t('results.pediatricBody')}</p>
            </div>
          )}

          {result.meta.lowInformation && !result.meta.pediatricUnsupported && (
            <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[11.5px] leading-relaxed text-amber-900">
              <InfoCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{t('results.lowInformation')}</p>
            </div>
          )}

          <VitalsSummary vitals={result.vitals} />

          {!result.meta.pediatricUnsupported && (
            <section aria-labelledby="differentials-title">
              <div className="mb-2 flex flex-wrap items-end justify-between gap-1 px-0.5">
                <h2 id="differentials-title" className="text-[13.5px] font-bold text-slate-900">
                  {t('results.differentialsTitle')}
                </h2>
                <p className="text-[10.5px] text-slate-500">
                  {t('results.differentialsCount', { count: result.differentials.length })}
                </p>
              </div>

              {language !== 'ar' && result.differentials.length > 0 && (
                <p className="mb-2 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-[10.5px] leading-relaxed text-sky-900">
                  {t('results.narrativeNotice')}
                </p>
              )}

              {result.differentials.length === 0 ? (
                <div className="card p-5 text-center text-[12.5px] text-slate-600">
                  {t('results.noDifferentials')}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {result.differentials.map((diagnosis, index) => (
                    <DiagnosisCard
                      key={diagnosis.id}
                      diagnosis={diagnosis}
                      rank={index + 1}
                      defaultOpen={index === 0}
                      symptoms={symptoms}
                      medicationsWithheld={medicationsWithheld}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          <div className="card space-y-2 p-4">
            <div className="flex items-start gap-2">
              <InfoCircle className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              <p className="text-[11px] leading-relaxed text-slate-500">
                {t('results.disclaimer')}
              </p>
            </div>

            <details className="rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2">
              <summary className="cursor-pointer text-[11px] font-semibold text-slate-600">
                {t('results.limitations', { count: result.meta.limitations.length })}
              </summary>
              {language !== 'ar' && (
                <p className="mt-2 text-[10px] leading-relaxed text-slate-500">
                  {t('results.limitationsNote')}
                </p>
              )}
              <ul className="mt-2 space-y-1.5">
                {result.meta.limitations.map((limitation) => (
                  <li
                    key={limitation}
                    className="flex items-start gap-1.5 text-[10.5px] leading-relaxed text-slate-500"
                  >
                    <span
                      className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400"
                      aria-hidden
                    />
                    <span>{limitation}</span>
                  </li>
                ))}
              </ul>
            </details>
            <p className="border-t border-slate-100 pt-2 text-[10px] text-slate-400">
              {t('results.footerMeta', {
                version: result.meta.engineVersion,
                entries: result.meta.knowledgeBaseEntries,
                time: formatDateTime(result.meta.generatedAt),
              })}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
