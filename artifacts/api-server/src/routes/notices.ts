import { Router } from "express";
import { db } from "@workspace/db";
import { noticesTable, usersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth, formatUser, AuthRequest } from "./middleware";

const router = Router();

function formatNotice(n: typeof noticesTable.$inferSelect, author?: typeof usersTable.$inferSelect) {
  return {
    id: n.id,
    title: n.title,
    content: n.content,
    authorId: n.authorId,
    author: author ? formatUser(author) : undefined,
    category: n.category,
    imageUrl: n.imageUrl,
    createdAt: n.createdAt.toISOString(),
  };
}

// GET /api/notices
router.get("/", async (req, res) => {
  const { category, limit = "20" } = req.query as Record<string, string>;
  const limitN = Math.min(parseInt(limit) || 20, 50);

  const notices = category
    ? await db.select().from(noticesTable).where(eq(noticesTable.category, category)).orderBy(desc(noticesTable.createdAt)).limit(limitN)
    : await db.select().from(noticesTable).orderBy(desc(noticesTable.createdAt)).limit(limitN);

  const results = await Promise.all(notices.map(async (n) => {
    const [author] = await db.select().from(usersTable).where(eq(usersTable.id, n.authorId)).limit(1);
    return formatNotice(n, author);
  }));
  return res.json(results);
});

// POST /api/notices
router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const { title, content, category, imageUrl } = req.body as {
    title: string; content: string; category: string; imageUrl?: string;
  };
  if (!title || !content || !category) return res.status(400).json({ error: "title, content, and category are required" });

  const [notice] = await db.insert(noticesTable).values({
    title, content, authorId: req.userId!, category, imageUrl,
  }).returning();

  const [author] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
  return res.status(201).json(formatNotice(notice, author));
});

export default router;
