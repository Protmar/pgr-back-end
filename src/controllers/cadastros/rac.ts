import { AuthenticatedUserRequest } from "../../middleware";
import { racDeleteService, racGetAllService, racGetService, racPostService, racPutService } from "../../services/cadastros/rac";

export const dadosCadastroRac = {
    post: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { descricao } = req.body;
            const { empresaId } = req.user!;

            const data = await racPostService(empresaId.toString(), descricao);
            
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },
    getAll: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const data = await racGetAllService(empresaId.toString());
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    get: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idrac } = req.params;
            const data = await racGetService(empresaId.toString(), idrac);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    put: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idrac } = req.params;
            const { descricao } = req.body;
            const data = await racPutService(empresaId.toString(), descricao, idrac);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    delete: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idrac } = req.params;
            const data = await racDeleteService(empresaId.toString(), idrac);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },
}