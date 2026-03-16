import { Request, Response } from "express";
import { TweetService } from "../services/tweet-service";

const tweetService = new TweetService();

export class TweetController {
  async handle(req: Request, res: Response) {
    try {
      const { content, parentTweetId } = req.body;
      const userId = (req as any).userId;

      if (!content) return res.status(400).json({ error: "Conteúdo obrigatório." });

      const tweet = await tweetService.create(content, userId, parentTweetId);
      return res.status(201).json(tweet);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
  async feed(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const tweets = await tweetService.findFollowerFeed(userId); 
      return res.status(200).json(tweets);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
  async index(req: Request, res: Response) {
    try {
      const tweets = await tweetService.findAll();
      return res.status(200).json(tweets);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao listar" });
    }
  }

  async like(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const userId = (req as any).userId;
      const result = await tweetService.like(id, userId);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
  async unlike(req: Request, res: Response) {
    try {
      const { id } = req.params; 
      const userId = (req as any).userId;
      const result = await tweetService.unlike(id as string, userId);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
async destroy(req: Request, res: Response) {
  try {
    const id = String(req.params.id);
    const userId = (req as any).userId;
    await tweetService.delete(id, userId); 
    
    return res.status(200).json({ message: "Tweet removido com sucesso!" });
  } catch (error: any) {
    const statusCode = error.message === "Você não tem permissão para excluir este tweet." ? 403 : 400;
    return res.status(statusCode).json({ error: error.message });
  }
}

  async reply(req: Request, res: Response) {
    try {
      const { content } = req.body;
      const id = String(req.params.id);
      const userId = (req as any).userId;

      if (!content) return res.status(400).json({ error: "Conteúdo obrigatório." });

      const reply = await tweetService.create(content, userId, id); 
      return res.status(201).json(reply);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}