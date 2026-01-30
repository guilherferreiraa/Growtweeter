import { Router } from "express";
import { FollowController } from "../controllers/follow.controller";

const followRouter = Router();
const controller = new FollowController();

followRouter.post("/follow", (req, res) => controller.handleFollow(req, res));
followRouter.delete("/unfollow/:id", (req, res) => controller.handleUnfollow(req, res));

export default followRouter;