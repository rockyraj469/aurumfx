import { type User, type UpsertUser } from "@shared/models/auth";
import { type Portfolio, type Trade, type InsertTrade, portfolios, trades } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getPortfolio(userId: string): Promise<Portfolio | undefined>;
  createPortfolio(userId: string): Promise<Portfolio>;
  getTrades(userId: string): Promise<Trade[]>;
  createTrade(userId: string, trade: InsertTrade): Promise<Trade>;
}

export class DatabaseStorage implements IStorage {
  async getPortfolio(userId: string): Promise<Portfolio | undefined> {
    const [portfolio] = await db.select().from(portfolios).where(eq(portfolios.userId, userId));
    return portfolio;
  }

  async createPortfolio(userId: string): Promise<Portfolio> {
    const [portfolio] = await db.insert(portfolios).values({ userId }).returning();
    return portfolio;
  }

  async getTrades(userId: string): Promise<Trade[]> {
    return await db.select().from(trades).where(eq(trades.userId, userId)).orderBy(desc(trades.createdAt));
  }

  async createTrade(userId: string, trade: InsertTrade): Promise<Trade> {
    const [newTrade] = await db.insert(trades).values({ ...trade, userId }).returning();
    return newTrade;
  }
}

export const storage = new DatabaseStorage();
