import { ResponsavelTecnicoServicoCreationAttributes } from "../../models/ResponsaveisTecnicosServicos";
import { responsavelTecnicoAttributes } from "../../models/ResponsavelTecnico";
import { deleteResponsavelTecnicoService, deleteServicoServicoService, getAllResponsavelTecnicoService, getAllResponsavelTecnicoServicoService, getOneResponsavelTecnicoService, getOneResponsavelTecnicoServicoService, postResponsavelTecnicoService, postResponsavelTecnicoServicoService, putResponsavelTecnicoService, putResponsavelTecnicoServicoService } from "../../services/responsavelTecnico";

export const responsavelTecnicoController = {
    getAllResponsavelTecnico: async (req: any, res: any) => {
        try {
            const { empresaId } = req.user!;
            const responsavelTecnico = await getAllResponsavelTecnicoService(empresaId);
            res.json(responsavelTecnico);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ message: err.message });
            }
        }
    },

    postResponsavelTecnico: async (req: any, res: any) => {
        try {
            const { empresaId } = req.user!;
            const { nome, funcao, numeroCrea, estadoCrea } = req.body;
            const responsavelTecnico = await postResponsavelTecnicoService({
                empresa_id: Number(empresaId),
                nome,
                funcao,
                numero_crea: numeroCrea,
                estado_crea: estadoCrea,
            } as responsavelTecnicoAttributes);
            res.json(responsavelTecnico);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ message: err.message });
            }
        }
    },

    getOneReponsavelTecnico: async (req: any, res: any) => {
        try {
            const { empresaId } = req.user!;
            const { id } = req.params;
            const responsavelTecnico = await getOneResponsavelTecnicoService(empresaId, id);
            res.json(responsavelTecnico);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ message: err.message });
            }
        }
    },
    
    putResponsavelTecnico: async (req: any, res: any) => {
        try {
            const { empresaId } = req.user!;
            const { nome, funcao, numeroCrea, estadoCrea } = req.body;
            const { id } = req.params;
            const responsavelTecnico = await putResponsavelTecnicoService(
                id,
                empresaId,
                {
                empresa_id: Number(empresaId),
                nome,
                funcao,
                numero_crea: numeroCrea,
                estado_crea: estadoCrea,
            } as responsavelTecnicoAttributes);
            res.json(responsavelTecnico);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ message: err.message });
            }
        }
    },

    deleteResponsavelTecnico: async (req: any, res: any) => {
        try {
            const { empresaId } = req.user!;
            const { id } = req.params;
            const responsavelTecnico = await deleteResponsavelTecnicoService(empresaId, id)
            res.json(responsavelTecnico);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ message: err.message });
            }
        }
    },

    postServico: async (req: any, res: any) => {
        try {
            const { empresaId } = req.user!;
            const { servico_id, cliente_id, responsavel_tecnico_id } = req.body;

            const newResponsavelTecnicoServico = await postResponsavelTecnicoServicoService({
                empresa_id: Number(empresaId),
                servico_id,
                responsavel_tecnico_id,
            });

            res.json(newResponsavelTecnicoServico);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ message: err.message });
            }
        }
    },

    getAllByServico: async (req: any, res: any) => {
        try {
            const { empresaId } = req.user!;
            const { servicoid } = req.params;

            const responsavelTecnico = await getAllResponsavelTecnicoServicoService(empresaId, Number(servicoid));

            res.json(responsavelTecnico);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ message: err.message });
            }
        }
    },

    deleteServico: async (req: any, res: any) => {
        try {
            const { empresaId } = req.user!;
            const { resptecservicoid } = req.params;
            const responsavelTecnico = await deleteServicoServicoService(empresaId, resptecservicoid)
            res.json(responsavelTecnico);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ message: err.message });
            }
        }
    },

    getOneByServico: async (req: any, res: any) => {
        try {
            const { empresaId } = req.user!;
            const { servicoid } = req.params;

            const responsavelTecnico = await getOneResponsavelTecnicoServicoService(empresaId, Number(servicoid));

            res.json(responsavelTecnico);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ message: err.message });
            }
        }
    },

    putServico: async (req: any, res: any) => {
        try {
            const { empresaId } = req.user!;
            const { servico_id, responsavel_tecnico_id } = req.body;
            const { id } = req.params;

            const responsavelTecnico = await putResponsavelTecnicoServicoService(
                id,
                empresaId,
                {
                    empresa_id: Number(empresaId),
                    servico_id,
                    responsavel_tecnico_id,
                } as ResponsavelTecnicoServicoCreationAttributes
            );

            res.json(responsavelTecnico);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ message: err.message });
            }
        }
    },
}