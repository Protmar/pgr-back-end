import { Request, Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import { deleteImageAtService, fluxogramaDeleteService, fluxogramaUpdateNameService, gesDeleteService, gesPostService, gesPutService, getAllGesByClienteService, getAllGesByServico, getAllGesService, getImagesAtService, getOneGesService, postImagesAtService } from "../../services/ges";
import { GesAttributes } from "../../models/Ges";
import { AmbienteTrabalhoAttributes } from "../../models/AmbienteTrabalho";
import { getCache } from "../cliente/cliente";


export const gesController = {
    postges: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
            // Verificando o arquivo enviado
            const file = req.files && req.files['file'] ? req.files['file'][0] : null;

            // Verificando se req.body.params existe
            if (!req.body.params) {
                return res.status(400).json({ message: "Parâmetros ausentes na requisição." });
            }

            let params;
            try {
                params = JSON.parse(req.body.params);
            } catch (error) {
                return res.status(400).json({ message: "Erro ao processar os parâmetros. JSON inválido." });
            }

            // Verifica autenticação do usuário
            if (!req.user) {
                return res.status(401).json({ message: "Usuário não autenticado." });
            }

            const { empresaId } = req.user;

            // Extraindo os parâmetros
            const {
                codigo,
                descricaoges,
                observacao,
                responsavel,
                cargo,
                listCurso = [],
                listRac = [],
                tipoPgr,
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
                pisoId,
                texto_caracterizacao_processos,
            } = params;

            // Dados do arquivo (se existir)
            const fileData = file
                ? {
                    path: file.path,
                    filename: file.filename,
                    mimetype: file.mimetype,
                }
                : null;


            const data = await gesPostService(
                empresaId,
                listCurso,
                listRac,
                listTrabalhadores,
                {
                    codigo,
                    descricao_ges: descricaoges,
                    observacao,
                    responsavel,
                    cargo,
                    tipo_pgr: tipoPgr,
                    texto_caracterizacao_processos,
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
                    piso_id: pisoId,
                } as AmbienteTrabalhoAttributes,
                fileData?.path,
                fileData?.filename,
                fileData?.mimetype
            );


            return res.status(201).json(data);
        } catch (err) {
            console.error("❌ Erro no postges:", err);
            return res.status(400).json({
                message: err instanceof Error ? err.message : "Erro desconhecido.",
            });
        }
    },




    putges: async (req: AuthenticatedUserRequest, res: Response) => {
        try {

            const { empresaId } = req.user!;
            const { id } = req.params; // Obtém o ID do recurso a ser atualizado
            const {
                newValuesMultiInput,
                codigo,
                descricaoges,
                observacao,
                responsavel,
                cargo,
                tipoPgr,
                listTrabalhadores,
                area,
                pedireito,
                qntjanelas,
                infoadicionais,
                tipoEdificacaoId,
                tetoId,
                paredeId,
                ventilacaoId,
                iluminacaoId,
                pisoId,
                fluxogramaName,
                servico_id,
                texto_caracterizacao_processos,
                risco_id
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
                    nome_fluxograma: fluxogramaName,
                    tipo_pgr: tipoPgr,
                    servico_id,
                    texto_caracterizacao_processos,
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

            const response = await getAllGesService(empresaId);
            res.status(200).json(response);
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

    getOneColor: async (req: AuthenticatedUserRequest, res: Response) => {
        try {

            const { empresaId } = req.user!;
            const { tipo, param, classe, grau } = req.params;

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
    },

    deleteFluxograma: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
            const { idges } = req.params;
            const data = await fluxogramaDeleteService(Number(idges))

            return res.status(201).json(data);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ message: err.message });
            }
        }
    },

    updateNameFluxograma: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
            const { idges } = req.params;
            const { fluxogramaName } = req.body;
            const data = await fluxogramaUpdateNameService(Number(idges), fluxogramaName)

            return res.status(201).json(data);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ message: err.message });
            }
        }
    },

    postImagesAt: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
            const { name, id_ges, nome_fluxograma } = req.body;


            console.log(id_ges)
            const response = await postImagesAtService(name, id_ges, nome_fluxograma);
            return res.status(200).json(response);

        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ message: err.message });
            }
        }
    },

    getImagesAt: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
            const { idges } = req.params;
            const response = await getImagesAtService(Number(idges));
            return res.status(200).json(response);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ message: err.message });
            }
        }
    },

    deleteImageAt: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
            const { idimageat } = req.params;
            const response = await deleteImageAtService(Number(idimageat));
            return res.status(200).json(response);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ message: err.message });
            }
        }
    },

    getAllByServico: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
            const { empresaId } = req.user!;
            const { idservico } = req.params;
            const response = await getAllGesByServico(empresaId, Number(idservico));
            return res.status(200).json(response);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ message: err.message });
            }
        }
    },

    getAllGesByCliente: async (req: AuthenticatedUserRequest, res: Response) => {
        try {

            const { empresaId } = req.user!;
            const { idcliente } = req.params;
            const response = await getAllGesByClienteService(empresaId, Number(idcliente));
            return res.status(200).json(response);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ message: err.message });
            }
        }
    }
}
