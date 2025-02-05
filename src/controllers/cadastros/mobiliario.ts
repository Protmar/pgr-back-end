import { AuthenticatedUserRequest } from "../../middleware";
import { mobiliariosDeleteService, mobiliariosGetAllService, mobiliariosGetService, mobiliariosPostService, mobiliariosPutService } from "../../services/cadastros/mobiliarios";

export const dadosCadastroMobiliarios = {
    post: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { descricao } = req.body;
            const { empresaId } = req.user!;

            const data = await mobiliariosPostService(empresaId.toString(), descricao);
            
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },
    getAll: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const data = await mobiliariosGetAllService(empresaId.toString());
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    get: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idmobiliariosbrigatorio } = req.params;
            const data = await mobiliariosGetService(empresaId.toString(), idmobiliariosbrigatorio);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    put: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idmobiliariosbrigatorio } = req.params;
            const { descricao } = req.body;
            const data = await mobiliariosPutService(empresaId.toString(), descricao, idmobiliariosbrigatorio);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    delete: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idmobiliariosbrigatorio } = req.params;
            const data = await mobiliariosDeleteService(empresaId.toString(), idmobiliariosbrigatorio);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },
}