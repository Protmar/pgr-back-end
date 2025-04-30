import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import {
    deleteDadosFatoresRiscoService,
  getDadosAllFatoresRiscoService,
  getDadosFatoresRiscoService,
  postDadosFatoresRiscoService,
  putDadosFatoresRiscoService,
} from "../../services/cadastros/fatoresrisco";

export const dadosCadastroFatoresRisco = {
  capitalizeName: (nome: string) => {
    if (!nome) return "";
    const palavras = nome.toLowerCase().split(" ");
    palavras[0] = palavras[0].charAt(0).toUpperCase() + palavras[0].slice(1);
    return palavras.join(" ");
  },

  post: async (req: AuthenticatedUserRequest, res: Response) => {
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
      } = req.body;
      const formattedDescricao =
        dadosCadastroFatoresRisco.capitalizeName(descricao);
      const formattedDanosSaude =
        dadosCadastroFatoresRisco.capitalizeName(danos_saude);

      const data = await postDadosFatoresRiscoService({
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
      });
      res.send(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
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
    }
  },

  get: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
        const { empresaId } = req.user!;
        const { idfatoresrisco } = req.params;
        const data = await getDadosFatoresRiscoService (empresaId.toString(), idfatoresrisco);
        res.send(data)
    }catch (err) {
        if (err instanceof Error) {
          return res.status(400).json({ message: err.message });
        }
      }
  },
  put: async (req: AuthenticatedUserRequest, res: Response) => {
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
        } = req.body;
        const formattedDescricao =
            dadosCadastroFatoresRisco.capitalizeName(descricao);
        const formattedDanosSaude =
            dadosCadastroFatoresRisco.capitalizeName(danos_saude);
        const data = await putDadosFatoresRiscoService(
            empresaId,
            Number (idfatoresrisco),
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
        )
        res.send(data)
    }catch (err) {
        if (err instanceof Error) {
          return res.status(400).json({ message: err.message });
        }
      }
  },

  delete: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
        const { empresaId } = req.user!;
        const { trabalhadorId } = req.params;
        const data = await deleteDadosFatoresRiscoService(empresaId, Number(trabalhadorId));
        res.send(data)
    }catch (err) {
        if (err instanceof Error) {
          return res.status(400).json({ message: err.message });
        }
      }
  }
};
