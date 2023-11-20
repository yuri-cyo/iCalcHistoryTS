import { defineConfig } from "vite";
import path from "path";
// import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'docs',
  },
  server: {
    host: '0.0.0.0',
    port: 8081, // Змініть це значення на номер порта, який ви бажаєте використовувати
  },
  base: './',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
