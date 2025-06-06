import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import {
  deleteDadosFatoresRiscoService,
  getDadosAllFatoresRiscoService,
  getDadosFatoresRiscoService,
  postDadosFatoresRiscoService,
  putDadosFatoresRiscoService,
} from "../../services/cadastros/fatoresrisco";
import { itemNrPostService } from "../../services/cadastros/fatoresrisco/itemNr";
import { ItemNr } from "../../models/ItemNr";
import { sequelize } from "../../database";

export const dadosCadastroFatoresRisco = {
  capitalizeName: (nome: string) => {
    if (!nome) return "";
    const palavras = nome.toLowerCase().split(" ");
    palavras[0] = palavras[0].charAt(0).toUpperCase() + palavras[0].slice(1);
    return palavras.join(" ");
  },

  post: async (req: AuthenticatedUserRequest, res: Response) => {
    const transaction = await sequelize.transaction();
    try {
      const { empresaId } = req.user!;
      const {
        tipo,
        parametro,
        ordem,
        codigo_esocial,
        descricao,
        danos_saude,
        tecnica_utilizada,
        lt_le,
        nivel_acao,
        ltcat,
        laudo_insalubridade,
        pgr,
        pgrtr,
        laudo_periculosidade,
        itensNormas,
      } = req.body;

      const formattedDescricao = dadosCadastroFatoresRisco.capitalizeName(descricao);
      const formattedDanosSaude = dadosCadastroFatoresRisco.capitalizeName(danos_saude);

      // Cria o fator de risco
      const fatorRisco = await postDadosFatoresRiscoService(
        {
          empresaId: empresaId,
          tipo,
          parametro,
          ordem,
          codigo_esocial,
          descricao: formattedDescricao,
          danos_saude: formattedDanosSaude,
          tecnica_utilizada,
          lt_le,
          nivel_acao,
          ltcat,
          laudo_insalubridade,
          pgr,
          pgrtr,
          laudo_periculosidade,
        },
        { transaction }
      );

      // Cria os itens NR, se fornecidos
      if (itensNormas && Array.isArray(itensNormas)) {
        const itensPromises = itensNormas.map((item: string) =>
          itemNrPostService(
            {
              fator_risco_id: fatorRisco.get("id") as number, // Acessa o id corretamente
              item_norma: item,
            },
            { transaction }
          )
        );
        await Promise.all(itensPromises);
      }

      // Busca o fator de risco com os itens associados
      const fatorRiscoCompleto = await getDadosFatoresRiscoService(
        empresaId.toString(),
        (fatorRisco.get("id") as number).toString(),
        { transaction }
      );

      await transaction.commit();
      return res.status(201).json(fatorRiscoCompleto);
    } catch (err) {
      await transaction.rollback();
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(400).json({ message: "Erro desconhecido" });
    }
  },

  getAll: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { empresaId } = req.user!;
      const data = await getDadosAllFatoresRiscoService(empresaId.toString());
      res.send(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(400).json({ message: "Erro desconhecido" });
    }
  },

  get: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { empresaId } = req.user!;
      const { idfatoresrisco } = req.params;
      const data = await getDadosFatoresRiscoService(empresaId.toString(), idfatoresrisco);
      res.send(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(400).json({ message: "Erro desconhecido" });
    }
  },

  put: async (req: AuthenticatedUserRequest, res: Response) => {
    const transaction = await sequelize.transaction();
    try {
      const { empresaId } = req.user!;
      const { idfatoresrisco } = req.params;
      const {
        tipo,
        ordem,
        parametro,
        codigo_esocial,
        descricao,
        danos_saude,
        tecnica_utilizada,
        lt_le,
        nivel_acao,
        ltcat,
        laudo_insalubridade,
        pgr,
        pgrtr,
        laudo_periculosidade,
        itensNormas,
      } = req.body;

      const formattedDescricao = dadosCadastroFatoresRisco.capitalizeName(descricao);
      const formattedDanosSaude = dadosCadastroFatoresRisco.capitalizeName(danos_saude);

      // Atualiza o fator de risco
      await putDadosFatoresRiscoService(
        empresaId,
        Number(idfatoresrisco),
        tipo,
        parametro,
        ordem,
        codigo_esocial,
        formattedDescricao,
        formattedDanosSaude,
        tecnica_utilizada,
        lt_le,
        nivel_acao,
        ltcat,
        laudo_insalubridade,
        pgr,
        pgrtr,
        laudo_periculosidade,
        { transaction }
      );

      // Se itensNormas for fornecido, atualiza a lista de itens
      if (itensNormas && Array.isArray(itensNormas)) {
        // Deleta os itens existentes
        await ItemNr.destroy(
          { where: { fator_risco_id: Number(idfatoresrisco) }, transaction }
        );

        // Cria os novos itens
        const itensPromises = itensNormas.map((item: string) =>
          itemNrPostService(
            {
              fator_risco_id: Number(idfatoresrisco),
              item_norma: item,
            },
            { transaction }
          )
        );
        await Promise.all(itensPromises);
      }

      // Busca o fator de risco atualizado com os itens
      const fatorRiscoCompleto = await getDadosFatoresRiscoService(
        empresaId.toString(),
        idfatoresrisco,
        { transaction }
      );

      await transaction.commit();
      return res.status(200).json(fatorRiscoCompleto);
    } catch (err) {
      await transaction.rollback();
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(400).json({ message: "Erro desconhecido" });
    }
  },

  delete: async (req: AuthenticatedUserRequest, res: Response) => {
    const transaction = await sequelize.transaction();
    try {
      const { empresaId } = req.user!;
      const { idfatoresrisco } = req.params; // Corrigido de trabalhadorId para idfatoresrisco

      // Deleta os itens associados
      await ItemNr.destroy(
        { where: { fator_risco_id: Number(idfatoresrisco) }, transaction }
      );

      // Deleta o fator de risco
      const data = await deleteDadosFatoresRiscoService(
        empresaId,
        Number(idfatoresrisco),
        { transaction }
      );

      await transaction.commit();
      return res.status(204).send();
    } catch (err) {
      await transaction.rollback();
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(400).json({ message: "Erro desconhecido" });
    }
  },
};