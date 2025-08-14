import { NextFunction, Request, Response } from "express";
import { AuthenticatedUserRequest } from ".";
import { empresaService } from "../services/empresaService";

export const middlewareCanEditAndCreate = async (
  req: AuthenticatedUserRequest,
  res: Response,
  next: NextFunction
) => {
  const empresaId = req.user?.empresaId;
  const email = req.user?.email;

  if (!empresaId) {
    return res.status(403).json({ message: "Acesso negado: ID da empresa não encontrado." });
  }

  if (!email) {
    return res.status(403).json({ message: "Acesso negado: E-mail do usuário não encontrado." });
  }

  try {
    const empresaData = await empresaService.findOne(Number(empresaId));

    if (!empresaData) {
      return res.status(403).json({ message: "Acesso negado: Empresa não encontrada." });
    }

    const user = await empresaService.getUserByEmail(email);

    if (!user || user.dataValues.editarLaudos === false) {
      return res.status(403).json({ message: "Acesso negado: Permissão insuficiente para editar ou criar." });
    }

    next();
  } catch (err) {
    console.error("Erro ao validar permissões:", err);
    return res.status(500).json({ message: "Erro interno ao validar permissões." });
  }
};
