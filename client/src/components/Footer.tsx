import { useI18n } from '../i18n';
import { LogoMark } from './Icons';

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="mt-12 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-3">
            <LogoMark className="h-9 w-9 shrink-0 text-brand-900" />
            <div>
              <p className="text-[13.5px] font-bold text-brand-950">{t('footer.brand')}</p>
              <p className="mt-0.5 max-w-md text-[11.5px] leading-relaxed text-slate-500">
                {t('footer.blurb')}
              </p>
            </div>
          </div>

          <div className="text-[11.5px] leading-relaxed text-slate-600 md:text-start">
            <p className="font-semibold text-slate-800">{t('footer.ipTitle')}</p>
            <p className="mt-1">{t('footer.rights')}</p>
            <p className="mt-1">
              {t('footer.supervision')}{' '}
              <span className="font-semibold text-slate-800">{t('footer.supervisor')}</span>
            </p>
            <p>
              {t('footer.development')}{' '}
              <span className="font-semibold text-slate-800">{t('footer.developer')}</span>
            </p>
          </div>
        </div>

        <p className="mt-6 border-t border-slate-100 pt-4 text-[10.5px] text-slate-400">
          {t('footer.legal')}
        </p>
      </div>
    </footer>
  );
}
