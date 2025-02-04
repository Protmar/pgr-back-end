import { AuthenticatedUserRequest } from "../../middleware";
import { getDadosPesquisaCnpjNomeService, getDadosPesquisaDescCargoService, getDadosPesquisaDescDtIniDtFimService, getDadosPesquisaDescGerenciaService, getDadosPesquisaDescSetorService, getDadosPesquisaTrabalhadoresService } from "../../services/pesquisa";

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
    },

    getDadosPesquisaGerencia: async (req: AuthenticatedUserRequest, res: any) => {
        try {
            const { pesquisa } = req.params;
            const { empresaId } = req.user!;

            const data = await getDadosPesquisaDescGerenciaService(empresaId, pesquisa);
            res.json(data);
        } catch (error) {
            console.error("Erro ao buscar dados do serviço:", error);
            res.status(500).send("Erro ao buscar dados do serviço");
        }
    },

    getDadosPesquisaCargo: async (req: AuthenticatedUserRequest, res: any) => {
        try {
            const { pesquisa } = req.params;
            const { empresaId } = req.user!;

            const data = await getDadosPesquisaDescCargoService(empresaId, pesquisa);
            res.json(data);
        } catch (error) {
            console.error("Erro ao buscar dados do serviço:", error);
            res.status(500).send("Erro ao buscar dados do serviço");
        }
    },

    getDadosPesquisaSetor: async (req: AuthenticatedUserRequest, res: any) => {
        try {
            const { pesquisa } = req.params;
            const { empresaId } = req.user!;

            const data = await getDadosPesquisaDescSetorService(empresaId, pesquisa);
            res.json(data);
        } catch (error) {
            console.error("Erro ao buscar dados do serviço:", error);
            res.status(500).send("Erro ao buscar dados do serviço");
        }
    },

    getDadosPesquisaTrabalhador: async (req: AuthenticatedUserRequest, res: any) => {
        try {
            const { pesquisa } = req.params;
            const { empresaId } = req.user!;

            const data = await getDadosPesquisaTrabalhadoresService(empresaId, pesquisa);
            res.json(data);
        } catch (error) {
            console.error("Erro ao buscar dados do serviço:", error);
            res.status(500).send("Erro ao buscar dados do baise");
        }
    },
};