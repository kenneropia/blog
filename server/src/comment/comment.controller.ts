import { Request, Response } from "express";
import { z } from "zod";
import { db } from "../db";
import { createCommentSchema, updateCommentSchema } from "./comment.schema";

const createComment = async (
  req: Request<any, any, z.infer<typeof createCommentSchema>>,
  res: Response
) => {
  const comment = await db.comment.create({
    data: {
      ...req.body,
      postId: req.params.postId,
    },
  });

  return res.json({ comment });
};

// const getAComment = async (req: Request, res: Response) => {
//   const comment = await db.comment.findFirst({
//     where: { id: req.params.commentId },
//   });
//   return res.json({ comment });
// };

const getAllComments = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const skip = (page - 1) * limit;
  const approvedQuery = req?.user?.role !== "admin" ? { approved: true } : {};
  const comments = await db.comment.findMany({
    where: {
      postId: req.params.postId,
      ...approvedQuery,
    },
    skip,
    take: limit,
  });

  // Send comments to client
  res.json({ comments });
};

const updateComment = async (
  req: Request<any, any, z.infer<typeof updateCommentSchema>>,
  res: Response
) => {
  const comment = await db.comment.update({
    where: {
      id: req.params.commentId,
    },
    data: {
      ...req.body,
    },
  });

  return res.json({ comment });
};

const deleteComment = async (req: Request, res: Response) => {
  try {
    await db.comment.findFirstOrThrow({
      where: { id: req.params.commentId },
    });
  } catch (err) {
    return res.status(404).json({ message: "comment not found" });
  }

  const comment = await db.comment.delete({
    where: {
      id: req.params.commentId,
    },
  });

  return res.json({ comment });
};

export { createComment, updateComment, deleteComment, getAllComments };
