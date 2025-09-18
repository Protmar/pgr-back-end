import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";

import { getDadosPesquisaCnpjNomeService, getDadosPesquisaDescCargoService, getDadosPesquisaDescCursoObrigatorioService, getDadosPesquisaDescDtIniDtFimService, getDadosPesquisaDescEdificacaoService, getDadosPesquisaDescEpiService, getDadosPesquisaDescEquipamentoService, getDadosPesquisaDescExamesService, getDadosPesquisaDescExposicaoService, getDadosPesquisaDescFonteGeradoraService, getDadosPesquisaDescFuncaoService, getDadosPesquisaDescGerenciaService, getDadosPesquisaDescIluminacaoService, getDadosPesquisaDescMedidaControleAdministrativaExistenteService, getDadosPesquisaDescMedidaControleAdministrativaNecessariaService, getDadosPesquisaDescMedidaControleColetivaExistenteService, getDadosPesquisaDescMedidaControleColetivaNecessariaService, getDadosPesquisaDescMedidaControleIndividualExistenteService, getDadosPesquisaDescMedidaControleIndividualNecessariaService, getDadosPesquisaDescMedidaDeControleService, getDadosPesquisaDescMeioDePropagacaoService, getDadosPesquisaDescRacService, getDadosPesquisaDescResponsaveisTecnicosService, getDadosPesquisaDescSetorService, getDadosPesquisaDescTecnicaUtilizadaService, getDadosPesquisaDescTetoService, getDadosPesquisaDescTipoPgrService, getDadosPesquisaDescTrajetoriaService, getDadosPesquisaDescVeiculoService, getDadosPesquisaDescVentilacaoService, getDadosPesquisaFatoresRiscoService, getDadosPesquisaGESService, getDadosPesquisaMobiliariosService, getDadosPesquisaParedeService, getDadosPesquisaPisoService, getDadosPesquisaRiscoService, getDadosPesquisaTrabalhadoresService } from "../../services/pesquisa";


