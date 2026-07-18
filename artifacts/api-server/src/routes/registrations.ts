import { Router } from "express";
import { db } from "@workspace/db";
import { registrationsTable, eventsTable, usersTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import { requireAuth, formatUser, AuthRequest } from "./middleware";
import { formatEvent } from "./events";

const router = Router({ mergeParams: true });

function formatRegistration(r: typeof registrationsTable.$inferSelect, user?: typeof usersTable.$inferSelect, event?: ReturnType<typeof formatEvent>) {
  return {
    id: r.id,
    eventId: r.eventId,
    userId: r.userId,
    user: user ? formatUser(user) : undefined,
    event: event ?? undefined,
    status: r.status,
    teamName: r.teamName,
    teamSize: r.teamSize,
    notes: r.notes,
    createdAt: r.createdAt.toISOString(),
  };
}

// GET /api/events/:eventId/registrations
router.get("/", async (req, res) => {
  const eventId = parseInt(req.params.eventId ?? "0");
  if (!eventId) return res.status(400).json({ error: "Invalid eventId" });

  const regs = await db.select().from(registrationsTable).where(and(eq(registrationsTable.eventId, eventId), eq(registrationsTable.status, "confirmed")));
  const results = await Promise.all(regs.map(async (r) => {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, r.userId)).limit(1);
    return formatRegistration(r, user);
  }));
  return res.json(results);
});

// POST /api/events/:eventId/registrations
router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const eventId = parseInt(req.params.eventId ?? "0");
  if (!eventId) return res.status(400).json({ error: "Invalid eventId" });

  const [event] = await db.select().from(eventsTable).where(eq(eventsTable.id, eventId)).limit(1);
  if (!event) return res.status(404).json({ error: "Event not found" });

  // Check already registered
  const [existing] = await db.select().from(registrationsTable)
    .where(and(eq(registrationsTable.eventId, eventId), eq(registrationsTable.userId, req.userId!), eq(registrationsTable.status, "confirmed")))
    .limit(1);
  if (existing) return res.status(400).json({ error: "Already registered" });

  // Check capacity
  if (event.maxParticipants && event.currentParticipants >= event.maxParticipants) {
    return res.status(400).json({ error: "Event is full" });
  }

  const { teamName, teamSize, notes } = req.body as { teamName?: string; teamSize?: number; notes?: string };

  const [reg] = await db.insert(registrationsTable).values({
    eventId, userId: req.userId!, status: "confirmed", teamName, teamSize, notes,
  }).returning();

  // Increment participant count and user's events joined
  await db.execute(sql`UPDATE events SET current_participants = current_participants + 1 WHERE id = ${eventId}`);
  await db.execute(sql`UPDATE users SET events_joined = events_joined + 1 WHERE id = ${req.userId!}`);

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
  return res.status(201).json(formatRegistration(reg, user));
});

// DELETE /api/events/:eventId/registrations/me
router.delete("/me", requireAuth, async (req: AuthRequest, res) => {
  const eventId = parseInt(req.params.eventId ?? "0");
  const [reg] = await db.select().from(registrationsTable)
    .where(and(eq(registrationsTable.eventId, eventId), eq(registrationsTable.userId, req.userId!)))
    .limit(1);

  if (!reg) return res.status(404).json({ error: "Registration not found" });

  await db.update(registrationsTable).set({ status: "cancelled" }).where(eq(registrationsTable.id, reg.id));
  await db.execute(sql`UPDATE events SET current_participants = GREATEST(current_participants - 1, 0) WHERE id = ${eventId}`);
  return res.json({ success: true, message: "Registration cancelled" });
});

export { formatRegistration };
export default router;
