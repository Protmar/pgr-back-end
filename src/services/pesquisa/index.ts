import { Op } from "sequelize";
import { Cliente } from "../../models/Cliente";
import Servicos from "../../models/Servicos";
import { CadastroGerencia } from "../../models/Gerencias";
import { CadastroCargo } from "../../models/Cargos";
import { CadastroSetor } from "../../models/Setores";
import Trabalhadores from "../../models/Trabalhadores";
import { CadastroFuncao } from "../../models/Funcoes";
import { CadastroCursoObrigatorio } from "../../models/Cursosobrigatorios";
import { CadastroTeto } from "../../models/Tetos";
import { CadastroRac } from "../../models/Racs";
import { CadastroIluminacao } from "../../models/Iluminacoes";
import { CadastroEquipamento } from "../../models/Equipamentos";
import { CadastroEdificacao } from "../../models/Edificacoes";
import { CadastroTipoPgr } from "../../models/TipoPgrs";
import { CadastroVentilacao } from "../../models/Ventilacoes";
import { CadastroVeiculo } from "../../models/Veiculos";
import { CadastroMobiliario } from "../../models/Mobiliarios";
import { CadastroParede } from "../../models/Paredes";
import { CadastroPiso } from "../../models/Pisos";
import { CadastroTecnicaUtilizada } from "../../models/TecnicasUtilizadas";
import { CadastroFonteGeradora } from "../../models/FontesGeradoras";
import { CadastroExposicao } from "../../models/Exposicoes";
import { CadastroEpi } from "../../models/Epis";
import { CadastroMeioDePropagacao } from "../../models/MeiosDePropagacoes";
import { CadastroTrajetoria } from "../../models/Trajetorias";
import { CadastroMedidaDeControle } from "../../models/MedidasDeControles";
import { CadastroFatoresRisco } from "../../models/FatoresRisco";
import { CadastroMedidaControleColetivaExistente } from "../../models/MedidaControleColetivaExistente";
import { CadastroMedidaControleAdministrativaExistente } from "../../models/MedidaControleAdministrativaExistente";
import { CadastroMedidaControleIndividualExistente } from "../../models/MedidaControleIndividualExistente";
import { Risco } from "../../models/Risco";
import { CadastroMedidaControleIndividualNecessaria } from "../../models/MedidaControleIndividualNecessaria";
import { CadastroMedidaControleAdministrativaNecessaria } from "../../models/MedidaControleAdministrativaNecessaria";
import { CadastroMedidaControleColetivaNecessaria } from "../../models/MedidaControleColetivaNecessaria";
import ResponsavelTecnico from "../../models/ResponsavelTecnico";
import { Ges } from "../../models";
import { getOneServico } from "../servicos";

export const getDadosPesquisaCnpjNomeService = async (
  empresa_id: any,
  pesquisa: any
) => {
  const data = await Cliente.findAll({
    where: {
      empresa_id: empresa_id, // Busca exata pelo ID da empresa
      [Op.or]: [
        {
          cnpj: {
            [Op.iLike]: `%${pesquisa}%`, // Pesquisa parcial no CNPJ
          },
        },
        {
          nome_fantasia: {
            [Op.iLike]: `%${pesquisa}%`, // Pesquisa parcial no Nome Fantasia
          },
        },
      ],
    },
  });

  return data; // Retorna os dados encontrados
};

export const getDadosPesquisaGESService = async(
  empresa_id: any,
  pesquisa: any,
  email: any
) => {

  const servicoSelecionado = await getOneServico(empresa_id, email);

  const data = await Ges.findAll({
    where: {
      servico_id: servicoSelecionado?.servicoselecionado ?? undefined,
      empresa_id: empresa_id, 
      [Op.or]: [
        {
          codigo: {
            [Op.iLike]: `%${pesquisa}%`,
          },
        },
        {
          descricao_ges: {
            [Op.iLike]: `%${pesquisa}%`,
          } as any,
        },
        {
          tipo_pgr: {
            [Op.iLike]: `%${pesquisa}%`,
          } as any,
        },
      ],
    },
  });

  return data;
};

