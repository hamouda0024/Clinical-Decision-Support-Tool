import fs from 'node:fs';
import path from 'node:path';
import compression from 'compression';
import express, { type NextFunction, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import type { ApiError } from '../shared/types.js';
import { config } from './config.js';
import { buildCatalog } from './data/catalog-response.js';
import { KNOWLEDGE_BASE_GOVERNANCE, KNOWLEDGE_BASE_SIZE } from './data/knowledge-base.js';
import { ENGINE_VERSION, runAssessment } from './engine/assessment.js';
import { FUTURE_CONTENT_REGISTRY, FUTURE_FEATURE_FLAGS } from './governance/future-schemas.js';
import { assessmentSchema, formatIssues } from './validation.js';

/** Requests from another origin are rejected: the API is same-origin only. */
function isSameOrigin(req: Request): boolean {
  const origin = req.get('origin');
  if (!origin) return true; // curl/server-to-server: no ambient browser credentials involved

  let parsed: URL;
  try {
    parsed = new URL(origin);
  } catch {
    return false;
  }
  if (config.allowedOrigins.includes(parsed.origin)) return true;

  // Compare hosts only: TLS may terminate at a trusted proxy (preview/CDN), so the
  // request can arrive over HTTP while the browser origin is HTTPS. The host check is
  // what prevents cross-site requests; protocols add no CSRF protection.
  const host = req.get('host');
  if (!host) return false;
  return parsed.host === host;
}

function noStore(_req: Request, res: Response, next: NextFunction): void {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  next();
}

export function createApp(): express.Express {
  const app = express();
  app.disable('x-powered-by');
  if (config.trustProxy) app.set('trust proxy', 1);

  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          // Tailwind/Vite inject <style> blocks; needed also for style attributes.
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:'],
          fontSrc: ["'self'"],
          connectSrc: ["'self'"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
          frameAncestors: ["'none'"],
          upgradeInsecureRequests: config.isProduction ? [] : null,
        },
      },
      crossOriginEmbedderPolicy: false,
      referrerPolicy: { policy: 'no-referrer' },
    }),
  );
  app.use(compression());
  app.use(express.json({ limit: '16kb', strict: true, type: 'application/json' }));

  // Reject cross-site API calls (CSRF defense-in-depth; no cookies are used).
  app.use('/api', (req, res, next) => {
    if (req.method === 'GET' || req.method === 'HEAD') return next();
    if (!isSameOrigin(req)) {
      res.status(403).json({
        error: { code: 'forbidden_origin', messageAr: 'طلب من مصدر غير مسموح به.' },
      } satisfies ApiError);
      return;
    }
    next();
  });

  app.use('/api', noStore);

  const apiLimiter = rateLimit({
    windowMs: 60_000,
    limit: 40,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
      error: { code: 'rate_limited', messageAr: 'عدد الطلبات كبير. الرجاء المحاولة بعد دقيقة.' },
    } satisfies ApiError,
  });
  app.use('/api', apiLimiter);

  app.get('/api/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      engineVersion: ENGINE_VERSION,
      knowledgeBaseEntries: KNOWLEDGE_BASE_SIZE,
      knowledgeBaseSchemaVersion: KNOWLEDGE_BASE_GOVERNANCE.schemaVersion,
      contentStatus: KNOWLEDGE_BASE_GOVERNANCE.contentStatus,
      reviewedEntries: KNOWLEDGE_BASE_GOVERNANCE.reviewedEntries,
    });
  });

  app.get('/api/catalog', (_req, res) => {
    res.status(200).json(buildCatalog());
  });

  // Future capability contract. It exposes no clinical content and every flag
  // stays false until the physician supplies and signs off the corresponding
  // module. Clients must not treat this as an enabled feature list yet.
  app.get('/api/capabilities', (_req, res) => {
    res.status(200).json({
      status: FUTURE_CONTENT_REGISTRY.status,
      schemaVersion: FUTURE_CONTENT_REGISTRY.schemaVersion,
      features: FUTURE_FEATURE_FLAGS,
      modules: {
        actionPlans: FUTURE_CONTENT_REGISTRY.actionPlans.length,
        pathways: FUTURE_CONTENT_REGISTRY.pathways.length,
        references: FUTURE_CONTENT_REGISTRY.references.length,
        labInterpretations: FUTURE_CONTENT_REGISTRY.labInterpretations.length,
        medications: FUTURE_CONTENT_REGISTRY.medications.length,
        populationPathways: FUTURE_CONTENT_REGISTRY.populationPathways.length,
        exportProfiles: FUTURE_CONTENT_REGISTRY.exportProfiles.length,
        offline: FUTURE_CONTENT_REGISTRY.offline.enabled,
      },
    });
  });

  app.post('/api/assess', (req, res) => {
    const parsed = assessmentSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: {
          code: 'validation_error',
          messageAr: 'بعض الحقول غير صالحة. الرجاء مراجعة البيانات المدخلة.',
          issues: formatIssues(parsed.error),
        },
      } satisfies ApiError);
      return;
    }

    // Never persist or log patient data: the assessment is computed in memory only.
    const result = runAssessment(parsed.data);
    res.status(200).json(result);
  });

  app.use('/api', (_req, res) => {
    res.status(404).json({
      error: { code: 'not_found', messageAr: 'المسار المطلوب غير موجود.' },
    } satisfies ApiError);
  });

  // ---- Static client (production build) ----------------------------------
  const indexHtml = path.join(config.clientDist, 'index.html');
  if (fs.existsSync(indexHtml)) {
    app.use(
      express.static(config.clientDist, {
        index: false,
        setHeaders: (res, filePath) => {
          if (filePath.includes(`${path.sep}assets${path.sep}`)) {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          }
        },
      }),
    );
    app.get(/^\/(?!api(?:\/|$)).*/, (req, res, next) => {
      if (req.method !== 'GET') return next();
      res.setHeader('Cache-Control', 'no-cache');
      res.sendFile(indexHtml, (error) => {
        if (error) next(error);
      });
    });
  }

  app.use((_req, res) => {
    res.status(404).json({
      error: { code: 'not_found', messageAr: 'المسار المطلوب غير موجود.' },
    } satisfies ApiError);
  });

  // Central error handler: never leaks stack traces or internals.
  app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (res.headersSent) return;
    const isPayloadTooLarge =
      typeof error === 'object' && error !== null && 'type' in error &&
      (error as { type?: string }).type === 'entity.too.large';
    if (isPayloadTooLarge) {
      res.status(413).json({
        error: { code: 'payload_too_large', messageAr: 'حجم الطلب أكبر من المسموح.' },
      } satisfies ApiError);
      return;
    }
    const isBadJson =
      typeof error === 'object' && error !== null && 'type' in error &&
      (error as { type?: string }).type === 'entity.parse.failed';
    if (isBadJson) {
      res.status(400).json({
        error: { code: 'invalid_json', messageAr: 'صيغة JSON غير صالحة.' },
      } satisfies ApiError);
      return;
    }
    console.error('[api] unhandled error:', (error as Error)?.name ?? 'unknown');
    res.status(500).json({
      error: { code: 'internal_error', messageAr: 'حدث خطأ غير متوقع. الرجاء المحاولة لاحقاً.' },
    } satisfies ApiError);
  });

  return app;
}
