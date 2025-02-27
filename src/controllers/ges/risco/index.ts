import { Response } from "express";
import { AuthenticatedUserRequest } from "../../../middleware";
import {
  deleteDadosRiscoService,
  getDadosAllRiscoService,
  getDadosRiscoService,
  postDadosRiscoService,
  putDadosRiscoService,
} from "../../../services/ges/gesRiscos";

export const dadosRisco = {
  post: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { empresaId } = req.user!;
      const {
        fatoresRiscoId,
        fonteGeradoraId,
        exposicaoId,
        meioPropagacaoId,
        trajetoriaId,
        transmitirESocial,
        ltLe,
        nivelAcao,
        tecnicaUtilizadaId,
        estrategiaAmostragem,
        probabFreq,
        conseqSeveridade,
        grauRisco,
        classeRisco,
        observacao,
      } = req.body;
      const data = await postDadosRiscoService({
        empresa_id: empresaId,
        id_fator_risco: fatoresRiscoId,
        id_fonte_geradora: fonteGeradoraId,
        id_exposicao: exposicaoId,
        id_meio_propagacao: meioPropagacaoId,
        id_trajetoria: trajetoriaId,
        transmitir_esocial: transmitirESocial,
        lt_le: ltLe,
        nivel_acao: nivelAcao,
        id_tecnica_utilizada: tecnicaUtilizadaId,
        estrategia_amostragem: estrategiaAmostragem,
        probab_freq: probabFreq,
        conseq_severidade: conseqSeveridade,
        grau_risco: grauRisco,
        classe_risco: classeRisco,
        obs: observacao,
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
      const data = await getDadosAllRiscoService(empresaId.toString());
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
      const { idrisco } = req.params;

      
      const data = await getDadosRiscoService(
        empresaId.toString(),
        idrisco
      );
      res.send(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  put: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { empresaId } = req.user!
      const { idrisco } = req.params
      const{
        fatoresRiscoId,
        fonteGeradoraId,
        exposicaoId,
        meioPropagacaoId,
        trajetoriaId,
        transmitirESocial,
        ltLe,
        nivelAcao,
        tecnicaUtilizadaId,
        estrategiaAmostragem,
        probabFreq,
        conseqSeveridade,
        grauRisco,
        classeRisco,
        observacao,
      } = req.body

      const data = await putDadosRiscoService(
        empresaId.toString(),
        idrisco,
        fatoresRiscoId,
        fonteGeradoraId,
        exposicaoId,
        meioPropagacaoId,
        trajetoriaId,
        transmitirESocial,
        ltLe,
        nivelAcao,
        tecnicaUtilizadaId,
        estrategiaAmostragem,
        probabFreq,
        conseqSeveridade,
        grauRisco,
        classeRisco,
        observacao,
      )
      res.send(data)
    }catch(error) {
      console.log(error)
    }
  },


  delete: async (req: AuthenticatedUserRequest, res: any) => {
    try {
      const { empresaId } = req.user!;
      const { idtrabalhador } = req.params;
      const data = await deleteDadosRiscoService(
        empresaId.toString(),
        idtrabalhador
      );
      res.send(data);
    } catch (error) {
      console.log(error);
    }
  },
};
