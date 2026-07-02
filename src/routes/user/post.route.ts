import { USER_TYPE } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import * as postController from "../../controllers/user/post.controller.js"

const router = Router();

router.get(
  "/",
  auth([USER_TYPE.user, USER_TYPE.admin]),
  validate({}),
  postController.createPost,
);

export default router;
