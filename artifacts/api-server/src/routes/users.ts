import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, formatUser, AuthRequest } from "./middleware";

const router = Router();

// GET /api/users/me
router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  return res.json(formatUser(req.user!));
});

// PATCH /api/users/me
router.patch("/me", requireAuth, async (req: AuthRequest, res) => {
  const { name, avatar, bio, location, lat, lng, attributes } = req.body as {
    name?: string;
    avatar?: string | null;
    bio?: string | null;
    location?: string | null;
    lat?: number | null;
    lng?: number | null;
    attributes?: string[];
  };

  const updates: Partial<typeof usersTable.$inferInsert> = {};
  if (name !== undefined) updates.name = name;
  if (avatar !== undefined) updates.avatar = avatar;
  if (bio !== undefined) updates.bio = bio;
  if (location !== undefined) updates.location = location;
  if (lat !== undefined) updates.lat = lat;
  if (lng !== undefined) updates.lng = lng;
  if (attributes !== undefined) updates.attributes = attributes;

  const [updated] = await db.update(usersTable).set(updates).where(eq(usersTable.id, req.userId!)).returning();
  return res.json(formatUser(updated));
});

// GET /api/users/:userId
router.get("/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId ?? "0");
  if (!userId) return res.status(400).json({ error: "Invalid userId" });

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
  if (!user) return res.status(404).json({ error: "User not found" });

  return res.json(formatUser(user));
});

export default router;
