import { defineConfig } from 'vite';

// Relative base so the build works on GitHub Pages whether it lands on a
// project path (user.github.io/repo) or a custom domain root.
export default defineConfig({
  base: './',
});
