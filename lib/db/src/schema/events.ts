import { pgTable, serial, text, real, jsonb, integer, timestamp, boolean, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const eventsTable = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull().default("other"), // morning_walk | gym | tournament | trip | picnic | social | sos | other
  hostId: integer("host_id").notNull().references(() => usersTable.id),
  location: text("location"),
  lat: real("lat"),
  lng: real("lng"),
  startAt: timestamp("start_at").notNull(),
  endAt: timestamp("end_at"),
  maxParticipants: integer("max_participants"),
  currentParticipants: integer("current_participants").notNull().default(0),
  entryFee: numeric("entry_fee", { precision: 10, scale: 2 }),
  status: text("status").notNull().default("upcoming"), // upcoming | ongoing | completed | cancelled
  tags: jsonb("tags").$type<string[]>().default([]),
  imageUrl: text("image_url"),
  isTournament: boolean("is_tournament").notNull().default(false),
  prize: text("prize"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertEventSchema = createInsertSchema(eventsTable).omit({ id: true, createdAt: true, currentParticipants: true });
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type DbEvent = typeof eventsTable.$inferSelect;
