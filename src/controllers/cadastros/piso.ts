import { AuthenticatedUserRequest } from "../../middleware";
import { pisoDeleteService, pisoGetAllService, pisoGetService, pisoPostService, pisoPutService } from "../../services/cadastros/piso";

export const dadosCadastroPiso = {
    post: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { descricao } = req.body;
            const { empresaId } = req.user!;

            const data = await pisoPostService(empresaId.toString(), descricao);
            
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },
    getAll: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const data = await pisoGetAllService(empresaId.toString());
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    get: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idpiso } = req.params;
            const data = await pisoGetService(empresaId.toString(), idpiso);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    put: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idpiso } = req.params;
            const { descricao } = req.body;
            const data = await pisoPutService(empresaId.toString(), descricao, idpiso);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    delete: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idpiso } = req.params;
            const data = await pisoDeleteService(empresaId.toString(), idpiso);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },
}