import type { AssessmentInput, AssessmentResult, ApiError, CatalogResponse } from '../../../shared/types';

export class ApiRequestError extends Error {
  readonly issues: { path: string; messageAr: string }[];

  constructor(message: string, issues: { path: string; messageAr: string }[] = []) {
    super(message);
    this.name = 'ApiRequestError';
    this.issues = issues;
  }
}

const TIMEOUT_MS = 20_000;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(path, {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
        ...init?.headers,
      },
    });

    const payload: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      const error = (payload as ApiError | null)?.error;
      throw new ApiRequestError(
        error?.messageAr ?? 'تعذّر إتمام الطلب. الرجاء المحاولة مرة أخرى.',
        error?.issues ?? [],
      );
    }

    return payload as T;
  } catch (error) {
    if (error instanceof ApiRequestError) throw error;
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiRequestError('انتهت مهلة الاتصال بالخادم. تحقّق من الشبكة وحاول مجدداً.');
    }
    throw new ApiRequestError('تعذّر الاتصال بالخادم. تأكّد من تشغيل الخدمة ثم أعد المحاولة.');
  } finally {
    clearTimeout(timeout);
  }
}

export function fetchCatalog(): Promise<CatalogResponse> {
  return request<CatalogResponse>('/api/catalog');
}

export function requestAssessment(input: AssessmentInput): Promise<AssessmentResult> {
  return request<AssessmentResult>('/api/assess', {
    method: 'POST',
    body: JSON.stringify(input),
    cache: 'no-store',
  });
}