export const getDadosPesquisaDescDtIniDtFimService = async (
  empresa_id: any,
  pesquisa: any
) => {
  const data = await Servicos.findAll({
    where: {
      empresa_id: empresa_id, // Busca exata pelo ID da empresa
      [Op.or]: [
        {
          descricao: {
            [Op.iLike]: `%${pesquisa}%`,
          },
        },
        {
          data_inicio: {
            [Op.iLike]: `%${pesquisa}%`,
          } as any,
        },
        {
          data_fim: {
            [Op.iLike]: `%${pesquisa}%`,
          } as any,
        },
      ],
    },
  });

  return data;
};

export const getDadosPesquisaDescGerenciaService = async (
  empresa_id: any,
  pesquisa: any
) => {
  const data = await CadastroGerencia.findAll({
    where: {
      empresa_id: empresa_id, // Busca exata pelo ID da empresa
      [Op.or]: [
        {
          descricao: {
            [Op.iLike]: `%${pesquisa}%`,
          },
        },
      ],
    },
  });

  return data;
};

export const getDadosPesquisaDescCargoService = async (
  empresa_id: any,
  pesquisa: any
) => {
  const data = await CadastroCargo.findAll({
    where: {
      empresa_id: empresa_id, // Busca exata pelo ID da empresa
      [Op.or]: [
        {
          descricao: {
            [Op.iLike]: `%${pesquisa}%`,
          },
        },
      ],
    },
  });

  return data;
};

