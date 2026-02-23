export * from "./models/auth";
import { pgTable, text, serial, numeric, timestamp, varchar, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";

export const portfolios = pgTable("portfolios", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  balance: numeric("balance").notNull().default("100000.00"),
});

export const trades = pgTable("trades", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  symbol: text("symbol").notNull(),
  type: text("type").notNull(), // 'buy' or 'sell'
  amount: numeric("amount").notNull(),
  price: numeric("price").notNull(),
  status: text("status").notNull().default("open"), // 'open' or 'closed'
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTradeSchema = createInsertSchema(trades).omit({ id: true, createdAt: true, status: true, userId: true });

export type Portfolio = typeof portfolios.$inferSelect;
export type Trade = typeof trades.$inferSelect;
export type InsertTrade = z.infer<typeof insertTradeSchema>;
