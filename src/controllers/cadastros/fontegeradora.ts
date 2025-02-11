import { AuthenticatedUserRequest } from "../../middleware";
import { fonteGeradoraDeleteService, fonteGeradoraGetAllService, fonteGeradoraGetService, fonteGeradoraPostService, fonteGeradoraPutService } from "../../services/cadastros/fontegeradora";

export const dadosCadastroFonteGeradora = {
    post: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { descricao } = req.body;
            const { empresaId } = req.user!;

            const data = await fonteGeradoraPostService(empresaId.toString(), descricao);
            
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },
    getAll: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const data = await fonteGeradoraGetAllService(empresaId.toString());
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    get: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idfontegeradora } = req.params;
            const data = await fonteGeradoraGetService(empresaId.toString(), idfontegeradora);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    put: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idfontegeradora } = req.params;
            const { descricao } = req.body;
            const data = await fonteGeradoraPutService(empresaId.toString(), descricao, idfontegeradora);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    delete: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idfontegeradora } = req.params;
            const data = await fonteGeradoraDeleteService(empresaId.toString(), idfontegeradora);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },
}