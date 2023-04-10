import { Router } from "express";
import { validateRequestBody } from "zod-express-middleware";
import isAuth from "../middleware/isAuth";
import {
  createComment,
  deleteComment,
  getAllComments,
  updateComment,
} from "./comment.controller";
import { createCommentSchema, updateCommentSchema } from "./comment.schema";

const commentRouter = Router({ mergeParams: true });

commentRouter.post(
  "/",

  validateRequestBody(createCommentSchema),
  createComment
);

commentRouter.get("/", getAllComments);

commentRouter.get("/admin", isAuth, getAllComments);

commentRouter.patch(
  "/:commentId",
  isAuth,
  validateRequestBody(updateCommentSchema),
  updateComment
);

commentRouter.delete("/:commentId", isAuth, deleteComment);

export default commentRouter;
