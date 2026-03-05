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
// In production, use proper multipart middleware like 'multer'
app.use((req, res, next) => {
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    // For development, we'll just accept multipart uploads
    // In production, use multer: npm install multer
    (req as any).files = {};
  }
  next();
});

// Setup routes
const httpServer = await registerRoutes(server, app);

// Setup Vite for development
if (process.env.NODE_ENV === "development") {
  await setupVite(httpServer, app);
} else {
  serveStatic(app);
}

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, "127.0.0.1", () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});