import { Router } from "express";
import { db } from "@workspace/db";
import { cbomTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateCbomEntryBody, UpdateCbomEntryBody } from "@workspace/api-zod";

const router = Router();

router.get("/cbom", async (req, res) => {
  const entries = await db.select().from(cbomTable).orderBy(cbomTable.createdAt);
  res.json(entries);
});

router.post("/cbom", async (req, res) => {
  const body = CreateCbomEntryBody.parse(req.body);
  const [entry] = await db
    .insert(cbomTable)
    .values({ ...body, updatedAt: new Date() })
    .returning();
  res.status(201).json(entry);
});

router.patch("/cbom/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const body = UpdateCbomEntryBody.parse(req.body);
  const [updated] = await db
    .update(cbomTable)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(cbomTable.id, id))
    .returning();
  if (!updated) return res.status(404).json({ error: "CBOM entry not found" });
  return res.json(updated);
});

router.delete("/cbom/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await db.delete(cbomTable).where(eq(cbomTable.id, id));
  res.status(204).send();
});

export default router;
