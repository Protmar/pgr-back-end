import { AuthenticatedUserRequest } from "../../middleware";
import { iluminacaoDeleteService, iluminacaoGetAllService, iluminacaoGetService, iluminacaoPostService, iluminacaoPutService } from "../../services/cadastros/iluminacao";
import { racDeleteService, racGetAllService, racGetService, racPostService, racPutService } from "../../services/cadastros/rac";

export const dadosCadastroIluminacao = {
    post: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { descricao } = req.body;
            const { empresaId } = req.user!;

            const data = await iluminacaoPostService(empresaId.toString(), descricao);
            
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },
    getAll: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const data = await iluminacaoGetAllService(empresaId.toString());
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    get: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idiluminacao } = req.params;
            const data = await iluminacaoGetService(empresaId.toString(), idiluminacao);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    put: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idiluminacao } = req.params;
            const { descricao } = req.body;
            const data = await iluminacaoPutService(empresaId.toString(), descricao, idiluminacao);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    delete: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idiluminacao } = req.params;
            const data = await iluminacaoDeleteService(empresaId.toString(), idiluminacao);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },
}