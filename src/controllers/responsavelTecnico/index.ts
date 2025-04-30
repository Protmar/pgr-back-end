import { responsavelTecnicoAttributes } from "../../models/ResponsavelTecnico";
import { deleteResponsavelTecnicoService, getAllResponsavelTecnicoService, getOneResponsavelTecnicoService, postResponsavelTecnicoService, putResponsavelTecnicoService } from "../../services/responsavelTecnico";

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
    }
}