import { catchAsync } from "../../utils/universalFunctions.js";
import { successResponse } from "../../utils/responses.js";
import { STATUS_CODES, SUCCESS_MESSAGES } from "../../config/appConstants.js";
import { Request, Response } from "express";

export const getProfile = catchAsync((req: Request, res: Response) => {
  console.log("in get profile");
  return successResponse(res, STATUS_CODES.SUCCESS, SUCCESS_MESSAGES.SUCCESS, {
    user: req.token?.user,
  });
});

export const updateProfile = catchAsync((req: Request, res: Response) => {
    
});