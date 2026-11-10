import { LogoMark, ShieldAlert } from './Icons';

export function Header() {
  return (
    <header className="no-print sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 lg:px-8">
        <LogoMark className="h-10 w-10 shrink-0 text-brand-900" />

        <div className="min-w-0">
          <p className="truncate text-[15px] font-bold tracking-tight text-brand-950">
            Clinical Decision Support
          </p>
          <p className="truncate text-[11.5px] text-slate-500">
            أداة دعم القرار السريري — للأطباء والممارسين الصحيين
          </p>
        </div>

        <div className="ms-auto flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
            الإصدار 1.0
          </span>
          <a
            href="#disclaimer"
            className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11.5px] font-semibold text-amber-800 transition hover:bg-amber-100"
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            للاستخدام التعليمي
          </a>
        </div>
      </div>
    </header>
  );
}
