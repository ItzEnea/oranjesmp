import { Router } from "express";
import { db, paymentMethodsTable, activityLogTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/requireAdmin";
import { logger } from "../lib/logger";

const router = Router();

function formatMethod(m: typeof paymentMethodsTable.$inferSelect) {
  return {
    id: m.id,
    name: m.name,
    type: m.type,
    link: m.link,
    isActive: m.isActive,
    sortOrder: m.sortOrder,
  };
}

router.get("/methods", async (req, res) => {
  try {
    const methods = await db.select().from(paymentMethodsTable).orderBy(asc(paymentMethodsTable.sortOrder));
    return res.json(methods.map(formatMethod));
  } catch (err) {
    logger.error({ err }, "Get payment methods error");
    return res.status(500).json({ error: "Interne serverfout" });
  }
});

router.post("/methods", requireAdmin, async (req, res) => {
  try {
    const { name, type, link, isActive, sortOrder } = req.body;
    const [method] = await db.insert(paymentMethodsTable).values({
      name, type, link,
      isActive: isActive ?? true,
      sortOrder: sortOrder ?? 0,
    }).returning();

    await db.insert(activityLogTable).values({
      action: `Betaalmethode "${name}" aangemaakt`,
      entityType: "payment_method",
      entityId: method.id,
      adminUsername: req.session.adminUsername ?? "admin",
    });

    return res.status(201).json(formatMethod(method));
  } catch (err) {
    logger.error({ err }, "Create payment method error");
    return res.status(500).json({ error: "Interne serverfout" });
  }
});

router.patch("/methods/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updates: Record<string, unknown> = {};
    const { name, type, link, isActive, sortOrder } = req.body;
    if (name !== undefined) updates.name = name;
    if (type !== undefined) updates.type = type;
    if (link !== undefined) updates.link = link;
    if (isActive !== undefined) updates.isActive = isActive;
    if (sortOrder !== undefined) updates.sortOrder = sortOrder;

    const [method] = await db.update(paymentMethodsTable).set(updates).where(eq(paymentMethodsTable.id, id)).returning();
    if (!method) return res.status(404).json({ error: "Betaalmethode niet gevonden" });

    await db.insert(activityLogTable).values({
      action: `Betaalmethode "${method.name}" bijgewerkt`,
      entityType: "payment_method",
      entityId: method.id,
      adminUsername: req.session.adminUsername ?? "admin",
    });

    return res.json(formatMethod(method));
  } catch (err) {
    logger.error({ err }, "Update payment method error");
    return res.status(500).json({ error: "Interne serverfout" });
  }
});

router.delete("/methods/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [method] = await db.delete(paymentMethodsTable).where(eq(paymentMethodsTable.id, id)).returning();
    if (!method) return res.status(404).json({ error: "Betaalmethode niet gevonden" });

    await db.insert(activityLogTable).values({
      action: `Betaalmethode "${method.name}" verwijderd`,
      entityType: "payment_method",
      entityId: id,
      adminUsername: req.session.adminUsername ?? "admin",
    });

    return res.json({ success: true, message: "Betaalmethode verwijderd" });
  } catch (err) {
    logger.error({ err }, "Delete payment method error");
    return res.status(500).json({ error: "Interne serverfout" });
  }
});

export default router;
