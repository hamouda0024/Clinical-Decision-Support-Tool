import type { TriageAssessment } from '../../../shared/types';
import { TRIAGE_STYLES } from '../lib/format';
import { AlertTriangle } from './Icons';

export function TriageBanner({ triage }: { triage: TriageAssessment }) {
  const style = TRIAGE_STYLES[triage.level];
  return (
    <section
      aria-labelledby="triage-title"
      className={`rounded-2xl border p-4 ${style.wrapper}`}
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${style.badge}`}>
          <AlertTriangle className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`badge ${style.badge}`}>{style.label}</span>
            <h2 id="triage-title" className="text-[14.5px] font-bold">
              {triage.labelAr}
            </h2>
          </div>
          <p className="mt-1 text-[12px] leading-relaxed opacity-90">{triage.descriptionAr}</p>
          <ul className="mt-2 space-y-1">
            {triage.reasons.slice(0, 5).map((reason) => (
              <li key={reason} className="flex items-start gap-1.5 text-[11.5px] leading-relaxed">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-current opacity-50" aria-hidden />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        <div
          className="shrink-0 rounded-xl bg-white/60 px-2.5 py-1.5 text-center ring-1 ring-current/10"
          title="درجة إنذار مبسّطة من خمس علامات حيوية — ليست NEWS2"
        >
          <p className="text-[9px] font-semibold tracking-wide uppercase opacity-60">EWS مبسّط</p>
          <p className="text-xl leading-tight font-bold">
            {triage.earlyWarningScore}
            <span className="text-[10px] font-medium opacity-60"> / {triage.earlyWarningMax}</span>
          </p>
          <p className="text-[9px] opacity-60">ليست NEWS2</p>
        </div>
      </div>
    </section>
  );
}
