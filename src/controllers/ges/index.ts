import { Request, Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import { gesDeleteService, gesPostService, gesPutService, getAllGesService, getOneGesService } from "../../services/ges";
import { GesAttributes } from "../../models/Ges";
import { AmbienteTrabalhoAttributes } from "../../models/AmbienteTrabalho";

export const gesController = {
    postges: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
            // Verificando o arquivo enviado
            const file = req.files ? req.files['file'] : null;
            const params = JSON.parse(req.body.params)
            
            if (!req.user) {
                return res.status(401).json({ message: "Usuário não autenticado." });
            }
    
            // Dados do usuário autenticado
            const { empresaId } = req.user;
            
    
            // Extraindo os parâmetros do corpo da requisição
            const {
                codigo,
                descricaoges,
                observacao,
                responsavel,
                cargo,
                listCurso = [],
                listRac = [],
                listTipoPgr = [],
                listTrabalhadores = [],
                area,
                pedireito,
                qntjanelas,
                infoadicionais,
                listequipamentos = [],
                listmobiliarios = [],
                listveiculos = [],
                tipoEdificacaoId,
                tetoId,
                paredeId,
                ventilacaoId,
                iluminacaoId,
                pisoId
            } = params;
    
            // Verificando e tratando o arquivo
            const fileData = file ? {
                path: file[0].path,
                filename: file[0].filename,
                mimetype: file[0].mimetype
            } : null;
    
            // Preparando os dados para enviar ao serviço
            const data = await gesPostService(
                empresaId,
                listCurso,
                listRac,
                listTipoPgr,
                listTrabalhadores,
                {
                    codigo,
                    descricao_ges: descricaoges,
                    observacao,
                    responsavel,
                    cargo
                } as GesAttributes,
                listequipamentos,
                listmobiliarios,
                listveiculos,
                {
                    area,
                    pe_direito: pedireito,
                    qnt_janelas: qntjanelas,
                    informacoes_adicionais: infoadicionais,
                    tipo_edificacao_id: tipoEdificacaoId,
                    teto_id: tetoId,
                    parede_id: paredeId,
                    ventilacao_id: ventilacaoId,
                    iluminacao_id: iluminacaoId,
                    piso_id: pisoId
                } as AmbienteTrabalhoAttributes,
                fileData?.path, // Caminho do arquivo
                fileData?.filename, // Nome do arquivo
                fileData?.mimetype // Tipo MIME do arquivo
            );
    
            return res.status(201).json(data);
        } catch (err) {
            // Log do erro
            console.error("Erro no postges:", err);
    
            // Retornando resposta de erro com mensagem detalhada
            return res.status(400).json({ 
                message: err instanceof Error ? err.message : "Erro desconhecido." 
            });
        }
    },
    
    

    putges: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
            const file = req.files ? req.files['file'] : null;

            const fileData = file ? {
                path: file[0].path,
                filename: file[0].filename,
                mimetype: file[0].mimetype
            } : null;

            const { empresaId } = req.user!;
            const { id } = req.params; // Obtém o ID do recurso a ser atualizado
            const {
                newValuesMultiInput,
                codigo,
                descricaoges,
                observacao,
                responsavel,
                cargo,
                listTrabalhadores,
                area,
                pedireito,
                qntjanelas,
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

            // Verifica se o ID foi informado
            if (!id) {
                return res.status(400).json({ message: "ID é obrigatório para atualização." });
            }

            const updatedData = await gesPutService(
                newValuesMultiInput,
                empresaId,
                Number(id),
                listTrabalhadores,
                {
                    codigo,
                    descricao_ges: descricaoges,
                    observacao,
                    responsavel,
                    cargo,
                } as GesAttributes,
                {
                    area: area,
                    pe_direito: pedireito,
                    qnt_janelas: qntjanelas,
                    informacoes_adicionais: infoadicionais,
                    tipo_edificacao_id: tipoEdificacaoId === "N/A" ? null : tipoEdificacaoId,
                    teto_id: tetoId === "N/A" ? null : tetoId,
                    parede_id: paredeId === "N/A" ? null : paredeId,
                    ventilacao_id: ventilacaoId === "N/A" ? null : ventilacaoId,
                    iluminacao_id: iluminacaoId === "N/A" ? null : iluminacaoId,
                    piso_id: pisoId === "N/A" ? null : pisoId
                } as AmbienteTrabalhoAttributes,
                fileData?.path, 
                fileData?.filename, 
                fileData?.mimetype 
            );

            return res.status(200).json(updatedData);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ message: err.message });
            }
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
    },



    deleteGes: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
            const { idges } = req.params;
            const data = await gesDeleteService(Number(idges))

            return res.status(201).json(data);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ message: err.message });
            }
        }
    }
}
