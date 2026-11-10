import type { TriageLevel, VitalStatus } from '../../../shared/types';

export const TRIAGE_STYLES: Record<
  TriageLevel,
  { wrapper: string; badge: string; dot: string; label: string }
> = {
  emergency: {
    wrapper: 'border-rose-200 bg-rose-50/80 text-rose-950',
    badge: 'bg-rose-600 text-white',
    dot: 'bg-rose-500',
    label: 'طارئ',
  },
  urgent: {
    wrapper: 'border-amber-200 bg-amber-50/80 text-amber-950',
    badge: 'bg-amber-500 text-white',
    dot: 'bg-amber-500',
    label: 'عاجل',
  },
  semi_urgent: {
    wrapper: 'border-sky-200 bg-sky-50/80 text-sky-950',
    badge: 'bg-sky-600 text-white',
    dot: 'bg-sky-500',
    label: 'شبه عاجل',
  },
  routine: {
    wrapper: 'border-emerald-200 bg-emerald-50/80 text-emerald-950',
    badge: 'bg-emerald-600 text-white',
    dot: 'bg-emerald-500',
    label: 'روتيني',
  },
};

export const VITAL_STATUS_LABEL: Record<VitalStatus, string> = {
  critical_low: 'منخفض جداً',
  low: 'منخفض',
  normal: 'طبيعي',
  high: 'مرتفع',
  critical_high: 'مرتفع جداً',
};

export function vitalStatusClass(status: VitalStatus): string {
  switch (status) {
    case 'normal':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
    case 'low':
    case 'high':
      return 'bg-amber-50 text-amber-700 ring-amber-200';
    case 'critical_low':
    case 'critical_high':
      return 'bg-rose-50 text-rose-700 ring-rose-200';
  }
}

export function confidenceBarClass(score: number): string {
  if (score >= 60) return 'bg-brand-700';
  if (score >= 35) return 'bg-brand-500';
  return 'bg-slate-400';
}

export function confidenceTextClass(score: number): string {
  if (score >= 60) return 'text-brand-800';
  if (score >= 35) return 'text-brand-700';
  return 'text-slate-600';
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('ar-u-nu-latn', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function formatDuration(value: number, unit: 'hours' | 'days' | 'weeks'): string {
  const labels: Record<typeof unit, string> = {
    hours: value === 1 ? 'ساعة' : 'ساعات',
    days: value === 1 ? 'يوم' : 'أيام',
    weeks: value === 1 ? 'أسبوع' : 'أسابيع',
  };
  return `${value} ${labels[unit]}`;
}
