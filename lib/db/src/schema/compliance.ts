import { pgTable, serial, integer, real, text, jsonb, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const complianceFrameworkEnum = pgEnum("compliance_framework", [
  "CNSA_2_0", "NIST_800_207", "NSM_10", "OMB_M_23_02", "NIST_800_53", "EO_14028"
]);
export const complianceStatusEnum = pgEnum("compliance_status", ["compliant", "partial", "non-compliant", "pending"]);

export const complianceTable = pgTable("compliance", {
  id: serial("id").primaryKey(),
  nodeId: integer("node_id").notNull(),
  framework: complianceFrameworkEnum("framework").notNull(),
  status: complianceStatusEnum("status").notNull().default("pending"),
  score: real("score").notNull().default(0),
  controls: jsonb("controls").notNull().default([]),
  lastAssessed: timestamp("last_assessed").notNull().defaultNow(),
});

export const insertComplianceSchema = createInsertSchema(complianceTable).omit({ id: true, lastAssessed: true });
export type InsertCompliance = z.infer<typeof insertComplianceSchema>;
export type ComplianceRecord = typeof complianceTable.$inferSelect;
