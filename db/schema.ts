// Write db/schema.ts for Drizzle + Postgres: a generations table with UUID primary key (default random), clerkUserId,
// optional originalFilename, sourceUrl, resultImageUrl, styleLabel, model, promptUsed, and createdAt
// (timestamp, default now); export as generations.

import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const generations = pgTable("generations", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkUserId: text("clerk_user_id").notNull(),
  originalFilename: text("original_filename"),
  sourceUrl: text("source_url"),
  resultImageUrl: text("result_image_url"),
  styleLabel: text("style_label"),
  model: text("model"),
  promptUsed: text("prompt_used"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
