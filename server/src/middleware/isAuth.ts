import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db } from "../db";

const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "UNAUTHORIZED" });
  }
  const token = req.headers.authorization.split(" ")[1];

  const payload = jwt.verify(token, "thisShouldBeMovedToDotEnvLater") as {
    id: string;
  };
  const user = await db.user.findUnique({
    where: { id: payload.id },
    select: {
      password: false,
      email: true,
      name: true,
      id: true,
      createdAt: true,
      updatedAt: true,
      role: true,
    },
  });
  if (!user) {
    return res.status(404).json({
      code: "NOT_FOUND",
      message: "This user doesn't exist",
    });
  }

  req.user = user;
  next();
};

export default isAuth;
