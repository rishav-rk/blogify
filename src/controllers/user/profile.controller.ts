import { catchAsync } from "../../utils/universalFunctions.js";
import { successResponse } from "../../utils/responses.js";
import { STATUS_CODES, SUCCESS_MESSAGES } from "../../config/appConstants.js";
import { Request, Response } from "express";
import * as profileService from "../../services/user/profile.service.js";

export const getProfile = catchAsync((req: Request, res: Response) => {
  return successResponse(res, STATUS_CODES.SUCCESS, SUCCESS_MESSAGES.SUCCESS, {
    user: req.token?.user,
  });
});

export const updateProfile = catchAsync(async (req: Request, res: Response) => {
  await profileService.updateProfile(req.token!.user!.id, req.body);
  return successResponse(
    res,
    STATUS_CODES.ACTION_COMPLETE,
    SUCCESS_MESSAGES.PROFILE_UPDATED,
  );
});

export const changePassword = catchAsync(
  async (req: Request, res: Response) => {
    await profileService.changePassword(req.token!.user!.id, req.body);
    return successResponse(
      res,
      STATUS_CODES.ACTION_COMPLETE,
      SUCCESS_MESSAGES.PASSWORD_CHANGED,
    );
  },
);

export const deleteAccount = catchAsync(async (req: Request, res: Response) => {
  await profileService.deleteAccount(req.token!.user!.id, req.body);
  return successResponse(
    res,
    STATUS_CODES.ACTION_COMPLETE,
    SUCCESS_MESSAGES.ACCOUNT_DELETED,
  );
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  await profileService.logout(req.token!.id!);
  return successResponse(
    res,
    STATUS_CODES.ACTION_COMPLETE,
    SUCCESS_MESSAGES.LOGGED_OUT,
  );
});
