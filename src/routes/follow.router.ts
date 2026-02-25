import { Router } from "express";
import { FollowController } from "../controllers/follow.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const followRouter = Router();
const controller = new FollowController();

followRouter.post("/follow", authMiddleware, (req, res) => controller.handleFollow(req, res));
followRouter.delete("/unfollow/:id", authMiddleware, (req, res) => controller.handleUnfollow(req, res));

export default followRouter;