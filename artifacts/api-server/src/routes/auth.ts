import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, sessionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomBytes, createHash } from "crypto";

const router = Router();

function hashPassword(pw: string): string {
  return createHash("sha256").update(pw + "nc_salt_2024").digest("hex");
}

function generateToken(): string {
  return randomBytes(32).toString("hex");
}

function formatUser(u: typeof usersTable.$inferSelect) {
  return {
    id: u.id,
    name: u.name,
    avatar: u.avatar,
    bio: u.bio,
    location: u.location,
    lat: u.lat,
    lng: u.lng,
    attributes: (u.attributes as string[]) ?? [],
    eventsHosted: u.eventsHosted,
    eventsJoined: u.eventsJoined,
    createdAt: u.createdAt.toISOString(),
  };
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { name, identifier, password } = req.body as { name: string; identifier: string; password: string };
  if (!name || !identifier || !password) {
    return res.status(400).json({ error: "name, identifier, and password are required" });
  }

  const existing = await db.select().from(usersTable).where(eq(usersTable.identifier, identifier)).limit(1);
  if (existing.length > 0) {
    return res.status(400).json({ error: "Account already exists with this identifier" });
  }

  const [user] = await db.insert(usersTable).values({
    name,
    identifier,
    passwordHash: hashPassword(password),
    attributes: [],
  }).returning();

  const token = generateToken();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  await db.insert(sessionsTable).values({ userId: user.id, token, expiresAt });

  res.cookie("nc_token", token, { httpOnly: true, expires: expiresAt, sameSite: "lax" });
  return res.status(201).json({ user: formatUser(user), isNewUser: true });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { identifier, password } = req.body as { identifier: string; password: string };
  if (!identifier || !password) {
    return res.status(400).json({ error: "identifier and password are required" });
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.identifier, identifier)).limit(1);
  if (!user || user.passwordHash !== hashPassword(password)) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = generateToken();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await db.insert(sessionsTable).values({ userId: user.id, token, expiresAt });

  res.cookie("nc_token", token, { httpOnly: true, expires: expiresAt, sameSite: "lax" });
  return res.json({ user: formatUser(user), isNewUser: false });
});

// POST /api/auth/logout
router.post("/logout", async (req, res) => {
  const token = req.cookies?.nc_token as string | undefined;
  if (token) {
    await db.delete(sessionsTable).where(eq(sessionsTable.token, token));
  }
  res.clearCookie("nc_token");
  return res.json({ success: true, message: "Logged out" });
});

export default router;
