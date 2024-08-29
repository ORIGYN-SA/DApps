import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { loadEnv } from 'vite';
import mainConfig from './vite.config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mode = process.env.NODE_ENV || 'production';
const env = loadEnv(mode, process.cwd(), '');
process.env = { ...process.env, ...env };

const rgx = '/-/[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{3}/collection/-';

export default defineConfig({
  integrations: [react()],
  tsconfig: new URL('./tsconfig.json', import.meta.url).pathname,
  server: {
    port: parseInt(process.env.PUBLIC_DEV_SERVER_PORT),
  },
  vite: {
    ...mainConfig,
    server: {
      proxy: {
        [`^${rgx}`]: {
          target: 'http://localhost:9001',
          changeOrigin: true,
          rewrite: (path) => {
            const newPath = path.replace(new RegExp(`^${rgx}`), '');
            console.log(newPath)
            return newPath;
          },
        },
      },
    },
  },
});