export const getDadosPesquisaDescSetorService = async (
  empresa_id: any,
  pesquisa: any
) => {
  const data = await CadastroSetor.findAll({
    where: {
      empresa_id: empresa_id, // Busca exata pelo ID da empresa
      [Op.or]: [
        {
          descricao: {
            [Op.iLike]: `%${pesquisa}%`,
          },
        },
      ],
    },
  });

  return data;
};
export const getDadosPesquisaDescFuncaoService = async (
  empresa_id: any,
  pesquisa: any
) => {
  const data = await CadastroFuncao.findAll({
    where: {
      empresa_id: empresa_id, // Busca exata pelo ID da empresa
      [Op.or]: [
        {
          descricao: {
            [Op.iLike]: `%${pesquisa}%`,
          },
        },
        {
          funcao: {
            [Op.iLike]: `%${pesquisa}%`,
          },
        },
      ],
    },
  });

  return data;
};
export const getDadosPesquisaDescTetoService = async (
  empresa_id: any,
  pesquisa: any
) => {
  const data = await CadastroTeto.findAll({
    where: {
      empresa_id: empresa_id, // Busca exata pelo ID da empresa
      [Op.or]: [
        {
          descricao: {
            [Op.iLike]: `%${pesquisa}%`,
          },
        },
      ],
    },
  });

  return data;
};
export const getDadosPesquisaDescRacService = async (
  empresa_id: any,
  pesquisa: any
) => {
  const data = await CadastroRac.findAll({
    where: {
      empresa_id: empresa_id, // Busca exata pelo ID da empresa
      [Op.or]: [
        {
          descricao: {
            [Op.iLike]: `%${pesquisa}%`,
          },
        },
      ],
    },
  });

  return data;
};
export const getDadosPesquisaDescIluminacaoService = async (
  empresa_id: any,
  pesquisa: any
) => {
  const data = await CadastroIluminacao.findAll({
    where: {
      empresa_id: empresa_id, // Busca exata pelo ID da empresa
      [Op.or]: [
        {
          descricao: {
            [Op.iLike]: `%${pesquisa}%`,
          },
        },
      ],
    },
  });

  return data;
};
export const getDadosPesquisaDescEquipamentoService = async (
  empresa_id: any,
  pesquisa: any
) => {
  const data = await CadastroEquipamento.findAll({
    where: {
      empresa_id: empresa_id, // Busca exata pelo ID da empresa
      [Op.or]: [
        {
          descricao: {
            [Op.iLike]: `%${pesquisa}%`,
          },
        },
      ],
    },
  });

  return data;
};
export const getDadosPesquisaDescEdificacaoService = async (
  empresa_id: any,
  pesquisa: any
) => {
  const data = await CadastroEdificacao.findAll({
    where: {
      empresa_id: empresa_id, // Busca exata pelo ID da empresa
      [Op.or]: [
        {
          descricao: {
            [Op.iLike]: `%${pesquisa}%`,
          },
        },
      ],
    },
  });

  return data;
};
export const getDadosPesquisaDescVentilacaoService = async (
  empresa_id: any,
  pesquisa: any
) => {
  const data = await CadastroVentilacao.findAll({
    where: {
      empresa_id: empresa_id, // Busca exata pelo ID da empresa
      [Op.or]: [
        {
          descricao: {
            [Op.iLike]: `%${pesquisa}%`,
          },
        },
      ],
    },
  });

  return data;
};
export const getDadosPesquisaDescVeiculoService = async (
  empresa_id: any,
  pesquisa: any
) => {
  const data = await CadastroVeiculo.findAll({
    where: {
      empresa_id: empresa_id, // Busca exata pelo ID da empresa
      [Op.or]: [
        {
          descricao: {
            [Op.iLike]: `%${pesquisa}%`,
          },
        },
      ],
    },
  });

  return data;
};
export const getDadosPesquisaDescTecnicaUtilizadaService = async (
  empresa_id: any,
  pesquisa: any
) => {
  const data = await CadastroTecnicaUtilizada.findAll({
    where: {
      empresa_id: empresa_id, // Busca exata pelo ID da empresa
      [Op.or]: [
        {
          descricao: {
            [Op.iLike]: `%${pesquisa}%`,
          },
        },
      ],
    },
  });

  return data;
};
export const getDadosPesquisaDescFonteGeradoraService = async (
  empresa_id: any,
  pesquisa: any
) => {
  const data = await CadastroFonteGeradora.findAll({
    where: {
      empresa_id: empresa_id, // Busca exata pelo ID da empresa
      [Op.or]: [
        {
          descricao: {
            [Op.iLike]: `%${pesquisa}%`,
          },
        },
      ],
    },
  });

  return data;
};
export const getDadosPesquisaDescExposicaoService = async (
  empresa_id: any,
  pesquisa: any
) => {
  const data = await CadastroExposicao.findAll({
    where: {
      empresa_id: empresa_id, // Busca exata pelo ID da empresa
      [Op.or]: [
        {
          descricao: {
            [Op.iLike]: `%${pesquisa}%`,
          },
        },
      ],
    },
  });

  return data;
};
export const getDadosPesquisaDescMeioDePropagacaoService = async (
  empresa_id: any,
  pesquisa: any
) => {
  const data = await CadastroMeioDePropagacao.findAll({
    where: {
      empresa_id: empresa_id, // Busca exata pelo ID da empresa
      [Op.or]: [
        {
          descricao: {
            [Op.iLike]: `%${pesquisa}%`,
          },
        },
      ],
    },
  });

  return data;
};
export const getDadosPesquisaDescTrajetoriaService = async (
  empresa_id: any,
  pesquisa: any
) => {
  const data = await CadastroTrajetoria.findAll({
    where: {
      empresa_id: empresa_id, // Busca exata pelo ID da empresa
      [Op.or]: [
        {
          descricao: {
            [Op.iLike]: `%${pesquisa}%`,
          },
        },
      ],
    },
  });

  return data;
};
export const getDadosPesquisaFatoresRiscoService = async (
  empresa_id: any,
  pesquisa: any
) => {
  const data = await CadastroFatoresRisco.findAll({
    where: {
      empresaId: empresa_id, // Busca exata pelo ID da empresa
      [Op.or]: [
        {
          tipo: {
            [Op.iLike]: `%${pesquisa}%`,
          },
        },
        {
          descricao: {
            [Op.iLike]: `%${pesquisa}%`,
          } as any,
        },
      ],
    },
  });

  return data;
};
export const getDadosPesquisaRiscoService = async (
  empresa_id: any,
  pesquisa: any
) => {
  const data = await Risco.findAll({
    where: {
      empresa_id: empresa_id, // Busca exata pelo ID da empresa
      [Op.or]: [
        {
          id_fator_risco: {
            [Op.iLike]: `%${pesquisa}%`,
          },
        },
        {
          id_fonte_geradora: {
            [Op.iLike]: `%${pesquisa}%`,
          } as any,
        },
      ],
    },
  });

  return data;
};
export const getDadosPesquisaDescMedidaDeControleService = async (
  empresa_id: any,
  pesquisa: any
) => {
  const data = await CadastroMedidaDeControle.findAll({
    where: {
      empresa_id: empresa_id, // Busca exata pelo ID da empresa
      [Op.or]: [
        {
          descricao: {
            [Op.iLike]: `%${pesquisa}%`,
          },
        },
      ],
    },
  });

  return data;
};
export const getDadosPesquisaDescEpiService = async (
  empresa_id: any,
  pesquisa: any
) => {
  const data = await CadastroEpi.findAll({
    where: {
      empresa_id: empresa_id, // Busca exata pelo ID da empresa
      [Op.or]: [
        {
          descricao: {
            [Op.iLike]: `%${pesquisa}%`,
          },
        },
      ],
    },
  });

  return data;
};
export const getDadosPesquisaDescMedidaControleColetivaExistenteService =
  async (empresa_id: any, pesquisa: any) => {
    const data = await CadastroMedidaControleColetivaExistente.findAll({
      where: {
        empresa_id: empresa_id, // Busca exata pelo ID da empresa
        [Op.or]: [
          {
            descricao: {
              [Op.iLike]: `%${pesquisa}%`,
            },
          },
        ],
      },
    });

    return data;
  };
