import { AuthenticatedUserRequest } from "../../middleware";
import { tetoDeleteService, tetoGetAllService, tetoGetService, tetoPostService, tetoPutService } from "../../services/cadastros/teto";

export const dadosCadastroTeto = {
    post: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { descricao } = req.body;
            const { empresaId } = req.user!;

            const data = await tetoPostService(empresaId.toString(), descricao);
            
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },
    getAll: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const data = await tetoGetAllService(empresaId.toString());
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    get: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idteto } = req.params;
            const data = await tetoGetService(empresaId.toString(), idteto);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    put: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idteto } = req.params;
            const { descricao } = req.body;
            const data = await tetoPutService(empresaId.toString(), descricao, idteto);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    delete: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idteto} = req.params;
            const data = await tetoDeleteService(empresaId.toString(), idteto);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },
}