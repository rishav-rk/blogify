import { USER_TYPE } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import * as postController from "../../controllers/user/post.controller.js";
import {
  createPostValidator,
  updatePostValidator,
  getPostIdValidator,
  getMyPostsValidator,
  getPublishedPostBySlugValidator,
  getPostValidator, 

} from "../../validators/user/post.validator.js";


const router = Router();

router.post(
  "/create",
  auth([USER_TYPE.user]),
  validate(createPostValidator),
  postController.createPost,
);

router.get(
  "/",
  auth([USER_TYPE.user, USER_TYPE.none]),
  validate(getPostValidator),
  postController.getAllPublishedPosts,
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
  validate(getPostIdValidator),
  postController.publishPost,
);

router.patch(
  "/:postId/unpublish",
  auth([USER_TYPE.user, USER_TYPE.admin]),
  validate(getPostIdValidator),
  postController.unpublishPost,
);

router.get(
  "/myPublishedPosts",
  async (req, res, next) =>{
    console.log("this is my publish route")
    next();
  },
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

router.get(
  "/:slug",
  auth([USER_TYPE.user, USER_TYPE.none]),
  validate(getPublishedPostBySlugValidator),
  postController.getPublishedPostBySlug,
);

router.delete(
  "/:postId",
  auth([USER_TYPE.user]),
  validate(getPostIdValidator),
  postController.deletePost,
);

export default router;
