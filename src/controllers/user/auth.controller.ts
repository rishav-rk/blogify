import * as authService from "../../services/user/auth.service.js";
import { Request, Response } from "express";
import { successResponse } from "../../utils/responses.js";
import { STATUS_CODES, SUCCESS_MESSAGES } from "../../config/appConstants.js";
import { catchAsync } from "../../utils/universalFunctions.js";

export const register = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.register(req.body);
  return successResponse(
    res,
    STATUS_CODES.CREATED,
    SUCCESS_MESSAGES.USER_REGISTERED,
    user,
  );
})

export const login = catchAsync(async (req: Request, res: Response) => {
  const data = await authService.login(req.body);
  return successResponse(
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.USER_LOGGED_IN,
    data,
  );
})
