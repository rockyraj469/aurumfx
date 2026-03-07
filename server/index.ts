import "dotenv/config";
import express from "express";
import { createServer } from "http";
import cookieParser from 'cookie-parser';
import { registerRoutes } from "./routes";
import { setupVite } from "./vite";
import { serveStatic } from "./static";

const app = express();
const server = createServer(app);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Simple file upload parsing (for small files)
app.use((req, res, next) => {
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    (req as any).files = {};
  }
  next();
});

// Setup routes
const httpServer = await registerRoutes(server, app);

// Add a 404 handler for any unmatched routes (this must come AFTER all other routes)
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Setup Vite for development
if (process.env.NODE_ENV === "development") {
  await setupVite(httpServer, app);
} else {
  serveStatic(app);
}

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});