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
import { TrabalhadorCreationAttributes } from "../../models/Trabalhadores";

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
      const { empresaId, id: userId } = req.user!;

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
        qnt_trabalhadores,
        nao_existe_trabalhador,
        cargo
      } = req.body;


      // Pegando cliente e serviço do usuário
      const cliente = await User.findOne({
        where: { id: userId },
        attributes: ["clienteselecionado"],
      });

      const servico = await User.findOne({
        where: { id: userId },
        attributes: ["servicoselecionado"],
      });

      if (!nome && !nao_existe_trabalhador) {
        return res.status(400).json({ message: "O campo 'nome' é obrigatório." });
      }

      if (!cliente || !servico) {
        return res.status(500).json({ message: "IDs de cliente ou serviço não definidos." });
      }

      const formattedNome = nome ? dadosTrabalhador.capitalizeName(nome) : undefined;

      // Montando objeto de criação
      const params: TrabalhadorCreationAttributes = {
        funcao_id: funcao_id ? Number(funcao_id) : undefined,
        cliente_id: Number(cliente.clienteselecionado),
        empresa_id: Number(empresaId),
        gerencia_id: gerencia_id ? Number(gerencia_id) : undefined,
        cargo_id: cargo_id ? Number(cargo_id) : undefined,
        setor_id: setor_id ? Number(setor_id) : undefined,
        servico_id: Number(servico.servicoselecionado),
        nao_existe: nao_existe_trabalhador || false,
        qnt_trabalhadores: qnt_trabalhadores ? Number(qnt_trabalhadores) : undefined,
        codigo: codigo || undefined,
        nome: formattedNome,
        genero: genero || undefined,
        data_nascimento: data_nascimento || undefined,
        cpf: cpf || undefined,
        rg: rg || undefined,
        orgao_expeditor: orgao_expeditor || undefined,
        nis_pis: nis_pis || undefined,
        ctps: ctps || undefined,
        serie: serie || undefined,
        uf: uf || undefined,
        jornada_trabalho: jornada_trabalho || undefined,
        cargo: cargo || undefined,
      };

      const data = await postDadosTrabalhadorService(params);
      res.status(201).json(data);
    } catch (err) {
      console.error("Erro em postTrabalhador:", err);
      console.error("Detalhes do erro:", JSON.stringify(err, Object.getOwnPropertyNames(err)));

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
        qnt_trabalhadores
      } = req.body;

      const formattedNome = nome ? dadosTrabalhador.capitalizeName(nome) : null;

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
        cargoString,
        qnt_trabalhadores
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
