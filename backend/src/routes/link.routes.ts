import { Router } from "express";
import {
  createLink,
  getLinks,
  updateLinks,
  deleteLinks,
  searchLinksByTags,
  getUserTags,
  toggleFavourite,
  getFavouriteLinks,
} from "../controllers/link.controller";
import { LinkSchema } from "../validators/link.validator";
import { authenticateToken } from "../middleware/jwt.middleware";
import requireAuthentication from "../middleware/requireAuth.middleware";
import { validateData } from "../middleware/validator.middleware";

const router = Router();

router.use(authenticateToken);
router.use(requireAuthentication);

router.post("/", validateData(LinkSchema), createLink); //create a link
router.delete("/:linkId", deleteLinks);
router.put("/:linkId", updateLinks);
router.patch("/:linkId/favourite", toggleFavourite); // mark/unmark fav
router.get("/folders/:folderId", getLinks); // get all links inside a folder
router.get("/search", searchLinksByTags); //tag filter
router.get("/tags", getUserTags); // get all unique tag
router.get("/favourites", getFavouriteLinks); // get all favs

export default router;
