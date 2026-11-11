import { LANGUAGES, useI18n, type TranslationKey } from '../i18n';
import { LogoMark, ShieldAlert } from './Icons';

export function Header() {
  const { language, setLanguage, t } = useI18n();

  return (
    <header className="no-print sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 lg:px-8">
        <LogoMark className="h-10 w-10 shrink-0 text-brand-900" />

        <div className="min-w-0">
          <p className="truncate text-[15px] font-bold tracking-tight text-brand-950">
            {t('header.title')}
          </p>
          <p className="truncate text-[11.5px] text-slate-500">{t('header.subtitle')}</p>
        </div>

        <div className="ms-auto flex items-center gap-2">
          <label className="relative inline-flex items-center">
            <span className="sr-only">{t('header.language')}</span>
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="pointer-events-none absolute start-2 h-3.5 w-3.5 text-slate-500"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" />
            </svg>
            <select
              aria-label={t('header.language')}
              value={language}
              onChange={(event) => setLanguage(event.target.value as (typeof LANGUAGES)[number])}
              className="cursor-pointer appearance-none rounded-full border border-slate-200 bg-white py-1.5 pe-2.5 ps-7 text-[11.5px] font-medium text-slate-700 transition hover:border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
            >
              {LANGUAGES.map((code) => (
                <option key={code} value={code}>
                  {t(`language.${code}` as TranslationKey)}
                </option>
              ))}
            </select>
          </label>

          <span className="hidden items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
            {t('header.version')}
          </span>
          <a
            href="#disclaimer"
            className="hidden items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11.5px] font-semibold text-amber-800 transition hover:bg-amber-100 sm:inline-flex"
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            {t('header.educational')}
          </a>
        </div>
      </div>
    </header>
  );
}
