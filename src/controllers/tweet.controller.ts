import { Request, Response } from "express";
import { TweetService } from "../services/tweet-service";

const tweetService = new TweetService();

export class TweetController {

  async handle(req: Request, res: Response) {
    try {
      const { content, userId } = req.body;

      if (!content || !userId) {
        return res.status(400).json({ error: "Conteúdo e ID do usuário são obrigatórios." });
      }

      const tweet = await tweetService.create(content, userId);
      return res.status(201).json(tweet);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async index(req: Request, res: Response) {
    try {
      const tweets = await tweetService.findAll();
      return res.status(200).json(tweets);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao listar tweets" });
    }
  }

  async destroy(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await tweetService.delete(id as string);
      return res.status(200).json({ message: "Tweet removido!" });
    } catch (error: any) {
      return res.status(400).json({ error: "Erro ao deletar" });
    }
  }
  async feed(req: Request, res: Response) {
    try {
      const { userId } = req.params; 
      const tweets = await tweetService.findFollowerFeed(userId as string);
      return res.status(200).json(tweets);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async toggleLike(req: Request, res: Response) {
    try {
      const { tweetId, userId } = req.body;

      if (!tweetId || !userId) {
        return res.status(400).json({ error: "ID do tweet e ID do usuário são obrigatórios." });
      }

      const result = await tweetService.toggleLike(tweetId, userId);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
  // Dentro da classe TweetController

async like(req: Request, res: Response) {
    try {
        const { tweetId, userId } = req.body;
        const result = await tweetService.like(tweetId, userId);
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
}

async unlike(req: Request, res: Response) {
    try {
        const { tweetId, userId } = req.body;
        const result = await tweetService.unlike(tweetId, userId);
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
}
}