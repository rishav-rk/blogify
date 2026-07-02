import { z } from "zod";
import { ZOD } from "../../config/appConstants.js";

export const createPostValidator = {
  body: z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
  }).strict(),
};

export const updatePostValidator = {
  body: z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
  }).strict(),
};

export const publishUnpublishPostValidator = {
  params: z.object({
    postId: ZOD.RECORD_ID,
  }).strict(),
};

export const deletePostValidator = {
  params: z.object({
    postId: ZOD.RECORD_ID,
  }).strict(),
};

export const getMyPostsValidator = {
  query: z.object({
    page: z.coerce.number().min(0).default(0).optional().transform(val=>Number(val)),
    limit: z.coerce.number().min(0).default(10).optional().transform(val=>Number(val)),
  }).strict(),
};

export const getPostByIdValidator = {
  params: z.object({
    postId: ZOD.RECORD_ID,
  }).strict(),
};
