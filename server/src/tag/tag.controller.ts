import { Request, Response } from "express";
import { z } from "zod";
import { db } from "../db";
import { createTagSchema, updateTagSchema } from "./tag.schema";

const createTag = async (
  req: Request<any, any, z.infer<typeof createTagSchema>>,
  res: Response
) => {
  const tag = await db.tag.create({
    data: {
      ...req.body,
    },
  });

  return res.json({ tag });
};

// const getATag = async (req: Request, res: Response) => {
//   const tag = await db.tag.findFirst({
//     where: { id: req.params.tagId },
//   });
//   return res.json({ tag });
// };

const getAllTags = async (req: Request, res: Response) => {
  const tags = await db.tag.findMany();

  // Send tags to client
  res.json({ tags });
};

const updateTag = async (
  req: Request<any, any, z.infer<typeof updateTagSchema>>,
  res: Response
) => {
  const tag = await db.tag.update({
    where: {
      id: req.params.tagId,
    },
    data: {
      ...req.body,
    },
  });

  return res.json({ tag });
};

const deleteTag = async (req: Request, res: Response) => {
  try {
    await db.tag.findUniqueOrThrow({
      where: { id: req.params.tagId },
    });
  } catch (err) {
    return res.status(404).json({ message: "tag not found" });
  }

  const tag = await db.tag.delete({
    where: {
      id: req.params.tagId,
    },
  });

  return res.json({ tag });
};

export { createTag, updateTag, deleteTag, getAllTags };
