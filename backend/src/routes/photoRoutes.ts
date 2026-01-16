import { Router } from "express";
import { deletePhoto } from "../controllers/photoController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);
router.delete("/:id", deletePhoto);

export default router;
