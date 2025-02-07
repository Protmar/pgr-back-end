import { AuthenticatedUserRequest } from "../../middleware";
import { equipamentoDeleteService, equipamentoGetAllService, equipamentoGetService, equipamentoPostService, equipamentoPutService } from "../../services/cadastros/equipamento";

export const dadosCadastroEquipamento = {
    post: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { descricao } = req.body;
            const { empresaId } = req.user!;

            const data = await equipamentoPostService(empresaId.toString(), descricao);
            
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },
    getAll: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const data = await equipamentoGetAllService(empresaId.toString());
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    get: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idequipamento } = req.params;
            const data = await equipamentoGetService(empresaId.toString(), idequipamento);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    put: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idequipamento } = req.params;
            const { descricao } = req.body;
            const data = await equipamentoPutService(empresaId.toString(), descricao, idequipamento);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    delete: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idequipamento } = req.params;
            const data = await equipamentoDeleteService(empresaId.toString(), idequipamento);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },
}