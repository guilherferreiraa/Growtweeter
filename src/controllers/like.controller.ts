import { Request, Response } from "express";
import { LikeService } from "../services/like-service";

const service = new LikeService();

export class LikeController {
    async handleLike(req: Request, res: Response) {
        try {
            const { userId, tweetId } = req.body;
            const result = await service.like(userId, tweetId);
            return res.status(201).json(result);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

async handleUnlike(req: Request, res: Response) {
    try {
        const { id } = req.params; 
        const result = await service.unlike(id as string);
        return res.status(200).json({ message: "Descurtido com sucesso" });
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
}
}