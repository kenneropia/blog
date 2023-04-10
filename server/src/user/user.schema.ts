import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),

  password: z.string().min(8),
});

const signinSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string().min(8),
});

export const roleEnum = z.enum(["student", "driver", "admin"]);

export { loginSchema, signinSchema };
