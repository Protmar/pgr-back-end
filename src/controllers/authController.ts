require("dotenv").config();
import { Request, Response } from "express";
import { userService } from "../services/userService";
import { jwtService } from "../services/jwtService";
import { randomBytes } from "crypto";
import { mailerService } from "../services/mailerService";
import { Role } from "../models/enums/role.enum";

const roles = Object.keys(Role);
const webUrl = process.env.WEB_URL;

export const authController = {
  //POST /auth/login
  login: async (req: Request, res: Response) => {
    const { email, senha } = req.body;

    try {
      const user = await userService.findByEmail(email);

      if (!user)
        return res.status(404).json({ message: "E-mail não registrado" });

      user.checkPassword(senha, (err, isSame) => {
        if (err) return res.status(400).json({ message: err.message });
        if (!isSame)
          return res.status(401).json({ message: "Senha incorreta" });

        const payload = {
          id: user.id,
          empresaId: user.empresaId,
          nome: user.nome,
          email: user.email,
        };

        const token = jwtService.signToken(payload, "12hr");

        return res.json({ authenticated: true, ...payload, token });
      });
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

   //POST /auth/forgotPassword
   forgotPassword: async(req: Request, res: Response) => {
    const { email } = req.body;

    try {
      const user = await userService.findByEmail(email);

      if (!user)
        return res.status(404).json({ message: "E-mail não registrado" });
      const token = randomBytes(5).toString("hex");

      const now = new Date();
      now.setHours(now.getHours() + 1);

      await userService.updateRecoverCode(user.id, {
        recoverCode: token,
        recoverExpires: now,
      });

      const emailContent = `
      <p>Para recuperar a sua senha <a href="${webUrl}/login/redefinirsenha/${token}">clique aqui</a> ou utilize o seguinte código: </p>
      <h3>${token}</h3>
      `;

      await mailerService.sendEmail(
        email,
        "Recuperação de senha",
        emailContent
      );

      return res.send();
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
   },
  //POST /auth/resetPassword/:token
   resetPassword: async(req: Request, res: Response) => {
    const { email, senha } = req.body;
    const { token } = req.params;

    try {
      const user = await userService.findByEmail(email);
      console.log(user)

      if (!user) {
        return res.status(404).json({ message: "E-mail não registrado" });
      }

      if (token !== user.recoverCode) {
        return res.status(400).json({ message: "Código inválido" });
      }

      if(new Date() > user.recoverExpires!) {
        return res.status(400).json({ message: "Código expirado, solicite um novo" });
      }

      user.senha = senha;
      user.recoverCode = null;
      user.recoverExpires = null;

      await user.save();

      return res.send();
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
   },
};
