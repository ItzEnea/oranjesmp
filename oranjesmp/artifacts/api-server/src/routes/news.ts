import { Router } from "express";
import { db, newsTable, activityLogTable } from "@workspace/db";
import { eq, desc, ilike, or, and, sql } from "drizzle-orm";
import { requireAdmin } from "../middlewares/requireAdmin";
import { logger } from "../lib/logger";

const router = Router();

function slugify(title: string): string {
  return title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim() + "-" + Date.now();
}

function formatArticle(a: typeof newsTable.$inferSelect) {
  return {
    id: a.id,
    title: a.title,
    slug: a.slug,
    content: a.content,
    excerpt: a.excerpt,
    imageUrl: a.imageUrl,
    category: a.category,
    status: a.status,
    authorName: a.authorName,
    publishedAt: a.publishedAt ? a.publishedAt.toISOString() : null,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  };
}

router.get("/", async (req, res) => {
  try {
    const { search, limit = "10", offset = "0" } = req.query;
    const lim = parseInt(limit as string);
    const off = parseInt(offset as string);

    let query = db.select().from(newsTable)
      .where(
        search
          ? and(eq(newsTable.status, "published"), or(ilike(newsTable.title, `%${search}%`), ilike(newsTable.content, `%${search}%`)))
          : eq(newsTable.status, "published")
      )
      .orderBy(desc(newsTable.publishedAt))
      .limit(lim)
      .offset(off);

    const articles = await query;

    const countResult = await db.select({ count: sql<number>`count(*)::int` }).from(newsTable)
      .where(
        search
          ? and(eq(newsTable.status, "published"), or(ilike(newsTable.title, `%${search}%`), ilike(newsTable.content, `%${search}%`)))
          : eq(newsTable.status, "published")
      );

    return res.json({
      articles: articles.map(formatArticle),
      total: countResult[0]?.count ?? 0,
    });
  } catch (err) {
    logger.error({ err }, "Get news error");
    return res.status(500).json({ error: "Interne serverfout" });
  }
});

router.get("/all", requireAdmin, async (req, res) => {
  try {
    const articles = await db.select().from(newsTable).orderBy(desc(newsTable.createdAt));
    return res.json(articles.map(formatArticle));
  } catch (err) {
    logger.error({ err }, "Get all news error");
    return res.status(500).json({ error: "Interne serverfout" });
  }
});

router.post("/", requireAdmin, async (req, res) => {
  try {
    const { title, content, excerpt, imageUrl, category, status, authorName, publishedAt } = req.body;
    const [article] = await db.insert(newsTable).values({
      title,
      slug: slugify(title),
      content,
      excerpt,
      imageUrl,
      category,
      status: status ?? "draft",
      authorName,
      publishedAt: publishedAt ? new Date(publishedAt) : (status === "published" ? new Date() : null),
    }).returning();

    await db.insert(activityLogTable).values({
      action: `Nieuwsartikel "${title}" aangemaakt`,
      entityType: "news",
      entityId: article.id,
      adminUsername: req.session.adminUsername ?? "admin",
    });

    return res.status(201).json(formatArticle(article));
  } catch (err) {
    logger.error({ err }, "Create news error");
    return res.status(500).json({ error: "Interne serverfout" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [article] = await db.select().from(newsTable).where(eq(newsTable.id, id));
    if (!article) return res.status(404).json({ error: "Artikel niet gevonden" });
    return res.json(formatArticle(article));
  } catch (err) {
    logger.error({ err }, "Get article error");
    return res.status(500).json({ error: "Interne serverfout" });
  }
});

router.patch("/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updates: Record<string, unknown> = {};
    const { title, content, excerpt, imageUrl, category, status, authorName, publishedAt } = req.body;
    if (title !== undefined) updates.title = title;
    if (content !== undefined) updates.content = content;
    if (excerpt !== undefined) updates.excerpt = excerpt;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;
    if (category !== undefined) updates.category = category;
    if (status !== undefined) updates.status = status;
    if (authorName !== undefined) updates.authorName = authorName;
    if (publishedAt !== undefined) updates.publishedAt = publishedAt ? new Date(publishedAt) : null;
    if (status === "published" && !publishedAt) updates.publishedAt = new Date();

    const [article] = await db.update(newsTable).set(updates).where(eq(newsTable.id, id)).returning();
    if (!article) return res.status(404).json({ error: "Artikel niet gevonden" });

    await db.insert(activityLogTable).values({
      action: `Artikel "${article.title}" bijgewerkt`,
      entityType: "news",
      entityId: article.id,
      adminUsername: req.session.adminUsername ?? "admin",
    });

    return res.json(formatArticle(article));
  } catch (err) {
    logger.error({ err }, "Update news error");
    return res.status(500).json({ error: "Interne serverfout" });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [article] = await db.delete(newsTable).where(eq(newsTable.id, id)).returning();
    if (!article) return res.status(404).json({ error: "Artikel niet gevonden" });

    await db.insert(activityLogTable).values({
      action: `Artikel "${article.title}" verwijderd`,
      entityType: "news",
      entityId: id,
      adminUsername: req.session.adminUsername ?? "admin",
    });

    return res.json({ success: true, message: "Artikel verwijderd" });
  } catch (err) {
    logger.error({ err }, "Delete news error");
    return res.status(500).json({ error: "Interne serverfout" });
  }
});

export default router;
