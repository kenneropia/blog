import { Router } from "express";
import { validateRequestBody } from "zod-express-middleware";
import isAuth from "../middleware/isAuth";
import {
  createPost,
  deletePost,
  getAllPosts,
  getAPost,
  updatePost,
} from "./post.controller";
import { createPostSchema, updatePostSchema } from "./post.schema";
import commentRouter from "../comment/comment.router";

const postRouter = Router();

postRouter.use("/:postId/comments", commentRouter);

postRouter.post("/", isAuth, validateRequestBody(createPostSchema), createPost);

postRouter.get("/", getAllPosts);

postRouter.get("/:postId", getAPost);
postRouter.patch(
  "/:postId",
  isAuth,
  validateRequestBody(updatePostSchema),
  updatePost
);

postRouter.delete("/:postId", isAuth, deletePost);

export default postRouter;
