import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: { jsx: 'automatic' },
  test: {
    environment: 'node',
    include: ['server/**/*.test.ts', 'shared/**/*.test.ts', 'client/**/*.test.ts', 'client/**/*.test.tsx'],
    reporters: 'default',
  },
});
