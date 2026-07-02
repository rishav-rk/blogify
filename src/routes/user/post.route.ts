import { USER_TYPE } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import * as postController from "../../controllers/user/post.controller.js";
import {
  getMyPostsValidator,
  publishUnpublishPostValidator,
  getPostByIdValidator,
  createPostValidator,
  updatePostValidator
} from "../../validators/user/post.validator.js";

const router = Router();

router.get(
  "/create",
  auth([USER_TYPE.user]),
  validate(createPostValidator),
  postController.createPost,
);

router.put(
  "/:postId",
  auth([USER_TYPE.user]),
  validate(updatePostValidator),
  postController.updatePost,
);

router.patch(
  "/:postId/publish",
  auth([USER_TYPE.user]),
  validate(publishUnpublishPostValidator),
  postController.publishPost,
);

router.patch(
  "/:postId/unpublish",
  auth([USER_TYPE.user, USER_TYPE.admin]),
  validate(publishUnpublishPostValidator),
  postController.unpublishPost,
);

router.get(
  "/myPublishedPosts",
  auth([USER_TYPE.user]),
  validate(getMyPostsValidator),
  postController.getMyPublishedPosts,
);

router.get(
  "/myUnpublisedPosts",
  auth([USER_TYPE.user]),
  validate(getMyPostsValidator),
  postController.getMyUnpublishedPosts,
);

export default router;
