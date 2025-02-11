import { AuthenticatedUserRequest } from "../../middleware";
import { epiDeleteService, epiGetAllService, epiGetService, epiPostService, epiPutService } from "../../services/cadastros/epi";

export const dadosCadastroEpi = {
    post: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { descricao } = req.body;
            const { empresaId } = req.user!;

            const data = await epiPostService(empresaId.toString(), descricao);
            
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },
    getAll: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const data = await epiGetAllService(empresaId.toString());
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    get: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idepi } = req.params;
            const data = await epiGetService(empresaId.toString(), idepi);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    put: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idepi } = req.params;
            const { descricao } = req.body;
            const data = await epiPutService(empresaId.toString(), descricao, idepi);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    delete: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idepi } = req.params;
            const data = await epiDeleteService(empresaId.toString(), idepi);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },
}