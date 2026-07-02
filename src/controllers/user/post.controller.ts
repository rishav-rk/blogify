import z from "zod";
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