export const getDadosPesquisaDescMedidaControleAdministrativaExistenteService =
  async (empresa_id: any, pesquisa: any) => {
    const data = await CadastroMedidaControleAdministrativaExistente.findAll({
      where: {
        empresa_id: empresa_id, // Busca exata pelo ID da empresa
        [Op.or]: [
          {
            descricao: {
              [Op.iLike]: `%${pesquisa}%`,
            },
          },
        ],
      },
    });

    return data;
  };
export const getDadosPesquisaDescMedidaControleIndividualExistenteService =
  async (empresa_id: any, pesquisa: any) => {
    const data = await CadastroMedidaControleIndividualExistente.findAll({
      where: {
        empresa_id: empresa_id, // Busca exata pelo ID da empresa
        [Op.or]: [
          {
            descricao: {
              [Op.iLike]: `%${pesquisa}%`,
            },
          },
        ],
      },
    });

    return data;
  };
export const getDadosPesquisaDescMedidaControleColetivaNecessariaService =
  async (empresa_id: any, pesquisa: any) => {
    const data = await CadastroMedidaControleColetivaNecessaria.findAll({
      where: {
        empresa_id: empresa_id, // Busca exata pelo ID da empresa
        [Op.or]: [
          {
            descricao: {
              [Op.iLike]: `%${pesquisa}%`,
            },
          },
        ],
      },
    });

    return data;
  };
export const getDadosPesquisaDescMedidaControleAdministrativaNecessariaService =
  async (empresa_id: any, pesquisa: any) => {
    const data = await CadastroMedidaControleAdministrativaNecessaria.findAll({
      where: {
        empresa_id: empresa_id, // Busca exata pelo ID da empresa
        [Op.or]: [
          {
            descricao: {
              [Op.iLike]: `%${pesquisa}%`,
            },
          },
        ],
      },
    });

    return data;
  };
