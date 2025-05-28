import { Response } from "express";
import { AuthenticatedUserRequest } from "../../../middleware";
import {
  deleteDadosRiscoService,
  getDadosAllRiscoService,
  getDadosRiscoService,
  medidaAdministrativaService,
  medidaColetivaService,
  medidaIndividualService,
  postDadosRiscoService,
  putDadosRiscoService,
} from "../../../services/ges/gesRiscos";
import { CadastroMedidaControleColetivaExistente } from "../../../models/MedidaControleColetivaExistente";
import { CadastroMedidaControleAdministrativaExistente } from "../../../models/MedidaControleAdministrativaExistente";
import { CadastroMedidaControleIndividualExistente } from "../../../models/MedidaControleIndividualExistente";
import { Risco } from "../../../models/Risco";
import { RiscoColetivoExistente } from "../../../models/Risco/RiscoColetivoExistente";
import { RiscoAdministrativoExistente } from "../../../models/Risco/RiscoAdministrativoExistente";
import { RiscoIndividualExistente } from "../../../models/Risco/RiscoIndividualExistente";
import { medidaAdministrativaNecessariasService, medidaColetivaNecessariasService, medidaIndividualNecessariasService } from "../../../services/ges/gesRiscos/PlanoAcao";

export const dadosRisco = {
  post: async (req: AuthenticatedUserRequest, res: Response) => {
    const { empresaId } = req.user!;
    const {
      id_fator_risco,
      id_fonte_geradora,
      id_trajetoria,
      id_exposicao,
      id_meio_propagacao,
      transmitir_esocial,
      intens_conc,
      lt_le,
      comentario,
      nivel_acao,
      id_tecnica_utilizada,
      id_estrategia_amostragem,
      desvio_padrao,
      percentil,
      obs,
      probab_freq,
      conseq_severidade,
      grau_risco,
      classe_risco,
      medidasColetivas,
      medidasAdministrativas,
      medidasIndividuais,
      conclusao_insalubridade,
      conclusao_periculosidade,
      conclusao_ltcat,
    } = req.body;

    try {
      // Log do payload recebido
      console.log("Payload recebido:", JSON.stringify(req.body, null, 2));
      console.log("empresaId do req.user:", empresaId);

      // Criar o risco
      const risco = await Risco.create({
        empresa_id: empresaId,
        id_fator_risco,
        id_fonte_geradora,
        id_trajetoria,
        id_exposicao,
        id_meio_propagacao,
        transmitir_esocial,
        intens_conc,
        lt_le,
        comentario,
        nivel_acao,
        id_tecnica_utilizada,
        id_estrategia_amostragem,
        desvio_padrao,
        percentil,
        obs,
        probab_freq,
        conseq_severidade,
        grau_risco,
        classe_risco,
        conclusao_insalubridade,
        conclusao_periculosidade,
        conclusao_ltcat,
      });

      // Log do risco criado
      console.log("Risco criado:", risco.toJSON());

      // Associa medidas de controle
      if (medidasColetivas && medidasColetivas.length > 0) {
        console.log("Associando medidas coletivas:", medidasColetivas);
        await RiscoColetivoExistente.bulkCreate(
          medidasColetivas.map((id: number) => ({
            id_risco: risco.getDataValue("id"),
            id_medida_controle_coletiva_existentes: id, // Nome correto!
          }))
        );
      }
      if (medidasAdministrativas && medidasAdministrativas.length > 0) {
        console.log(
          "Associando medidas administrativas:",
          medidasAdministrativas
        );
        await RiscoAdministrativoExistente.bulkCreate(
          medidasAdministrativas.map((id: number) => ({
            id_risco: risco.getDataValue("id"),
            id_medida_controle_administrativa_existentes: id, // Nome correto!
          }))
        );
      }
      if (medidasIndividuais && medidasIndividuais.length > 0) {
        console.log("Associando medidas individuais:", medidasIndividuais);
        await RiscoIndividualExistente.bulkCreate(
          medidasIndividuais.map((id: number) => ({
            id_risco: risco.getDataValue("id"),
            id_medida_controle_individual_existentes: id, // Nome correto!
          }))
        );
      }

      res.status(201).json(risco);
    } catch (err: unknown) {
      console.error("Erro ao criar risco:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      res
        .status(400)
        .json({ message: "Erro ao criar risco", error: errorMessage });
    }
  },

  getAll: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { empresaId } = req.user!;
      const data = await getDadosAllRiscoService(empresaId.toString());
      res.status(200).json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Erro desconhecido" });
    }
  },

  get: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { empresaId } = req.user!;
      const { idrisco } = req.params;

      const data = await getDadosRiscoService(empresaId.toString(), idrisco);
      if (!data) {
        return res.status(404).json({ message: "Risco não encontrado" });
      }
      res.status(200).json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Erro desconhecido" });
    }
  },

  put: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { empresaId } = req.user!;
      const { idrisco } = req.params;
      const {
        fatoresRiscoId,
        fonteGeradoraId,
        trajetoriaId,
        exposicaoId,
        meioPropagacaoId,
        transmitirESocial,
        intensConc,
        ltLe,
        comentario,
        nivelAcao,
        tecnicaUtilizadaId,
        estrategiaAmostragem,
        desvioPadrao,
        percentil,
        observacao,
        probabFreq,
        conseqSeveridade,
        grauRisco,
        classeRisco,
        medidasColetivas,
        medidasAdministrativas,
        medidasIndividuais,
        conclusao_insalubridade,
        conclusao_periculosidade,
        conclusao_ltcat,
      } = req.body;

      const data = await putDadosRiscoService(
        empresaId.toString(),
        idrisco,
        fatoresRiscoId,
        fonteGeradoraId,
        trajetoriaId,
        exposicaoId,
        meioPropagacaoId,
        transmitirESocial,
        intensConc,
        ltLe,
        comentario,
        nivelAcao,
        tecnicaUtilizadaId,
        estrategiaAmostragem,
        desvioPadrao,
        percentil,
        observacao,
        probabFreq,
        conseqSeveridade,
        grauRisco,
        classeRisco,
        medidasColetivas || [], // Garante que seja um array
        medidasAdministrativas || [], // Garante que seja um array
        medidasIndividuais || [], // Garante que seja um array
        conclusao_insalubridade,
        conclusao_periculosidade,
        conclusao_ltcat,
      );

      res.status(200).json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Erro desconhecido" });
    }
  },

  delete: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { empresaId } = req.user!;
      const { idrisco } = req.params;
      const data = await deleteDadosRiscoService(empresaId.toString(), idrisco);
      if (data === 0) {
        return res.status(404).json({ message: "Risco não encontrado" });
      }
      res.status(204).send();
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Erro desconhecido" });
    }
  },
};

export const medidaColetivaController = {
  getAll: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const medidas = await medidaColetivaService.getAll();
      res.status(200).json(medidas);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Erro desconhecido" });
    }
  },
};
export const medidaAdministrativaController = {
  getAll: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const medidas = await medidaAdministrativaService.getAll();
      res.status(200).json(medidas);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Erro desconhecido" });
    }
  },
};

export const medidaIndividualController = {
  getAll: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const medidas = await medidaIndividualService.getAll();
      res.status(200).json(medidas);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Erro desconhecido" });
    }
  },
};
