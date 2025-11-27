import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { resolve } from 'path';

export default defineConfig({
  plugins: [viteSingleFile()],
  base: '/cellular-automata/',
  build: {
    minify: true,
    outDir: resolve(__dirname, 'dist')
  }
});
