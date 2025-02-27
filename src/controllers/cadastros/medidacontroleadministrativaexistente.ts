import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import { administrativaExistenteDeleteService, administrativaExistenteGetAllService, administrativaExistenteGetService, administrativaExistentePostService, administrativaExistentePutService } from "../../services/cadastros/medidascontrole/administrativaexistente";

export const dadosCadastroAdministrativaExistente = {

    post: async (req: AuthenticatedUserRequest, res: Response): Promise<void> => {
        try{
            const { descricao } = req.body;
            const { empresaId } = req.user!;

            const data = await administrativaExistentePostService(empresaId.toString(), descricao)
            res.send(data)
        } catch (error) {
            console.log(error)
        }
    },

    getAll: async (req: AuthenticatedUserRequest, res: Response): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const data = await administrativaExistenteGetAllService(empresaId.toString());
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    get: async (req: AuthenticatedUserRequest, res: Response): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idadministrativaexistente } = req.params;
            const data = await administrativaExistenteGetService(empresaId.toString(), idadministrativaexistente);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    put: async  (req: AuthenticatedUserRequest, res: Response): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idadministrativaexistente } = req.params;
            const { descricao } = req.body;
            const data = await administrativaExistentePutService(empresaId.toString(), descricao, idadministrativaexistente);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    delete: async (req: AuthenticatedUserRequest, res: Response): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idadministrativaexistente } = req.params;
            const data = await administrativaExistenteDeleteService(empresaId.toString(), idadministrativaexistente);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    }
}
