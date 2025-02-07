import { AuthenticatedUserRequest } from "../../middleware";
import { edificacaoDeleteService, edificacaoGetAllService, edificacaoGetService, edificacaoPostService, edificacaoPutService } from "../../services/cadastros/edificacao";

export const dadosCadastroEdificacao = {
    post: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { descricao } = req.body;
            const { empresaId } = req.user!;

            const data = await edificacaoPostService(empresaId.toString(), descricao);
            
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },
    getAll: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const data = await edificacaoGetAllService(empresaId.toString());
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    get: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idedificacao } = req.params;
            const data = await edificacaoGetService(empresaId.toString(), idedificacao);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    put: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idedificacao } = req.params;
            const { descricao } = req.body;
            const data = await edificacaoPutService(empresaId.toString(), descricao, idedificacao);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    delete: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idedificacao } = req.params;
            const data = await edificacaoDeleteService(empresaId.toString(), idedificacao);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },
}