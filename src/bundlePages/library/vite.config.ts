import { defineConfig } from 'vite';
import mainConfig from '../../../vite.config.build';
import { join } from 'path';

// https://vitejs.dev/config/
const pageName = __dirname.split('/').pop() ?? '';

export default defineConfig({
  ...mainConfig,
  build: {
    outDir: mainConfig.root ? join(mainConfig.root, 'dist', pageName) : undefined,
  },
});
