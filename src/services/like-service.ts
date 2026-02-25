import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class LikeService {
    async like(userId: string, tweetId: string) {
        const existingLike = await prisma.like.findFirst({
            where: { userId, tweetId }
        });

        if (existingLike) {
            throw new Error("Você já curtiu este tweet.");
        }

        return await prisma.like.create({
            data: { userId, tweetId }
        });
    }
    async unlike(userId: string, tweetId: string) {
        const result = await prisma.like.deleteMany({
            where: {
                userId,
                tweetId
            }
        });

        if (result.count === 0) {
            throw new Error("Este like não existe ou já foi removido.");
        }

        return result;
    }
}