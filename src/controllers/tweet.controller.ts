import { Request, Response } from "express";
import { TweetService } from "../services/tweet-service";

const tweetService = new TweetService();

export class TweetController {
  async handle(req: Request, res: Response) {
    try {
      const { content, parentTweetId } = req.body;
      const userId = (req as any).userId;
      if (!content)
        return res.status(400).json({ error: "Conteúdo obrigatório." });
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

    // console.log("--- DEBUG UNLIKE ---");
    // console.log("ID do Tweet recebido:", id);
    // console.log("ID do Usuário no Token:", userId);

    const result = await tweetService.unlike(id as string, userId);
    return res.status(200).json(result);
  } catch (error: any) {
    console.log("Erro no Service:", error.message);
    return res.status(400).json({ error: error.message });
  }
}

  async destroy(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      await tweetService.delete(id);
      return res.status(200).json({ message: "Removido!" });
    } catch (error: any) {
      return res.status(400).json({ error: "Erro ao deletar" });
    }
  }

  async reply(req: Request, res: Response) {
    try {
      const { content } = req.body;
      const id = String(req.params.id);
      const userId = (req as any).userId;
      if (!content)
        return res.status(400).json({ error: "Conteúdo obrigatório." });
      const reply = await tweetService.create(content, userId, id);
      return res.status(201).json(reply);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
