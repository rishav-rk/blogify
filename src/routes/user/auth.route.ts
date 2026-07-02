import { Router } from "express";
import * as authController from "../../controllers/user/auth.controller.js";
import { validate } from "../../middlewares/validate.js";
import {
  signUpValidator,
  loginValidator,
} from "../../validators/user/auth.validator.js";

const router = Router();

router.post("/register", validate(signUpValidator), authController.register);
router.post("/login", validate(loginValidator), authController.login);

export default router;
