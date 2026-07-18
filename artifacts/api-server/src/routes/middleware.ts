import { Request, Response, NextFunction } from "express";
import { db } from "@workspace/db";
import { usersTable, sessionsTable } from "@workspace/db";
import { eq, and, gt } from "drizzle-orm";

export interface AuthRequest extends Request {
  userId?: number;
  user?: typeof usersTable.$inferSelect;
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.nc_token as string | undefined;
  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const [session] = await db
    .select()
    .from(sessionsTable)
    .where(and(eq(sessionsTable.token, token), gt(sessionsTable.expiresAt, new Date())))
    .limit(1);

  if (!session) {
    return res.status(401).json({ error: "Session expired or invalid" });
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, session.userId)).limit(1);
  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }

  req.userId = user.id;
  req.user = user;
  return next();
}

export function formatUser(u: typeof usersTable.$inferSelect) {
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