export const getDadosPesquisaDescMedidaControleIndividualNecessariaService =
  async (empresa_id: any, pesquisa: any) => {
    const data = await CadastroMedidaControleIndividualNecessaria.findAll({
      where: {
        empresa_id: empresa_id, // Busca exata pelo ID da empresa
        [Op.or]: [
          {
            descricao: {
              [Op.iLike]: `%${pesquisa}%`,
            },
          },
        ],
      },
    });

    return data;
  };
export const getDadosPesquisaDescTipoPgrService = async (
  empresa_id: any,
  pesquisa: any
) => {
  const data = await CadastroTipoPgr.findAll({
    where: {
      empresa_id: empresa_id, // Busca exata pelo ID da empresa
      [Op.or]: [
        {
          descricao: {
            [Op.iLike]: `%${pesquisa}%`,
          },
        },
      ],
    },
  });

  return data;
};
export const getDadosPesquisaDescCursoObrigatorioService = async (
  empresa_id: any,
  pesquisa: any
) => {
  const data = await CadastroCursoObrigatorio.findAll({
    where: {
      empresa_id: empresa_id, // Busca exata pelo ID da empresa
      [Op.or]: [
        {
          descricao: {
            [Op.iLike]: `%${pesquisa}%`,
          },
        },
      ],
    },
  });

  return data;
};

export const getDadosPesquisaTrabalhadoresService = async (
  empresa_id: any,
  pesquisa: any,
  email: any
) => {

  const servico = await getOneServico(empresa_id, email);

  const data = await Trabalhadores.findAll({
    where: {
      servico_id: servico?.servicoselecionado ?? undefined,
      empresa_id: empresa_id, 
      [Op.or]: [
        {
          codigo: {
            [Op.iLike]: `%${pesquisa}%`,
          },
        },
        {
          nome: {
            [Op.iLike]: `%${pesquisa}%`,
          } as any,
        },
        {
          cpf: {
            [Op.iLike]: `%${pesquisa}%`,
          } as any,
        },
        {
          cargo: {
            [Op.iLike]: `%${pesquisa}%`,
          } as any,
        },
      ],
    },
  });

  return data;
};

export const getDadosPesquisaMobiliariosService = async (
  empresa_id: any,
  pesquisa: any
) => {
  const data = await CadastroMobiliario.findAll({
    where: {
      empresa_id: empresa_id,
      [Op.or]: [
        {
          descricao: {
            [Op.iLike]: `%${pesquisa}%`,
          },
        },
      ],
    },
  });

  return data;
};

export const getDadosPesquisaParedeService = async (
  empresa_id: any,
  pesquisa: any
) => {
  const data = await CadastroParede.findAll({
    where: {
      empresa_id: empresa_id,
      [Op.or]: [
        {
          descricao: {
            [Op.iLike]: `%${pesquisa}%`,
          },
        },
      ],
    },
  });

  return data;
};

export const getDadosPesquisaPisoService = async (
  empresa_id: any,
  pesquisa: any
) => {
  const data = await CadastroPiso.findAll({
    where: {
      empresa_id: empresa_id,
      [Op.or]: [
        {
          descricao: {
            [Op.iLike]: `%${pesquisa}%`,
          },
        },
      ],
    },
  });

  return data;
};

export const getDadosPesquisaDescResponsaveisTecnicosService = async (
  empresa_id: any,
  pesquisa: any
) => {
  const data = await ResponsavelTecnico.findAll({
    where: {
      empresa_id: empresa_id,
      [Op.or]: [
        {
          [Op.or]: [
            {
              nome: {
                [Op.iLike]: `%${pesquisa}%`,
              },
            },
            {
              funcao: {
                [Op.iLike]: `%${pesquisa}%`,
              } as any,
            }
          ],
        },
      ],
    },
  });

  return data;
};