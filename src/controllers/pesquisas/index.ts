import { AuthenticatedUserRequest } from "../../middleware";
import { getDadosPesquisaCnpjNomeService, getDadosPesquisaDescDtIniDtFimService } from "../../services/pesquisa";

export const pesquisaController = {

    getCnpjNome: async (req: AuthenticatedUserRequest, res: any) => {
        try {
            const { pesquisa } = req.params;
            const { empresaId } = req.user!;

            const data = await getDadosPesquisaCnpjNomeService(empresaId, pesquisa);
            res.json(data);
        } catch (error) {
            console.error("Erro ao buscar dados do cliente:", error);
            res.status(500).send("Erro ao buscar dados do cliente");
        }
    },

    getDadosPesquisaDescDtIniDtFim: async (req: AuthenticatedUserRequest, res: any) => {
        try {
            const { pesquisa } = req.params;
            const { empresaId } = req.user!;

            const data = await getDadosPesquisaDescDtIniDtFimService(empresaId, pesquisa);
            res.json(data);
        } catch (error) {
            console.error("Erro ao buscar dados do serviço:", error);
            res.status(500).send("Erro ao buscar dados do serviço");
        }
    }
};