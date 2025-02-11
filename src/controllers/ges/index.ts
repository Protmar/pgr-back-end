import { Request, Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import { gesPostService } from "../../services/ges";

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
                cargo
            } = req.body;

            const data = await gesPostService({
                empresa_id: empresaId,
                codigo,
                descricao_ges: descricaoGes,
                observacao,
                caracterizacao_processos_id: caracterizacaoProcessosId,
                caracterizacao_ambientes_trabalho_id: caracterizacaoAmbientesTrabalhoId,
                responsavel,
                cargo,
                id:0
            });

            return res.status(201).json(data);
        } catch (error) {
            console.error("Erro no postges:", error);
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }
};
