import { AuthenticatedUserRequest } from "../../middleware";
import { gerenciaDeleteService, gerenciaGetAllService, gerenciaGetService, gerenciaPostService, gerenciaPutService } from "../../services/cadastros/gerencia";

export const dadosCadastroGerencia = {
    post: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { descricao } = req.body;
            const { empresaId } = req.user!;

            const data = await gerenciaPostService(empresaId.toString(), descricao);
            
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },
    getAll: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const data = await gerenciaGetAllService(empresaId.toString());
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    get: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idgerencia } = req.params;
            const data = await gerenciaGetService(empresaId.toString(), idgerencia);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    put: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idgerencia } = req.params;
            const { descricao } = req.body;
            const data = await gerenciaPutService(empresaId.toString(), descricao, idgerencia);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    delete: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idgerencia } = req.params;
            const data = await gerenciaDeleteService(empresaId.toString(), idgerencia);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },
}