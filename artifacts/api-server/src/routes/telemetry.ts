import { Router } from "express";
import { db } from "@workspace/db";
import { telemetryTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { CreateTelemetryEventBody } from "@workspace/api-zod";

const router = Router();

const KEY_SHARE_MAP: Record<string, string> = {
  "0x0017": "secp256r1 (P-256)",
  "0x0018": "secp384r1 (P-384)",
  "0x001d": "x25519",
  "0x6399": "X25519MLKEM768 (Hybrid PQC)",
  "0x0202": "ML-KEM-768 (Kyber)",
  "0x0203": "ML-KEM-1024 (Kyber)",
  "0x020f": "ML-DSA-65 (Dilithium)",
  "0x0024": "x448",
};

const GROUPS_MAP: Record<string, string> = {
  "0x0017,0x0018": "P-256, P-384",
  "0x001d,0x0017": "X25519, P-256",
  "0x6399,0x001d": "X25519MLKEM768, X25519 (Hybrid PQC)",
  "0x0202,0x001d": "ML-KEM-768, X25519",
  "0x0017": "P-256",
  "0x001d": "X25519",
};

function decodeHex(hex: string): string {
  return KEY_SHARE_MAP[hex] ?? GROUPS_MAP[hex] ?? `Group(${hex})`;
}

router.get("/telemetry", async (req, res) => {
  const nodeId = req.query.nodeId ? parseInt(req.query.nodeId as string) : undefined;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

  let query = db.select().from(telemetryTable).orderBy(desc(telemetryTable.timestamp)).limit(limit);
  if (nodeId) {
    query = db.select().from(telemetryTable).where(eq(telemetryTable.nodeId, nodeId)).orderBy(desc(telemetryTable.timestamp)).limit(limit) as typeof query;
  }
  const events = await query;
  res.json(events);
});

router.post("/telemetry", async (req, res) => {
  const body = CreateTelemetryEventBody.parse(req.body);
  const keyShareDecoded = decodeHex(body.keyShareHex);
  const supportedGroupsDecoded = decodeHex(body.supportedGroupsHex);
  const [event] = await db
    .insert(telemetryTable)
    .values({ ...body, keyShareDecoded, supportedGroupsDecoded })
    .returning();
  res.status(201).json(event);
});

router.get("/telemetry/stream", async (req, res) => {
  const events = await db
    .select()
    .from(telemetryTable)
    .orderBy(desc(telemetryTable.timestamp))
    .limit(20);
  res.json(events);
});

export default router;
