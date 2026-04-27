import { pgTable, serial, text, boolean, real, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const nodeEnvironmentEnum = pgEnum("node_environment", ["production", "staging", "development", "federal"]);
export const nodeStatusEnum = pgEnum("node_status", ["compliant", "at-risk", "critical", "migrating"]);

export const nodesTable = pgTable("nodes", {
  id: serial("id").primaryKey(),
  hostname: text("hostname").notNull(),
  ipAddress: text("ip_address").notNull(),
  environment: nodeEnvironmentEnum("environment").notNull(),
  tlsVersion: text("tls_version").notNull(),
  opensslVersion: text("openssl_version").notNull(),
  kernelVersion: text("kernel_version").notNull(),
  pqcEnabled: boolean("pqc_enabled").notNull().default(false),
  riskScore: real("risk_score").notNull().default(50),
  status: nodeStatusEnum("status").notNull().default("at-risk"),
  lastSeen: timestamp("last_seen").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertNodeSchema = createInsertSchema(nodesTable).omit({ id: true, createdAt: true, lastSeen: true, riskScore: true, status: true });
export type InsertNode = z.infer<typeof insertNodeSchema>;
export type Node = typeof nodesTable.$inferSelect;
