import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'index.ts'),
      name: 'CmMarkdown',
      fileName: (format) => `index.${format === 'es' ? 'esm' : 'js'}`,
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: [
        '@codemirror/state',
        '@codemirror/view',
        '@codemirror/lang-markdown',
        '@codemirror/language-data',
        '@codemirror/language',
        '@lezer/highlight'
      ],
      output: {
        globals: {
          '@codemirror/state': 'CodeMirrorState',
          '@codemirror/view': 'CodeMirrorView',
          '@codemirror/lang-markdown': 'CodeMirrorLangMarkdown',
          '@codemirror/language-data': 'CodeMirrorLanguageData',
          '@codemirror/language': 'CodeMirrorLanguage',
          '@lezer/highlight': 'LezerHighlight'
        }
      }
    }
  }
}); 