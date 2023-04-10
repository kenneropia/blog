import { z } from "zod";

// Zod schema for creating a new tag
export const createCategorySchema = z.object({
  name: z.string(),
});

// Zod schema for updating an existing tag
export const updateCategorySchema = z.object({
  name: z.string().optional(),
});
