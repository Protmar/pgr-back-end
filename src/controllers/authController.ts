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
import crypto from "crypto";
import otpauth from "otpauth";
import QRCode from "qrcode";
import { promisify } from "util";

const roles = Object.keys(Role);
const webUrl = "https://www.pgrsoftware.com.br";

export const authController = {
  //POST /auth/login
  login: async (req: Request, res: Response) => {
    const { email, senha, recaptchaToken, code } = req.body;

    try {
      const isLocalhost = req.hostname === "localhost";

      if (!isLocalhost) {
        const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
        const recaptchaRes = await axios.post(
          `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${recaptchaToken}`
        );

        if (!recaptchaRes.data.success || recaptchaRes.data.score < 0.5) {
          return res.status(403).json({ message: "Falha na verificação do reCAPTCHA" });
        }
      }

      const user = await userService.findByEmail(email);
      if (!user) return res.status(404).json({ message: "E-mail não registrado" });

      // Promisify checkPassword
      const checkPasswordAsync = promisify(user.checkPassword.bind(user));
      const isSame = await checkPasswordAsync(senha);

      if (!isSame) return res.status(401).json({ message: "Senha incorreta" });

      const payload = {
        id: user.id,
        empresaId: user.empresaId,
        nome: user.nome,
        email: user.email,
      };

      const token = jwtService.signToken(payload, "12hr");

      return res.json({ authenticated: true, ...payload, token, use_token_mfa: user.use_token_mfa });

    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: err instanceof Error ? err.message : "Erro inesperado" });
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
  },

  enableMFA: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { empresaId, email } = req.user!;

      const secretHex = crypto.randomBytes(48).toString("hex");
      const secret = otpauth.Secret.fromHex(secretHex);

      await User.update(
        { use_token_mfa: false, token_mfa: secret.base32 },
        {
          where: {
            empresaId: empresaId,
            email: email
          }
        }
      );

      const totp = new otpauth.TOTP({
        issuer: "PGR Software",
        label: email,
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret,
      });

      const uri = totp.toString();
      const svg = await QRCode.toString(uri, { type: "svg" });

      return res.status(200).json({
        message: "MFA habilitado com sucesso",
        qrCode: svg,
        secret: secretHex,
      });
    } catch (err) {
      console.error("Erro ao gerar QR Code:", err);
      return res.status(500).json({ message: "Erro ao gerar QR Code" });
    }
  },

  addToken: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { empresaId, email } = req.user!;

      const user = await User.findOne({
        where: {
          empresaId: empresaId,
          email: email
        }
      });

      if (!user) {
        return res.status(404).json({ message: "Usuário nao encontrado" });
      }

      const { code } = req.body;

      const totp = new otpauth.TOTP({
        issuer: "PGR Software",
        label: email,
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: user.token_mfa!,
      });

      const delta = totp.validate({ token: code, window: 1 });

      if (delta! === 0) {
        await User.update(
          { use_token_mfa: true },
          {
            where: {
              empresaId: empresaId,
              email: email
            }
          }
        );
        return res.status(200).json({ message: "Código MFA validado com sucesso", status: 200 });
      } else {
        await User.update(
          { use_token_mfa: false },
          {
            where: {
              empresaId: empresaId,
              email: email
            }
          }
        );
        return res.status(401).json({ message: "Código MFA inválido" });
      }

    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  removeToken: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { empresaId, email } = req.user!;

      const user = await User.findOne({
        where: {
          empresaId: empresaId,
          email: email
        }
      });

      if (!user) {
        return res.status(404).json({ message: "Usuário nao encontrado" });
      }

      const userUpdate = await User.update(
        { use_token_mfa: false, token_mfa: null },
        {
          where: {
            empresaId: empresaId,
            email: email
          }
        }
      );
      console.log("Usuário atualizado:", user);
      return res.status(200).json({ message: "Token removido com sucesso" });
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  removeTokenInternal: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { empresaId, email } = req.user!;

      const user = await User.findOne({
        where: {
          empresaId: empresaId,
          email: email
        }
      });

      if (!user) {
        return res.status(404).json({ message: "Usuário nao encontrado" });
      }

      const userUpdate = await User.update(
        { use_token_mfa: false, token_mfa: null },
        {
          where: {
            empresaId: empresaId,
            email: email
          }
        }
      );
      console.log("Usuário atualizado:", user);
      return res.status(200).json({ message: "Token removido com sucesso" });
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  getUserByEmail: async (req: AuthenticatedUserRequest, res: Response) => {

    const { email } = req.params;

    const user = await User.findOne({ where: { email } });
    return user;
  },

  verify: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { code, email } = req.body;

      const user = await User.findOne({
        where: {
          email: email
        }
      });

      console.log(user?.dataValues.token_mfa);

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      if (!user.dataValues.token_mfa) {
        return res.status(400).json({ message: "MFA não configurado para este usuário" });
      }

      const totp = new otpauth.TOTP({
        issuer: "PGR Software",
        label: email,
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: user.dataValues.token_mfa,
      });

      const delta = totp.validate({ token: code, window: 1 });

      if (delta !== null && delta === 0) {
        return res.status(200).json({ message: "Código MFA validado com sucesso" });
      } else {
        return res.status(401).json({ message: "Código MFA inválido" });
      }

    } catch (err) {
      console.error("Erro ao validar MFA:", err);
      if (err instanceof Error) {
        return res.status(500).json({ message: err.message });
      }
      return res.status(500).json({ message: "Erro inesperado ao validar MFA" });
    }
  },

  changePassword: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { empresaId, email } = req.user!;
      const { password } = req.body;

      const user = await User.findOne({
        where: { empresaId, email }
      });

      if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

      user.senha = password;
      await user.save();

      return res.status(200).json({ message: "Senha alterada com sucesso" });

    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

};