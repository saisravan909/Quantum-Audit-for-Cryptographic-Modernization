import { pgTable, serial, integer, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const telemetryTable = pgTable("telemetry", {
  id: serial("id").primaryKey(),
  nodeId: integer("node_id").notNull(),
  sourceIp: text("source_ip").notNull(),
  destIp: text("dest_ip").notNull(),
  tlsVersion: text("tls_version").notNull(),
  cipherSuite: text("cipher_suite").notNull(),
  keyShareHex: text("key_share_hex").notNull(),
  supportedGroupsHex: text("supported_groups_hex").notNull(),
  keyShareDecoded: text("key_share_decoded").notNull(),
  supportedGroupsDecoded: text("supported_groups_decoded").notNull(),
  isHybridPqc: boolean("is_hybrid_pqc").notNull().default(false),
  isClassicalOnly: boolean("is_classical_only").notNull().default(true),
  protocol: text("protocol").notNull().default("TLS 1.3"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertTelemetrySchema = createInsertSchema(telemetryTable).omit({ id: true, timestamp: true, keyShareDecoded: true, supportedGroupsDecoded: true });
export type InsertTelemetry = z.infer<typeof insertTelemetrySchema>;
export type TelemetryEvent = typeof telemetryTable.$inferSelect;
