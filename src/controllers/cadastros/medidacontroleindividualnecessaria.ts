import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import { individualNecessariaDeleteService, individualNecessariaGetAllService, individualNecessariaGetService, individualNecessariaPostService, individualNecessariaPutService } from "../../services/cadastros/medidascontrole/individualnecessario";

export const dadosCadastroIndividualNecessaria = {

    post: async (req: AuthenticatedUserRequest, res: Response): Promise<void> => {
        try{
            const { descricao } = req.body;
            const { empresaId } = req.user!;

            const data = await individualNecessariaPostService(empresaId.toString(), descricao)
            res.send(data)
        } catch (error) {
            console.log(error)
        }
    },

    getAll: async (req: AuthenticatedUserRequest, res: Response): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const data = await individualNecessariaGetAllService(empresaId.toString());
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    get: async (req: AuthenticatedUserRequest, res: Response): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idindividualnecessasria } = req.params;
            const data = await individualNecessariaGetService(empresaId.toString(), idindividualnecessasria);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    put: async  (req: AuthenticatedUserRequest, res: Response): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idindividualnecessasria } = req.params;
            const { descricao } = req.body;
            const data = await individualNecessariaPutService(empresaId.toString(), descricao, idindividualnecessasria);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    delete: async (req: AuthenticatedUserRequest, res: Response): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idindividualnecessasria } = req.params;
            const data = await individualNecessariaDeleteService(empresaId.toString(), idindividualnecessasria);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    }
}
