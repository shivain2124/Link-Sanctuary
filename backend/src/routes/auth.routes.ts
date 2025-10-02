import { Router } from "express";
import { validateData } from "../middleware/validator.middleware";
import { SignUpSchema, LoginSchema } from "../validators/auth.validator";
import {
  registerController,
  loginController,
} from "../controllers/auth.controller";
import { refreshTokenController } from "../controllers/refresh-token";

const router = Router();

router.post("/register", validateData(SignUpSchema), registerController);
router.post("/login", validateData(LoginSchema), loginController);
router.post("/refresh", refreshTokenController);

export default router;
