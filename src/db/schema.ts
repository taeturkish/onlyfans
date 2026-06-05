import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).unique().notNull(),
  displayName: text("display_name").notNull(),
  bio: text("bio").default(""),
  profileImageUrl: text("profile_image_url").default(""),
  coverImageUrl: text("cover_image_url").default(""),
  scareType: varchar("scare_type", { length: 50 }).default("video"), // 'video' | 'image'
  scareUrl: text("scare_url").default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
