import { AuthenticatedUserRequest } from "../../middleware";
import { tipoPgrDeleteService, tipoPgrGetAllService, tipoPgrGetService, tipoPgrPostService, tipoPgrPutService } from "../../services/cadastros/tipoPgr";

export const dadosCadastroTipoPgr = {
    post: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { descricao } = req.body;
            const { empresaId } = req.user!;

            const data = await tipoPgrPostService(empresaId.toString(), descricao);
            
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },
    getAll: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const data = await tipoPgrGetAllService(empresaId.toString());
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    get: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idtipopgr } = req.params;
            const data = await tipoPgrGetService(empresaId.toString(), idtipopgr);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    put: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idtipopgr } = req.params;
            const { descricao } = req.body;
            const data = await tipoPgrPutService(empresaId.toString(), descricao, idtipopgr);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    delete: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idtipopgr } = req.params;
            const data = await tipoPgrDeleteService(empresaId.toString(), idtipopgr);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },
}