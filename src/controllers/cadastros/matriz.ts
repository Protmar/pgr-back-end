import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import Servicos from "../../models/Servicos";
import {
  matrizesServicoPostService,
  matrizServicoDelete,
  matrizServicoGet,
  matrizServicoGetAll,
  matrizServicoGetPadrao,
  matrizServicoPut,
  setMatrizService,
} from "../../services/cadastros/matrizes/matrizservico";
import { User } from "../../models";

export const dadosMatrizServico = {
  post: async (req: AuthenticatedUserRequest, res: Response) => {
    try {


      const {
        servicoid,
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

      let servicoId = servicoid;
      if (!servicoId) {
        return res.status(401).json({ message: "Serviço ID não fornecido" });
      }

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

      //Validação para o campo is_padrao
      if (is_padrao !== undefined && typeof is_padrao !== "boolean") {
        return res.status(400).json({ message: "is_padrao deve ser booleano" });
      }

      const servico = await Servicos.findOne({ where: { id: servicoId } });
      if (!servico) {
        return res.status(404).json({ message: "Serviço não encontrado" });
      }

      const data = await matrizesServicoPostService({
        servico_id: servicoId,
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
        formaAtuacao,
      });

      return res.status(201).json(data);
    } catch (err) {
      return res.status(500).json({
        message:
          err instanceof Error ? err.message : "Erro interno no servidor",
      });
    }
  },

  getAll: async (req: AuthenticatedUserRequest, res: Response) => {
    try {

      const userId = req.user!.id;

      const servicoId = await User.findOne({
        where: { id: userId },
        attributes: ["servicoselecionado"],
      });
      if (!servicoId) {
        return res.status(401).json({ message: "Serviço ID não fornecido" });
      }
      const data = await matrizServicoGetAll(servicoId?.dataValues.servicoselecionado?.toString());
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({
        message:
          err instanceof Error ? err.message : "Erro interno no servidor",
      });
    }
  },

  getMatrizByServico: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const servicoId = req.params.servicoid;

      const userId = req.user!.id;

      const servicoIdSelecionado = await User.findOne({
        where: { id: userId },
        attributes: ["servicoselecionado"],
      });;
      if (!servicoId) {
        return res.status(401).json({ message: "Serviço ID não fornecido" });
      }
      const data = await matrizServicoGetAll(servicoId.toString(), servicoIdSelecionado?.dataValues?.servicoselecionado?.toString());
      if (!data) {
        return res.status(404).json({ message: "Matriz não encontrada" });
      }
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({
        message:
          err instanceof Error ? err.message : "Erro interno no servidor",
      });
    }
  },

  get: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const servicoid = req.params.servicoid;
      if (!servicoid) {
        return res.status(401).json({ message: "Serviço ID não fornecido" });
      }
      const { matrizId } = req.params;
      const data = await matrizServicoGet(servicoid.toString(), matrizId);
      if (!data) {
        return res.status(404).json({ message: "Matriz não encontrada" });
      }
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({
        message:
          err instanceof Error ? err.message : "Erro interno no servidor",
      });
    }
  },

  put: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      
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
        formaAtuacao,
        servicoId,
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
      const data = await matrizServicoPut(
        servicoId.toString(),
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
        is_padrao,
      );

      return res
        .status(200)
        .json({ message: "Matriz atualizada com sucesso", data });
    } catch (err) {
      return res.status(500).json({
        message:
          err instanceof Error ? err.message : "Erro interno no servidor",
      });
    }
  },

  delete: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const servicoId = req.params.servicoid;
      if (!servicoId) {
        return res.status(401).json({ message: "Serviço ID não fornecido" });
      }
      const { matrizId } = req.params;
      const data = await matrizServicoDelete(servicoId.toString(), matrizId);
      if (data === 0) {
        return res.status(404).json({ message: "Matriz não encontrada" });
      }
      return res.status(204).send(); // Alterado pra 204 (No Content)
    } catch (err) {
      return res.status(500).json({
        message:
          err instanceof Error ? err.message : "Erro interno no servidor",
      });
    }
  },

  setPadrao: async (req: AuthenticatedUserRequest, res: Response) => {
    try {

      const userId = req.user!.id;

      const servicoId = await User.findOne({
        where: { id: userId },
        attributes: ["servicoselecionado"],
      });
      const { idMatriz, tipo, parametro } = req.body;

      // Validação
      if (!idMatriz || !tipo || !parametro) {
        return res
          .status(400)
          .json({ message: "idMatriz, tipo e parametro são obrigatórios" });
      }

      const data = await setMatrizService(
        servicoId?.dataValues.servicoselecionado?.toString() || "",
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
  getPadrao: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { servicoId, tipo, parametro } = req.query;
      console.log("Parâmetros recebidos:", { servicoId, tipo, parametro });
      if (!servicoId || !tipo || !parametro) {
        return res.status(400).json({ message: "servicoId, tipo e parametro são obrigatórios" });
      }
      const data = await matrizServicoGetPadrao(servicoId as string, tipo as string, parametro as string);
      if (!data) {
        return res.status(404).json({ message: "Matriz padrão não encontrada" });
      }
      return res.status(200).json(data);
    } catch (err) {
      console.error("Erro no getPadrao:", err);
      return res.status(500).json({ message: err instanceof Error ? err.message : "Erro interno" });
    }
  },
};