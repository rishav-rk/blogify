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

export const getPostIdValidator = {
  params: z.object({
    postId: ZOD.RECORD_ID
  }).strict(),
};

export const getMyPostsValidator = {
  query: z.object({
    page: z.coerce.number().min(0).default(0).optional(),
    limit: z.coerce.number().min(0).default(10).optional(),
  }).strict(),
};
