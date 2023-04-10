import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string(),
  content: z.string(),
  categoryId: z.string().uuid(),
  tags: z.array(z.string().uuid()),
});

// Zod schema for updating an existing post
export const updatePostSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  tags: z.array(z.string().uuid()).optional(),
});

// Zod schema for creating a new category
export const createCategorySchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
});

// Zod schema for updating an existing category
export const updateCategorySchema = z.object({
  name: z.string().min(3).optional(),
  slug: z.string().min(3).optional(),
});

// Zod schema for creating a new tag
export const createTagSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
});

// Zod schema for updating an existing tag
export const updateTagSchema = z.object({
  name: z.string().min(3).optional(),
  slug: z.string().min(3).optional(),
});
