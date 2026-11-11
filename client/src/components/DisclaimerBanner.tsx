import { useI18n } from '../i18n';
import { ShieldAlert } from './Icons';

export function DisclaimerBanner() {
  const { t } = useI18n();

  return (
    <section
      id="disclaimer"
      aria-labelledby="disclaimer-title"
      className="no-print border-b border-amber-200/80 bg-amber-50"
    >
      <div className="mx-auto flex max-w-7xl items-start gap-3 px-4 py-3 lg:px-8">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
        <div>
          <h2 id="disclaimer-title" className="text-[13px] font-bold text-amber-900">
            {t('disclaimer.title')}
          </h2>
          <p className="mt-0.5 text-[12px] leading-relaxed text-amber-900/90">
            {t('disclaimer.body')}
          </p>
        </div>
      </div>
    </section>
  );
}
