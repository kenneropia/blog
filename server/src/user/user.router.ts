import { Request, Response, Router } from "express";
import { validateRequestBody } from "zod-express-middleware";
import isAuth from "../middleware/isAuth";
import { login, signup, profile } from "./user.controller";
import { loginSchema, signinSchema } from "./user.schema";

const userRouter = Router();

userRouter.post("/auth/login", validateRequestBody(loginSchema), login);
userRouter.post("/auth/signup", validateRequestBody(signinSchema), signup);
userRouter.get("/auth/me", isAuth, profile);

export default userRouter;
