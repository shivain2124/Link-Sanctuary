import { Router } from "express";
import { validateData } from "../middleware/validator.middleware";
import { authenticateToken } from "../middleware/jwt.middleware";
import { CreateFolderSchema } from "../validators/folder.validator";
import { CreateFolderController } from "../controllers/folder.controller";

const router = Router();

router.post(
  "/",
  authenticateToken,
  validateData(CreateFolderSchema),
  CreateFolderController
);
