import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { loadEnv } from 'vite';
import path from 'path';
import EnvironmentPlugin from 'vite-plugin-environment';
import process from 'process';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

process.env = {
  ...process.env,
  ...loadEnv(process.env.NODE_ENV, path.resolve(process.cwd(), './'), ''),
};

//const url = '/-/'+process.env.NFT_CANISTER_ID+'/collection/-/marketplace';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  server: {
    host: 'localhost',
    port: parseInt(process.env.DEV_SERVER_PORT),
  },
  build: {
    format: 'file',
    out: 'dist',
  },
  fallback: {
    fs: false,
    path: false,
  },
  tsconfig: new URL('./tsconfig.json', import.meta.url).pathname,
  vite: {
    plugins: [EnvironmentPlugin(['DEV_SERVER_PORT', 'NFT_CANISTER_ID', 'OGY_LEDGER_CANISTER_ID'])],
    define: {
      'process.env': process.env,
    },
    resolve: {
      alias: {
        '@dapp/features-authentication': resolve(
          __dirname,
          './src/packages/features/authentication/src/index.tsx',
        ),
        '@dapp/features-theme': resolve(__dirname, './src/packages/features/theme/src/index.tsx'),
        '@dapp/features-components': resolve(
          __dirname,
          './src/packages/features/components/src/index.ts',
        ),
        '@dapp/features-tokens-provider': resolve(
          __dirname,
          './src/packages/features/tokens-provider/src/index.ts',
        ),
        '@dapp/features-context-provider': resolve(
          __dirname,
          './src/packages/features/context-provider/src/index.tsx',
        ),
        '@dapp/utils': resolve(__dirname, './src/packages/utils/src/index.ts'),
        '@dapp/common-types': resolve(__dirname, './src/packages/common/types/src/index.ts'),
        '@dapp/common-candid': resolve(__dirname, './src/packages/common/candid/src/index.ts'),
        '@dapp/common-assets': resolve(__dirname, './src/packages/common/assets/src/index.ts'),
        '@dapp/candy-editor': resolve(__dirname, './src/packages/candy_editor/src/index.ts'),
        '@dapp/features-debug-provider': resolve(
          __dirname,
          './src/packages/features/debug-provider/src/index.tsx',
        ),
        '@dapp/features-sales-escrows': resolve(
          __dirname,
          './src/packages/features/sales-escrows/index.ts',
        ),
        '@dapp/features-user-messages': resolve(
          __dirname,
          './src/packages/features/user-messages/src/index.ts',
        ),
        '@dapp/common-api': resolve(__dirname, './src/packages/common/api/src/index.ts'),
        '@dapp/app-ledger': resolve(__dirname, './src/pages/ledger.astro'),
        '@daap/app-vault': resolve(__dirname, './src/pages/vault.astro'),
        '@dapp/features-sales-escrows/components/modals/TransferTokens': resolve( __dirname, './src/packages/features/sales-escrows/components/modals/TransferTokens.tsx'),
        '@testUtils': resolve(__dirname, './src/testUtils/index.ts'),
        process: 'process/browser',
        buffer: 'buffer/',
        stream: 'stream-browserify/',
        crypto: 'crypto-browserify/',
        util: 'util/',
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'globalThis',
          'process.env.BROWSER': 'true',
        },
        plugins: [
          NodeGlobalsPolyfillPlugin({
            process: true,
            buffer: true,
          }),
        ],
      },
    },
  },
});
