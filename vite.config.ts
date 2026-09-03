import { defineConfig } from 'vite';

// Relative base so the build works on GitHub Pages whether it lands on a
// project path (user.github.io/repo) or a custom domain root.
export default defineConfig({
  base: './',
  // Vite doesn't read PORT on its own; honouring it lets a host assign the
  // dev port when 5173 is already taken. Nothing here needs a fixed port.
  server: { port: Number(process.env.PORT) || 5173 },
});
