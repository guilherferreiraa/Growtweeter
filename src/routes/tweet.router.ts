import { Router } from "express";
import { TweetController } from "../controllers/tweet.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const tweetRouter = Router();
const tweetController = new TweetController();

tweetRouter.get("/tweet", authMiddleware, (req, res) => tweetController.index(req, res)); 
tweetRouter.get("/tweet/feed", authMiddleware, (req, res) => tweetController.feed(req, res));

tweetRouter.post("/tweet", authMiddleware, (req, res) => tweetController.handle(req, res));
tweetRouter.delete("/tweet/:id", authMiddleware, (req, res) => tweetController.destroy(req, res));
tweetRouter.post("/tweet/:id/reply", authMiddleware, (req, res) => tweetController.reply(req, res));

tweetRouter.post("/like/:id", authMiddleware, (req, res) => tweetController.like(req, res));
tweetRouter.delete("/unlike/:id", authMiddleware, (req, res) => tweetController.unlike(req, res));

export default tweetRouter;