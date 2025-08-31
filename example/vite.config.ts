import { defineConfig } from 'vite';

export default defineConfig({
  // Ensure assets are served from the repository subpath when deployed
  base: '/cm-markdown/',
});

