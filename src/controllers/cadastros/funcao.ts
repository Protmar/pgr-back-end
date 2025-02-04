import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import { funcaoDeleteService, funcaoGetAllService, funcaoGetService, funcaoPostService, funcaoPutService } from "../../services/cadastros/funcao";

export const dadosCadastroFuncao = {

    post: async (req: AuthenticatedUserRequest, res: Response): Promise<void> => {
        try{
            const { descricao } = req.body;
            const { empresaId } = req.user!;

            const data = await funcaoPostService(empresaId.toString(), descricao)
            res.send(data)
        } catch (error) {
            console.log(error)
        }
    },

    getAll: async (req: AuthenticatedUserRequest, res: Response): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const data = await funcaoGetAllService(empresaId.toString());
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    get: async (req: AuthenticatedUserRequest, res: Response): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idfuncao } = req.params;
            const data = await funcaoGetService(empresaId.toString(), idfuncao);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    put: async  (req: AuthenticatedUserRequest, res: Response): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idfuncao } = req.params;
            const { descricao } = req.body;
            const data = await funcaoPutService(empresaId.toString(), descricao, idfuncao);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    delete: async (req: AuthenticatedUserRequest, res: Response): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idfuncao } = req.params;
            const data = await funcaoDeleteService(empresaId.toString(), idfuncao);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    }
}
