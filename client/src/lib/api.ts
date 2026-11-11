import type { AssessmentInput, AssessmentResult, ApiError, CatalogResponse } from '../../../shared/types';

export class ApiRequestError extends Error {
  readonly code: string;
  readonly issues: { path: string; messageAr: string }[];

  constructor(
    message: string,
    code = 'request_failed',
    issues: { path: string; messageAr: string }[] = [],
  ) {
    super(message);
    this.name = 'ApiRequestError';
    this.code = code;
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
        error?.messageAr ?? 'Request failed',
        error?.code ?? 'request_failed',
        error?.issues ?? [],
      );
    }

    return payload as T;
  } catch (error) {
    if (error instanceof ApiRequestError) throw error;
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiRequestError(
        'Request timed out',
        'timeout',
      );
    }
    throw new ApiRequestError(
      'Network error',
      'network',
    );
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * The GitHub Pages build is fully static: the same engine is bundled and runs
 * locally instead of calling the Express API. The module is imported lazily so
 * server-backed builds never download it.
 */
const STATIC_MODE = __STATIC_MODE__;

export async function fetchCatalog(): Promise<CatalogResponse> {
  if (STATIC_MODE) {
    const { localCatalog } = await import('./static-engine');
    return localCatalog();
  }
  return request<CatalogResponse>('/api/catalog');
}

export async function requestAssessment(input: AssessmentInput): Promise<AssessmentResult> {
  if (STATIC_MODE) {
    const { localAssessment } = await import('./static-engine');
    return localAssessment(input);
  }
  return request<AssessmentResult>('/api/assess', {
    method: 'POST',
    body: JSON.stringify(input),
    cache: 'no-store',
  });
}
