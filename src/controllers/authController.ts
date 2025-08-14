require("dotenv").config();
import { Request, Response } from "express";
import { userService } from "../services/userService";
import { jwtService } from "../services/jwtService";
import { randomBytes } from "crypto";
import { mailerService } from "../services/mailerService";
import { Role } from "../models/enums/role.enum";
import { AuthenticatedUserRequest } from "../middleware";
import { empresaController } from "./empresaController";
import { empresaService } from "../services/empresaService";
import { User } from "../models";
import axios from "axios";

const roles = Object.keys(Role);
const webUrl = "https://www.pgrsoftware.com.br";

export const authController = {
  //POST /auth/login
  login: async (req: Request, res: Response) => {
    const { email, senha, recaptchaToken } = req.body;

    try {
      const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
      const recaptchaRes = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${recaptchaToken}`
      );

      if (!recaptchaRes.data.success || recaptchaRes.data.score < 0.5) {
        return res.status(403).json({ message: "Falha na verificação do reCAPTCHA" });
      }

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
  forgotPassword: async (req: Request, res: Response) => {
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
      <p>Se você não solicitou a recuperação de senha, por favor ignore este e-mail.</p>
      <p>Mensagem enviada automaticamente, não responda.</p>
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
  resetPassword: async (req: Request, res: Response) => {
    const { email, senha } = req.body;
    const { token } = req.params;

    try {
      const user = await userService.findByEmail(email);

      if (!user) {
        return res.status(404).json({ message: "E-mail não registrado" });
      }

      if (token !== user.recoverCode) {
        return res.status(400).json({ message: "Código inválido" });
      }

      if (new Date() > user.recoverExpires!) {
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

  getAllUsersByEmpresa: async (req: AuthenticatedUserRequest, res: Response) => {
    const { empresaId } = req.user!;
    console.log("Empresa ID:", empresaId);
    try {
      if (!empresaId) {
        return res.status(400).json({ message: "Empresa ID é obrigatório" });
      }

      const users = await userService.getAllUsersByEmpresa(String(empresaId));

      return res.json(users);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  registerUserByEmpresa: async (req: AuthenticatedUserRequest, res: Response) => {
    const { empresaId } = req.user!;

    try {
      const { nome, email, senha, role, permissionCreateAndEditiButton } = req.body;
      if (!empresaId) {
        return res.status(400).json({ message: "Empresa ID é obrigatório" });
      }

      const user = await userService.findByEmail(email);

      if (user) {
        return res.status(400).json({ message: "E-mail ja cadastrado" });
      }

      try {
        const alreadyExists = await userService.findByEmail(email);

        if (alreadyExists) {
          throw new Error("Este e-mail já está cadastrado.");
        }

        // Formata os nomes antes de salvar
        const formattedNome = empresaController.capitalizeName(nome);

        const user = await userService.create({
          nome: formattedNome,
          email,
          senha,
          role: role,
          empresaId: empresaId,
          visualizarLaudos: false,
          editarLaudos: permissionCreateAndEditiButton,
          visualizarConfigClientes: false,
          editarConfigClientes: false,
          realizarPagamentos: false,
          recoverCode: null,
          recoverExpires: null
        });

        return res.status(201).json({ user });
      } catch (err) {
        if (err instanceof Error) {
          return res.status(400).json({ message: err.message });
        }
      }

      return res.json(user);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  deleteUser: async (req: AuthenticatedUserRequest, res: Response) => {
    const { id } = req.body;

    try {
      if (!id) {
        return res.status(400).json({ message: "ID do usuário é obrigatório" });
      }

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      await user.destroy();

      return res.status(200).json({ message: "Usuário deletado com sucesso" });
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  getCompanyUser: async (req: AuthenticatedUserRequest, res: Response) => {
    const { empresaId } = req.user!;

    try {
      if (!empresaId) {
        return res.status(400).json({ message: "Empresa ID é obrigatório" });
      }

      const user = await User.findOne({
        where: {
          empresaId: empresaId,
          role: "COMPANY"
        }
      });

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado para esta empresa" });
      }

      return res.json(user);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  getUserLogado: async (req: AuthenticatedUserRequest, res: Response) => {
    const { empresaId, email } = req.user!;
    try {

      const userData = await User.findOne({
        where: {
          empresaId: empresaId,
          email: email
        }
      });

      if (!userData) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      return res.json(userData);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  }
};