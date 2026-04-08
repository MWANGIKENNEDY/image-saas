// Write db/schema.ts for Drizzle + Postgres: a generations table with UUID primary key (default random), clerkUserId,
// optional originalFileName, sourceImageUrl, resultImageUrl, styleSlug, styleLabel, model, promptUsed, and createdAt
// (timestamp, default now); export as generations.

import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const generations = pgTable("generations", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkUserId: text("clerk_user_id").notNull(),
  originalFileName: text("original_file_name"),
  sourceImageUrl: text("source_image_url").notNull(),
  resultImageUrl: text("result_image_url").notNull(),
  styleSlug: text("style_slug").notNull(),
  styleLabel: text("style_label").notNull(),
  model: text("model").notNull(),
  promptUsed: text("prompt_used").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
