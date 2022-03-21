import * as path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import icons from 'unplugin-icons/vite';
import iconResolver from 'unplugin-icons/resolver';
import components from 'unplugin-vue-components/vite';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    vue({
      reactivityTransform: true,
    }),
    components({
      resolvers: [iconResolver()],
      dts: 'src/types/components.d.ts',
    }),
    icons({
      scale: 1.5,
    }),
  ],
});
