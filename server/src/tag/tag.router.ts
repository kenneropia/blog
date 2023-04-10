import { Router } from "express";
import { validateRequestBody } from "zod-express-middleware";
import isAuth from "../middleware/isAuth";
import { createTag, deleteTag, getAllTags, updateTag } from "./tag.controller";
import { createTagSchema, updateTagSchema } from "./tag.schema";

const tagRouter = Router();

tagRouter.post("/", isAuth, validateRequestBody(createTagSchema), createTag);

tagRouter.get("/", isAuth, getAllTags);

tagRouter.patch(
  "/:tagId",
  isAuth,
  validateRequestBody(updateTagSchema),
  updateTag
);

tagRouter.delete("/:tagId", isAuth, deleteTag);

export default tagRouter;
