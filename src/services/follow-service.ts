import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class FollowService {
  async follow(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new Error("Você não pode seguir a si mesmo.");
    }

    const existing = await prisma.follow.findFirst({
      where: { followerId, followingId },
    });

    if (existing) {
      throw new Error("Você já segue este usuário.");
    }

    return await prisma.follow.create({
      data: { followerId, followingId },
    });
  }

  async unfollow(followerId: string, followingId: string) {
    const result = await prisma.follow.deleteMany({
      where: {
        followerId: followerId,
        followingId: followingId,
      },
    });

    if (result.count === 0) {
      throw new Error("Você não segue este usuário.");
    }

    return result;
  }
}
