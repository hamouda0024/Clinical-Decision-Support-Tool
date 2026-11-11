import type { TriageLevel, VitalStatus } from '../../../shared/types';

/** Colour treatments only: labels come from the translation dictionaries. */
export const TRIAGE_STYLES: Record<
  TriageLevel,
  { wrapper: string; badge: string; dot: string }
> = {
  emergency: {
    wrapper: 'border-rose-200 bg-rose-50/80 text-rose-950',
    badge: 'bg-rose-600 text-white',
    dot: 'bg-rose-500',
  },
  urgent: {
    wrapper: 'border-amber-200 bg-amber-50/80 text-amber-950',
    badge: 'bg-amber-500 text-white',
    dot: 'bg-amber-500',
  },
  semi_urgent: {
    wrapper: 'border-sky-200 bg-sky-50/80 text-sky-950',
    badge: 'bg-sky-600 text-white',
    dot: 'bg-sky-500',
  },
  routine: {
    wrapper: 'border-emerald-200 bg-emerald-50/80 text-emerald-950',
    badge: 'bg-emerald-600 text-white',
    dot: 'bg-emerald-500',
  },
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
