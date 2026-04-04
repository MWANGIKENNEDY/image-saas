/**
 * Database operations for image generations
 * Handles CRUD operations and quota tracking for AI-generated images
 */

import { and, count, desc, eq, gte, type InferInsertModel } from "drizzle-orm";

import { generations } from "@/db/schema";
import { db } from "@/db/index";

/**
 * Returns the start of the current month in UTC timezone.
 * Used for calculating monthly generation quotas and usage tracking.
 * 
 * @returns Date object set to the first day of the current month at 00:00:00 UTC
 * @example
 * // If current date is 2024-03-15
 * utcMonthStart() // Returns 2024-03-01 00:00:00 UTC
 */
export function utcMonthStart() {
  const n = new Date();
  return new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), 1, 0, 0, 0, 0));
}

/**
 * Counts the number of generations created by a user since a specific date.
 * Useful for enforcing rate limits and quota restrictions.
 * 
 * @param clerkUserId - The Clerk user ID to count generations for
 * @param since - The date to count from (inclusive)
 * @returns Promise resolving to the count of generations
 * @example
 * // Count generations this month
 * const monthlyCount = await countGenerationsSince(userId, utcMonthStart());
 */
export async function countGenerationsSince(clerkUserId: string, since: Date) {
  const [row] = await db
    .select({ c: count() })
    .from(generations)
    .where(and(eq(generations.clerkUserId, clerkUserId), gte(generations.createdAt, since)));

  return Number(row?.c ?? 0);
}

/**
 * Retrieves all generations for a specific user, ordered by most recent first.
 * Returns complete generation records including URLs, prompts, and metadata.
 * 
 * @param clerkUserId - The Clerk user ID to fetch generations for
 * @returns Promise resolving to an array of generation records
 * @example
 * const userGenerations = await listUserGenerationSummaries(userId);
 * // Returns: [{ id, clerkUserId, sourceUrl, resultImageUrl, ... }, ...]
 */
export async function listUserGenerationSummaries(clerkUserId: string) {
  return db
    .select()
    .from(generations)
    .where(eq(generations.clerkUserId, clerkUserId))
    .orderBy(desc(generations.createdAt));
}

/**
 * Type for inserting a new generation record.
 * Omits auto-generated fields (id, createdAt) from the schema.
 */
type InsertGenerationInput = Omit<InferInsertModel<typeof generations>, "id" | "createdAt">;

/**
 * Creates a new generation record in the database.
 * Auto-generates id (UUID) and createdAt (timestamp) fields.
 * 
 * @param input - Generation data including clerkUserId and optional fields
 * @returns Promise resolving to the created generation record
 * @example
 * const newGen = await createGeneration({
 *   clerkUserId: "user_123",
 *   sourceUrl: "https://...",
 *   resultImageUrl: "https://...",
 *   promptUsed: "A beautiful sunset",
 *   model: "stable-diffusion-xl"
 * });
 */
export async function createGeneration(input: InsertGenerationInput) {
  const [row] = await db.insert(generations).values(input).returning();

  return row;
}