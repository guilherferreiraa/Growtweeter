import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido ou mal formatado." });
  }

  // Pegamos o token e garantimos que ele é uma string preenchida
  const token = authHeader.split(" ")[1];
  const secret = "supersecretkey123";

  if (!token) {
    return res.status(401).json({ error: "Token ausente." });
  }

  try {
    // Aqui a gente força a barra: passamos como string e ignoramos a tipagem chata
    const decoded = jwt.verify(token as string, secret as string) as any;

    const userId = decoded.id || decoded.sub;

    if (!userId) {
      return res.status(401).json({ error: "ID não encontrado no token." });
    }

    (req as any).userId = userId;
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
};