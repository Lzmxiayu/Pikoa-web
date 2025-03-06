import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
// import vueDevTools from 'vite-plugin-vue-devtools';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ArcoResolver } from 'unplugin-vue-components/resolvers';
import { resolve } from 'node:path';
// import { visualizer } from 'rollup-plugin-visualizer';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    Vue(),
    tsconfigPaths(),
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
    // visualizer({
    //   filename: './dist/stats.html',
    //   title: 'Bundle Visualizer',
    // }),
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
    port: 3000,
    open: true,
  },
  build: {
    // lib: {
    //   entry: 'src/ffmpeg-entry.js',
    //   name: 'ffmpeg',
    //   fileName: 'ffmpeg',
    //   formats: ['umd'],
    // },
    target: 'modules',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: './index.html',
      },
      output: {
        format: 'es',
        entryFileNames: 'index.[hash].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
});
