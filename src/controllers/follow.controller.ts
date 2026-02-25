import { Request, Response } from "express";
import { FollowService } from "../services/follow-service";

const service = new FollowService();

export class FollowController {
  async handleFollow(req: Request, res: Response) {
    try {
      const { followingId } = req.body;
      const followerId = (req as any).userId;

      const result = await service.follow(followerId, followingId);
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async handleUnfollow(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const followerId = (req as any).userId;

      if (!id) {
        return res.status(400).json({ error: "ID é obrigatório" });
      }

      await service.unfollow(followerId, id as string);

      return res.status(200).json({ message: "Deixou de seguir com sucesso!" });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
