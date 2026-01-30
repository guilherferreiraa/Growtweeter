import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export class FollowService {
    async follow(followerId: string, followingId: string) {
        const existingFollow = await prisma.follow.findFirst({
            where: { followerId, followingId }
        });

        if (existingFollow) {
            throw new Error("Você já segue este usuário.");
        }

        return await prisma.follow.create({
            data: { followerId, followingId }
        });
    }

    async unfollow(id: string) {
        const follow = await prisma.follow.findUnique({
            where: { id }
        });

        if (!follow) {
            throw new Error("Você não segue este usuário ou a relação já foi removida.");
        }

        return await prisma.follow.delete({
            where: { id }
        });
    }
}

    
    
    
    

    