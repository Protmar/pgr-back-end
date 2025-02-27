import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import { administrativaNecessariaDeleteService, administrativaNecessariaGetAllService, administrativaNecessariaGetService, administrativaNecessariaPostService, administrativaNecessariaPutService } from "../../services/cadastros/medidascontrole/administrativanecessario";

export const dadosCadastroAdministrativaNecessaria = {

    post: async (req: AuthenticatedUserRequest, res: Response) => {
        try{
            const { descricao } = req.body;
            const { empresaId } = req.user!;

            const data = await administrativaNecessariaPostService(empresaId.toString(), descricao)
            res.send(data)
        } catch (err) {
            if (err instanceof Error) {
              return res.status(400).json({ message: err.message });
            }
          }
    },

    getAll: async (req: AuthenticatedUserRequest, res: Response): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const data = await administrativaNecessariaGetAllService(empresaId.toString());
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    get: async (req: AuthenticatedUserRequest, res: Response): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idadministrativanecessaria } = req.params;
            const data = await administrativaNecessariaGetService(empresaId.toString(), idadministrativanecessaria);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    put: async  (req: AuthenticatedUserRequest, res: Response): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idadministrativanecessaria } = req.params;
            const { descricao } = req.body;
            const data = await administrativaNecessariaPutService(empresaId.toString(), descricao, idadministrativanecessaria);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    delete: async (req: AuthenticatedUserRequest, res: Response): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idadministrativanecessaria } = req.params;
            const data = await administrativaNecessariaDeleteService(empresaId.toString(), idadministrativanecessaria);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    }
}
