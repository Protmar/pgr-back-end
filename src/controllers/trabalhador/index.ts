import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import {
  deleteDadosTrabalhadorService,
  getDadosAllTrabalhadoresService,
  getDadosTrabalhadorService,
  postDadosTrabalhadorService,
  putDadosTrabalhadorService,
} from "../../services/trabalhadores";

export const dadosTrabalhador = {
  // Função para capitalizar a primeira letra de cada palavra
  capitalizeName: (name: string) => {
    return name
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  },

  postTrabalhador: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { empresaId } = req.user!;
      const {
        gerencia_id,
        cargo_id,
        setor_id,
        codigo,
        nome,
        genero,
        data_nascimento,
        cpf,
        rg,
        orgao_expeditor,
        nis_pis,
        ctps,
        serie,
        uf,
        jornada_trabalho,
        dataCargo,
      } = req.body;

      const formattedNome = dadosTrabalhador.capitalizeName(nome);

      const data = await postDadosTrabalhadorService({
        empresa_id: empresaId,
        gerencia_id,
        cargo_id,
        setor_id,
        codigo,
        nome: formattedNome,
        genero,
        data_nascimento,
        cpf,
        rg,
        orgao_expeditor,
        nis_pis,
        ctps,
        serie,
        uf,
        jornada_trabalho,
        cargo: dataCargo,
      });

      res.send(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  getAllTrabalhadores: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { empresaId } = req.user!;
      const data = await getDadosAllTrabalhadoresService(empresaId.toString());
      res.send(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  getTrabalhador: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { empresaId } = req.user!;
      const { idtrabalhador } = req.params;
      const data = await getDadosTrabalhadorService(
        empresaId.toString(),
        idtrabalhador
      );
      res.send(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  putTrabalhador: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { empresaId } = req.user!;
      const { idtrabalhador } = req.params;
      const {
        gerencia_id,
        cargo_id,
        setor_id,
        codigo,
        nome,
        genero,
        data_nascimento,
        cpf,
        rg,
        orgao_expeditor,
        nis_pis,
        ctps,
        serie,
        uf,
        jornada_trabalho,
        cargoString,
      } = req.body;

      const formattedNome = dadosTrabalhador.capitalizeName(nome);

      const data = await putDadosTrabalhadorService(
        empresaId.toString(),
        idtrabalhador,
        gerencia_id,
        cargo_id,
        setor_id,
        codigo,
        formattedNome,
        genero,
        data_nascimento,
        cpf,
        rg,
        orgao_expeditor,
        nis_pis,
        ctps,
        serie,
        uf,
        jornada_trabalho,
        cargoString
      );

      res.send(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  deleteTrabalhador: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { empresaId } = req.user!;
      const { idtrabalhador } = req.params;
      const data = await deleteDadosTrabalhadorService(
        empresaId.toString(),
        idtrabalhador
      );
      res.send(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
};
