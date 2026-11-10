import path from 'node:path';
import 'dotenv/config';

function parsePort(raw: string | undefined): number {
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65_535) return 4000;
  return parsed;
}

function parseOrigins(raw: string | undefined): string[] {
  const fallback = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ];
  if (!raw) return fallback;
  return raw
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => /^https?:\/\/[^\s/]+$/.test(origin));
}

export const config = {
  port: parsePort(process.env.PORT),
  host: process.env.HOST?.trim() || '0.0.0.0',
  isProduction: process.env.NODE_ENV === 'production',
  allowedOrigins: parseOrigins(process.env.ALLOWED_ORIGINS),
  clientDist: path.resolve(process.cwd(), 'dist/client'),
  /** Only enable when running behind a trusted reverse proxy. */
  trustProxy: process.env.TRUST_PROXY === 'true',
} as const;
