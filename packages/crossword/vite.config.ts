import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: "dist/browser",
    sourcemap: true,
  },
  plugins: [react()],
});
