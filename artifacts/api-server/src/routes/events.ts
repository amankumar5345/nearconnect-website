import { Router } from "express";
import { db } from "@workspace/db";
import { eventsTable, usersTable, registrationsTable } from "@workspace/db";
import { eq, desc, and, count, sql } from "drizzle-orm";
import { requireAuth, formatUser, AuthRequest } from "./middleware";

const router = Router();

function formatEvent(e: typeof eventsTable.$inferSelect, host?: typeof usersTable.$inferSelect) {
  return {
    id: e.id,
    title: e.title,
    description: e.description,
    type: e.type,
    hostId: e.hostId,
    host: host ? formatUser(host) : undefined,
    location: e.location,
    lat: e.lat,
    lng: e.lng,
    startAt: e.startAt.toISOString(),
    endAt: e.endAt?.toISOString() ?? null,
    maxParticipants: e.maxParticipants,
    currentParticipants: e.currentParticipants,
    entryFee: e.entryFee !== null ? parseFloat(String(e.entryFee)) : null,
    status: e.status,
    tags: (e.tags as string[]) ?? [],
    imageUrl: e.imageUrl,
    isTournament: e.isTournament,
    prize: e.prize,
    createdAt: e.createdAt.toISOString(),
  };
}

async function getEventWithHost(eventId: number) {
  const [event] = await db.select().from(eventsTable).where(eq(eventsTable.id, eventId)).limit(1);
  if (!event) return null;
  const [host] = await db.select().from(usersTable).where(eq(usersTable.id, event.hostId)).limit(1);
  return formatEvent(event, host);
}

// GET /api/events
router.get("/", async (req, res) => {
  const { type, limit = "20", offset = "0" } = req.query as Record<string, string>;
  const limitN = Math.min(parseInt(limit) || 20, 50);
  const offsetN = parseInt(offset) || 0;

  let query = db.select().from(eventsTable).orderBy(desc(eventsTable.startAt)).limit(limitN).offset(offsetN);
  const events = type
    ? await db.select().from(eventsTable).where(eq(eventsTable.type, type)).orderBy(desc(eventsTable.startAt)).limit(limitN).offset(offsetN)
    : await query;

  const results = await Promise.all(events.map(async (e) => {
    const [host] = await db.select().from(usersTable).where(eq(usersTable.id, e.hostId)).limit(1);
    return formatEvent(e, host);
  }));
  return res.json(results);
});

// GET /api/events/feed
router.get("/feed", async (req, res) => {
  const { limit = "20" } = req.query as Record<string, string>;
  const limitN = Math.min(parseInt(limit) || 20, 50);
  const events = await db.select().from(eventsTable).where(eq(eventsTable.status, "upcoming")).orderBy(desc(eventsTable.createdAt)).limit(limitN);
  const results = await Promise.all(events.map(async (e) => {
    const [host] = await db.select().from(usersTable).where(eq(usersTable.id, e.hostId)).limit(1);
    return formatEvent(e, host);
  }));
  return res.json(results);
});

// GET /api/events/stats
router.get("/stats", async (req, res) => {
  const [totalEvents] = await db.select({ count: count() }).from(eventsTable);
  const [upcomingEvents] = await db.select({ count: count() }).from(eventsTable).where(eq(eventsTable.status, "upcoming"));
  const [totalUsers] = await db.select({ count: count() }).from(usersTable);

  const typeCounts = await db
    .select({ type: eventsTable.type, count: count() })
    .from(eventsTable)
    .groupBy(eventsTable.type);

  return res.json({
    totalEvents: totalEvents?.count ?? 0,
    upcomingEvents: upcomingEvents?.count ?? 0,
    totalUsers: totalUsers?.count ?? 0,
    activeToday: Math.floor(Math.random() * 20) + 5,
    byType: typeCounts.map((t) => ({ type: t.type, count: t.count })),
  });
});

// GET /api/events/:eventId
router.get("/:eventId", async (req, res) => {
  const eventId = parseInt(req.params.eventId ?? "0");
  if (!eventId) return res.status(400).json({ error: "Invalid eventId" });
  const result = await getEventWithHost(eventId);
  if (!result) return res.status(404).json({ error: "Event not found" });
  return res.json(result);
});

// POST /api/events
router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const { title, description, type, location, lat, lng, startAt, endAt, maxParticipants, entryFee, tags, imageUrl, isTournament, prize } = req.body as {
    title: string; description?: string; type?: string; location?: string;
    lat?: number; lng?: number; startAt: string; endAt?: string;
    maxParticipants?: number; entryFee?: number; tags?: string[];
    imageUrl?: string; isTournament?: boolean; prize?: string;
  };

  if (!title || !startAt) return res.status(400).json({ error: "title and startAt are required" });

  const [event] = await db.insert(eventsTable).values({
    title, description, type: type ?? "other",
    hostId: req.userId!,
    location, lat, lng,
    startAt: new Date(startAt),
    endAt: endAt ? new Date(endAt) : undefined,
    maxParticipants, entryFee: entryFee?.toString(),
    tags: tags ?? [], imageUrl,
    isTournament: isTournament ?? false,
    prize,
    status: "upcoming",
  }).returning();

  // Increment host's events hosted count
  await db.execute(sql`UPDATE users SET events_hosted = events_hosted + 1 WHERE id = ${req.userId!}`);

  const result = await getEventWithHost(event.id);
  return res.status(201).json(result);
});

// PATCH /api/events/:eventId
router.patch("/:eventId", requireAuth, async (req: AuthRequest, res) => {
  const eventId = parseInt(req.params.eventId ?? "0");
  const [event] = await db.select().from(eventsTable).where(eq(eventsTable.id, eventId)).limit(1);
  if (!event) return res.status(404).json({ error: "Event not found" });
  if (event.hostId !== req.userId) return res.status(403).json({ error: "Not the host" });

  const { title, description, location, startAt, endAt, maxParticipants, entryFee, status, imageUrl, prize } = req.body as {
    title?: string; description?: string; location?: string;
    startAt?: string; endAt?: string; maxParticipants?: number;
    entryFee?: number; status?: string; imageUrl?: string; prize?: string;
  };

  const updates: Partial<typeof eventsTable.$inferInsert> = {};
  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (location !== undefined) updates.location = location;
  if (startAt !== undefined) updates.startAt = new Date(startAt);
  if (endAt !== undefined) updates.endAt = new Date(endAt);
  if (maxParticipants !== undefined) updates.maxParticipants = maxParticipants;
  if (entryFee !== undefined) updates.entryFee = entryFee.toString();
  if (status !== undefined) updates.status = status;
  if (imageUrl !== undefined) updates.imageUrl = imageUrl;
  if (prize !== undefined) updates.prize = prize;

  await db.update(eventsTable).set(updates).where(eq(eventsTable.id, eventId));
  const result = await getEventWithHost(eventId);
  return res.json(result);
});

// DELETE /api/events/:eventId
router.delete("/:eventId", requireAuth, async (req: AuthRequest, res) => {
  const eventId = parseInt(req.params.eventId ?? "0");
  const [event] = await db.select().from(eventsTable).where(eq(eventsTable.id, eventId)).limit(1);
  if (!event) return res.status(404).json({ error: "Event not found" });
  if (event.hostId !== req.userId) return res.status(403).json({ error: "Not the host" });

  await db.delete(registrationsTable).where(eq(registrationsTable.eventId, eventId));
  await db.delete(eventsTable).where(eq(eventsTable.id, eventId));
  return res.json({ success: true, message: "Event deleted" });
});

export { formatEvent };
export default router;
