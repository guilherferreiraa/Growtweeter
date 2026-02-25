import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const userRouter = Router();
const userCtrl = new UserController();

userRouter.get("/user", authMiddleware, userCtrl.index); 
userRouter.get("/user/:id", authMiddleware, userCtrl.show); 
userRouter.post("/user", userCtrl.store); 
userRouter.post("/login", userCtrl.login);
userRouter.post("/logout/:id", authMiddleware, userCtrl.logout);

userRouter.delete("/user/:id", authMiddleware, userCtrl.destroy);

export default userRouter;