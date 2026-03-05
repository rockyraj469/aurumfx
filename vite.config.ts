import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(async () => {
  const plugins = [react()];

  // Only load Replit-specific plugins when running on Replit
  if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined) {
    const runtimeErrorOverlay = (await import("@replit/vite-plugin-runtime-error-modal")).default;
    const cartographer = (await import("@replit/vite-plugin-cartographer")).cartographer;
    const devBanner = (await import("@replit/vite-plugin-dev-banner")).devBanner;

    plugins.push(runtimeErrorOverlay());
    plugins.push(cartographer());
    plugins.push(devBanner());
  }

  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "shared"),
        "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      },
    },
    root: path.resolve(import.meta.dirname, "client"),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true,
    },
    server: {
      host: true,
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
  };
});