export const pesquisaController = {

  getCnpjNome: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { pesquisa } = req.params;
      const { empresaId } = req.user!;

      const data = await getDadosPesquisaCnpjNomeService(empresaId, pesquisa);
      res.json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  getDadosPesquisaGES: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { pesquisa } = req.params;
      const { empresaId, email } = req.user!;

      const data = await getDadosPesquisaGESService(empresaId, pesquisa, email);
      res.json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  getDadosPesquisaDescDtIniDtFim: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { pesquisa } = req.params;
      const { empresaId } = req.user!;

      const data = await getDadosPesquisaDescDtIniDtFimService(empresaId, pesquisa);
      res.json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  getDadosPesquisaGerencia: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { pesquisa } = req.params;
      const { empresaId } = req.user!;

      const data = await getDadosPesquisaDescGerenciaService(empresaId, pesquisa);
      res.json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  getDadosPesquisaCargo: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { pesquisa } = req.params;
      const { empresaId } = req.user!;

      const data = await getDadosPesquisaDescCargoService(empresaId, pesquisa);
      res.json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  getDadosPesquisaSetor: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { pesquisa } = req.params;
      const { empresaId } = req.user!;

      const data = await getDadosPesquisaDescSetorService(empresaId, pesquisa);
      res.json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
  getDadosPesquisaFuncao: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { pesquisa } = req.params;
      const { empresaId } = req.user!;

      const data = await getDadosPesquisaDescFuncaoService(empresaId, pesquisa);
      res.json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
  getDadosPesquisaTeto: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { pesquisa } = req.params;
      const { empresaId } = req.user!;

      const data = await getDadosPesquisaDescTetoService(empresaId, pesquisa);
      res.json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
  getDadosPesquisaRac: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { pesquisa } = req.params;
      const { empresaId } = req.user!;

      const data = await getDadosPesquisaDescRacService(empresaId, pesquisa);
      res.json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
  getDadosPesquisaIluminacao: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { pesquisa } = req.params;
      const { empresaId } = req.user!;

      const data = await getDadosPesquisaDescIluminacaoService(empresaId, pesquisa);
      res.json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
  getDadosPesquisaEquipamento: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { pesquisa } = req.params;
      const { empresaId } = req.user!;

      const data = await getDadosPesquisaDescEquipamentoService(empresaId, pesquisa);
      res.json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
  getDadosPesquisaEdificacao: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { pesquisa } = req.params;
      const { empresaId } = req.user!;

      const data = await getDadosPesquisaDescEdificacaoService(empresaId, pesquisa);
      res.json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
  getDadosPesquisaTipoPgr: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { pesquisa } = req.params;
      const { empresaId } = req.user!;

      const data = await getDadosPesquisaDescTipoPgrService(empresaId, pesquisa);
      res.json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
  getDadosPesquisaVentilacao: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { pesquisa } = req.params;
      const { empresaId } = req.user!;

      const data = await getDadosPesquisaDescVentilacaoService(empresaId, pesquisa);
      res.json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
  getDadosPesquisaDescMedidaControleColetivaExistenteService: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { pesquisa } = req.params;
      const { empresaId } = req.user!;

      const data = await getDadosPesquisaDescMedidaControleColetivaExistenteService(empresaId, pesquisa);
      res.json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
  getDadosPesquisaDescMedidaControleAdministrativaExistenteService: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { pesquisa } = req.params;
      const { empresaId } = req.user!;

      const data = await getDadosPesquisaDescMedidaControleAdministrativaExistenteService(empresaId, pesquisa);
      res.json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
  getDadosPesquisaDescMedidaControleIndividualExistenteService: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { pesquisa } = req.params;
      const { empresaId } = req.user!;

      const data = await getDadosPesquisaDescMedidaControleIndividualExistenteService(empresaId, pesquisa);
      res.json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
  getDadosPesquisaDescMedidaControleColetivaNecessariaService: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { pesquisa } = req.params;
      const { empresaId } = req.user!;

      const data = await getDadosPesquisaDescMedidaControleColetivaNecessariaService(empresaId, pesquisa);
      res.json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
  getDadosPesquisaDescMedidaControleAdministrativaNecessariaService: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { pesquisa } = req.params;
      const { empresaId } = req.user!;

      const data = await getDadosPesquisaDescMedidaControleAdministrativaNecessariaService(empresaId, pesquisa);
      res.json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
  getDadosPesquisaDescMedidaControleIndividualNecessariaService: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { pesquisa } = req.params;
      const { empresaId } = req.user!;

      const data = await getDadosPesquisaDescMedidaControleIndividualNecessariaService(empresaId, pesquisa);
      res.json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  getDadosPesquisaVeiculo: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { pesquisa } = req.params;
      const { empresaId } = req.user!;

      const data = await getDadosPesquisaDescVeiculoService(empresaId, pesquisa);
      res.json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
  getDadosPesquisaCursoObrigatorio: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { pesquisa } = req.params;
      const { empresaId } = req.user!;

      const data = await getDadosPesquisaDescCursoObrigatorioService(empresaId, pesquisa);
      res.json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  getDadosPesquisaTrabalhador: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { pesquisa } = req.params;
      const { empresaId, email } = req.user!;

      const data = await getDadosPesquisaTrabalhadoresService(empresaId, pesquisa, email);
      res.json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  getDadosPesquisaMobiliarios: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { pesquisa } = req.params;
      const { empresaId } = req.user!;

      const data = await getDadosPesquisaMobiliariosService(empresaId, pesquisa);
      res.json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  getDadosPesquisaParede: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { pesquisa } = req.params;
      const { empresaId } = req.user!;

      const data = await getDadosPesquisaParedeService(empresaId, pesquisa);
      res.json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  getDadosPesquisaPiso: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { pesquisa } = req.params;
      const { empresaId } = req.user!;

      const data = await getDadosPesquisaPisoService(empresaId, pesquisa);
      res.json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  getDadosPesquisaTecnicaUtilizada: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { pesquisa } = req.params;
      const { empresaId } = req.user!;

      const data = await getDadosPesquisaDescTecnicaUtilizadaService(empresaId, pesquisa);
      res.json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  getDadosPesquisaFonteGeradora: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { pesquisa } = req.params;
      const { empresaId } = req.user!;

      const data = await getDadosPesquisaDescFonteGeradoraService(empresaId, pesquisa);
      res.json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  getDadosPesquisaExposicao: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { pesquisa } = req.params;
      const { empresaId } = req.user!;

      const data = await getDadosPesquisaDescExposicaoService(empresaId, pesquisa);
      res.json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  getDadosPesquisaEpi: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { pesquisa } = req.params;
      const { empresaId } = req.user!;

      const data = await getDadosPesquisaDescEpiService(empresaId, pesquisa);
      res.json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  getDadosPesquisaMeioDePropagacao: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { pesquisa } = req.params;
      const { empresaId } = req.user!;

      const data = await getDadosPesquisaDescMeioDePropagacaoService(empresaId, pesquisa);
      res.json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  getDadosPesquisaTrajetoria: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { pesquisa } = req.params;
      const { empresaId } = req.user!;

      const data = await getDadosPesquisaDescTrajetoriaService(empresaId, pesquisa);
      res.json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  getDadosPesquisaMedidaDeControle: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { pesquisa } = req.params;
      const { empresaId } = req.user!;

      const data = await getDadosPesquisaDescMedidaDeControleService(empresaId, pesquisa);
      res.json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
  getDadosPesquisaFatoresRisco: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { pesquisa } = req.params;
      const { empresaId } = req.user!;

      const data = await getDadosPesquisaFatoresRiscoService(empresaId, pesquisa);
      res.json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
  getDadosPesquisaRisco: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { pesquisa } = req.params;
      const { empresaId } = req.user!;

      const data = await getDadosPesquisaRiscoService(empresaId, pesquisa);
      res.json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  getDadosPesquisaResponsaveisTecnicos: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { pesquisa } = req.params;
      const { empresaId } = req.user!;

      const data = await getDadosPesquisaDescResponsaveisTecnicosService(empresaId, pesquisa);
      res.json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  getDadosPesquisaExames: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { pesquisa } = req.params;
      const { empresaId, email } = req.user!;

      const data = await getDadosPesquisaDescExamesService(empresaId, pesquisa, email);
      res.json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
};