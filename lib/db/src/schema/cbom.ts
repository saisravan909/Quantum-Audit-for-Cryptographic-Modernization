import { pgTable, serial, integer, text, boolean, integer as intCol, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const cbomStatusEnum = pgEnum("cbom_status", ["active", "deprecated", "migrating", "replaced"]);

export const cbomTable = pgTable("cbom", {
  id: serial("id").primaryKey(),
  nodeId: integer("node_id").notNull(),
  componentName: text("component_name").notNull(),
  componentVersion: text("component_version").notNull(),
  algorithm: text("algorithm").notNull(),
  keySize: intCol("key_size").notNull(),
  pqcReady: boolean("pqc_ready").notNull().default(false),
  expiresAt: timestamp("expires_at"),
  gitCommit: text("git_commit").notNull(),
  status: cbomStatusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertCbomSchema = createInsertSchema(cbomTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCbom = z.infer<typeof insertCbomSchema>;
export type CbomEntry = typeof cbomTable.$inferSelect;
