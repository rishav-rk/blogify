import { Request, Response } from "express";
import { successResponse } from "../../utils/responses.js";
import { STATUS_CODES, SUCCESS_MESSAGES } from "../../config/appConstants.js";
import * as userService from "../../services/admin/user.service.js"

export const getAllUsers = async (req: Request, res: Response) => {
  return successResponse(
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    await userService.getAllUsers(),
  );
};

export const enableDisableUser = async (req: Request, res: Response) => {
  return successResponse(
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    await userService.enableDisableUser(Number(req.params.userId)),
  );
};
