import { Router } from "express";
import { db, teamMembersTable, activityLogTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/requireAdmin";
import { logger } from "../lib/logger";

const router = Router();

function formatMember(m: typeof teamMembersTable.$inferSelect) {
  return {
    id: m.id,
    name: m.name,
    role: m.role,
    avatarUrl: m.avatarUrl,
    minecraftUsername: m.minecraftUsername,
    description: m.description,
    sortOrder: m.sortOrder,
  };
}

router.get("/", async (req, res) => {
  try {
    const members = await db.select().from(teamMembersTable).orderBy(asc(teamMembersTable.sortOrder));
    return res.json(members.map(formatMember));
  } catch (err) {
    logger.error({ err }, "Get team error");
    return res.status(500).json({ error: "Interne serverfout" });
  }
});

router.post("/", requireAdmin, async (req, res) => {
  try {
    const { name, role, avatarUrl, minecraftUsername, description, sortOrder } = req.body;
    const [member] = await db.insert(teamMembersTable).values({
      name, role, avatarUrl, minecraftUsername, description,
      sortOrder: sortOrder ?? 0,
    }).returning();

    await db.insert(activityLogTable).values({
      action: `Teamlid "${name}" aangemaakt`,
      entityType: "team_member",
      entityId: member.id,
      adminUsername: req.session.adminUsername ?? "admin",
    });

    return res.status(201).json(formatMember(member));
  } catch (err) {
    logger.error({ err }, "Create team member error");
    return res.status(500).json({ error: "Interne serverfout" });
  }
});

router.patch("/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updates: Record<string, unknown> = {};
    const { name, role, avatarUrl, minecraftUsername, description, sortOrder } = req.body;
    if (name !== undefined) updates.name = name;
    if (role !== undefined) updates.role = role;
    if (avatarUrl !== undefined) updates.avatarUrl = avatarUrl;
    if (minecraftUsername !== undefined) updates.minecraftUsername = minecraftUsername;
    if (description !== undefined) updates.description = description;
    if (sortOrder !== undefined) updates.sortOrder = sortOrder;

    const [member] = await db.update(teamMembersTable).set(updates).where(eq(teamMembersTable.id, id)).returning();
    if (!member) return res.status(404).json({ error: "Teamlid niet gevonden" });

    await db.insert(activityLogTable).values({
      action: `Teamlid "${member.name}" bijgewerkt`,
      entityType: "team_member",
      entityId: member.id,
      adminUsername: req.session.adminUsername ?? "admin",
    });

    return res.json(formatMember(member));
  } catch (err) {
    logger.error({ err }, "Update team member error");
    return res.status(500).json({ error: "Interne serverfout" });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [member] = await db.delete(teamMembersTable).where(eq(teamMembersTable.id, id)).returning();
    if (!member) return res.status(404).json({ error: "Teamlid niet gevonden" });

    await db.insert(activityLogTable).values({
      action: `Teamlid "${member.name}" verwijderd`,
      entityType: "team_member",
      entityId: id,
      adminUsername: req.session.adminUsername ?? "admin",
    });

    return res.json({ success: true, message: "Teamlid verwijderd" });
  } catch (err) {
    logger.error({ err }, "Delete team member error");
    return res.status(500).json({ error: "Interne serverfout" });
  }
});

export default router;
