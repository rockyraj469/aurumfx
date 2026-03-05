import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupMockAuth, isAuthenticated } from "./mockAuth";
import { api } from "@shared/routes";
import { z } from "zod";
import fs from "fs";
import path from "path";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  setupMockAuth(app); // sets up mock authentication endpoints

  // Signup endpoint
  app.post("/api/signup", async (req, res) => {
    try {
      const schema = z.object({
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        email: z.string().email("Valid email is required"),
        mobileNumber: z.string().min(10, "Valid phone number is required"),
        country: z.string().min(2, "Country is required"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        promoCode: z.string().optional().nullable(),
      });

      const input = schema.parse(req.body);
      
      // Create mock user (in production, hash password and store in database)
      const userId = `user_${Date.now()}`;
      
      // Apply promo code if provided (mock implementation)
      let signupBonus = 0;
      if (input.promoCode) {
        // In production, validate promo code from database
        const promoBonus: { [key: string]: number } = {
          "WELCOME100": 100,
          "TRADER50": 50,
          "PROMO25": 25,
        };
        signupBonus = promoBonus[input.promoCode] || 0;
      }
      
      res.status(201).json({
        success: true,
        userId,
        email: input.email,
        signupBonus,
        message: "Account created successfully. Please complete KYC verification.",
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Signup failed" });
    }
  });

  // KYC submission endpoint
  app.post("/api/kyc/submit", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Validate form data
      const schema = z.object({
        dateOfBirth: z.string(),
        idType: z.string(),
        idNumber: z.string(),
        country: z.string(),
        address: z.string(),
        city: z.string(),
        state: z.string().optional(),
        postalCode: z.string(),
      });

      const kycData = schema.parse({
        dateOfBirth: req.body.dateOfBirth,
        idType: req.body.idType,
        idNumber: req.body.idNumber,
        country: req.body.country,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        postalCode: req.body.postalCode,
      });

      // Check if document was uploaded (would be in req.files in production)
      if (!req.files || !req.files.document) {
        return res.status(400).json({ message: "Document upload failed" });
      }

      // In production, you would:
      // 1. Save the document to secure storage
      // 2. Run document verification and OCR
      // 3. Run face matching if photo required
      // 4. Store KYC data encrypted in database
      
      res.status(200).json({
        success: true,
        message: "KYC verification submitted successfully",
        status: "pending",
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "KYC submission failed" });
    }
  });

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