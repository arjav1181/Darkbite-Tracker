import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Food entry schema
export const foodEntries = pgTable("food_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  calories: integer("calories").notNull(),
  protein: integer("protein").default(0),
  carbs: integer("carbs").default(0),
  fat: integer("fat").default(0),
  imageUrl: text("image_url"),
  entryType: text("entry_type").notNull(), // 'photo' or 'text'
  mealType: text("meal_type"), // 'breakfast', 'lunch', 'dinner', 'snack'
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertFoodEntrySchema = createInsertSchema(foodEntries).omit({
  id: true,
  timestamp: true,
});

export type InsertFoodEntry = z.infer<typeof insertFoodEntrySchema>;
export type FoodEntry = typeof foodEntries.$inferSelect;

// AI Analysis result schema (for API responses)
export const aiAnalysisSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  calories: z.number(),
  protein: z.number().optional(),
  carbs: z.number().optional(),
  fat: z.number().optional(),
  confidence: z.number().optional(),
});

export type AIAnalysis = z.infer<typeof aiAnalysisSchema>;
