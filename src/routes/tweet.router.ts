import { Router } from "express";
import { TweetController } from "../controllers/tweet.controller";
import { prisma } from "../database/prisma.database";
 
const tweetRouter = Router();
const tweetController = new TweetController();

tweetRouter.get("/tweet", tweetController.index); 
tweetRouter.get("/tweet/feed", (req, res) => tweetController.feed(req, res));

// --- Ações de Tweet 
tweetRouter.post("/tweet", (req, res) => tweetController.handle(req, res));
tweetRouter.delete("/tweet/:id", (req, res) => tweetController.destroy(req, res));

// --- Likes ---
tweetRouter.post("/tweet/like", (req, res) => tweetController.like(req, res));
tweetRouter.post("/tweet/unlike", (req, res) => tweetController.unlike(req, res));

// --- Comments ---
tweetRouter.post("/comment", async (req, res) => {
  const { content, userId, tweetId } = req.body;

  try {
    const newComment = await prisma.comment.create({
      data: { content, userId, tweetId }
    });
    return res.status(201).json(newComment);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar comentário" });
  }
});

export default tweetRouter;