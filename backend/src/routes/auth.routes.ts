import { Router } from "express";
import { validateData } from "../middleware/validator.middleware";
import { SignUpSchema, LoginSchema } from "../validators/auth.validator";
import {
  registerController,
  loginController,
} from "../controllers/auth.controller";

const router = Router();

router.post("/register", validateData(SignUpSchema), registerController);
router.post("/login", validateData(LoginSchema), loginController);

export default router;
