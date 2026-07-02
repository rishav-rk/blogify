import prisma from "../../config/db.js";
import { OperationalError } from "../../utils/errors.js";
import { ERROR_MESSAGES, STATUS_CODES } from "../../config/appConstants.js";

export const getAllPosts = async (page: number, limit: number) => {
  return await prisma.post.findMany({
    where: {
      isDeleted: false,
    },
    skip: page * limit,
    take: limit,
  });
};

export const getPostById = async (postId: string) => {
  const post = await prisma.post.findFirst({
    where: {
      id: postId,
      published: true,
      isDeleted: false,
    },
  });
  if (!post) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.POST_NOT_FOUND
    );
  }
  return post;
};
