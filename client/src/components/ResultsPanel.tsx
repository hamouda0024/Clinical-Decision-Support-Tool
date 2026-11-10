import type { AssessmentResult } from '../../../shared/types';
import { formatDateTime } from '../lib/format';
import { DiagnosisCard } from './DiagnosisCard';
import { AlertTriangle, ClipboardList, InfoCircle, Sparkles, Stethoscope, X } from './Icons';
import { TriageBanner } from './TriageBanner';
import { VitalsSummary } from './VitalsSummary';

interface Props {
  result: AssessmentResult | null;
  loading: boolean;
  error: string | null;
  onDismissError: () => void;
}

function EmptyState() {
  return (
    <div className="card flex flex-col items-center px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 ring-1 ring-brand-100">
        <Stethoscope className="h-7 w-7 text-brand-600" />
      </div>
      <h2 className="mt-4 text-[14.5px] font-bold text-slate-800">نتائج التقييم ستظهر هنا</h2>
      <p className="mt-1.5 max-w-xs text-[12px] leading-relaxed text-slate-500">
        أكمل بيانات المريض والأعراض والعلامات الحيوية، ثم اضغط «تحليل الحالة» للحصول على التشخيصات
        التفاضلية والإجراءات الموصى بها.
      </p>

      <ul className="mt-6 w-full space-y-2 text-start">
        {[
          { icon: <ClipboardList className="h-4 w-4" />, text: 'ترتيب التشخيصات حسب درجة الاحتمالية' },
          { icon: <Sparkles className="h-4 w-4" />, text: 'أدلة داعمة وعلامات ناقصة لكل تشخيص' },
          { icon: <AlertTriangle className="h-4 w-4" />, text: 'مستوى الفرز والتحذيرات والموانع' },
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
  return (
    <div className="card space-y-4 p-5" aria-live="polite" aria-busy="true">
      <div className="flex items-center gap-2">
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-brand-200 border-t-brand-700"
          aria-hidden
        />
        <p className="text-[13px] font-semibold text-slate-700">جارٍ تحليل البيانات سريرياً…</p>
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

export function ResultsPanel({ result, loading, error, onDismissError }: Props) {
  if (loading) return <LoadingState />;

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
            aria-label="إغلاق التنبيه"
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
                محتوى سريري غير مُعتمد بعد
              </p>
              <p className="mt-1">
                لم تُوقَّع المراجعة الطبية على قاعدة المعرفة: راجع الطبيب{' '}
                {result.meta.governance.reviewedEntries} من أصل{' '}
                {result.meta.governance.totalEntries} حالة. تُعرض النتائج للاستخدام التعليمي
                والمراجعة فقط، ولا تُعتمد للتشخيص أو القرار العلاجي.
              </p>
            </div>
          )}

          {result.meta.lowInformation && (
            <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[11.5px] leading-relaxed text-amber-900">
              <InfoCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                عدد الأعراض المُدخلة قليل، لذلك قد يكون ترتيب التشخيصات محدود الدقة. أضف المزيد من
                الأعراض السريرية للحصول على تقييم أفضل.
              </p>
            </div>
          )}

          <VitalsSummary vitals={result.vitals} />

          <section aria-labelledby="differentials-title">
            <div className="mb-2 flex flex-wrap items-end justify-between gap-1 px-0.5">
              <h2 id="differentials-title" className="text-[13.5px] font-bold text-slate-900">
                التشخيصات التفاضلية
              </h2>
              <p className="text-[10.5px] text-slate-500">
                {result.differentials.length} تشخيصات · مرتبة تنازلياً حسب درجة الاحتمالية
              </p>
            </div>

            {result.differentials.length === 0 ? (
              <div className="card p-5 text-center text-[12.5px] text-slate-600">
                لم يُعثر على تشخيص مطابق للأعراض المُدخلة. راجع الأعراض المختارة أو أضف أعراضاً أخرى.
              </div>
            ) : (
              <div className="space-y-2.5">
                {result.differentials.map((diagnosis, index) => (
                  <DiagnosisCard
                    key={diagnosis.id}
                    diagnosis={diagnosis}
                    rank={index + 1}
                    defaultOpen={index === 0}
                  />
                ))}
              </div>
            )}
          </section>

          <div className="card space-y-2 p-4">
            <div className="flex items-start gap-2">
              <InfoCircle className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              <p className="text-[11px] leading-relaxed text-slate-500">
                درجات الاحتمالية نسبية داخل هذه الأداة وليست احتمالات مطلقة أو تشخيصاً. القرار
                النهائي مسؤولية الطبيب المعالج، ويجب التحقق من كل توصية وفق المعايير السريرية
                المعتمدة.
              </p>
            </div>

            <details className="rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2">
              <summary className="cursor-pointer text-[11px] font-semibold text-slate-600">
                حدود هذه النسخة ({result.meta.limitations.length})
              </summary>
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
              محرك التحليل v{result.meta.engineVersion} · قاعدة المعرفة: {result.meta.knowledgeBaseEntries}{' '}
              حالة · وقت التوليد: {formatDateTime(result.meta.generatedAt)}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
