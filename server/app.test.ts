import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { AssessmentResult, CatalogResponse } from '../shared/types.js';
import { createApp } from './app.js';

let server: Server;
let baseUrl: string;

beforeAll(async () => {
  const app = createApp();
  await new Promise<void>((resolve) => {
    server = app.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${address.port}`;
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

describe('API', () => {
  it('serves a health check without caching', async () => {
    const response = await fetch(`${baseUrl}/api/health`);
    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toContain('no-store');
    const body = (await response.json()) as { status: string; knowledgeBaseEntries: number };
    expect(body.status).toBe('ok');
    expect(body.knowledgeBaseEntries).toBeGreaterThan(0);
  });

  it('serves the symptom catalogue', async () => {
    const response = await fetch(`${baseUrl}/api/catalog`);
    expect(response.status).toBe(200);
    const catalog = (await response.json()) as CatalogResponse;
    expect(catalog.symptoms.length).toBeGreaterThan(20);
    expect(catalog.vitals.map((vital) => vital.id)).toContain('spo2');
    expect(catalog.specialties.length).toBeGreaterThan(5);
  });

  it('rejects cross-site POST requests', async () => {
    const response = await fetch(`${baseUrl}/api/assess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: 'https://evil.example' },
      body: JSON.stringify({}),
    });
    expect(response.status).toBe(403);
    const body = (await response.json()) as { error: { code: string } };
    expect(body.error.code).toBe('forbidden_origin');
  });

  it('validates the assessment payload before running the engine', async () => {
    const response = await fetch(`${baseUrl}/api/assess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: baseUrl },
      body: JSON.stringify({ age: 40 }),
    });
    expect(response.status).toBe(400);
    const body = (await response.json()) as { error: { code: string; issues: unknown[] } };
    expect(body.error.code).toBe('validation_error');
    expect(body.error.issues.length).toBeGreaterThan(0);
  });

  it('returns a differential assessment for a same-origin request', async () => {
    const response = await fetch(`${baseUrl}/api/assess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: baseUrl },
      body: JSON.stringify({
        age: 58,
        sex: 'male',
        specialty: 'emergency',
        duration: { value: 2, unit: 'hours' },
        symptoms: ['chest_pain', 'diaphoresis', 'dyspnea'],
        vitals: {
          systolicBP: 150,
          diastolicBP: 95,
          heartRate: 108,
          temperature: 37.1,
          spo2: 93,
        },
      }),
    });
    expect(response.status).toBe(200);
    const result = (await response.json()) as AssessmentResult;
    expect(result.triage.level).toBe('emergency');
    expect(result.differentials.length).toBeGreaterThan(0);
    expect(result.meta.knowledgeBaseEntries).toBeGreaterThan(0);
  });

  it('sets baseline security headers', async () => {
    const response = await fetch(`${baseUrl}/api/health`);
    expect(response.headers.get('x-content-type-options')).toBe('nosniff');
    expect(response.headers.get('x-frame-options')).toBeTruthy();
    expect(response.headers.get('content-security-policy')).toContain("default-src 'self'");
    expect(response.headers.get('x-powered-by')).toBeNull();
  });

  it('returns a structured 404 for unknown API routes', async () => {
    const response = await fetch(`${baseUrl}/api/does-not-exist`);
    expect(response.status).toBe(404);
    const body = (await response.json()) as { error: { code: string } };
    expect(body.error.code).toBe('not_found');
  });
});
