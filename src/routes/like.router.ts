import { Router } from "express";
import { LikeController } from "../controllers/like.controller";

const likeRouter = Router();
const controller = new LikeController();

likeRouter.post("/like", (req, res) => controller.handleLike(req, res));
likeRouter.delete("/unlike/:id", (req, res) => controller.handleUnlike(req, res));

export default likeRouter;