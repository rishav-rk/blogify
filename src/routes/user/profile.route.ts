import { Router } from "express";
import auth from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import {
  changePassword,
  deleteAccount,
  getProfile,
  updateProfile,
  logout,
} from "../../controllers/user/profile.controller.js";
import {
  changePasswordValidator,
  deleteAccountValidator,
  updateProfileValidator,
} from "../../validators/user/auth.validator.js";
import { noBodyValidator } from "../../validators/common.validator.js";
import { USER_TYPE } from "@prisma/client";

const router = Router();

router.get("/", auth([USER_TYPE.user]), validate(noBodyValidator), getProfile);

router.put(
  "/",
  auth([USER_TYPE.user]),
  validate(updateProfileValidator),
  updateProfile,
);

router.post(
  "/change-password",
  auth([USER_TYPE.user]),
  validate(changePasswordValidator),
  changePassword,
);

router.delete(
  "/delete-account",
  auth([USER_TYPE.user]),
  validate(deleteAccountValidator),
  deleteAccount,
);

router.delete(
  "/logout",
  auth([USER_TYPE.user]),
  validate(noBodyValidator),
  logout,
);

export default router;
