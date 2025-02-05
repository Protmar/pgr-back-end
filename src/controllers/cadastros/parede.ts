import { AuthenticatedUserRequest } from "../../middleware";
import { paredeDeleteService, paredeGetAllService, paredeGetService, paredePostService, paredePutService } from "../../services/cadastros/parede";

export const dadosCadastroParede = {
    post: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { descricao } = req.body;
            const { empresaId } = req.user!;

            const data = await paredePostService(empresaId.toString(), descricao);
            
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },
    getAll: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const data = await paredeGetAllService(empresaId.toString());
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    get: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idparede } = req.params;
            const data = await paredeGetService(empresaId.toString(), idparede);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    put: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idparede } = req.params;
            const { descricao } = req.body;
            const data = await paredePutService(empresaId.toString(), descricao, idparede);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    delete: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idparede } = req.params;
            const data = await paredeDeleteService(empresaId.toString(), idparede);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },
}