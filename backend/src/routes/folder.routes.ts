import { Router } from "express";
import { validateData } from "../middleware/validator.middleware";
import { authenticateToken } from "../middleware/jwt.middleware";
import { CreateFolderSchema } from "../validators/folder.validator";
import requireAuthentication from "../middleware/requireAuth.middleware";
import {
  CreateFolderController,
  getRootFolders,
  getChildFolders,
  deleteFolder,
} from "../controllers/folder.controller";

const router = Router();

router.use(authenticateToken);
router.use(requireAuthentication);

router.post("/", validateData(CreateFolderSchema), CreateFolderController);
router.get("/roots", getRootFolders);
router.get("/:folderId/children", getChildFolders);
router.post("/:folderId", deleteFolder);

export default router;
