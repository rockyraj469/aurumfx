import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { isAuthenticated } from "./replit_integrations/auth";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await setupAuth(app);
  registerAuthRoutes(app);

  app.get(api.portfolio.get.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    let portfolio = await storage.getPortfolio(userId);
    if (!portfolio) {
      portfolio = await storage.createPortfolio(userId);
    }
    res.json(portfolio);
  });

  app.get(api.trades.list.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const userTrades = await storage.getTrades(userId);
    res.json(userTrades);
  });

  app.post(api.trades.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bodySchema = api.trades.create.input.extend({
        amount: z.coerce.string(),
        price: z.coerce.string(),
      });
      const input = bodySchema.parse(req.body);
      const trade = await storage.createTrade(userId, input);
      res.status(201).json(trade);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
