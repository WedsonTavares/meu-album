import { Router } from "express";
import {
  createAlbum,
  deleteAlbum,
  getAlbum,
  listAlbums,
  updateAlbum,
} from "../controllers/albumController";
import { addPhotos } from "../controllers/photoController";
import { authMiddleware } from "../middleware/auth";
import { upload } from "../config/upload";

const router = Router();

router.use(authMiddleware);

router.get("/", listAlbums);
router.post("/", createAlbum);
router.get("/:id", getAlbum);
router.put("/:id", updateAlbum);
router.delete("/:id", deleteAlbum);
router.post("/:albumId/photos", upload.array("files", 10), addPhotos);

export default router;
