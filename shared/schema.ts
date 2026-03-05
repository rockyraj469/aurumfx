export * from "./models/auth";
import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
// import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";

export const portfolios = sqliteTable("portfolios", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => users.id),
  balance: text("balance").notNull().default("100000.00"),
});

export const trades = sqliteTable("trades", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => users.id),
  symbol: text("symbol").notNull(),
  type: text("type").notNull(),
  amount: text("amount").notNull(),
  price: text("price").notNull(),
  status: text("status").notNull().default("open"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

// export const insertTradeSchema = createInsertSchema(trades).omit({ id: true, createdAt: true, status: true, userId: true });

export type Portfolio = typeof portfolios.$inferSelect;
export type Trade = typeof trades.$inferSelect;
// export type InsertTrade = z.infer<typeof insertTradeSchema>;