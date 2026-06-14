import { Router } from "express";
import { db, ranksTable, activityLogTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/requireAdmin";
import { logger } from "../lib/logger";

const router = Router();

function formatRank(rank: typeof ranksTable.$inferSelect) {
  return {
    id: rank.id,
    name: rank.name,
    price: parseFloat(rank.price as string),
    color: rank.color,
    badgeColor: rank.badgeColor,
    sortOrder: rank.sortOrder,
    features: rank.features as string[],
    isActive: rank.isActive,
    description: rank.description,
  };
}

router.get("/", async (req, res) => {
  try {
    const ranks = await db.select().from(ranksTable).where(eq(ranksTable.isActive, true)).orderBy(asc(ranksTable.sortOrder));
    return res.json(ranks.map(formatRank));
  } catch (err) {
    logger.error({ err }, "Get ranks error");
    return res.status(500).json({ error: "Interne serverfout" });
  }
});

router.post("/", requireAdmin, async (req, res) => {
  try {
    const { name, price, color, badgeColor, features, description, sortOrder, isActive } = req.body;
    const [rank] = await db.insert(ranksTable).values({
      name, price: String(price), color,
      badgeColor: badgeColor ?? "#F97316",
      features: features ?? [],
      description, sortOrder: sortOrder ?? 0,
      isActive: isActive ?? true,
    }).returning();

    await db.insert(activityLogTable).values({
      action: `Rank "${name}" aangemaakt`,
      entityType: "rank",
      entityId: rank.id,
      adminUsername: req.session.adminUsername ?? "admin",
    });

    return res.status(201).json(formatRank(rank));
  } catch (err) {
    logger.error({ err }, "Create rank error");
    return res.status(500).json({ error: "Interne serverfout" });
  }
});

router.post("/reorder", requireAdmin, async (req, res) => {
  try {
    const { ids } = req.body as { ids: number[] };
    for (let i = 0; i < ids.length; i++) {
      await db.update(ranksTable).set({ sortOrder: i }).where(eq(ranksTable.id, ids[i]));
    }
    return res.json({ success: true, message: "Volgorde bijgewerkt" });
  } catch (err) {
    logger.error({ err }, "Reorder ranks error");
    return res.status(500).json({ error: "Interne serverfout" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [rank] = await db.select().from(ranksTable).where(eq(ranksTable.id, id));
    if (!rank) return res.status(404).json({ error: "Rank niet gevonden" });
    return res.json(formatRank(rank));
  } catch (err) {
    logger.error({ err }, "Get rank error");
    return res.status(500).json({ error: "Interne serverfout" });
  }
});

router.patch("/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updates: Record<string, unknown> = {};
    const { name, price, color, badgeColor, features, description, sortOrder, isActive } = req.body;
    if (name !== undefined) updates.name = name;
    if (price !== undefined) updates.price = String(price);
    if (color !== undefined) updates.color = color;
    if (badgeColor !== undefined) updates.badgeColor = badgeColor;
    if (features !== undefined) updates.features = features;
    if (description !== undefined) updates.description = description;
    if (sortOrder !== undefined) updates.sortOrder = sortOrder;
    if (isActive !== undefined) updates.isActive = isActive;

    const [rank] = await db.update(ranksTable).set(updates).where(eq(ranksTable.id, id)).returning();
    if (!rank) return res.status(404).json({ error: "Rank niet gevonden" });

    await db.insert(activityLogTable).values({
      action: `Rank "${rank.name}" bijgewerkt`,
      entityType: "rank",
      entityId: rank.id,
      adminUsername: req.session.adminUsername ?? "admin",
    });

    return res.json(formatRank(rank));
  } catch (err) {
    logger.error({ err }, "Update rank error");
    return res.status(500).json({ error: "Interne serverfout" });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [rank] = await db.delete(ranksTable).where(eq(ranksTable.id, id)).returning();
    if (!rank) return res.status(404).json({ error: "Rank niet gevonden" });

    await db.insert(activityLogTable).values({
      action: `Rank "${rank.name}" verwijderd`,
      entityType: "rank",
      entityId: id,
      adminUsername: req.session.adminUsername ?? "admin",
    });

    return res.json({ success: true, message: "Rank verwijderd" });
  } catch (err) {
    logger.error({ err }, "Delete rank error");
    return res.status(500).json({ error: "Interne serverfout" });
  }
});

export default router;
