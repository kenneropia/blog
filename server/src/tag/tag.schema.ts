import { z } from "zod";

// Zod schema for creating a new tag
export const createTagSchema = z.object({
  name: z.string(),
});

// Zod schema for updating an existing tag
export const updateTagSchema = z.object({
  name: z.string(),
});
