import { Response } from "express";
import { AuthenticatedUserRequest } from "../../../../middleware";
import {
  matrizPadraoDelete,
  matrizPadraoGet,
  matrizPadraoGetAll,
  matrizPadraoGetTipoParametro,
  matrizPadraoPostService,
  matrizPadraoPut,
  setMatrizPadraoService,
} from "../../../../services/cadastros/matrizpadrao/matrizpadrao";
import { Empresa } from "../../../../models";

export const dadosMatrizPadrao = {
  post: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { empresaId } = req.user!;
      const {
        tipo,
        parametro,
        size,
        is_padrao,
        texts,
        severidadeDesc,
        colTexts,
        paramDesc,
        riskClasses,
        riskDesc,
        riskColors,
        formaAtuacao,
      } = req.body;

      // Validação básica
      if (!tipo || !parametro || !size) {
        return res
          .status(400)
          .json({ message: "tipo, parametro e size são obrigatórios" });
      }
      if (!texts || !severidadeDesc || texts.length !== severidadeDesc.length) {
        return res.status(400).json({
          message:
            "texts e severidadeDesc devem ser arrays com o mesmo tamanho",
        });
      }
      if (
        !colTexts ||
        !paramDesc ||
        colTexts.length !== paramDesc.length ||
        colTexts.length !== Number(size)
      ) {
        return res.status(400).json({
          message:
            "colTexts e paramDesc devem ser arrays com tamanho igual ao size",
        });
      }

      // Validação específica para Quantitativo
      if (parametro === "Quantitativo") {
        for (let i = 0; i < paramDesc.length; i++) {
          const { sinal, valor, semMedidaProtecao } = paramDesc[i] || {};
          if (!sinal || !valor || typeof semMedidaProtecao !== "boolean") {
            return res.status(400).json({
              message: `Para Quantitativo, paramDesc[${i}] deve conter sinal, valor e semMedidaProtecao válidos`,
            });
          }
        }
      }
      //Validação para o campo is_padrao
      if (is_padrao !== undefined && typeof is_padrao !== "boolean") {
        return res.status(400).json({ message: "is_padrao deve ser booleano" });
      }

      const empresa = await Empresa.findOne({ where: { id: empresaId } });
      if (!empresa) {
        return res.status(400).json({ message: "Empresa não encontrada" });
      }

      const data = await matrizPadraoPostService({
        empresa_id: empresaId,
        tipo,
        parametro,
        size: Number(size),
        is_padrao,
        texts,
        severidadeDesc,
        colTexts,
        paramDesc,
        riskClasses,
        riskDesc,
        riskColors,
        formaAtuacao, // Novo campo adicionado
      });

      return res.status(201).json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Erro interno no servidor" });
    }
  },

  getAll: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { empresaId } = req.user!;
      
      const data = await matrizPadraoGetAll(empresaId.toString());
      res.send(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  get: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { empresaId } = req.user!;
      const { matrizId } = req.params;
      const data = await matrizPadraoGet(empresaId.toString(), matrizId);
      if (!data) {
        return res.status(404).json({ message: "Matriz não encontrada" });
      }
      res.send(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Erro interno no servidor" });
    }
  },

  put: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { empresaId } = req.user!;
      const { matrizId } = req.params;
      const {
        tipo,
        parametro,
        size,
        is_padrao,
        texts,
        colTexts,
        paramDesc,
        severidadeDesc,
        riskClasses,
        riskColors,
        riskDesc,
        formaAtuacao, // Novo campo adicionado
      } = req.body;

      if (!tipo || !parametro || !size) {
        return res
          .status(400)
          .json({ message: "tipo, parametro e size são obrigatórios" });
      }
      if (!texts || !severidadeDesc || texts.length !== severidadeDesc.length) {
        return res.status(400).json({
          message:
            "texts e severidadeDesc devem ser arrays com o mesmo tamanho",
        });
      }
      if (
        !colTexts ||
        !paramDesc ||
        colTexts.length !== paramDesc.length ||
        colTexts.length !== Number(size)
      ) {
        return res.status(400).json({
          message:
            "colTexts e paramDesc devem ser arrays com tamanho igual ao size",
        });
      }

      if (parametro === "Quantitativo") {
        for (let i = 0; i < paramDesc.length; i++) {
          const { sinal, valor, semMedidaProtecao } = paramDesc[i] || {};
          if (!sinal || !valor || typeof semMedidaProtecao !== "boolean") {
            return res.status(400).json({
              message: `Para Quantitativo, paramDesc[${i}] deve conter sinal, valor e semMedidaProtecao válidos`,
            });
          }
        }
      }

      // Validação para o campo is_padrao
      if (is_padrao !== undefined && typeof is_padrao !== "boolean") {
        return res.status(400).json({ message: "is_padrao deve ser booleano" });
      }

      const data = await matrizPadraoPut(
        empresaId.toString(),
        size,
        tipo,
        parametro,
        matrizId,
        texts,
        colTexts,
        paramDesc,
        severidadeDesc,
        riskClasses,
        riskColors,
        riskDesc,
        formaAtuacao,
        is_padrao // Novo campo adicionado
      );

      res.status(200).json({ message: "Matriz atualizada com sucesso", data });
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      res.status(500).json({ message: "Erro interno ao atualizar matriz" });
    }
  },

  delete: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { empresaId } = req.user!;
      const { matrizId } = req.params;
      const data = await matrizPadraoDelete(empresaId.toString(), matrizId);
      return res.status(204).json(data)
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
  setPadrao: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { empresaId } = req.user!;
      const { idMatriz, tipo, parametro } = req.body;

      // Validação
      if (!idMatriz || !tipo || !parametro) {
        return res
          .status(400)
          .json({ message: "idMatriz, tipo e parametro são obrigatórios" });
      }

      const data = await setMatrizPadraoService(
        empresaId.toString(),
        idMatriz,
        tipo,
        parametro
      );
      if (!data) {
        return res.status(404).json({ message: "Matriz não encontrada" });
      }

      res
        .status(200)
        .json({ message: "Matriz definida como padrão com sucesso", data });
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      return res
        .status(500)
        .json({ message: "Erro interno ao definir matriz padrão" });
    }
  },

  getMatrizPadraoByTipoParametro: async (
    req: AuthenticatedUserRequest,
    res: Response 
  ) => {
    try {
      const { empresaId } = req.user!;
      const { tipo, parametro } = req.params;

      // Validação
      if (!tipo || !parametro) {
        return res
          .status(400)
          .json({ message: "tipo e parametro são obrigatórios" });
      }

      const data = await matrizPadraoGetTipoParametro(empresaId.toString(), tipo, parametro);
      if (!data) {
        return res.status(404).json({ message: "Matriz padrão não encontrada" });
      }

      res.status(200).json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Erro interno ao buscar matriz padrão" });
    }
  }
};
