import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['server/server.ts'],
  format: ['esm'],
  outDir: 'dist-server',
  clean: true,
  sourcemap: true,
  splitting: false,
  bundle: true,
  external: ['express', 'dotenv', 'pino', 'pino-pretty'],
});
