import { Router } from "express";
import { LikeController } from "../controllers/like.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const likeRouter = Router();
const controller = new LikeController();

likeRouter.post("/like", authMiddleware, (req, res) => controller.handleLike(req, res));
likeRouter.delete("/like/:id", authMiddleware, (req, res) => controller.handleUnlike(req, res));

export default likeRouter;