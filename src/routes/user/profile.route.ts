import { Router } from "express";
import auth from "../../middlewares/auth.js";
import {
  STATUS_CODES,
  SUCCESS_MESSAGES,
  USER_TYPE,
} from "../../config/appConstants.js";
import { validate } from "../../middlewares/validate.js";
import { getProfile } from "../../controllers/user/profile.controller.js";

const router = Router();

router.get(
  "/",
  auth([USER_TYPE.USER]),
  validate({}),
  getProfile
);  

router.put("/", auth([USER_TYPE.USER]), validate({}), (req, res) => {
  console.log("in update profile");
  return res.status(200).json({
    status: "success",
    message: "Profile updated successfully",
  });
});

export default router;
