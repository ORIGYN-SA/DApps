import { defineConfig } from 'vite';
import mainConfig from './vite.config';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { resolve, dirname, join, extname } from 'path';
import { fileURLToPath } from 'url';
import svgr from 'vite-plugin-svgr';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import EnvironmentPlugin from 'vite-plugin-environment';
import tailwindcss from 'tailwindcss';
import { loadEnv } from 'vite';

// Define constants and derive paths
const VALIDATE_PRINCIPAL_RGX =
  '/-/[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{3}/collection/-';
const PORT = Number(process.env.PUBLIC_DEV_SERVER_PORT || 9000);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables based on the current mode
const MODE = process.env.NODE_ENV || 'production';
const env = loadEnv(MODE, process.cwd(), '');
process.env = { ...process.env, ...env };

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
  root: resolve(__dirname, 'src/bundlePages/collections'),
  ...mainConfig,
  plugins: [
    ...(mainConfig.plugins || []),
    react(),
    EnvironmentPlugin([
      'PUBLIC_DEV_SERVER_PORT',
      'PUBLIC_NFT_CANISTER_ID',
      'PUBLIC_OGY_LEDGER_CANISTER_ID',
      'PUBLIC_ICP_LEDGER_CANISTER_ID',
    ]),
    viteSingleFile(),
    svgr(),
  ],
  define: {
    'process.env': process.env,
    global: 'globalThis',
    'process.env.BROWSER': 'true',
  },
  resolve: {
    alias: {
      '@dapp/features-authentication': resolve(
        __dirname,
        './src/packages/features/authentication/src/index.ts',
      ),
      '@dapp/features-tokensdata': resolve(
        __dirname,
        './src/packages/features/tokensdata/src/index.ts',
      ),
      '@dapp/features-userprofile': resolve(
        __dirname,
        './src/packages/features/userprofile/src/index.ts',
      ),
      '@dapp/features-components': resolve(
        __dirname,
        './src/packages/features/components/src/index.ts',
      ),
      '@dapp/common-assets': resolve(__dirname, './src/packages/common/assets/src/index.ts'),
      '@dapp/common-constants': resolve(__dirname, './src/packages/common/constants/src/index.ts'),
      '@dapp/common-hooks': resolve(__dirname, './src/packages/common/hooks/src/index.ts'),
      '@dapp/common-types': resolve(__dirname, './src/packages/common/types/src/index.ts'),
      '@dapp/utils': resolve(__dirname, './src/packages/utils/src/index.ts'),
      '@assets': resolve(__dirname, 'public/assets'),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
        'process.env.BROWSER': 'true',
      },
    },
  },
  build: {
    outDir: '../../../dist/collection',
    minify: 'terser',
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/bundlePages/collections/index.html'),
      },
      output: {
        entryFileNames: 'index.html',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
      ],
      external: ['src/testUtils/**/*.js'],
    },
  },
  publicDir: resolve(__dirname, './public'),
});
