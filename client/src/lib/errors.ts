import type { TranslationKey } from '../i18n';
import { ApiRequestError } from './api';

type Translate = (key: TranslationKey, vars?: Record<string, string | number>) => string;

/**
 * Localise transport/API failures by stable error code. Server validation issue
 * details are Arabic-only; non-Arabic locales get the localized summary instead
 * of mixing untranslated clinical text into the interface.
 */
export function apiErrorMessage(error: unknown, t: Translate): string {
  if (!(error instanceof ApiRequestError)) return t('error.request');

  switch (error.code) {
    case 'validation_error':
      return t('error.validation');
    case 'rate_limited':
      return t('error.rateLimited');
    case 'forbidden_origin':
      return t('error.forbidden');
    case 'not_found':
      return t('error.notFound');
    case 'internal_error':
      return t('error.internal');
    case 'timeout':
      return t('error.timeout');
    case 'network':
      return t('error.connection');
    default:
      return t('error.request');
  }
}
