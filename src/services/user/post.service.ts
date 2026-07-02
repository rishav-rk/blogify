import slugify from "slugify";
import prisma from "../../config/db.js";
import { Prisma } from "@prisma/client";
import { OperationalError } from "../../utils/errors.js";
import { ERROR_MESSAGES, STATUS_CODES } from "../../config/appConstants.js";

export const createPost = async (
  userId: string,
  title: Prisma.PostCreateInput["title"],
  content: string | null,
) => {
  const slug: Prisma.PostCreateInput["slug"] = slugify(title, {
    replacement: "-",
    lower: true,
    strict: true,
  });
  await prisma.post.create({
    data: {
      title,
      content,
      slug,
      author: userId,
    },
  });
};

export const publishPost = async (postId: string) => {
  const result = await prisma.post.updateMany({
    where: {
      id: postId,
    },
    data: {
      published: true,
    },
  });

  console.log("Update result object: ", result);

  if (result.count === 0) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.POST_NOT_FOUND,
    );
  }
};

export const getMyPosts = async (
  userId: string,
  published: boolean,
  page: number,
  limit: number,
) => {
  const posts = await prisma.post.findMany({
    where: {
      author: userId,
      published: published,
      isDeleted: false,
    },
    skip: page * limit,
    take: limit,
  });
  return posts;
};

