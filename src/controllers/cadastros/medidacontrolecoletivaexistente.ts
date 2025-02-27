import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import { coletivaExistenteDeleteService, coletivaExistenteGetAllService, coletivaExistenteGetService, coletivaExistentePostService, coletivaExistentePutService } from "../../services/cadastros/medidascontrole/coletivaexistente";

export const dadosCadastroColetivaExistente = {

    post: async (req: AuthenticatedUserRequest, res: Response): Promise<void> => {
        try{
            const { descricao } = req.body;
            const { empresaId } = req.user!;

            const data = await coletivaExistentePostService(empresaId.toString(), descricao)
            res.send(data)
        } catch (error) {
            console.log(error)
        }
    },

    getAll: async (req: AuthenticatedUserRequest, res: Response): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const data = await coletivaExistenteGetAllService(empresaId.toString());
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    get: async (req: AuthenticatedUserRequest, res: Response): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idcoletivaexistente } = req.params;
            const data = await coletivaExistenteGetService(empresaId.toString(), idcoletivaexistente);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    put: async  (req: AuthenticatedUserRequest, res: Response): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idcoletivaexistente } = req.params;
            const { descricao } = req.body;
            const data = await coletivaExistentePutService(empresaId.toString(), descricao, idcoletivaexistente);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    delete: async (req: AuthenticatedUserRequest, res: Response): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idcoletivaexistente } = req.params;
            const data = await coletivaExistenteDeleteService(empresaId.toString(), idcoletivaexistente);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    }
}
