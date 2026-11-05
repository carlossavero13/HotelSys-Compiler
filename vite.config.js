import { defineConfig } from "vite";
export default defineConfig({
  build: { outDir: "dist" },
  server: { host: "127.0.0.1", port: 3000, open: false },
  test: { include: ["tests/**/*.test.js"] },
});
