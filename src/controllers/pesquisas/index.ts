import { AuthenticatedUserRequest } from "../../middleware";

import { getDadosPesquisaCnpjNomeService, getDadosPesquisaDescCargoService, getDadosPesquisaDescCursoObrigatorioService, getDadosPesquisaDescDtIniDtFimService, getDadosPesquisaDescEdificacaoService, getDadosPesquisaDescEpiService, getDadosPesquisaDescEquipamentoService, getDadosPesquisaDescExposicaoService, getDadosPesquisaDescFonteGeradoraService, getDadosPesquisaDescFuncaoService, getDadosPesquisaDescGerenciaService, getDadosPesquisaDescIluminacaoService, getDadosPesquisaDescMedidaDeControleService, getDadosPesquisaDescMeioDePropagacaoService, getDadosPesquisaDescRacService, getDadosPesquisaDescSetorService, getDadosPesquisaDescTecnicaUtilizadaService, getDadosPesquisaDescTetoService, getDadosPesquisaDescTipoPgrService, getDadosPesquisaDescTrajetoriaService, getDadosPesquisaDescVeiculoService, getDadosPesquisaDescVentilacaoService, getDadosPesquisaMobiliariosService, getDadosPesquisaParedeService, getDadosPesquisaPisoService, getDadosPesquisaTrabalhadoresService } from "../../services/pesquisa";


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
    getDadosPesquisaFuncao: async (req: AuthenticatedUserRequest, res: any) => {
        try {
            const { pesquisa } = req.params;
            const { empresaId } = req.user!;

            const data = await getDadosPesquisaDescFuncaoService(empresaId, pesquisa);
            res.json(data);
        } catch (error) {
            console.error("Erro ao buscar dados do serviço:", error);
            res.status(500).send("Erro ao buscar dados do serviço");
        }
    },
    getDadosPesquisaTeto: async (req: AuthenticatedUserRequest, res: any) => {
        try {
            const { pesquisa } = req.params;
            const { empresaId } = req.user!;

            const data = await getDadosPesquisaDescTetoService(empresaId, pesquisa);
            res.json(data);
        } catch (error) {
            console.error("Erro ao buscar dados do serviço:", error);
            res.status(500).send("Erro ao buscar dados do serviço");
        }
    },
    getDadosPesquisaRac: async (req: AuthenticatedUserRequest, res: any) => {
        try {
            const { pesquisa } = req.params;
            const { empresaId } = req.user!;

            const data = await getDadosPesquisaDescRacService(empresaId, pesquisa);
            res.json(data);
        } catch (error) {
            console.error("Erro ao buscar dados do serviço:", error);
            res.status(500).send("Erro ao buscar dados do serviço");
        }
    },
    getDadosPesquisaIluminacao: async (req: AuthenticatedUserRequest, res: any) => {
        try {
            const { pesquisa } = req.params;
            const { empresaId } = req.user!;

            const data = await getDadosPesquisaDescIluminacaoService(empresaId, pesquisa);
            res.json(data);
        } catch (error) {
            console.error("Erro ao buscar dados do serviço:", error);
            res.status(500).send("Erro ao buscar dados do serviço");
        }
    },
    getDadosPesquisaEquipamento: async (req: AuthenticatedUserRequest, res: any) => {
        try {
            const { pesquisa } = req.params;
            const { empresaId } = req.user!;

            const data = await getDadosPesquisaDescEquipamentoService(empresaId, pesquisa);
            res.json(data);
        } catch (error) {
            console.error("Erro ao buscar dados do serviço:", error);
            res.status(500).send("Erro ao buscar dados do serviço");
        }
    },
    getDadosPesquisaEdificacao: async (req: AuthenticatedUserRequest, res: any) => {
        try {
            const { pesquisa } = req.params;
            const { empresaId } = req.user!;

            const data = await getDadosPesquisaDescEdificacaoService(empresaId, pesquisa);
            res.json(data);
        } catch (error) {
            console.error("Erro ao buscar dados do serviço:", error);
            res.status(500).send("Erro ao buscar dados do serviço");
        }
    },
    getDadosPesquisaTipoPgr: async (req: AuthenticatedUserRequest, res: any) => {
        try {
            const { pesquisa } = req.params;
            const { empresaId } = req.user!;

            const data = await getDadosPesquisaDescTipoPgrService(empresaId, pesquisa);
            res.json(data);
        } catch (error) {
            console.error("Erro ao buscar dados do serviço:", error);
            res.status(500).send("Erro ao buscar dados do serviço");
        }
    },
    getDadosPesquisaVentilacao: async (req: AuthenticatedUserRequest, res: any) => {
        try {
            const { pesquisa } = req.params;
            const { empresaId } = req.user!;

            const data = await getDadosPesquisaDescVentilacaoService(empresaId, pesquisa);
            res.json(data);
        } catch (error) {
            console.error("Erro ao buscar dados do serviço:", error);
            res.status(500).send("Erro ao buscar dados do serviço");
        }
    },
    getDadosPesquisaVeiculo: async (req: AuthenticatedUserRequest, res: any) => {
        try {
            const { pesquisa } = req.params;
            const { empresaId } = req.user!;

            const data = await getDadosPesquisaDescVeiculoService(empresaId, pesquisa);
            res.json(data);
        } catch (error) {
            console.error("Erro ao buscar dados do serviço:", error);
            res.status(500).send("Erro ao buscar dados do serviço");
        }
    },
    getDadosPesquisaCursoObrigatorio: async (req: AuthenticatedUserRequest, res: any) => {
        try {
            const { pesquisa } = req.params;
            const { empresaId } = req.user!;

            const data = await getDadosPesquisaDescCursoObrigatorioService(empresaId, pesquisa);
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

    getDadosPesquisaMobiliarios: async (req: AuthenticatedUserRequest, res: any) => {
        try {
            const { pesquisa } = req.params;
            const { empresaId } = req.user!;

            const data = await getDadosPesquisaMobiliariosService(empresaId, pesquisa);
            res.json(data);
        } catch (error) {
            console.error("Erro ao buscar dados do serviço:", error);
            res.status(500).send("Erro ao buscar dados do baise");
        }
    },

    getDadosPesquisaParede: async (req: AuthenticatedUserRequest, res: any) => {
        try {
            const { pesquisa } = req.params;
            const { empresaId } = req.user!;

            const data = await getDadosPesquisaParedeService(empresaId, pesquisa);
            res.json(data);
        } catch (error) {
            console.error("Erro ao buscar dados do serviço:", error);
            res.status(500).send("Erro ao buscar dados do baise");
        }
    },

    getDadosPesquisaPiso: async (req: AuthenticatedUserRequest, res: any) => {
        try {
            const { pesquisa } = req.params;
            const { empresaId } = req.user!;

            const data = await getDadosPesquisaPisoService(empresaId, pesquisa);            
            res.json(data);
        } catch (error) {
            console.error("Erro ao buscar dados do serviço:", error);
            res.status(500).send("Erro ao buscar dados do baise");
        }
    },

    getDadosPesquisaTecnicaUtilizada: async (req: AuthenticatedUserRequest, res: any) => {
        try {
            const { pesquisa } = req.params;
            const { empresaId } = req.user!;

            const data = await getDadosPesquisaDescTecnicaUtilizadaService(empresaId, pesquisa);            
            res.json(data);
        } catch (error) {
            console.error("Erro ao buscar dados do serviço:", error);
            res.status(500).send("Erro ao buscar dados do baise");
        }
    },

    getDadosPesquisaFonteGeradora: async (req: AuthenticatedUserRequest, res: any) => {
        try {
            const { pesquisa } = req.params;
            const { empresaId } = req.user!;

            const data = await getDadosPesquisaDescFonteGeradoraService(empresaId, pesquisa);            
            res.json(data);
        } catch (error) {
            console.error("Erro ao buscar dados do serviço:", error);
            res.status(500).send("Erro ao buscar dados do baise");
        }
    },

    getDadosPesquisaExposicao: async (req: AuthenticatedUserRequest, res: any) => {
        try {
            const { pesquisa } = req.params;
            const { empresaId } = req.user!;

            const data = await getDadosPesquisaDescExposicaoService(empresaId, pesquisa);            
            res.json(data);
        } catch (error) {
            console.error("Erro ao buscar dados do serviço:", error);
            res.status(500).send("Erro ao buscar dados do baise");
        }
    },

    getDadosPesquisaEpi: async (req: AuthenticatedUserRequest, res: any) => {
        try {
            const { pesquisa } = req.params;
            const { empresaId } = req.user!;

            const data = await getDadosPesquisaDescEpiService(empresaId, pesquisa);            
            res.json(data);
        } catch (error) {
            console.error("Erro ao buscar dados do serviço:", error);
            res.status(500).send("Erro ao buscar dados do baise");
        }
    },

    getDadosPesquisaMeioDePropagacao: async (req: AuthenticatedUserRequest, res: any) => {
        try {
            const { pesquisa } = req.params;
            const { empresaId } = req.user!;

            const data = await getDadosPesquisaDescMeioDePropagacaoService(empresaId, pesquisa);            
            res.json(data);
        } catch (error) {
            console.error("Erro ao buscar dados do serviço:", error);
            res.status(500).send("Erro ao buscar dados do baise");
        }
    },

    getDadosPesquisaTrajetoria: async (req: AuthenticatedUserRequest, res: any) => {
        try {
            const { pesquisa } = req.params;
            const { empresaId } = req.user!;

            const data = await getDadosPesquisaDescTrajetoriaService(empresaId, pesquisa);            
            res.json(data);
        } catch (error) {
            console.error("Erro ao buscar dados do serviço:", error);
            res.status(500).send("Erro ao buscar dados do baise");
        }
    },

    getDadosPesquisaMedidaDeControle: async (req: AuthenticatedUserRequest, res: any) => {
        try {
            const { pesquisa } = req.params;
            const { empresaId } = req.user!;

            const data = await getDadosPesquisaDescMedidaDeControleService(empresaId, pesquisa);            
            res.json(data);
        } catch (error) {
            console.error("Erro ao buscar dados do serviço:", error);
            res.status(500).send("Erro ao buscar dados do baise");
        }
    },
};