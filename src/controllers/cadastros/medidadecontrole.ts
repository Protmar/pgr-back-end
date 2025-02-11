import { AuthenticatedUserRequest } from "../../middleware";
import { medidaDeControleDeleteService, medidaDeControleGetAllService, medidaDeControleGetService, medidaDeControlePostService, medidaDeControlePutService } from "../../services/cadastros/medidadecontrole";

export const dadosCadastroMedidaDeControle = {
    post: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { descricao } = req.body;
            const { empresaId } = req.user!;

            const data = await medidaDeControlePostService(empresaId.toString(), descricao);
            
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },
    getAll: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const data = await medidaDeControleGetAllService(empresaId.toString());
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    get: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idmedidadecontrole } = req.params;
            const data = await medidaDeControleGetService(empresaId.toString(), idmedidadecontrole);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    put: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idmedidadecontrole } = req.params;
            const { descricao } = req.body;
            const data = await medidaDeControlePutService(empresaId.toString(), descricao, idmedidadecontrole);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    delete: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idmedidadecontrole } = req.params;
            const data = await medidaDeControleDeleteService(empresaId.toString(), idmedidadecontrole);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },
}