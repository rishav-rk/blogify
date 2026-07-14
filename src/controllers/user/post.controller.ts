import * as postServices from "../../services/user/post.service.js";
import { Request, Response } from "express";
import { successResponse } from "../../utils/responses.js";
import { STATUS_CODES, SUCCESS_MESSAGES } from "../../config/appConstants.js";

export const createPost = async (req: Request, res: Response) => {
  const post = await postServices.createPost(req.token!.user!.id, req.body);
  return successResponse(
    res,
    STATUS_CODES.CREATED,
    SUCCESS_MESSAGES.POST_CREATED,
    post,
  );
};

export const updatePost = async (req: Request, res: Response) => {
  await postServices.updatePost(req.params as { postId: string }, req.body);
  return successResponse(
    res,
    STATUS_CODES.ACTION_COMPLETE,
    SUCCESS_MESSAGES.SUCCESS,
  );
};

export const publishPost = async (req: Request, res: Response) => {
  await postServices.publishPost(req.params as { postId: string }, req.token);
  return successResponse(
    res,
    STATUS_CODES.ACTION_COMPLETE,
    SUCCESS_MESSAGES.SUCCESS,
  );
};

export const unpublishPost = async (req: Request, res: Response) => {
  await postServices.unpublishPost(req.params as { postId: string }, req.token);
  return successResponse(
    res,
    STATUS_CODES.ACTION_COMPLETE,
    SUCCESS_MESSAGES.SUCCESS,
  );
};

export const getMyPublishedPosts = async (req: Request, res: Response) => {
  console.log('my pubish controller')
  const results = await postServices.getMyPublishedPosts(
    req.token!.user!.id,
    Number(req.query.page),
    Number(req.query.limit),
  );
  return successResponse(
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    results,
  );
};

export const getMyUnpublishedPosts = async (req: Request, res: Response) => {
  const results = await postServices.getMyUnpublishedPosts(
    req.token!.user!.id,
    Number(req.query.page),
    Number(req.query.limit),
  );
  return successResponse(
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    results,
  );
};

export const deletePost = async (req: Request, res: Response) => {
  await postServices.deletePost(req.params as { postId: string }, req.token);
  return successResponse(
    res,
    STATUS_CODES.ACTION_COMPLETE,
    SUCCESS_MESSAGES.SUCCESS,
  );
};

export const getAllPublishedPosts = async (req: Request, res: Response) => {
  const results = await postServices.getAllPublishedPosts(
    req.query.search as string,
    req.query.category as string,
    Number(req.query.page),
    Number(req.query.limit),
  );
  return successResponse(
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    results,
  );
};

export const getPublishedPostBySlug = async (req: Request, res: Response) => {
  const post = await postServices.getPostBySlug({
    slug: req.params.slug as string,
  });
  return successResponse(
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    {post},
  );
};
