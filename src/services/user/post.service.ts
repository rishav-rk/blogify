import slugify from "slugify";
import prisma from "../../config/db.js";
import { Prisma, TOKEN_TYPE, USER_TYPE } from "@prisma/client";
import { OperationalError } from "../../utils/errors.js";
import { ERROR_MESSAGES, STATUS_CODES } from "../../config/appConstants.js";
import {
  createPostValidator,
  updatePostValidator,
  getPostIdValidator,
} from "../../validators/user/post.validator.js";
import { z } from "zod";

type createPostInput = z.infer<typeof createPostValidator.body>;
type publishUnpublishPost = z.infer<typeof getPostIdValidator.params>;
type upatePostInput = z.infer<typeof updatePostValidator.body>;
type getPostById = z.infer<typeof getPostIdValidator.params>;

interface TokenPayload {
  user?: object;
  userId?: string | null;
  type?: TOKEN_TYPE;
  role?: USER_TYPE;
  admin?: object;
  adminId?: string | null;
}

export const createPost = async (userId: string, postData: createPostInput) => {
  const slug = slugify(postData.title, {
    replacement: "-",
    lower: true,
    strict: true,
  });
  await prisma.post.create({
    data: {
      title: postData.title,
      content: postData.content,
      slug,
      author: userId,
    },
  });
};

export const updatePost = async (
  param: publishUnpublishPost,
  postData: upatePostInput,
) => {
  await prisma.post.update({
    where: {
      id: param.postId,
      isDeleted: false,
    },
    data: {
      title: postData.title,
      content: postData.content,
    },
  });
};

export const publishPost = async (
  param: publishUnpublishPost,
  token?: TokenPayload,
) => {
  const filter: {
    id: string;
    isDeleted: boolean;
    author?: string;
    isPublished: boolean;
  } = {
    id: param.postId,
    isDeleted: false,
    isPublished: false,
  };

  const result = await prisma.post.findFirst({
    where: filter,
  });

  if (!result) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.POST_NOT_FOUND,
    );
  } else {
    if (result.isUnpublishedbyAdmin && token?.user && token.userId) {
      throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.POST_UNPUBLISHED_BY_ADMIN,
      );
    }
    if (token && token.userId !== result.author) {
      throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.OTHERS_POST,
      );
    }
  }

  await prisma.post.updateMany({
    where: filter,
    data: {
      isPublished: true,
    },
  });
};

export const unpublishPost = async (
  param: publishUnpublishPost,
  token?: TokenPayload,
) => {
  const filter: {
    id: string;
    isDeleted: boolean;
    author?: string;
    isPublished: boolean;
  } = {
    id: param.postId,
    isDeleted: false,
    isPublished: true,
  };

  const result = await prisma.post.findFirst({
    where: filter,
  });

  console.log("Update result object: ", result);

  if (!result) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.POST_NOT_FOUND,
    );
  } else {
    if (token && token.userId !== result.author) {
      throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.OTHERS_POST,
      );
    }
  }

  await prisma.post.updateMany({
    where: filter,
    data: {
      isPublished: false,
      isUnpublishedbyAdmin: token?.admin ? true : false,
    },
  });
};

export const getMyPublishedPosts = async (
  userId: string,
  page: number,
  limit: number,
) => {

  console.log('my publish service')
  const filter = {
    author: userId,
    isDeleted: false,
    isPublished: true,
  };

  const posts = await prisma.post.findMany({
    where: filter,
    skip: page * limit,
    take: limit,
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      description: true,
      thumbnail: true,
      slug: true,
      updatedAt: true,
      authorRelation: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });
  const totalPosts = await prisma.post.count({
    where: filter,
  });
  return {
    posts,
    totalPosts,
    pageSize: limit,
    currentPage: page,
  };
};

export const getMyUnpublishedPosts = async (
  userId: string,
  page: number,
  limit: number,
) => {
  console.log('my unpublished service')
  const filter = {
    author: userId,
    isDeleted: false,
    isPublished: false,
  };
  const posts = await prisma.post.findMany({
    where: filter,
    skip: page * limit,
    take: limit,
    select: {
      id: true,
      title: true,
      content: true,
      slug: true,
      createdAt: true,
      description: true,
      thumbnail: true,
      updatedAt: true,
      authorRelation: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });
  const totalPosts = await prisma.post.count({
    where: filter,
  });
  return {
    posts,
    totalPosts,
    pageSize: limit,
    currentPage: page,
  };
};

export const getPostById = async (param: getPostById) => {
  const post = await prisma.post.findFirst({
    where: {
      id: param.postId,
      isDeleted: false,
    },
  });

  if (!post) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.POST_NOT_FOUND,
    );
  }

  return post;
};

export const getPostBySlug = async (param: { slug: string }) => {
  const post = await prisma.post.findFirst({
    where: {
      slug: param.slug,
      isDeleted: false,
    },
    include: {
      authorRelation: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  if (!post) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.POST_NOT_FOUND,
    );
  }

  return post;
};

export const deletePost = async (param: getPostById, token?: TokenPayload) => {
  const filter: {
    id: string;
    isDeleted: boolean;
    author?: string;
  } = {
    id: param.postId,
    isDeleted: false,
  };

  const result = await prisma.post.findFirst({
    where: filter,
  });

  if (!result) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.POST_NOT_FOUND,
    );
  } else {
    if (token && token.userId !== result.author) {
      throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.OTHERS_POST,
      );
    }
  }

  await prisma.post.updateMany({
    where: filter,
    data: {
      isDeleted: true,
    },
  });
};

export const getAllPublishedPosts = async (
  search: string,
  category: string,
  page: number,
  limit: number,
) => {
  const filter: Prisma.PostWhereInput = {
    isDeleted: false,
    isPublished: true,
  };

  // Add category filter if provided
  if (category && category !== 'all') {
    filter.category = category;
  }

  // Add search filter if provided (search in title and content)
  if (search) {
    filter.OR = [
      { title: { contains: search } },
      { content: { contains: search } },
    ];
  }

  console.log("Filter =====> ", filter);

  const posts = await prisma.post.findMany({
    where: filter,

    skip: page * limit,
    take: limit,
    select: {
      id: true,
      title: true,
      content: true,
      slug: true,
      createdAt: true,
      description: true,
      thumbnail: true,
      updatedAt: true,
      category: true,
      authorRelation: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });
  const totalPosts = await prisma.post.count({
    where: filter,
  });
  return {
    posts,
    totalPosts,
    pageSize: limit,
    currentPage: page,
  };
};
