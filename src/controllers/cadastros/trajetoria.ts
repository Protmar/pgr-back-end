import { AuthenticatedUserRequest } from "../../middleware";
import { trajetoriaDeleteService, trajetoriaGetAllService, trajetoriaGetService, trajetoriaPostService, trajetoriaPutService } from "../../services/cadastros/trajetoria";

export const dadosCadastroTrajetoria = {
    post: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { descricao } = req.body;
            const { empresaId } = req.user!;

            const data = await trajetoriaPostService(empresaId.toString(), descricao);
            
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },
    getAll: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const data = await trajetoriaGetAllService(empresaId.toString());
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    get: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idtrajetoria } = req.params;
            const data = await trajetoriaGetService(empresaId.toString(), idtrajetoria);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    put: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idtrajetoria } = req.params;
            const { descricao } = req.body;
            const data = await trajetoriaPutService(empresaId.toString(), descricao, idtrajetoria);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },

    delete: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idtrajetoria } = req.params;
            const data = await trajetoriaDeleteService(empresaId.toString(), idtrajetoria);
            res.send(data)
        } catch (error) {
            console.log(error);
        }
    },
}