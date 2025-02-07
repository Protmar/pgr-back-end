import { AuthenticatedUserRequest } from "../../middleware";
import { ventilacaoDeleteService, ventilacaoGetAllService, ventilacaoGetService, ventilacaoPostService, ventilacaoPutService } from "../../services/cadastros/ventilacao";

export const dadosCadastroVentilacao = {
    post: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { descricao } = req.body;
            const { empresaId } = req.user!;

            const data = await ventilacaoPostService(empresaId.toString(), descricao);
            
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },
    getAll: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const data = await ventilacaoGetAllService(empresaId.toString());
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    get: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idventilacao } = req.params;
            const data = await ventilacaoGetService(empresaId.toString(), idventilacao);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    put: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idventilacao } = req.params;
            const { descricao } = req.body;
            const data = await ventilacaoPutService(empresaId.toString(), descricao, idventilacao);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    delete: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idventilacao } = req.params;
            const data = await ventilacaoDeleteService(empresaId.toString(), idventilacao);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },
}