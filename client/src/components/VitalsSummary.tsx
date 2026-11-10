import type { VitalEvaluation } from '../../../shared/types';
import { VITAL_STATUS_LABEL, vitalStatusClass } from '../lib/format';
import { HeartPulse } from './Icons';

export function VitalsSummary({ vitals }: { vitals: VitalEvaluation[] }) {
  return (
    <section className="card p-4" aria-labelledby="vitals-summary-title">
      <div className="mb-3 flex items-center gap-2">
        <HeartPulse className="h-4 w-4 text-rose-500" />
        <h2 id="vitals-summary-title" className="text-[13px] font-bold text-slate-800">
          تقييم العلامات الحيوية
        </h2>
      </div>

      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {vitals.map((vital) => (
          <div
            key={vital.id}
            className="rounded-xl border border-slate-200/80 bg-slate-50/60 px-3 py-2"
          >
            <dt className="text-[10.5px] font-medium text-slate-500">{vital.labelAr}</dt>
            <dd className="mt-1 flex items-baseline gap-1">
              <span className="text-[15px] font-bold text-slate-900">{vital.value}</span>
              <span className="text-[10px] text-slate-500">{vital.unit}</span>
            </dd>
            <dd className="mt-1">
              <span
                className={`badge ring-1 ${vitalStatusClass(vital.status)}`}
                title={vital.noteAr}
              >
                {VITAL_STATUS_LABEL[vital.status]}
              </span>
            </dd>
          </div>
        ))}
      </dl>

      {vitals.some((vital) => vital.status !== 'normal') && (
        <ul className="mt-3 space-y-1">
          {vitals
            .filter((vital) => vital.status !== 'normal')
            .map((vital) => (
              <li key={vital.id} className="text-[11px] leading-relaxed text-slate-600">
                <span className="font-semibold text-slate-700">{vital.labelAr}:</span> {vital.noteAr}
              </li>
            ))}
        </ul>
      )}
    </section>
  );
}
