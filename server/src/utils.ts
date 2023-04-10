import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { roleEnum } from "./user/user.schema";
import { Request, Response, NextFunction } from "express";
import { z } from "zod";
export const isCorrect = async (passwordHash: string, rawPassword: string) =>
  await bcrypt.compare(rawPassword, passwordHash);

export const createToken = (user: { email: string; id: string }) => {
  return jwt.sign(user, "thisShouldBeMovedToDotEnvLater", {
    expiresIn: 60 * 60 * 24 * 20,
  });
};

export const roleChecker =
  (roles: z.infer<typeof roleEnum>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    if (roles.includes(req.user.role)) return next();
    return res
      .status(403)
      .json({ status: "error", message: "unauthorized acess" });
  };
