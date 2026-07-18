import { Router } from "express";
import { db } from "@workspace/db";
import { chatRoomsTable, chatMessagesTable, chatRoomParticipantsTable, usersTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth, formatUser, AuthRequest } from "./middleware";

const router = Router();

function formatRoom(r: typeof chatRoomsTable.$inferSelect, unreadCount = 0) {
  return {
    id: r.id,
    name: r.name,
    type: r.type,
    eventId: r.eventId,
    avatarUrl: r.avatarUrl,
    lastMessage: r.lastMessage,
    lastMessageAt: r.lastMessageAt.toISOString(),
    unreadCount,
    participantCount: r.participantCount,
  };
}

function formatMessage(m: typeof chatMessagesTable.$inferSelect, user?: typeof usersTable.$inferSelect) {
  return {
    id: m.id,
    roomId: m.roomId,
    userId: m.userId,
    user: user ? formatUser(user) : undefined,
    text: m.text,
    createdAt: m.createdAt.toISOString(),
  };
}

// GET /api/chat/rooms
router.get("/rooms", requireAuth, async (req: AuthRequest, res) => {
  const participations = await db
    .select()
    .from(chatRoomParticipantsTable)
    .where(eq(chatRoomParticipantsTable.userId, req.userId!));

  const rooms = await Promise.all(participations.map(async (p) => {
    const [room] = await db.select().from(chatRoomsTable).where(eq(chatRoomsTable.id, p.roomId)).limit(1);
    return room ? formatRoom(room, p.unreadCount) : null;
  }));

  return res.json(rooms.filter(Boolean));
});

// GET /api/chat/rooms/:roomId/messages
router.get("/rooms/:roomId/messages", requireAuth, async (req: AuthRequest, res) => {
  const roomId = parseInt(req.params.roomId ?? "0");
  if (!roomId) return res.status(400).json({ error: "Invalid roomId" });

  const messages = await db
    .select()
    .from(chatMessagesTable)
    .where(eq(chatMessagesTable.roomId, roomId))
    .orderBy(desc(chatMessagesTable.createdAt))
    .limit(50);

  // Reset unread count for this user
  await db
    .update(chatRoomParticipantsTable)
    .set({ unreadCount: 0 })
    .where(and(eq(chatRoomParticipantsTable.roomId, roomId), eq(chatRoomParticipantsTable.userId, req.userId!)));

  const results = await Promise.all(messages.reverse().map(async (m) => {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, m.userId)).limit(1);
    return formatMessage(m, user);
  }));

  return res.json(results);
});

// POST /api/chat/rooms/:roomId/messages
router.post("/rooms/:roomId/messages", requireAuth, async (req: AuthRequest, res) => {
  const roomId = parseInt(req.params.roomId ?? "0");
  if (!roomId) return res.status(400).json({ error: "Invalid roomId" });

  const { text } = req.body as { text: string };
  if (!text?.trim()) return res.status(400).json({ error: "text is required" });

  const [message] = await db.insert(chatMessagesTable).values({
    roomId, userId: req.userId!, text: text.trim(),
  }).returning();

  // Update room's last message
  await db.update(chatRoomsTable).set({ lastMessage: text.trim(), lastMessageAt: new Date() }).where(eq(chatRoomsTable.id, roomId));

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
  return res.status(201).json(formatMessage(message, user));
});

export default router;
