import { Router } from "express";
import {
  createLink,
  getLinks,
  updateLinks,
  deleteLinks,
} from "../controllers/link.controller";
import { LinkSchema } from "../validators/link.validator";
import { authenticateToken } from "../middleware/jwt.middleware";
import requireAuthentication from "../middleware/requireAuth.middleware";
import { validateData } from "../middleware/validator.middleware";

const router = Router();

router.use(authenticateToken);
router.use(requireAuthentication);

router.post("/", validateData(LinkSchema), createLink);
router.get("/folder/:folderId", getLinks);
router.delete("/:linkId", deleteLinks);
router.put("/:linkId", updateLinks);

export default router;
