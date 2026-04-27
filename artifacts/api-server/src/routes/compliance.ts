import { Router } from "express";
import { db } from "@workspace/db";
import { complianceTable, nodesTable } from "@workspace/db";
import { count, avg, sql } from "drizzle-orm";

const router = Router();

router.get("/compliance", async (req, res) => {
  const records = await db.select().from(complianceTable).orderBy(complianceTable.lastAssessed);
  res.json(records);
});

router.get("/compliance/velocity", async (req, res) => {
  const now = new Date();
  const points = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    const label = date.toISOString().slice(0, 7);
    const baseAdoption = Math.max(5, 85 - i * 7);
    const noise = Math.random() * 5 - 2.5;
    const pqcAdoption = Math.min(95, baseAdoption + noise);
    const hybridPqc = pqcAdoption * 0.65;
    const classicalOnly = 100 - pqcAdoption;
    const mlKemAdoption = pqcAdoption * 0.55;
    const mlDsaAdoption = pqcAdoption * 0.35;
    points.push({
      date: label,
      pqcAdoption: parseFloat(pqcAdoption.toFixed(1)),
      hybridPqc: parseFloat(hybridPqc.toFixed(1)),
      classicalOnly: parseFloat(classicalOnly.toFixed(1)),
      mlKemAdoption: parseFloat(mlKemAdoption.toFixed(1)),
      mlDsaAdoption: parseFloat(mlDsaAdoption.toFixed(1)),
    });
  }
  res.json(points);
});

router.get("/compliance/overview", async (req, res) => {
  const nodes = await db.select().from(nodesTable);
  const totalNodes = nodes.length;
  const compliantNodes = nodes.filter(n => n.status === "compliant").length;
  const atRiskNodes = nodes.filter(n => n.status === "at-risk").length;
  const criticalNodes = nodes.filter(n => n.status === "critical").length;
  const pqcEnabled = nodes.filter(n => n.pqcEnabled).length;

  const overallComplianceRate = totalNodes > 0 ? (compliantNodes / totalNodes) * 100 : 0;
  const cnsa20Rate = totalNodes > 0 ? (pqcEnabled / totalNodes) * 100 : 0;
  const zeroTrustScore = Math.max(10, overallComplianceRate - (criticalNodes * 5));

  const frameworks = [
    { name: "CNSA 2.0", compliance: cnsa20Rate },
    { name: "NIST 800-207", compliance: Math.min(95, zeroTrustScore + 5) },
    { name: "NSM-10", compliance: Math.min(90, overallComplianceRate + 2) },
    { name: "OMB M-23-02", compliance: Math.min(88, cnsa20Rate - 3) },
    { name: "NIST 800-53", compliance: Math.min(92, overallComplianceRate + 8) },
    { name: "EO 14028", compliance: Math.min(85, cnsa20Rate - 8) },
  ].map(f => ({ ...f, compliance: parseFloat(Math.max(0, f.compliance).toFixed(1)) }));

  res.json({
    totalNodes,
    compliantNodes,
    atRiskNodes,
    criticalNodes,
    overallComplianceRate: parseFloat(overallComplianceRate.toFixed(1)),
    cnsa20Rate: parseFloat(cnsa20Rate.toFixed(1)),
    zeroTrustScore: parseFloat(zeroTrustScore.toFixed(1)),
    frameworks,
  });
});

export default router;
