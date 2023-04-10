import { z } from "zod";

// Zod schema for creating a new tag
export const createCommentSchema = z.object({
  name: z.string().min(3),
  content: z.string().min(3),
});

// Zod schema for updating an existing tag
export const updateCommentSchema = z.object({
  approved: z.boolean(),
});
