import { LogoMark } from './Icons';

export function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-3">
            <LogoMark className="h-9 w-9 shrink-0 text-brand-900" />
            <div>
              <p className="text-[13.5px] font-bold text-brand-950">Clinical Decision Support Tool</p>
              <p className="mt-0.5 max-w-md text-[11.5px] leading-relaxed text-slate-500">
                أداة تعليمية لدعم القرار السريري، مخصّصة للأطباء والممارسين الصحيين. لا تحفظ بيانات
                المرضى ولا تستبدل الحكم السريري.
              </p>
            </div>
          </div>

          <div className="text-[11.5px] leading-relaxed text-slate-600 md:text-start">
            <p className="font-semibold text-slate-800">حقوق الملكية الفكرية</p>
            <p className="mt-1">
              © 2026 — جميع الحقوق محفوظة.
            </p>
            <p className="mt-1">
              الإشراف الطبي والعلمي: <span className="font-semibold text-slate-800">الدكتورة طاهر أنفال</span>
            </p>
            <p>
              التطوير والهندسة: <span className="font-semibold text-slate-800">زرقين أحمد إسلام</span>
            </p>
          </div>
        </div>

        <p className="mt-6 border-t border-slate-100 pt-4 text-[10.5px] text-slate-400">
          يُمنع نسخ أو إعادة استخدام هذا التطبيق أو محتواه دون إذن كتابي من أصحاب الحقوق. مراجعة
          المحتوى السريري مسؤولية الفريق الطبي المشرف.
        </p>
      </div>
    </footer>
  );
}
