import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { FollowController } from "../controllers/follow.controller";

const userRouter = Router();
const userCtrl = new UserController();
const followCtrl = new FollowController();

userRouter.get("/user", userCtrl.index); 
userRouter.post("/user", userCtrl.store); 
userRouter.post("/login", userCtrl.login);
userRouter.post("/logout/:id", (req, res) => userCtrl.logout(req, res));

userRouter.delete("/user/:id", (req, res) => userCtrl.destroy(req, res));
userRouter.post("/follow", (req, res) => followCtrl.handleFollow(req, res));
userRouter.delete("/unfollow/:id", (req, res) => followCtrl.handleUnfollow(req, res)); 

export default userRouter;