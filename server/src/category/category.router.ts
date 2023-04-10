import { Router } from "express";
import { validateRequestBody } from "zod-express-middleware";
import isAuth from "../middleware/isAuth";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "./category.controller";
import { createCategorySchema, updateCategorySchema } from "./category.schema";

const categoryRouter = Router();

categoryRouter.post(
  "/",
  isAuth,
  validateRequestBody(createCategorySchema),
  createCategory
);

categoryRouter.get("/", isAuth, getAllCategories);

categoryRouter.patch(
  "/:categoryId",
  isAuth,
  validateRequestBody(updateCategorySchema),
  updateCategory
);

categoryRouter.delete("/:categoryId", isAuth, deleteCategory);

export default categoryRouter;
