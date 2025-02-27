import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import { individualExistenteDeleteService, individualExistenteGetAllService, individualExistenteGetService, individualExistentePostService, individualExistentePutService } from "../../services/cadastros/medidascontrole/individualexistente";

export const dadosCadastroIndividualExistente = {

    post: async (req: AuthenticatedUserRequest, res: Response): Promise<void> => {
        try{
            const { descricao } = req.body;
            const { empresaId } = req.user!;

            const data = await individualExistentePostService(empresaId.toString(), descricao)
            res.send(data)
        } catch (error) {
            console.log(error)
        }
    },

    getAll: async (req: AuthenticatedUserRequest, res: Response): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const data = await individualExistenteGetAllService(empresaId.toString());
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    get: async (req: AuthenticatedUserRequest, res: Response): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idindividualexistente } = req.params;
            const data = await individualExistenteGetService(empresaId.toString(), idindividualexistente);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    put: async  (req: AuthenticatedUserRequest, res: Response): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idindividualexistente } = req.params;
            const { descricao } = req.body;
            const data = await individualExistentePutService(empresaId.toString(), descricao, idindividualexistente);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    delete: async (req: AuthenticatedUserRequest, res: Response): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idindividualexistente } = req.params;
            const data = await individualExistenteDeleteService(empresaId.toString(), idindividualexistente);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    }
}
