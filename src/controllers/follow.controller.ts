import { Request, Response } from "express";
import { FollowService } from "../services/follow-service";

const service = new FollowService(); 

export class FollowController {
async handleFollow(req: Request, res: Response) {
    try {
        const { followerId, followingId } = req.body;
        
        if (!followerId || !followingId) {
            return res.status(400).json({ error: "IDs são obrigatórios" });
        }

        const result = await service.follow(followerId, followingId);
        return res.status(201).json(result);
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
}
async handleUnfollow(req: Request, res: Response) {
    try {
        const { id } = req.params;

        console.log("ID EXTRAÍDO DA URL:", id); 

        if (!id) {
            return res.status(400).json({ error: "ID não encontrado na URL" });
        }

        await service.unfollow(id as string);
        return res.status(200).json({ message: "Deixou de seguir!" });
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
}
}