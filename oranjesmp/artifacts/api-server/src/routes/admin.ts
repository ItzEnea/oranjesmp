import { Router } from "express";
import { db, ranksTable, productsTable, newsTable, paymentMethodsTable, adminUsersTable, activityLogTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/requireAdmin";
import { logger } from "../lib/logger";
import { sql } from "drizzle-orm";

const router = Router();

router.get("/dashboard", requireAdmin, async (req, res) => {
  try {
    const [rankCount] = await db.select({ count: sql<number>`count(*)::int` }).from(ranksTable);
    const [productCount] = await db.select({ count: sql<number>`count(*)::int` }).from(productsTable);
    const [newsCount] = await db.select({ count: sql<number>`count(*)::int` }).from(newsTable);
    const [publishedCount] = await db.select({ count: sql<number>`count(*)::int` }).from(newsTable).where(eq(newsTable.status, "published"));
    const [paymentCount] = await db.select({ count: sql<number>`count(*)::int` }).from(paymentMethodsTable).where(eq(paymentMethodsTable.isActive, true));

    return res.json({
      totalRanks: rankCount?.count ?? 0,
      totalProducts: productCount?.count ?? 0,
      totalNewsArticles: newsCount?.count ?? 0,
      publishedNewsArticles: publishedCount?.count ?? 0,
      activePaymentMethods: paymentCount?.count ?? 0,
      recentOrdersCount: 0,
    });
  } catch (err) {
    logger.error({ err }, "Dashboard stats error");
    return res.status(500).json({ error: "Interne serverfout" });
  }
});

router.get("/users", requireAdmin, async (req, res) => {
  try {
    const users = await db.select({
      id: adminUsersTable.id,
      username: adminUsersTable.username,
      role: adminUsersTable.role,
      mustChangePassword: adminUsersTable.mustChangePassword,
    }).from(adminUsersTable);
    return res.json(users);
  } catch (err) {
    logger.error({ err }, "Get admin users error");
    return res.status(500).json({ error: "Interne serverfout" });
  }
});

router.get("/activity", requireAdmin, async (req, res) => {
  try {
    const activity = await db.select().from(activityLogTable).orderBy(desc(activityLogTable.createdAt)).limit(50);
    return res.json(activity.map(a => ({
      id: a.id,
      action: a.action,
      entityType: a.entityType,
      entityId: a.entityId,
      adminUsername: a.adminUsername,
      createdAt: a.createdAt.toISOString(),
    })));
  } catch (err) {
    logger.error({ err }, "Get activity error");
    return res.status(500).json({ error: "Interne serverfout" });
  }
});

export default router;
