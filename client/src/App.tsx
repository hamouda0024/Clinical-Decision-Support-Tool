import { useCallback, useEffect, useRef, useState } from 'react';
import type { AssessmentInput, AssessmentResult, CatalogResponse } from '../../shared/types';
import { AssessmentForm } from './components/AssessmentForm';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Activity, AlertTriangle, Check, ClipboardList, ShieldAlert } from './components/Icons';
import { ResultsPanel } from './components/ResultsPanel';
import { ApiRequestError, fetchCatalog, requestAssessment } from './lib/api';

export default function App() {
  const [catalog, setCatalog] = useState<CatalogResponse | null>(null);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [catalogLoading, setCatalogLoading] = useState(true);

  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const loadCatalog = useCallback(async () => {
    setCatalogLoading(true);
    setCatalogError(null);
    try {
      const data = await fetchCatalog();
      setCatalog(data);
    } catch (catalogRequestError) {
      setCatalogError(
        catalogRequestError instanceof ApiRequestError
          ? catalogRequestError.message
          : 'تعذّر تحميل قوائم الإدخال. تحقّق من الاتصال ثم أعد المحاولة.',
      );
    } finally {
      setCatalogLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCatalog();
  }, [loadCatalog]);

  const handleSubmit = useCallback(async (input: AssessmentInput) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const assessment = await requestAssessment(input);
      setResult(assessment);
      requestAnimationFrame(() => {
        if (window.matchMedia('(max-width: 1023px)').matches) {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    } catch (requestError) {
      const issues =
        requestError instanceof ApiRequestError && requestError.issues.length > 0
          ? ` (${requestError.issues.map((issue) => issue.messageAr).join(' · ')})`
          : '';
      setError(
        `${requestError instanceof ApiRequestError ? requestError.message : 'تعذّر إتمام التحليل.'}${issues}`,
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleResetResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <DisclaimerBanner />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 lg:px-8">
        <section className="no-print mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge bg-brand-50 text-brand-800 ring-1 ring-brand-200">
              <Activity className="h-3 w-3" />
              دعم القرار السريري
            </span>
            <span className="text-[11px] text-slate-500">مخصص للأطباء والممارسين الصحيين</span>
            {catalog?.governance.clinicalReviewRequired && (
              <span className="badge bg-amber-50 text-amber-800 ring-1 ring-amber-200">
                محتوى غير مُراجع سريرياً
              </span>
            )}
          </div>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-brand-950 sm:text-[28px]">
            تقييم سريري منظّم، مع تشخيصات تفاضلية قابلة للتفسير
          </h1>
          <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-slate-600">
            أدخل الأعراض الرئيسية والعلامات الحيوية للمريض، لتحصل على قائمة مرتّبة بالتشخيصات
            المحتملة مع الفحوصات المطلوبة، الإجراءات الفورية، والأدوية والتحذيرات المرتبطة بكل
            احتمال.
          </p>

          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[11.5px] text-slate-500">
            <li className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              محرك منطقي قابل للتفسير
            </li>
            <li className="flex items-center gap-1.5">
              <ClipboardList className="h-3.5 w-3.5 text-brand-600" />
              فحوصات وإجراءات لكل تشخيص
            </li>
            <li className="flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
              لا تخزين لبيانات المرضى
            </li>
          </ul>
        </section>

        <div className="grid gap-5 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            {catalogLoading && (
              <div className="card space-y-3 p-5" aria-live="polite" aria-busy="true">
                <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                <div className="grid gap-3 sm:grid-cols-2">
                  {[0, 1, 2, 3].map((key) => (
                    <div key={key} className="h-16 animate-pulse rounded-xl bg-slate-100" />
                  ))}
                </div>
                <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
              </div>
            )}

            {!catalogLoading && catalogError && (
              <div className="card border-rose-200 p-5" role="alert">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-5 w-5 text-rose-600" />
                  <div>
                    <h2 className="text-[13.5px] font-bold text-rose-900">تعذّر تحميل الأداة</h2>
                    <p className="mt-1 text-[12px] leading-relaxed text-rose-800">{catalogError}</p>
                    <button type="button" onClick={() => void loadCatalog()} className="btn-ghost mt-3">
                      إعادة المحاولة
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!catalogLoading && catalog && (
              <AssessmentForm
                catalog={catalog}
                loading={loading}
                onSubmit={(input) => void handleSubmit(input)}
                onResetResult={handleResetResult}
              />
            )}
          </div>

          <aside
            ref={resultsRef}
            className="scroll-mt-20 lg:col-span-5 lg:sticky lg:top-20"
            aria-label="لوحة نتائج التقييم"
          >
            <ResultsPanel
              result={result}
              loading={loading}
              error={error}
              onDismissError={() => setError(null)}
            />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
