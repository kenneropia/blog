import { Request, Response } from "express";
import { z } from "zod";
import { db } from "../db";
import { createCategorySchema, updateCategorySchema } from "./category.schema";

const createCategory = async (
  req: Request<any, any, z.infer<typeof createCategorySchema>>,
  res: Response
) => {
  const category = await db.category.create({
    data: {
      ...req.body,
    },
    select: {
      _count: true,
      name: true,
      posts: true,
      id: true,
    },
  });

  // Send category to client

  return res.json({ category });
};

// const getACategory = async (req: Request, res: Response) => {
//   const category = await db.category.findFirst({
//     where: { id: req.params.categoryId },
//   });
//   return res.json({ category });
// };

const getAllCategories = async (req: Request, res: Response) => {
  const categories = await db.category.findMany({
    select: {
      _count: true,
      name: true,
      posts: true,
      id: true,
    },
  });

  // const categoriesWithNoOfPost = categories.map((category)=>{
  //   const
  // })
  // Send categorys to client
  return res.json({ categories });
};

const updateCategory = async (
  req: Request<any, any, z.infer<typeof updateCategorySchema>>,
  res: Response
) => {
  const category = await db.category.update({
    select: {
      _count: true,
      posts: true,
      id: true,
      name: true,
    },
    where: {
      id: req.params.categoryId,
    },
    data: {
      ...req.body,
    },
  });

  return res.json({ category });
};

const deleteCategory = async (req: Request, res: Response) => {
  try {
    await db.category.findUniqueOrThrow({
      where: { id: req.params.categoryId },
    });
  } catch (err) {
    return res.status(404).json({ message: "category not found" });
  }

  const category = await db.category.delete({
    where: {
      id: req.params.categoryId,
    },
  });

  return res.json({ category });
};

export { createCategory, updateCategory, deleteCategory, getAllCategories };
