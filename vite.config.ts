// vite.config.ts

import { defineConfig } from 'vite'
import { resolve, dirname } from 'path'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import EnvironmentPlugin from 'vite-plugin-environment'
import svgr from 'vite-plugin-svgr'
import { loadEnv } from 'vite'
import { fileURLToPath } from 'url'

// Load environment variables based on the current mode
const MODE = process.env.NODE_ENV || 'production'
const env = loadEnv(MODE, process.cwd(), '')
process.env = { ...process.env, ...env }

// Derive __dirname and __filename using fileURLToPath and import.meta.url
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Export the Vite configuration directly as an object
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
})
