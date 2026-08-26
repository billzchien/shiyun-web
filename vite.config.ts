import { defineConfig } from 'vite';

// Relative base so the build works on GitHub Pages whether it lands on a
// project path (user.github.io/repo) or a custom domain root.
export default defineConfig({
  base: './',
  define: {
    /**
     * The privacy page's "Last updated" line. Stamped from the machine that
     * runs the build — which, since CI builds on every push, is the deploy
     * date. UTC and an explicit format so a runner's locale cannot change it.
     */
    __BUILD_DATE__: JSON.stringify(
      new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(new Date())
    ),
  },
});
