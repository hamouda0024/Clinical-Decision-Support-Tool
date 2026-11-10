import type { ReactNode } from 'react';
import type { DifferentialDiagnosis } from '../../../shared/types';
import { confidenceBarClass, confidenceTextClass } from '../lib/format';
import { Bolt, ChevronDown, Flask, Pill, Scan, ShieldAlert } from './Icons';

interface Props {
  diagnosis: DifferentialDiagnosis;
  rank: number;
  defaultOpen?: boolean;
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

export function DiagnosisCard({ diagnosis, rank, defaultOpen = false }: Props) {
  const { actions } = diagnosis;
  return (
    <details className="card group overflow-hidden" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-start gap-3 p-4 transition hover:bg-slate-50/70">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[11.5px] font-bold text-brand-700 ring-1 ring-brand-200">
          {rank}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h4 className="text-[13.5px] font-bold text-slate-900">{diagnosis.nameAr}</h4>
            <span className="badge bg-slate-100 text-slate-600">{diagnosis.specialty.labelAr}</span>
          </div>
          <p className="mt-0.5 truncate text-[11px] text-slate-400" dir="ltr">
            {diagnosis.nameEn}
          </p>

          <div className="mt-2 flex items-center gap-2">
            <div
              className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100"
              role="progressbar"
              aria-valuenow={diagnosis.confidence}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`درجة الاحتمالية: ${diagnosis.confidence}%`}
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
                أدلة داعمة من الإدخال
              </p>
              <ul className="flex flex-wrap gap-1">
                {diagnosis.matchedEvidence.map((item) => (
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
                علامات مميزة غير مُسجّلة
              </p>
              <ul className="flex flex-wrap gap-1">
                {diagnosis.missingKeyFindings.map((item) => (
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
              عوامل لا تدعم هذا التشخيص
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
            <span className="text-[10.5px] font-semibold text-rose-700">أعلام حمراء:</span>
            {diagnosis.redFlags.map((flag) => (
              <span
                key={flag}
                className="badge bg-rose-50 text-rose-700 ring-1 ring-rose-200"
              >
                {flag}
              </span>
            ))}
          </div>
        )}

        <div className="grid gap-2 sm:grid-cols-2">
          <ActionList title="الفحوصات المخبرية" icon={<Flask className="h-3.5 w-3.5" />} items={actions.labs} />
          <ActionList title="التصوير الطبي" icon={<Scan className="h-3.5 w-3.5" />} items={actions.imaging} />
          <ActionList
            title="الإجراءات الفورية"
            icon={<Bolt className="h-3.5 w-3.5" />}
            items={actions.immediate}
          />
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
            <h5 className="mb-2 flex items-center gap-1.5 text-[11.5px] font-bold text-slate-700">
              <Pill className="h-3.5 w-3.5 text-brand-700" />
              الأدوية المقترحة
            </h5>
            {actions.medications.length === 0 ? (
              <p className="text-[11.5px] text-slate-500">لا توجد أدوية محددة في هذه الحالة.</p>
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
          title="تحذيرات وموانع الاستخدام"
          tone="danger"
          icon={<ShieldAlert className="h-3.5 w-3.5" />}
          items={actions.alerts}
        />
      </div>
    </details>
  );
}
