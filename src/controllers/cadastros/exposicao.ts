import { AuthenticatedUserRequest } from "../../middleware";
import { exposicaoDeleteService, exposicaoGetAllService, exposicaoGetService, exposicaoPostService, exposicaoPutService } from "../../services/cadastros/exposicao";

export const dadosCadastroExposicao = {
    post: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { descricao } = req.body;
            const { empresaId } = req.user!;

            const data = await exposicaoPostService(empresaId.toString(), descricao);
            
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },
    getAll: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const data = await exposicaoGetAllService(empresaId.toString());
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    get: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idexposicao } = req.params;
            const data = await exposicaoGetService(empresaId.toString(), idexposicao);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    put: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idexposicao } = req.params;
            const { descricao } = req.body;
            const data = await exposicaoPutService(empresaId.toString(), descricao, idexposicao);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    delete: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idexposicao } = req.params;
            const data = await exposicaoDeleteService(empresaId.toString(), idexposicao);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },
}