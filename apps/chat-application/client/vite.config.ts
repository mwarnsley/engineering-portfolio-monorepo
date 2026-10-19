import type { UserConfig } from 'vite';
import type { InlineConfig } from 'vitest/node';
import react from '@vitejs/plugin-react';

// Type both owners explicitly: pnpm can resolve multiple Vite peer instances,
// so Vitest's module augmentation may target a different instance from the React plugin.
export default {
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.ts',
    css: true,
  },
} satisfies UserConfig & { test: InlineConfig };
