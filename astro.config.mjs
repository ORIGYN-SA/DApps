import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { loadEnv } from 'vite';
import mainConfig from './vite.config';

const PORT = Number(process.env.PUBLIC_DEV_SERVER_PORT || 9000);
const VALIDATE_PRINCIPAL_RGX =
  '/-/[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{3}/collection/-';

const mode = process.env.NODE_ENV || 'production';
const env = loadEnv(mode, process.cwd(), '');
process.env = { ...process.env, ...env };

export default defineConfig({
  integrations: [react()],
  tsconfig: new URL('./tsconfig.json', import.meta.url).pathname,
  server: {
    port: parseInt(process.env.PUBLIC_DEV_SERVER_PORT),
  },
  vite: {
    ...mainConfig,
    server: {
      port: PORT,
      proxy: {
        [`^${VALIDATE_PRINCIPAL_RGX}`]: {
          target: `http://localhost:${PORT}`,
          changeOrigin: true,
          rewrite: (path) => {
            const newPath = path.replace(new RegExp(`^${VALIDATE_PRINCIPAL_RGX}`), '');
            console.log(newPath);
            return newPath;
          },
        },
      },
    },
  },
});
