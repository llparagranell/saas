import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  base: "/saas/",

  server: {
    proxy: {
      "/api": {
        target: "https://saas-wtcn.onrender.com",
        changeOrigin: true,
        secure: true
      }
    }
  }
});