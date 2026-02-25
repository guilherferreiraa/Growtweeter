import { Request, Response } from "express";
import { UserService } from "../services/user-service";
import jwt from "jsonwebtoken";

const userService = new UserService();

export class UserController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await userService.login(email as string, password as string);

      const secret = process.env.JWT_SECRET!;

      const token = jwt.sign(
        { id: user.id }, 
        secret, 
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        message: "Login efetuado com sucesso!",
        token,
        user: { id: user.id, username: user.username }
      });
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  }

  async store(req: Request, res: Response) {
    try {
      const { name, username, email, password, avatarUrl } = req.body;

      if (!name || !username || !email || !password || !avatarUrl) {
        return res.status(400).json({ 
          error: "Nome, username, email, senha e avatarUrl são obrigatórios." 
        });
      }

      const user = await userService.create(req.body);
      return res.status(201).json(user);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async show(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const profile = await userService.findProfile(id as string);

      if (!profile) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      return res.status(200).json(profile);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await userService.logout(id as string);
      return res.status(200).json({ message: "Logout realizado!" });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async destroy(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const loggedUserId = (req as any).userId; 

      if (id !== loggedUserId) {
        return res.status(403).json({ error: "Você não tem permissão para excluir esta conta." });
      }

      await userService.delete(id as string);
      return res.status(200).json({ message: "Sua conta foi excluída com sucesso!" });
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  async index(req: Request, res: Response) {
    try {
      const users = await userService.findAll();
      return res.status(200).json(users);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}