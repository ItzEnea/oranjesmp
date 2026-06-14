import { Router } from "express";
import { db, productsTable, discountCodesTable, activityLogTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/requireAdmin";
import { logger } from "../lib/logger";

const router = Router();

function formatProduct(p: typeof productsTable.$inferSelect) {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: parseFloat(p.price as string),
    originalPrice: p.originalPrice ? parseFloat(p.originalPrice as string) : null,
    type: p.type,
    imageUrl: p.imageUrl,
    rankId: p.rankId,
    isActive: p.isActive,
    isFeatured: p.isFeatured,
    sortOrder: p.sortOrder,
  };
}

function formatDiscountCode(d: typeof discountCodesTable.$inferSelect) {
  return {
    id: d.id,
    code: d.code,
    discountPercent: parseFloat(d.discountPercent as string),
    isActive: d.isActive,
    expiresAt: d.expiresAt ? d.expiresAt.toISOString() : null,
    maxUses: d.maxUses,
    usedCount: d.usedCount,
  };
}

// Products
router.get("/products", async (req, res) => {
  try {
    const products = await db.select().from(productsTable)
      .where(eq(productsTable.isActive, true))
      .orderBy(asc(productsTable.sortOrder));
    return res.json(products.map(formatProduct));
  } catch (err) {
    logger.error({ err }, "Get products error");
    return res.status(500).json({ error: "Interne serverfout" });
  }
});

router.get("/products/all", requireAdmin, async (req, res) => {
  try {
    const products = await db.select().from(productsTable).orderBy(asc(productsTable.sortOrder));
    return res.json(products.map(formatProduct));
  } catch (err) {
    logger.error({ err }, "Get all products error");
    return res.status(500).json({ error: "Interne serverfout" });
  }
});

router.post("/products", requireAdmin, async (req, res) => {
  try {
    const { name, description, price, originalPrice, type, imageUrl, rankId, isActive, isFeatured, sortOrder } = req.body;
    const [product] = await db.insert(productsTable).values({
      name, description,
      price: String(price),
      originalPrice: originalPrice ? String(originalPrice) : null,
      type: type ?? "rank",
      imageUrl, rankId,
      isActive: isActive ?? true,
      isFeatured: isFeatured ?? false,
      sortOrder: sortOrder ?? 0,
    }).returning();

    await db.insert(activityLogTable).values({
      action: `Product "${name}" aangemaakt`,
      entityType: "product",
      entityId: product.id,
      adminUsername: req.session.adminUsername ?? "admin",
    });

    return res.status(201).json(formatProduct(product));
  } catch (err) {
    logger.error({ err }, "Create product error");
    return res.status(500).json({ error: "Interne serverfout" });
  }
});

router.patch("/products/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updates: Record<string, unknown> = {};
    const { name, description, price, originalPrice, type, imageUrl, rankId, isActive, isFeatured, sortOrder } = req.body;
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (price !== undefined) updates.price = String(price);
    if (originalPrice !== undefined) updates.originalPrice = originalPrice ? String(originalPrice) : null;
    if (type !== undefined) updates.type = type;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;
    if (rankId !== undefined) updates.rankId = rankId;
    if (isActive !== undefined) updates.isActive = isActive;
    if (isFeatured !== undefined) updates.isFeatured = isFeatured;
    if (sortOrder !== undefined) updates.sortOrder = sortOrder;

    const [product] = await db.update(productsTable).set(updates).where(eq(productsTable.id, id)).returning();
    if (!product) return res.status(404).json({ error: "Product niet gevonden" });

    await db.insert(activityLogTable).values({
      action: `Product "${product.name}" bijgewerkt`,
      entityType: "product",
      entityId: product.id,
      adminUsername: req.session.adminUsername ?? "admin",
    });

    return res.json(formatProduct(product));
  } catch (err) {
    logger.error({ err }, "Update product error");
    return res.status(500).json({ error: "Interne serverfout" });
  }
});

router.delete("/products/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [product] = await db.delete(productsTable).where(eq(productsTable.id, id)).returning();
    if (!product) return res.status(404).json({ error: "Product niet gevonden" });

    await db.insert(activityLogTable).values({
      action: `Product "${product.name}" verwijderd`,
      entityType: "product",
      entityId: id,
      adminUsername: req.session.adminUsername ?? "admin",
    });

    return res.json({ success: true, message: "Product verwijderd" });
  } catch (err) {
    logger.error({ err }, "Delete product error");
    return res.status(500).json({ error: "Interne serverfout" });
  }
});

// Discount codes
router.get("/discount-codes", requireAdmin, async (req, res) => {
  try {
    const codes = await db.select().from(discountCodesTable);
    return res.json(codes.map(formatDiscountCode));
  } catch (err) {
    logger.error({ err }, "Get discount codes error");
    return res.status(500).json({ error: "Interne serverfout" });
  }
});

router.post("/discount-codes", requireAdmin, async (req, res) => {
  try {
    const { code, discountPercent, isActive, expiresAt, maxUses } = req.body;
    const [discountCode] = await db.insert(discountCodesTable).values({
      code: code.toUpperCase(),
      discountPercent: String(discountPercent),
      isActive: isActive ?? true,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      maxUses: maxUses ?? null,
    }).returning();

    await db.insert(activityLogTable).values({
      action: `Kortingscode "${code}" aangemaakt`,
      entityType: "discount_code",
      entityId: discountCode.id,
      adminUsername: req.session.adminUsername ?? "admin",
    });

    return res.status(201).json(formatDiscountCode(discountCode));
  } catch (err) {
    logger.error({ err }, "Create discount code error");
    return res.status(500).json({ error: "Interne serverfout" });
  }
});

router.delete("/discount-codes/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [code] = await db.delete(discountCodesTable).where(eq(discountCodesTable.id, id)).returning();
    if (!code) return res.status(404).json({ error: "Kortingscode niet gevonden" });

    await db.insert(activityLogTable).values({
      action: `Kortingscode "${code.code}" verwijderd`,
      entityType: "discount_code",
      entityId: id,
      adminUsername: req.session.adminUsername ?? "admin",
    });

    return res.json({ success: true, message: "Kortingscode verwijderd" });
  } catch (err) {
    logger.error({ err }, "Delete discount code error");
    return res.status(500).json({ error: "Interne serverfout" });
  }
});

export default router;
