import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
// import vueDevTools from 'vite-plugin-vue-devtools';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ArcoResolver } from 'unplugin-vue-components/resolvers';
import { resolve } from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    Vue(),
    // vueDevTools(),
    AutoImport({
      resolvers: [ArcoResolver()],
    }),
    Components({
      resolvers: [
        ArcoResolver({
          sideEffect: true,
        }),
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '.proto': './src/assets/dm.proto',
      public: './public',
    },
  },
  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util'],
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  build: {
    lib: {
      entry: 'src/ffmpeg-entry.js',
      name: 'ffmpeg',
      fileName: 'ffmpeg',
      formats: ['umd'],
    },
  },
});
