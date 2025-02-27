import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import { coletivaNecessariaDeleteService, coletivaNecessariaGetAllService, coletivaNecessariaGetService, coletivaNecessariaPostService, coletivaNecessariaPutService } from "../../services/cadastros/medidascontrole/coletivanecessario";

export const dadosCadastroColetivaNecessaria = {

    post: async (req: AuthenticatedUserRequest, res: Response): Promise<void> => {
        try{
            const { descricao } = req.body;
            const { empresaId } = req.user!;

            const data = await coletivaNecessariaPostService(empresaId.toString(), descricao)
            res.send(data)
        } catch (error) {
            console.log(error)
        }
    },

    getAll: async (req: AuthenticatedUserRequest, res: Response): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const data = await coletivaNecessariaGetAllService(empresaId.toString());
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    get: async (req: AuthenticatedUserRequest, res: Response): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idcoletivanecessasria } = req.params;
            const data = await coletivaNecessariaGetService(empresaId.toString(), idcoletivanecessasria);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    put: async  (req: AuthenticatedUserRequest, res: Response): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idcoletivanecessasria } = req.params;
            const { descricao } = req.body;
            const data = await coletivaNecessariaPutService(empresaId.toString(), descricao, idcoletivanecessasria);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    delete: async (req: AuthenticatedUserRequest, res: Response): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idcoletivanecessasria } = req.params;
            const data = await coletivaNecessariaDeleteService(empresaId.toString(), idcoletivanecessasria);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    }
}
