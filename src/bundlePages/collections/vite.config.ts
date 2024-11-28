// src/bundlePages/collections/vite.config.ts
import { defineConfig } from 'vite';
import mainConfig from '../../../vite.config.build';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { dirname, join, basename } from 'path';
import { createHtmlPlugin } from 'vite-plugin-html';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

// Derive __filename and __dirname directly using fileURLToPath and import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the page name from the directory path
const pageName = basename(__dirname);

// Update this path to the actual location of index.html
const indexPath = join(__dirname, 'index.html');

// Export the Vite configuration object
export default defineConfig({
  ...mainConfig,
  root: __dirname,
  plugins: [
    ...(mainConfig.plugins || []),
    react(),
    viteSingleFile(),
    createHtmlPlugin({
      inject: {
        data: {
          InjectedHTML: readFileSync(indexPath, 'utf-8').replace(
            '<slot />',
            '<script type="module" src="./main.tsx"></script>',
          ),
        },
      },
    }),
  ],
  build: {
    outDir: mainConfig.root ? join(mainConfig.root, 'dist', pageName) : undefined,
  },
});
