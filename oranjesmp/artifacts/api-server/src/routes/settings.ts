import { Router } from "express";
import { db, siteSettingsTable, activityLogTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/requireAdmin";
import { logger } from "../lib/logger";

const router = Router();

function formatSettings(s: typeof siteSettingsTable.$inferSelect) {
  return {
    id: s.id,
    serverIp: s.serverIp,
    serverName: s.serverName,
    currentSeason: s.currentSeason,
    discordUrl: s.discordUrl,
    heroTitle: s.heroTitle,
    heroSubtitle: s.heroSubtitle,
    logoUrl: s.logoUrl,
    backgroundUrl: s.backgroundUrl,
    heroBackgroundUrl: s.heroBackgroundUrl,
    contactEmail: s.contactEmail,
    twitterUrl: s.twitterUrl,
    youtubeUrl: s.youtubeUrl,
  };
}

router.get("/", async (req, res) => {
  try {
    const [settings] = await db.select().from(siteSettingsTable).limit(1);
    if (!settings) {
      // Create default settings
      const [newSettings] = await db.insert(siteSettingsTable).values({}).returning();
      return res.json(formatSettings(newSettings));
    }
    return res.json(formatSettings(settings));
  } catch (err) {
    logger.error({ err }, "Get settings error");
    return res.status(500).json({ error: "Interne serverfout" });
  }
});

router.patch("/", requireAdmin, async (req, res) => {
  try {
    const [existing] = await db.select().from(siteSettingsTable).limit(1);

    const updates: Record<string, unknown> = {};
    const fields = ["serverIp", "serverName", "currentSeason", "discordUrl", "heroTitle", "heroSubtitle",
      "logoUrl", "backgroundUrl", "heroBackgroundUrl", "contactEmail", "twitterUrl", "youtubeUrl"];
    for (const f of fields) {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    }

    let settings;
    if (existing) {
      [settings] = await db.update(siteSettingsTable).set(updates).returning();
    } else {
      [settings] = await db.insert(siteSettingsTable).values(updates as Record<string, string>).returning();
    }

    await db.insert(activityLogTable).values({
      action: "Site-instellingen bijgewerkt",
      entityType: "settings",
      entityId: 1,
      adminUsername: req.session.adminUsername ?? "admin",
    });

    return res.json(formatSettings(settings));
  } catch (err) {
    logger.error({ err }, "Update settings error");
    return res.status(500).json({ error: "Interne serverfout" });
  }
});

export default router;
