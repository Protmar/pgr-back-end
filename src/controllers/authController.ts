import { Request, Response } from "express";
import { userService } from "../service/userService";
import { jwtService } from "../service/jwtService";

export const authController = {
  //POST /auth/login
  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const user = await userService.findByEmail(email);

      if (!user)
        return res.status(404).json({ message: "E-mail não registrado" });

      user.checkPassword(password, (err, isSame) => {
        if (err) return res.status(400).json({ message: err.message });
        if (!isSame)
          return res.status(401).json({ message: "Senha incorreta" });

        const payload = {
          id: user.id,
          empresaId: user.empresaId,
          nome: user.nome,
          email: user.email,
        };

        const token = jwtService.signToken(payload, "7d");

        return res.json({ authenticated: true, ...payload, token });
      });
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  }}
