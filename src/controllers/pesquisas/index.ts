import { getDadosPesquisaCnpjNomeService } from "../../services/pesquisa";

export const pesquisaController = {

    getCnpjNome: async (req: any, res: any) => {
        try {
            const { idempresa, pesquisa } = req.params;

            const data = await getDadosPesquisaCnpjNomeService(idempresa, pesquisa);
            res.json(data);
        } catch (error) {
            console.error("Erro ao buscar dados do cliente:", error);
            res.status(500).send("Erro ao buscar dados do cliente");
        }
    }
};