import { Router } from "express";
import * as userController from "../../controllers/admin/user.controller.js";

const router = Router();

router.get("/", userController.getAllUsers);
router.post("/enable-disable/:userId", userController.enableDisableUser);

export default router;
