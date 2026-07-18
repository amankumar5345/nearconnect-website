import { pgTable, serial, text, real, jsonb, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  identifier: text("identifier").notNull().unique(), // email or phone
  passwordHash: text("password_hash").notNull(),
  avatar: text("avatar"),
  bio: text("bio"),
  location: text("location"),
  lat: real("lat"),
  lng: real("lng"),
  attributes: jsonb("attributes").$type<string[]>().default([]),
  eventsHosted: integer("events_hosted").notNull().default(0),
  eventsJoined: integer("events_joined").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true, eventsHosted: true, eventsJoined: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
