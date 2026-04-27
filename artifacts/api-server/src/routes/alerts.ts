import { Router } from "express";
import { db } from "@workspace/db";
import { alertsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { CreateAlertBody } from "@workspace/api-zod";

const router = Router();

router.get("/alerts", async (req, res) => {
  const alerts = await db.select().from(alertsTable).orderBy(desc(alertsTable.createdAt));
  res.json(alerts);
});

router.post("/alerts", async (req, res) => {
  const body = CreateAlertBody.parse(req.body);
  const [alert] = await db
    .insert(alertsTable)
    .values({ ...body })
    .returning();
  res.status(201).json(alert);
});

router.post("/alerts/:id/acknowledge", async (req, res) => {
  const id = parseInt(req.params.id);
  const [alert] = await db
    .update(alertsTable)
    .set({ acknowledged: true, acknowledgedAt: new Date() })
    .where(eq(alertsTable.id, id))
    .returning();
  if (!alert) return res.status(404).json({ error: "Alert not found" });
  return res.json(alert);
});

export default router;
