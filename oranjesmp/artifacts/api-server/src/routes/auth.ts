import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, adminUsersTable, activityLogTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";

declare module "express-session" {
  interface SessionData {
    adminUserId?: number;
    adminUsername?: string;
  }
}

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Gebruikersnaam en wachtwoord zijn verplicht" });
    }

    const [user] = await db.select().from(adminUsersTable).where(eq(adminUsersTable.username, username));
    if (!user) {
      return res.status(401).json({ error: "Ongeldige inloggegevens" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Ongeldige inloggegevens" });
    }

    req.session.adminUserId = user.id;
    req.session.adminUsername = user.username;

    await db.insert(activityLogTable).values({
      action: "Ingelogd",
      entityType: "admin_user",
      entityId: user.id,
      adminUsername: user.username,
    });

    return res.json({
      id: user.id,
      username: user.username,
      role: user.role,
      mustChangePassword: user.mustChangePassword,
    });
  } catch (err) {
    logger.error({ err }, "Login error");
    return res.status(500).json({ error: "Interne serverfout" });
  }
});

router.post("/logout", async (req, res) => {
  req.session.destroy(() => {});
  return res.json({ success: true, message: "Uitgelogd" });
});

router.get("/me", async (req, res) => {
  if (!req.session.adminUserId) {
    return res.status(401).json({ error: "Niet ingelogd" });
  }
  try {
    const [user] = await db.select().from(adminUsersTable).where(eq(adminUsersTable.id, req.session.adminUserId));
    if (!user) {
      return res.status(401).json({ error: "Gebruiker niet gevonden" });
    }
    return res.json({
      id: user.id,
      username: user.username,
      role: user.role,
      mustChangePassword: user.mustChangePassword,
    });
  } catch (err) {
    logger.error({ err }, "Get me error");
    return res.status(500).json({ error: "Interne serverfout" });
  }
});

router.post("/change-credentials", async (req, res) => {
  if (!req.session.adminUserId) {
    return res.status(401).json({ error: "Niet ingelogd" });
  }
  try {
    const { currentPassword, newUsername, newPassword } = req.body;
    const [user] = await db.select().from(adminUsersTable).where(eq(adminUsersTable.id, req.session.adminUserId));
    if (!user) {
      return res.status(404).json({ error: "Gebruiker niet gevonden" });
    }

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Huidig wachtwoord is onjuist" });
    }

    const updates: Record<string, unknown> = { mustChangePassword: false };
    if (newUsername && newUsername !== user.username) {
      updates.username = newUsername;
    }
    if (newPassword) {
      updates.passwordHash = await bcrypt.hash(newPassword, 12);
    }

    await db.update(adminUsersTable).set(updates).where(eq(adminUsersTable.id, user.id));

    if (updates.username) {
      req.session.adminUsername = updates.username as string;
    }

    await db.insert(activityLogTable).values({
      action: "Inloggegevens gewijzigd",
      entityType: "admin_user",
      entityId: user.id,
      adminUsername: user.username,
    });

    return res.json({ success: true, message: "Inloggegevens bijgewerkt" });
  } catch (err) {
    logger.error({ err }, "Change credentials error");
    return res.status(500).json({ error: "Interne serverfout" });
  }
});

export default router;
