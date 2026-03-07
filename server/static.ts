import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function serveStatic(app: express.Express) {
  const distPath = path.resolve(__dirname, "..", "dist", "public");
  console.log("✅ Serving static files from:", distPath);

  // Serve static assets
  app.use(express.static(distPath));

  // For any request not matching an API route, send index.html
  app.get("*", (req, res) => {
    console.log("🌐 Catch-all route for:", req.originalUrl);
    res.sendFile(path.join(distPath, "index.html"));
  });
}