import { ShieldAlert } from './Icons';

export function DisclaimerBanner() {
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
            إخلاء مسؤولية طبي
          </h2>
          <p className="mt-0.5 text-[12px] leading-relaxed text-amber-900/90">
            هذه الأداة تعليمية لدعم القرار السريري فقط، ولا تُعدّ تشخيصاً نهائياً ولا بديلاً عن
            التقييم السريري المباشر والفحص البدني واستشارة الطبيب المختص. النتائج احتمالية ومبنية على
            قاعدة معرفة مبسطة، ويجب التحقق منها دائماً وفق المعايير المعتمدة وحالة كل مريض على حدة.
          </p>
        </div>
      </div>
    </section>
  );
}
