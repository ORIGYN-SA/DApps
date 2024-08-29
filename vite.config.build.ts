import { defineConfig } from 'vite';
import mainConfig from './vite.config';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const VALIDATE_PRINCIPAL_RGX =
  '/-/[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{3}/collection/-';
const PORT = Number(process.env.PUBLIC_DEV_SERVER_PORT || 9001);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  root: __dirname,
  ...mainConfig,
  plugins: [
    ...mainConfig.plugins!,
    react(),
    viteSingleFile(),
  ],
  appType: 'custom',
  preview: {
    port: PORT,
    proxy: {
      [`^${VALIDATE_PRINCIPAL_RGX}`]: {
        target: `http://localhost:${PORT}`,
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(new RegExp(`^${VALIDATE_PRINCIPAL_RGX}`), '') + '/index.html',
      },
    },
  },
});
