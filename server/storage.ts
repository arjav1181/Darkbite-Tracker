import { type FoodEntry, type InsertFoodEntry } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getFoodEntries(): Promise<FoodEntry[]>;
  getFoodEntry(id: string): Promise<FoodEntry | undefined>;
  createFoodEntry(entry: InsertFoodEntry): Promise<FoodEntry>;
  deleteFoodEntry(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private foodEntries: Map<string, FoodEntry>;

  constructor() {
    this.foodEntries = new Map();
  }

  async getFoodEntries(): Promise<FoodEntry[]> {
    return Array.from(this.foodEntries.values());
  }

  async getFoodEntry(id: string): Promise<FoodEntry | undefined> {
    return this.foodEntries.get(id);
  }

  async createFoodEntry(insertEntry: InsertFoodEntry): Promise<FoodEntry> {
    const id = randomUUID();
    const entry: FoodEntry = {
      id,
      name: insertEntry.name,
      description: insertEntry.description ?? null,
      calories: insertEntry.calories,
      protein: insertEntry.protein ?? null,
      carbs: insertEntry.carbs ?? null,
      fat: insertEntry.fat ?? null,
      imageUrl: insertEntry.imageUrl ?? null,
      entryType: insertEntry.entryType,
      mealType: insertEntry.mealType ?? null,
      timestamp: new Date(),
    };
    this.foodEntries.set(id, entry);
    return entry;
  }

  async deleteFoodEntry(id: string): Promise<boolean> {
    return this.foodEntries.delete(id);
  }
}

export const storage = new MemStorage();
