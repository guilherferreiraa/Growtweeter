import { prisma } from "../database/prisma.database";

export class TweetService {
  async create(content: string, userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error("Usuário não encontrado.");
    }
    return await prisma.tweet.create({
      data: { content, userId },
      include: { 
        user: true, 
        likes: true, 
      }
    });
  }

  async findAll() {
    return await prisma.tweet.findMany({
      include: {
        user: true,
        likes: true,
        _count: {
          select: {
             likes: true,
            }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
  async findFollowerFeed(userId: string) {
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true }
    });
    const followingIds = following.map(f => f.followingId);

    return await prisma.tweet.findMany({
      where: {
        userId: { in: [...followingIds, userId] }
      },
      include: {
        user: true,
        likes: true,
        _count: { select: { comments: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
  async toggleLike(tweetId: string, userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    const existingLike = await prisma.like.findFirst({
      where: { tweetId, userId }
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      return { message: "Curtida removida." };
    }

    await prisma.like.create({
      data: { tweetId, userId }
    });
    return { message: "Tweet curtido com sucesso!" };
  }

async like(tweetId: string, userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("Usuário não encontrado.");

    // Verifica se já existe para não duplicar erro no banco
    const existingLike = await prisma.like.findFirst({ where: { tweetId, userId } });
    if (existingLike) return { message: "Você já curtiu este tweet." };

    await prisma.like.create({ data: { tweetId, userId } });
    return { message: "Tweet curtido com sucesso!" };
}

async unlike(tweetId: string, userId: string) {
    const existingLike = await prisma.like.findFirst({ where: { tweetId, userId } });
    
    if (!existingLike) throw new Error("Curtida não encontrada.");

    await prisma.like.delete({ where: { id: existingLike.id } });
    return { message: "Curtida removida." };
}

  async delete(id: string) {
    return await prisma.tweet.delete({
      where: { id },
    });
  }
}
