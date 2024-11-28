// vite.config.build.ts

import { defineConfig } from 'vite';
import mainConfig from './vite.config';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { dirname, join, extname } from 'path';
import { createHtmlPlugin } from 'vite-plugin-html';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

// Define constants and derive paths
const VALIDATE_PRINCIPAL_RGX =
  '/-/[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{3}/collection/-';
const PORT = Number(process.env.PUBLIC_DEV_SERVER_PORT || 9000);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Export the Vite configuration object
export default defineConfig({
  root: __dirname,
  ...mainConfig, // Spread mainConfig properties directly
  plugins: [
    ...(mainConfig.plugins || []),
    react(),
    viteSingleFile(),
    createHtmlPlugin({
      inject: {
        data: {
          InjectedHTML: readFileSync(join(__dirname, 'src', 'index.html'), 'utf-8').replace(
            '<slot />',
            '<script type="module" src="./main.tsx"></script>',
          ),
        },
      },
    }),
  ],
  build: {
    cssMinify: 'lightningcss',
    minify: 'terser',
  },
  appType: 'custom',
  preview: {
    port: PORT,
    proxy: {
      [`^${VALIDATE_PRINCIPAL_RGX}`]: {
        target: `http://localhost:${PORT}`,
        changeOrigin: true,
        rewrite: (path) => {
          const newPath = path.replace(new RegExp(`^${VALIDATE_PRINCIPAL_RGX}`), '');
          if (extname(path) === '.html') {
            return newPath.split('.')[0] + '/index.html';
          }
          return newPath + '/index.html';
        },
      },
    },
  },
});
