import { AuthenticatedUserRequest } from "../../middleware";
import { tecnicaUtilizadaDeleteService, tecnicaUtilizadaGetAllService, tecnicaUtilizadaGetService, tecnicaUtilizadaPostService, tecnicaUtilizadaPutService } from "../../services/cadastros/tecnicautilizada";

export const dadosCadastroTecnicaUtilizada = {
    post: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { descricao } = req.body;
            const { empresaId } = req.user!;

            const data = await tecnicaUtilizadaPostService(empresaId.toString(), descricao);
            
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },
    getAll: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const data = await tecnicaUtilizadaGetAllService(empresaId.toString());
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    get: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idtecnicautilizada } = req.params;
            const data = await tecnicaUtilizadaGetService(empresaId.toString(), idtecnicautilizada);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    put: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idtecnicautilizada } = req.params;
            const { descricao } = req.body;
            const data = await tecnicaUtilizadaPutService(empresaId.toString(), descricao, idtecnicautilizada);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    delete: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idtecnicautilizada } = req.params;
            const data = await tecnicaUtilizadaDeleteService(empresaId.toString(), idtecnicautilizada);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },
}