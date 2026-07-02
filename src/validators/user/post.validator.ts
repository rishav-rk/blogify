import { z } from "zod";

export const createPostValidator = {
  body: z.object({
    title: z.string(),
    content: z.string().min(1),
  }),
};

export const publishPostValidator = {
  params: z.object({
    postId: z.string(),
  }),
};

export const deletePostValidator = {
  params: z.object({
    postId: z.string(),
  }),
};

export const getMyPostsValidator = {
  query: z.object({
    published: z.boolean().default(true).optional(),
    page: z.number().default(0).optional(),
    limit: z.number().default(10).optional(),
  }),
};

export const getAllPostsValidator = {
  query: z.object({
    page: z.number().default(0).optional(),
    limit: z.number().default(10).optional(),
  }),
};

export const getPostByIdValidator = {
  params: z.object({
    postId: z.string(),
  }),
};
