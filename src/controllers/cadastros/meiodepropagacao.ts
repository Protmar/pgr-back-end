import { AuthenticatedUserRequest } from "../../middleware";
import { meioDePropagacaoDeleteService, meioDePropagacaoGetAllService, meioDePropagacaoGetService, meioDePropagacaoPostService, meioDePropagacaoPutService } from "../../services/cadastros/meiodepropagacao";

export const dadosCadastroMeioDePropagacao = {
    post: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { descricao } = req.body;
            const { empresaId } = req.user!;

            const data = await meioDePropagacaoPostService(empresaId.toString(), descricao);
            
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },
    getAll: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const data = await meioDePropagacaoGetAllService(empresaId.toString());
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    get: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idmeiodepropagacao } = req.params;
            const data = await meioDePropagacaoGetService(empresaId.toString(), idmeiodepropagacao);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    put: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idmeiodepropagacao } = req.params;
            const { descricao } = req.body;
            const data = await meioDePropagacaoPutService(empresaId.toString(), descricao, idmeiodepropagacao);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    delete: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idmeiodepropagacao } = req.params;
            const data = await meioDePropagacaoDeleteService(empresaId.toString(), idmeiodepropagacao);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },
}