import { prisma } from "../database/prisma.database";

export class TweetService {
  async create(content: string, userId: string, parentTweetId?: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    return await prisma.tweet.create({
      data: { 
        content, 
        userId,
        parentTweetId: parentTweetId || null,
        type: parentTweetId ? "R" : "T" 
      },
      include: { 
        user: true, 
        likes: true, 
      }
    });
  }

  async findAll() {
    return await prisma.tweet.findMany({
      where: { parentTweetId: null }, 
      include: {
        user: true,
        likes: true,
        _count: {
          select: {
            likes: true,
            replies: true 
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

async findFollowerFeed(userId: string) {
  const follows = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true }
  });

  const followingIds = follows.map((f: { followingId: string }) => f.followingId);
  return await prisma.tweet.findMany({
    where: {
      OR: [
        { userId: userId },            
        { userId: { in: followingIds } } 
      ],
    },
    include: {
      user: {
        select: { 
          id: true, 
          name: true, 
          username: true, 
          avatarUrl: true,
          followers: true, 
          following: true,
        }
      },
      likes: true,
      replies: {
        include: {
          user: {
            select: { name: true, username: true, avatarUrl: true }
          }
        }
      },
      _count: {
        select: { replies: true }
      }
    },
    orderBy: {
      createdAt: 'desc' 
    }
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