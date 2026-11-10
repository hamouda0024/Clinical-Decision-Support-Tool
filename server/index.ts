import { createApp } from './app.js';
import { config } from './config.js';
import { KNOWLEDGE_BASE_SIZE } from './data/knowledge-base.js';

const app = createApp();

const server = app.listen(config.port, config.host, () => {
  console.log(
    `Clinical Decision Support API listening on http://${config.host}:${config.port} ` +
      `(${config.isProduction ? 'production' : 'development'}, knowledge base: ${KNOWLEDGE_BASE_SIZE} entries)`,
  );
});

function shutdown(signal: string): void {
  console.log(`Received ${signal}, shutting down gracefully…`);
  server.close((error) => {
    if (error) {
      console.error('Error while closing server:', error.name);
      process.exitCode = 1;
    }
    process.exit();
  });
  // Do not hang forever on lingering keep-alive connections.
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
