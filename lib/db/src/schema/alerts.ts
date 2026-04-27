import { pgTable, serial, integer, text, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const alertSeverityEnum = pgEnum("alert_severity", ["critical", "high", "medium", "low"]);
export const alertTypeEnum = pgEnum("alert_type", [
  "classical-fallback", "hndl-risk", "cert-expiry", "compliance-drift", "zero-trust-violation", "cbom-stale"
]);

export const alertsTable = pgTable("alerts", {
  id: serial("id").primaryKey(),
  nodeId: integer("node_id").notNull(),
  severity: alertSeverityEnum("severity").notNull(),
  type: alertTypeEnum("type").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  acknowledged: boolean("acknowledged").notNull().default(false),
  acknowledgedAt: timestamp("acknowledged_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAlertSchema = createInsertSchema(alertsTable).omit({ id: true, createdAt: true, acknowledged: true, acknowledgedAt: true });
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alertsTable.$inferSelect;
