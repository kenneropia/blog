import { Request, Response } from "express";
import { z } from "zod";
import { db } from "../db";
import { createPostSchema, updatePostSchema } from "./post.schema";
import { Prisma } from "@prisma/client";

const createPost = async (
  req: Request<any, any, z.infer<typeof createPostSchema>>,
  res: Response
) => {
  const post = await db.post.create({
    data: {
      ...req.body,
      categoryId: req.body.categoryId,
      tags: {
        connect: req.body.tags?.length
          ? req.body.tags.map((id) => ({ id }))
          : [],
      },
    },
  });

  return res.json({ post });
};

const getAPost = async (req: Request, res: Response) => {
  try {
    const post = await db.post.findUniqueOrThrow({
      where: { id: req.params.postId },
      include: {
        category: true,
        comments: true,
        tags: true,
      },
    });
    return res.json({ post });
  } catch (err) {
    return res.status(404).json({ message: "post not found" });
  }
};

const getAllPosts = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const skip = (page - 1) * limit;
  const searchQuery: Prisma.PostFindManyArgs = req.query.search
    ? {
        where: {
          OR: [
            {
              title: {
                contains: req.query.search as string,
              },
            },
            { content: { contains: req.query.search as string } },
          ],
        },
      }
    : {};
  const posts = await db.post.findMany({
    take: limit,
    skip,
    ...searchQuery,
  });

  const totalPage = Math.ceil((await db.post.count({})) / limit);
  // Send posts to client
  res.json({ posts, totalPage });
};

const updatePost = async (
  req: Request<any, any, z.infer<typeof updatePostSchema>>,
  res: Response
) => {
  const post = await db.post.update({
    where: {
      id: req.params.postId,
    },
    data: {
      ...req.body,
      tags: {
        set: req.body.tags?.length ? req.body.tags.map((id) => ({ id })) : [],
      },
    },
  });

  return res.json({ post });
};

const deletePost = async (req: Request, res: Response) => {
  try {
    await db.post.findUniqueOrThrow({
      where: { id: req.params.postId },
    });
  } catch (err) {
    return res.status(404).json({ message: "post not found" });
  }

  const post = await db.post.delete({
    where: {
      id: req.params.postId,
    },
  });

  return res.json({ post });
};

export { createPost, updatePost, deletePost, getAllPosts, getAPost };
