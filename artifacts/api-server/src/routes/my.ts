import { Router } from "express";
import { db } from "@workspace/db";
import { registrationsTable, eventsTable, usersTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth, formatUser, AuthRequest } from "./middleware";
import { formatEvent } from "./events";

const router = Router();

function formatRegistration(r: typeof registrationsTable.$inferSelect, event?: ReturnType<typeof formatEvent>) {
  return {
    id: r.id,
    eventId: r.eventId,
    userId: r.userId,
    event: event ?? undefined,
    status: r.status,
    teamName: r.teamName,
    teamSize: r.teamSize,
    notes: r.notes,
    createdAt: r.createdAt.toISOString(),
  };
}

// GET /api/my/registrations
router.get("/registrations", requireAuth, async (req: AuthRequest, res) => {
  const regs = await db
    .select()
    .from(registrationsTable)
    .where(and(eq(registrationsTable.userId, req.userId!), eq(registrationsTable.status, "confirmed")))
    .orderBy(desc(registrationsTable.createdAt));

  const results = await Promise.all(regs.map(async (r) => {
    const [e] = await db.select().from(eventsTable).where(eq(eventsTable.id, r.eventId)).limit(1);
    if (!e) return formatRegistration(r);
    const [host] = await db.select().from(usersTable).where(eq(usersTable.id, e.hostId)).limit(1);
    return formatRegistration(r, formatEvent(e, host));
  }));
  return res.json(results);
});

// GET /api/my/events
router.get("/events", requireAuth, async (req: AuthRequest, res) => {
  const events = await db
    .select()
    .from(eventsTable)
    .where(eq(eventsTable.hostId, req.userId!))
    .orderBy(desc(eventsTable.createdAt));

  const [host] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
  return res.json(events.map((e) => formatEvent(e, host)));
});

export default router;
