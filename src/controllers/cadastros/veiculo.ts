import { AuthenticatedUserRequest } from "../../middleware";
import { veiculoDeleteService, veiculoGetAllService, veiculoGetService, veiculoPostService, veiculoPutService } from "../../services/cadastros/veiculo";

export const dadosCadastroVeiculo = {
    post: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { descricao } = req.body;
            const { empresaId } = req.user!;

            const data = await veiculoPostService(empresaId.toString(), descricao);
            
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },
    getAll: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const data = await veiculoGetAllService(empresaId.toString());
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    get: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idveiculo } = req.params;
            const data = await veiculoGetService(empresaId.toString(), idveiculo);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    put: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idveiculo } = req.params;
            const { descricao } = req.body;
            const data = await veiculoPutService(empresaId.toString(), descricao, idveiculo);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    delete: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idveiculo } = req.params;
            const data = await veiculoDeleteService(empresaId.toString(), idveiculo);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },
}