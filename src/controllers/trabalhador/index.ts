import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import {
  deleteDadosTrabalhadorService,
  getDadosAllTrabalhadoresService,
  getDadosTrabalhadoByIdService,
  getDadosTrabalhadorService,
  postDadosTrabalhadorExcelService,
  postDadosTrabalhadorService,
  putDadosTrabalhadorService,
} from "../../services/trabalhadores";
import { getCache } from "../cliente/cliente";
import { User } from "../../models";

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
        funcao_id,
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

      const userId = req.user!.id;

      const cliente_id = await User.findOne({
        where: { id: userId },
        attributes: ["clienteselecionado"],
      });
      const servico_id = await User.findOne({
        where: { id: userId },
        attributes: ["servicoselecionado"],
      });;

      if (!nome) {
        return res.status(400).json({ message: "O campo 'nome' é obrigatório." });
      }

      if (!cliente_id || !servico_id) {
        return res.status(500).json({ message: "IDs globais de cliente ou serviço não definidos." });
      }

      const formattedNome = dadosTrabalhador.capitalizeName(nome);

      const data = await postDadosTrabalhadorService({
        funcao_id: Number(funcao_id),
        cliente_id: Number(cliente_id.clienteselecionado),
        empresa_id: empresaId,
        gerencia_id,
        cargo_id,
        setor_id,
        servico_id: Number(servico_id.servicoselecionado),
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

      res.status(201).json(data);
    } catch (err) {
      console.error("Erro em postTrabalhador:", err);

      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }

      return res.status(500).json({ message: "Erro desconhecido ao cadastrar trabalhador." });
    }
  },

  uploadExcel: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { empresaId } = req.user!;
      const trabalhadores = req.body;
      const data = await postDadosTrabalhadorExcelService(trabalhadores, empresaId.toString());
      res.send(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  getAllTrabalhadores: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const { empresaId } = req.user!;
      const data = await getDadosAllTrabalhadoresService(empresaId.toString(), userId);
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
        valueFuncao,
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
        Number(valueFuncao),
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
      res.status(201).json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
};
