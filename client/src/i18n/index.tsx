import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { DurationUnit } from '../../../shared/types';
import { ar, type TranslationKey } from './translations/ar';
import { en } from './translations/en';
import { fr } from './translations/fr';

export const LANGUAGES = ['ar', 'fr', 'en'] as const;
export type Language = (typeof LANGUAGES)[number];
export type Direction = 'rtl' | 'ltr';

export const LANGUAGE_META: Record<
  Language,
  { label: string; dir: Direction; locale: string }
> = {
  ar: { label: 'العربية', dir: 'rtl', locale: 'ar-DZ' },
  fr: { label: 'Français', dir: 'ltr', locale: 'fr-FR' },
  en: { label: 'English', dir: 'ltr', locale: 'en-GB' },
};

export type { TranslationKey };

const DICTIONARIES: Record<Language, Record<TranslationKey, string>> = { ar, fr, en };

export const LANGUAGE_STORAGE_KEY = 'cds.language';

export function isLanguage(value: unknown): value is Language {
  return typeof value === 'string' && (LANGUAGES as readonly string[]).includes(value);
}

export function directionFor(language: Language): Direction {
  return LANGUAGE_META[language].dir;
}

/**
 * Stored preference wins; otherwise follow a supported browser language.
 * Arabic remains the fallback because it is the project's primary locale.
 */
export function resolveInitialLanguage(
  stored: string | null | undefined,
  navigatorLanguages: readonly string[] = [],
): Language {
  if (isLanguage(stored)) return stored;
  for (const tag of navigatorLanguages) {
    const base = tag.toLowerCase().split('-')[0];
    if (isLanguage(base)) return base;
  }
  return 'ar';
}

export function translate(
  language: Language,
  key: TranslationKey,
  vars?: Record<string, string | number>,
): string {
  const template = DICTIONARIES[language][key] ?? ar[key];
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}

export function formatDateTimeForLanguage(iso: string, language: Language): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  const numbering = language === 'ar' ? 'ar-u-nu-latn' : LANGUAGE_META[language].locale;
  return new Intl.DateTimeFormat(numbering, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

interface I18nContextValue {
  language: Language;
  dir: Direction;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  formatDateTime: (iso: string) => string;
  formatDuration: (value: number, unit: DurationUnit) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function readStoredLanguage(): string | null {
  try {
    return window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function LanguageProvider({
  children,
  initialLanguage,
}: {
  children: ReactNode;
  initialLanguage?: Language;
}) {
  const [language, setLanguageState] = useState<Language>(
    () =>
      initialLanguage ??
      resolveInitialLanguage(
        typeof window === 'undefined' ? null : readStoredLanguage(),
        typeof navigator === 'undefined' ? [] : navigator.languages,
      ),
  );

  const dir = directionFor(language);

  // The document direction is part of the rendered contract: keep it in sync
  // with the provider so logical Tailwind utilities flip immediately.
  useEffect(() => {
    const root = document.documentElement;
    root.lang = language;
    root.dir = dir;
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // Storage can be unavailable in private contexts; the session still works.
    }
  }, [language, dir]);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
  }, []);

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>) =>
      translate(language, key, vars),
    [language],
  );

  const formatDateTime = useCallback(
    (iso: string) => formatDateTimeForLanguage(iso, language),
    [language],
  );

  const formatDuration = useCallback(
    (value: number, unit: DurationUnit) => {
      const key = `duration.${unit}.${value === 1 ? 'one' : 'other'}` as TranslationKey;
      return `${value} ${t(key)}`;
    },
    [t],
  );

  const value = useMemo<I18nContextValue>(
    () => ({ language, dir, setLanguage, t, formatDateTime, formatDuration }),
    [language, dir, setLanguage, t, formatDateTime, formatDuration],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used inside <LanguageProvider>.');
  }
  return context;
}
