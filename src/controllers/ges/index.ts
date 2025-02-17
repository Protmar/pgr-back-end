import { Request, Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import { gesPostService, getAllGesService, getOneGesService } from "../../services/ges";
import { GesAttributes } from "../../models/Ges";
import { AmbienteTrabalhoAttributes } from "../../models/AmbienteTrabalho";

export const gesController = {
    postges: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
            const { empresaId } = req.user!;
            const {
                codigo,
                descricaoGes,
                observacao,
                caracterizacaoProcessosId,
                caracterizacaoAmbientesTrabalhoId,
                responsavel,
                cargo,
                listCurso,
                listRac,
                listTipoPgr,
                listTrabalhadores,

                area,
                pedireito,
                qntjanelas,
                qntequipamentos,
                infoadicionais,
                listequipamentos,
                listmobiliarios,
                listveiculos,
                tipoEdificacaoId,
                tetoId,
                paredeId,
                ventilacaoId,
                iluminacaoId,
                pisoId
            } = req.body;

            const data = await gesPostService(empresaId, listCurso, listRac, listTipoPgr, listTrabalhadores, {
                codigo,
                descricao_ges: descricaoGes,
                observacao,
                responsavel,
                cargo,
            } as GesAttributes,
            listequipamentos,
                listmobiliarios,
                listveiculos,
                {
                    area,
                    pe_direito: pedireito,
                    qnt_janelas: qntjanelas,
                    qnt_equipamentos: qntequipamentos,
                    informacoes_adicionais: infoadicionais,
                    tipo_edificacao_id: tipoEdificacaoId,
                    teto_id: tetoId,
                    parede_id: paredeId,
                    ventilacao_id: ventilacaoId,
                    iluminacao_id: iluminacaoId,
                    piso_id: pisoId
                } as AmbienteTrabalhoAttributes);

            return res.status(201).json(data);
        } catch (error) {
            console.error("Erro no postges:", error);
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    },

    getAll: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
            const { empresaId } = req.user!;
    
            // Correção do nome da variável "resposne" para "response"
            const response = await getAllGesService(empresaId);
    
            // Enviando a resposta corretamente
            res.status(200).json(response); // Usando JSON em vez de send para garantir um formato adequado
        } catch (err) {
            if (err instanceof Error) {
              return res.status(400).json({ message: err.message });
            }
          }
    },

    getOne: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
            const { idges } = req.params;
            const { empresaId } = req.user!;

            const response = await getOneGesService(empresaId, Number(idges));

            res.status(200).json(response);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ message: err.message });
              }
            }
        }
}
