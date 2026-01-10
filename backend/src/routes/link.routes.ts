import { Router } from "express";
import {
  createLink,
  getLinks,
  updateLinks,
  deleteLinks,
  getUserTags,
  toggleFavourite,
  getFavouriteLinks,
  universalSearch,
} from "../controllers/link.controller";
import { LinkSchema } from "../validators/link.validator";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import { validateData } from "../middleware/validator.middleware";

const router = Router();

router.use(clerkMiddleware());
router.use(requireAuth());

router.post("/", validateData(LinkSchema), createLink); //create a link
router.get("/search", universalSearch); // universal search
router.get("/tags", getUserTags); // get all unique tag
router.get("/favourites", getFavouriteLinks); // get all favs
router.patch("/:linkId/favourite", toggleFavourite); // toggle favourite

router.get("/folders/:folderId", getLinks); // get all links inside a folder
router.put("/:linkId", updateLinks);
router.delete("/:linkId", deleteLinks);

export default router;
