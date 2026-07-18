import { Router } from "express";
import { db } from "@workspace/db";
import { sosRequestsTable, sosResponsesTable, usersTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import { requireAuth, formatUser, AuthRequest } from "./middleware";

const router = Router();

function formatSos(s: typeof sosRequestsTable.$inferSelect, requester?: typeof usersTable.$inferSelect) {
  return {
    id: s.id,
    title: s.title,
    description: s.description,
    requesterId: s.requesterId,
    requester: requester ? formatUser(requester) : undefined,
    location: s.location,
    status: s.status,
    responseCount: s.responseCount,
    createdAt: s.createdAt.toISOString(),
  };
}

// GET /api/sos
router.get("/", async (_req, res) => {
  const requests = await db
    .select()
    .from(sosRequestsTable)
    .where(eq(sosRequestsTable.status, "open"))
    .orderBy(desc(sosRequestsTable.createdAt))
    .limit(30);

  const results = await Promise.all(requests.map(async (s) => {
    const [requester] = await db.select().from(usersTable).where(eq(usersTable.id, s.requesterId)).limit(1);
    return formatSos(s, requester);
  }));
  return res.json(results);
});

// POST /api/sos
router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const { title, description, location } = req.body as { title: string; description: string; location?: string };
  if (!title || !description) return res.status(400).json({ error: "title and description are required" });

  const [sos] = await db.insert(sosRequestsTable).values({
    title, description, requesterId: req.userId!, location, status: "open",
  }).returning();

  const [requester] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
  return res.status(201).json(formatSos(sos, requester));
});

// POST /api/sos/:sosId/respond
router.post("/:sosId/respond", requireAuth, async (req: AuthRequest, res) => {
  const sosId = parseInt(req.params.sosId ?? "0");
  if (!sosId) return res.status(400).json({ error: "Invalid sosId" });

  const { message } = req.body as { message: string };
  if (!message) return res.status(400).json({ error: "message is required" });

  await db.insert(sosResponsesTable).values({ sosId, responderId: req.userId!, message });
  await db.execute(sql`UPDATE sos_requests SET response_count = response_count + 1 WHERE id = ${sosId}`);
  return res.status(201).json({ success: true, message: "Response recorded" });
});

export default router;
