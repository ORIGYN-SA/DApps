import { defineConfig } from 'vite';
import { resolve } from 'path';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import EnvironmentPlugin from 'vite-plugin-environment';
import svgr from 'vite-plugin-svgr';
import { loadEnv } from 'vite';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const MODE = process.env.NODE_ENV || 'production';
const env = loadEnv(MODE, process.cwd(), '');
process.env = { ...process.env, ...env };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    EnvironmentPlugin([
      'PUBLIC_DEV_SERVER_PORT',
      'PUBLIC_NFT_CANISTER_ID',
      'PUBLIC_OGY_LEDGER_CANISTER_ID',
      'PUBLIC_ICP_LEDGER_CANISTER_ID',
    ]),
    svgr(),
  ],
  define: {
    'process.env': process.env,
    global: 'globalThis',
    'process.env.BROWSER': 'true',
  },
  resolve: {
    alias: {
      '@dapp/common-candid/src/standard/origyn_nfr': resolve(
        __dirname,
        './src/packages/common/candid/src/standard/origyn_nfr.ts',
      ),
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
      '@dapp/features-sales-escrows/components/modals/TransferTokens': resolve(
        __dirname,
        './src/packages/features/sales-escrows/components/modals/TransferTokens.tsx',
      ),
      '@testUtils': resolve(__dirname, './src/testUtils/index.js'),
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
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
      ],
      external: ['src/testUtils/**/*.js'],
    },
  },
});
