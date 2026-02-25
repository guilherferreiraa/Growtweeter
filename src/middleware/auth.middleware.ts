import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
  id: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2) {
    return res.status(401).json({ error: "Token mal formatado." });
  }

  const [scheme, token] = parts;
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({ error: "Erro de configuração do servidor." });
  }

  try {
    const decoded = jwt.verify(token!, secret!) as unknown as TokenPayload;
    
    (req as any).userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
};