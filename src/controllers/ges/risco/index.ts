import { Response } from "express";
import { AuthenticatedUserRequest } from "../../../middleware";
import {
  deleteDadosRiscoService,
  deleteImagePerigoService,
  getDadosAllRiscoService,
  getDadosRiscoService,
  getImagesPerigoService,
  postDadosRiscoService,
  postImagePerigoService,
  putDadosRiscoService,
} from "../../../services/ges/gesRiscos";

export const dadosRisco = {
  post: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { empresaId } = req.user!;
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
      } = req.body;
      const data = await postDadosRiscoService({
        empresa_id: empresaId,
        id_fator_risco: fatoresRiscoId,
        id_fonte_geradora: fonteGeradoraId,
        id_trajetoria: trajetoriaId,
        id_exposicao: exposicaoId,
        id_meio_propagacao: meioPropagacaoId,
        transmitir_esocial: transmitirESocial,
        intens_conc: intensConc,
        lt_le: ltLe,
        comentario: comentario,
        nivel_acao: nivelAcao,
        id_tecnica_utilizada: tecnicaUtilizadaId,
        id_estrategia_amostragem: estrategiaAmostragem,
        desvio_padrao: desvioPadrao,
        percentil: percentil,
        obs: observacao,
        probab_freq: probabFreq,
        conseq_severidade: conseqSeveridade,
        grau_risco: grauRisco,
        classe_risco: classeRisco,
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
      } = req.body

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
      )
      res.send(data)
    }catch(error) {
      console.log(error)
    }
  },


  delete: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { empresaId } = req.user!;
      const { idrisco } = req.params;
      const data = await deleteDadosRiscoService(
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
  
  postImagePerigo:async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const {
        risco_id,
        url,
        tipo_risco
      } = req.body;


      const data = await postImagePerigoService(tipo_risco, risco_id, url);
      res.send(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  getImagesPerigo: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { idrisco, origem } = req.params;
      const data = await getImagesPerigoService(idrisco, origem);
      res.send(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  deleteImagePerigo: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { idrisco, origem } = req.params;
      const data = await deleteImagePerigoService(idrisco, origem);
      res.send(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
};
