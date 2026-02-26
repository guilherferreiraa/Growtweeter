import { prisma } from "../database/prisma.database";
import { UserDTO } from "../dtos/user.dto";

export class UserService {
async create(data: UserDTO) {
    // 1. Verifica se o username ou email já estão em uso
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { username: data.username },
                { email: data.email }
            ]
        }
    });

    if (existingUser) {
        throw new Error("Já existe uma conta com esses dados.");
    }
    return await prisma.user.create({
        data: {
            name: data.name,
            username: data.username,
            email: data.email,
            password: data.password,
            avatarUrl: data.avatarUrl,
        },
    });
}

async findProfile(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      tweets: {
        orderBy: { createdAt: "desc" },
        include: { 
          likes: true,
          _count: { select: { replies: true } } 
        }
      },
      followers: true, 
      following: true,
    },
  });
}

  async findAll() {
    return await prisma.user.findMany({
      select: { id: true, username: true, email: true, isLogged: true }
    });
  }

  async login(email: string, pass: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.password !== pass) {
        throw new Error("Credenciais inválidas");
    }
    return await prisma.user.update({
        where: { id: user.id },
        data: { isLogged: true }
    });
  }

  async logout(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    
    if (!user) throw new Error("Usuário não encontrado.");
    return await prisma.user.update({
      where: { id },
      data: { isLogged: false }
    });
  }

  async delete(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    return await prisma.user.delete({ 
      where: { id } 
    });
  }
}