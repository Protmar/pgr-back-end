import { AuthenticatedUserRequest } from "../../middleware";
import { cargoDeleteService, cargoGetAllService, cargoGetService, cargoPostService, cargoPutService } from "../../services/cadastros/cargo";
import { gerenciaDeleteService, gerenciaGetAllService, gerenciaGetService, gerenciaPostService, gerenciaPutService } from "../../services/cadastros/gerencia";

export const dadosCadastroCargo = {
    post: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { descricao } = req.body;
            const { empresaId } = req.user!;

            const data = await cargoPostService(empresaId.toString(), descricao);
            
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },
    getAll: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const data = await cargoGetAllService(empresaId.toString());
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    get: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idcargo } = req.params;
            const data = await cargoGetService(empresaId.toString(), idcargo);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    put: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idcargo } = req.params;
            const { descricao } = req.body;
            const data = await cargoPutService(empresaId.toString(), descricao, idcargo);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    delete: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idcargo } = req.params;
            const data = await cargoDeleteService(empresaId.toString(), idcargo);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },
}