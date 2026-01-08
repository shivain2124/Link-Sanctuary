import { Router } from "express";
import { validateData } from "../middleware/validator.middleware";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import { CreateFolderSchema } from "../validators/folder.validator";
import {
  CreateFolderController,
  getRootFolders,
  getChildFolders,
  deleteFolder,
} from "../controllers/folder.controller";

const router = Router();

router.use(clerkMiddleware());
router.use(requireAuth());

router.post("/", validateData(CreateFolderSchema), CreateFolderController);
router.get("/root", getRootFolders);
router.get("/:folderId/children", getChildFolders);
router.delete("/:folderId", deleteFolder);

export default router;
