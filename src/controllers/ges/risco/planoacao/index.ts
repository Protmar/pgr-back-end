import { PlanoAcaoRisco } from "../../../../models/Risco/PlanoAcao/PlanoAcaoRisco";
import { RiscoColetivoNecessaria } from "../../../../models/Risco/PlanoAcao/RiscoColetivoNecessaria";
import {
  deleteDadosPlanoAcaoService,
  getAllDadosPlanoAcaoService,
  getDadosPlanoAcaoService,
  putDadosPlanoAcaoService,
  medidaColetivaNecessariasService,
  medidaAdministrativaNecessariasService,
  medidaIndividualNecessariasService,
  postDadosPlanoAcaoService,
} from "../../../../services/ges/gesRiscos/PlanoAcao";

export const dadosPlanoAcao = {
  post: async (req: any, res: any) => {
    const { riscoId } = req.params;
    const {
      responsavel,
      eliminar_risco_administrativo,
      eliminar_risco_coletivo,
      eliminar_risco_individual,
      data_prevista,
      data_realizada,
      data_inspecao,
      data_monitoramento,
      resultado_realizacacao,
      medidaColetivaNecessarias,
      medidaAdministrativaNecessarias,
      medidaIndividualNecessarias,
    } = req.body;

    try {
      console.log("Payload recebido:", JSON.stringify(req.body, null, 2));
      console.log("RiscoId do req.params:", riscoId);

      const planoAcao = await postDadosPlanoAcaoService({
        id_risco: riscoId,
        eliminar_risco_administrativo,
        eliminar_risco_coletivo,
        eliminar_risco_individual,
        responsavel,
        data_prevista,
        data_realizada,
        data_inspecao,
        data_monitoramento,
        resultado_realizacacao,
        medidasColetivasNecessarias: medidaColetivaNecessarias || [],
        medidasAdministrativasNecessarias: medidaAdministrativaNecessarias || [],
        medidasIndividualNecessarias: medidaIndividualNecessarias || [],
      });
      

      console.log("Plano de ação criado:", planoAcao.toJSON());
      res.status(201).json({
        success: true,
        data: planoAcao,
        message: 'Plano de ação criado com sucesso',
      });
    } catch (err: unknown) {
      console.error("Erro ao criar plano de ação:", err);
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      res.status(400).json({ message: "Erro ao criar plano de ação", error: errorMessage });
    }
  },

  getAll: async (req: any, res: any) => {
    try {
      const { riscoId } = req.params;
      const data = await getAllDadosPlanoAcaoService(riscoId);
      res.status(200).json({
        success: true,
        data,
        message: 'Planos de ação encontrados',
      });
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Erro desconhecido" });
    }
  },

  get: async (req: any, res: any) => {
    try {
      const { riscoId, planoAcaoId } = req.params;
      const data = await getDadosPlanoAcaoService(riscoId, planoAcaoId);
      if (!data) {
        return res.status(404).json({ message: "Plano de Ação não encontrado" });
      }
      res.status(200).json({
        success: true,
        data,
        message: 'Plano de ação encontrado',
      });
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Erro desconhecido" });
    }
  },

  put: async (req: any, res: any) => {
    try {
      const { riscoId, planoAcaoId } = req.params;
      const {
        responsavel,
        eliminar_risco_administrativo,
        eliminar_risco_coletivo,
        eliminar_risco_individual,
        data_prevista,
        data_realizada,
        data_inspecao,
        data_monitoramento,
        resultado_realizacacao,
        medidaColetivaNecessarias,
        medidaAdministrativaNecessarias,
        medidaIndividualNecessarias,
      } = req.body;

      const data = await putDadosPlanoAcaoService(riscoId, planoAcaoId, {
        id_risco: Number(riscoId),
        responsavel,
        eliminar_risco_administrativo,
        eliminar_risco_coletivo,
        eliminar_risco_individual,
        data_prevista,
        data_realizada,
        data_inspecao,
        data_monitoramento,
        resultado_realizacacao,
        medidasColetivasNecessarias: medidaColetivaNecessarias || [],
        medidasAdministrativasNecessarias: medidaAdministrativaNecessarias || [],
        medidasIndividualNecessarias: medidaIndividualNecessarias || [],
      });
      res.status(200).json({
        success: true,
        data,
        message: 'Plano de ação atualizado com sucesso',
      });
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Erro desconhecido" });
    }
  },

  delete: async (req: any, res: any) => {
    try {
      const { riscoId, planoAcaoId } = req.params;
      const data = await deleteDadosPlanoAcaoService(riscoId, planoAcaoId);
      if (data === 0) {
        return res.status(404).json({ message: "Plano de Ação não encontrado" });
      }
      res.status(200).json({
        success: true,
        message: 'Plano de ação removido com sucesso',
      });
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Erro desconhecido" });
    }
  },
};

export const medidaColetivaPlanoAcaoController = {
  getAll: async (req: any, res: any) => {
    try {
      const { riscoId } = req.params;
      const data = await medidaColetivaNecessariasService.getAll();
      // Transformar a resposta para camelCase
      // const responseData = data.map((plano: any) => ({
      //   ...plano.toJSON(),
      //   medidaColetivaNecessarias: plano.medidas_coletivas_necessarias || [],
      //   medidaAdministrativaNecessarias: plano.medidas_administrativas_necessarias || [],
      //   medidaIndividualNecessarias: plano.medidas_individual_necessarias || [],
      // }));
      res.status(200).json({
        success: true,
        data: data,
        message: 'Planos de ação encontrados',
      });
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Erro desconhecido" });
    }
  },
};

export const medidaAdministrativaPlanoAcaoController = {
  getAll: async (req: any, res: any) => {
    try {
      const medidas = await medidaAdministrativaNecessariasService.getAll();
      res.status(200).json({
        success: true,
        data: medidas,
        message: 'Medidas administrativas encontradas',
      });
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Erro desconhecido" });
    }
  },
};

export const medidaIndividualPlanoAcaoController = {
  getAll: async (req: any, res: any) => {
    try {
      const medidas = await medidaIndividualNecessariasService.getAll();
      res.status(200).json({
        success: true,
        data: medidas,
        message: 'Medidas individuais encontradas',
      });
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Erro desconhecido" });
    }
  },
};