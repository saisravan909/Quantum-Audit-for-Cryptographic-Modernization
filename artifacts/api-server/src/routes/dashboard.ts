import { Router } from "express";
import { db } from "@workspace/db";
import { nodesTable, telemetryTable, alertsTable, cbomTable } from "@workspace/db";
import { eq, desc, count, sql } from "drizzle-orm";

const router = Router();

router.get("/dashboard/summary", async (req, res) => {
  const nodes = await db.select().from(nodesTable);
  const alerts = await db.select().from(alertsTable);
  const cbomEntries = await db.select().from(cbomTable);
  const recentTelemetry = await db.select().from(telemetryTable).orderBy(desc(telemetryTable.timestamp)).limit(200);

  const totalNodes = nodes.length;
  const pqcEnabledNodes = nodes.filter(n => n.pqcEnabled).length;
  const criticalAlerts = alerts.filter(a => a.severity === "critical" && !a.acknowledged).length;
  const avgRisk = nodes.length > 0 ? nodes.reduce((sum, n) => sum + n.riskScore, 0) / nodes.length : 0;
  const hndlExposureScore = parseFloat(Math.min(100, avgRisk * 1.2).toFixed(1));
  const compliantNodes = nodes.filter(n => n.status === "compliant").length;
  const complianceRate = totalNodes > 0 ? parseFloat(((compliantNodes / totalNodes) * 100).toFixed(1)) : 0;
  const hybridPqcCount = recentTelemetry.filter(t => t.isHybridPqc).length;
  const classicalOnlyCount = recentTelemetry.filter(t => t.isClassicalOnly).length;
  const total = recentTelemetry.length || 1;
  const hybridPqcTrafficPct = parseFloat(((hybridPqcCount / total) * 100).toFixed(1));
  const classicalOnlyTrafficPct = parseFloat(((classicalOnlyCount / total) * 100).toFixed(1));
  const pendingCbomUpdates = cbomEntries.filter(c => c.status === "deprecated" || c.status === "migrating").length;
  const zeroTrustScore = parseFloat(Math.max(10, complianceRate - criticalAlerts * 3).toFixed(1));
  const cnsa20ComplianceRate = parseFloat(((pqcEnabledNodes / Math.max(1, totalNodes)) * 100).toFixed(1));

  res.json({
    totalNodes,
    pqcEnabledNodes,
    criticalAlerts,
    hndlExposureScore,
    complianceRate,
    hybridPqcTrafficPct,
    classicalOnlyTrafficPct,
    pendingCbomUpdates,
    zeroTrustScore,
    cnsa20ComplianceRate,
  });
});

router.get("/dashboard/hndl-exposure", async (req, res) => {
  const now = new Date();
  const events = [
    { date: "", exposedBytes: 0, protectedBytes: 0, riskScore: 0 }
  ];
  const milestones: Record<string, string> = {
    "2024-01": "NSM-10 Issued",
    "2024-06": "NIST PQC Standards Final",
    "2024-09": "CNSA 2.0 Effective",
    "2025-01": "OMB M-23-02 Deadline",
  };

  const points = [];
  for (let i = 23; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    const label = date.toISOString().slice(0, 7);
    const progress = (23 - i) / 23;
    const exposedBytes = Math.round((1 - progress * 0.7) * 850 + Math.random() * 50) * 1_000_000;
    const protectedBytes = Math.round(progress * 0.7 * 850 + Math.random() * 30) * 1_000_000;
    const riskScore = parseFloat((100 - progress * 65 + Math.random() * 8 - 4).toFixed(1));
    const point: {
      date: string;
      exposedBytes: number;
      protectedBytes: number;
      riskScore: number;
      eventLabel?: string;
    } = { date: label, exposedBytes, protectedBytes, riskScore };
    if (milestones[label]) point.eventLabel = milestones[label];
    points.push(point);
  }
  res.json(points);
});

router.get("/dashboard/algorithm-breakdown", async (req, res) => {
  const nodes = await db.select().from(nodesTable);
  const totalNodes = nodes.length || 10;
  const pqcNodes = nodes.filter(n => n.pqcEnabled).length;
  const classicalNodes = totalNodes - pqcNodes;

  const algorithms = [
    { algorithm: "ML-KEM-768 (Kyber)", count: Math.round(pqcNodes * 0.45), category: "pqc" as const, cnsa20Approved: true },
    { algorithm: "X25519MLKEM768 (Hybrid)", count: Math.round(pqcNodes * 0.35), category: "hybrid" as const, cnsa20Approved: true },
    { algorithm: "ML-DSA-65 (Dilithium)", count: Math.round(pqcNodes * 0.2), category: "pqc" as const, cnsa20Approved: true },
    { algorithm: "X25519 + AES-256-GCM", count: Math.round(classicalNodes * 0.4), category: "classical" as const, cnsa20Approved: false },
    { algorithm: "P-384 + AES-256-GCM", count: Math.round(classicalNodes * 0.3), category: "classical" as const, cnsa20Approved: false },
    { algorithm: "RSA-2048", count: Math.round(classicalNodes * 0.15), category: "deprecated" as const, cnsa20Approved: false },
    { algorithm: "P-256 + AES-128-GCM", count: Math.round(classicalNodes * 0.1), category: "deprecated" as const, cnsa20Approved: false },
    { algorithm: "3DES-EDE-CBC", count: Math.round(classicalNodes * 0.05), category: "deprecated" as const, cnsa20Approved: false },
  ];

  const totalAlgs = algorithms.reduce((s, a) => s + a.count, 0) || 1;
  return res.json(algorithms.map(a => ({
    ...a,
    percentage: parseFloat(((a.count / totalAlgs) * 100).toFixed(1)),
  })));
});

export default router;
