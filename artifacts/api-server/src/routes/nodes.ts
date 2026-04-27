import { Router } from "express";
import { db } from "@workspace/db";
import { nodesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateNodeBody, UpdateNodeBody } from "@workspace/api-zod";

const router = Router();

function computeRiskScore(node: {
  pqcEnabled: boolean;
  opensslVersion: string;
  kernelVersion: string;
  tlsVersion: string;
}): number {
  let score = 100;
  if (node.pqcEnabled) score -= 40;
  const opensslMajor = parseInt(node.opensslVersion.split(".")[0] ?? "1");
  if (opensslMajor >= 3) score -= 20;
  const kernelMajor = parseInt(node.kernelVersion.split(".")[0] ?? "4");
  if (kernelMajor >= 6) score -= 15;
  if (node.tlsVersion === "TLS 1.3") score -= 15;
  return Math.max(5, Math.min(100, score));
}

function computeStatus(score: number): "compliant" | "at-risk" | "critical" | "migrating" {
  if (score <= 20) return "compliant";
  if (score <= 50) return "migrating";
  if (score <= 75) return "at-risk";
  return "critical";
}

router.get("/nodes", async (req, res) => {
  const nodes = await db.select().from(nodesTable).orderBy(nodesTable.createdAt);
  res.json(nodes);
});

router.post("/nodes", async (req, res) => {
  const body = CreateNodeBody.parse(req.body);
  const riskScore = computeRiskScore(body);
  const status = computeStatus(riskScore);
  const [node] = await db
    .insert(nodesTable)
    .values({ ...body, riskScore, status, lastSeen: new Date() })
    .returning();
  res.status(201).json(node);
});

router.get("/nodes/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const [node] = await db.select().from(nodesTable).where(eq(nodesTable.id, id));
  if (!node) return res.status(404).json({ error: "Node not found" });
  return res.json(node);
});

router.patch("/nodes/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const body = UpdateNodeBody.parse(req.body);
  const existing = await db.select().from(nodesTable).where(eq(nodesTable.id, id));
  if (!existing[0]) return res.status(404).json({ error: "Node not found" });
  const merged = { ...existing[0], ...body };
  const riskScore = computeRiskScore(merged);
  const status = body.status ?? computeStatus(riskScore);
  const [updated] = await db
    .update(nodesTable)
    .set({ ...body, riskScore, status, lastSeen: new Date() })
    .where(eq(nodesTable.id, id))
    .returning();
  return res.json(updated);
});

router.delete("/nodes/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await db.delete(nodesTable).where(eq(nodesTable.id, id));
  res.status(204).send();
});

router.get("/nodes/:id/risk-score", async (req, res) => {
  const id = parseInt(req.params.id);
  const [node] = await db.select().from(nodesTable).where(eq(nodesTable.id, id));
  if (!node) return res.status(404).json({ error: "Node not found" });

  const factors = [
    { factor: "PQC Enabled", weight: 40, value: node.pqcEnabled ? "Yes" : "No" },
    { factor: "OpenSSL Version", weight: 20, value: node.opensslVersion },
    { factor: "Kernel Version", weight: 15, value: node.kernelVersion },
    { factor: "TLS Version", weight: 15, value: node.tlsVersion },
    { factor: "Last Seen", weight: 10, value: new Date(node.lastSeen).toISOString() },
  ];

  const cnsa20Compliance = node.pqcEnabled ? Math.max(10, 100 - node.riskScore) : Math.max(5, 30 - node.riskScore * 0.3);
  const predictedMigrationDays = node.pqcEnabled ? 30 : Math.round(node.riskScore * 2.5);

  let recommendation = "Enable PQC hybrid key exchange (ML-KEM-768) and upgrade to OpenSSL 3.x";
  if (node.pqcEnabled && node.riskScore < 30) {
    recommendation = "Node is on migration path. Finalize ML-DSA certificate rotation.";
  } else if (node.pqcEnabled) {
    recommendation = "PQC enabled. Validate CNSA 2.0 cipher suite ordering and update CBOM entries.";
  }

  return res.json({
    nodeId: id,
    score: node.riskScore,
    factors,
    recommendation,
    cnsa20Compliance,
    predictedMigrationDays,
  });
});

export default router;
