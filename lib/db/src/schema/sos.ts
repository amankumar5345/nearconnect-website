import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const sosRequestsTable = pgTable("sos_requests", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  requesterId: integer("requester_id").notNull().references(() => usersTable.id),
  location: text("location"),
  status: text("status").notNull().default("open"), // open | resolved | cancelled
  responseCount: integer("response_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const sosResponsesTable = pgTable("sos_responses", {
  id: serial("id").primaryKey(),
  sosId: integer("sos_id").notNull().references(() => sosRequestsTable.id),
  responderId: integer("responder_id").notNull().references(() => usersTable.id),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSosRequestSchema = createInsertSchema(sosRequestsTable).omit({ id: true, createdAt: true, responseCount: true });
export type InsertSosRequest = z.infer<typeof insertSosRequestSchema>;
export type SosRequest = typeof sosRequestsTable.$inferSelect;
