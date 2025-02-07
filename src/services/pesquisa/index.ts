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

export const getDadosPesquisaCnpjNomeService = async (empresa_id: any, pesquisa: any) => {
    try {
        const data = await Cliente.findAll({
            where: {
                empresa_id: empresa_id, // Busca exata pelo ID da empresa
                [Op.or]: [
                    {
                        cnpj: {
                            [Op.iLike]: `%${pesquisa}%` // Pesquisa parcial no CNPJ
                        }
                    },
                    {
                        nome_fantasia: {
                            [Op.iLike]: `%${pesquisa}%` // Pesquisa parcial no Nome Fantasia
                        }
                    }
                ]
            }
        });

        return data; // Retorna os dados encontrados
    } catch (error) {
        console.error("Erro ao buscar dados do cliente:", error);
        throw error; // Lança o erro para o controlador ou camada superior tratar
    }
};

export const getDadosPesquisaDescDtIniDtFimService = async (empresa_id: any, pesquisa: any) => {
    try {
        const data = await Servicos.findAll({
            where: {
                empresa_id: empresa_id, // Busca exata pelo ID da empresa
                [Op.or]: [
                    {
                        descricao: {
                            [Op.iLike]: `%${pesquisa}%` 
                        }
                    },
                    {
                        data_inicio: {
                            [Op.iLike]: `%${pesquisa}%`
                        } as any
                    },
                    {
                        data_fim: {
                            [Op.iLike]: `%${pesquisa}%`
                        } as any
                    }
                ]
            }
        });

        return data;
    } catch (error) {
        console.error("Erro ao buscar dados do cliente:", error);
        throw error; // Lança o erro para o controlador ou camada superior tratar
    }
};

export const getDadosPesquisaDescGerenciaService = async (empresa_id: any, pesquisa: any) => {
    try {
        const data = await CadastroGerencia.findAll({
            where: {
                empresa_id: empresa_id, // Busca exata pelo ID da empresa
                [Op.or]: [
                    {
                        descricao: {
                            [Op.iLike]: `%${pesquisa}%` 
                        }
                    }
                ]
            }
        });

        return data;
    } catch (error) {
        console.error("Erro ao buscar dados do cliente:", error);
        throw error; // Lança o erro para o controlador ou camada superior tratar
    }   
}

export const getDadosPesquisaDescCargoService = async (empresa_id: any, pesquisa: any) => {
    try {
        const data = await CadastroCargo.findAll({
            where: {
                empresa_id: empresa_id, // Busca exata pelo ID da empresa
                [Op.or]: [
                    {
                        descricao: {
                            [Op.iLike]: `%${pesquisa}%` 
                        }
                    }
                ]
            }
        });

        return data;
    } catch (error) {
        console.error("Erro ao buscar dados do cliente:", error);
        throw error; // Lança o erro para o controlador ou camada superior tratar
    }   
}

export const getDadosPesquisaDescSetorService = async (empresa_id: any, pesquisa: any) => {
    try {
        const data = await CadastroSetor.findAll({
            where: {
                empresa_id: empresa_id, // Busca exata pelo ID da empresa
                [Op.or]: [
                    {
                        descricao: {
                            [Op.iLike]: `%${pesquisa}%` 
                        }
                    }
                ]
            }
        });

        return data;
    } catch (error) {
        console.error("Erro ao buscar dados do cliente:", error);
        throw error; // Lança o erro para o controlador ou camada superior tratar
    }   
}
export const getDadosPesquisaDescFuncaoService = async (empresa_id: any, pesquisa: any) => {
    try {
        const data = await CadastroFuncao.findAll({
            where: {
                empresa_id: empresa_id, // Busca exata pelo ID da empresa
                [Op.or]: [
                    {
                        descricao: {
                            [Op.iLike]: `%${pesquisa}%` 
                        }
                    }
                ]
            }
        });

        return data;
    } catch (error) {
        console.error("Erro ao buscar dados do cliente:", error);
        throw error; // Lança o erro para o controlador ou camada superior tratar
    }   
}
export const getDadosPesquisaDescTetoService = async (empresa_id: any, pesquisa: any) => {
    try {
        const data = await CadastroTeto.findAll({
            where: {
                empresa_id: empresa_id, // Busca exata pelo ID da empresa
                [Op.or]: [
                    {
                        descricao: {
                            [Op.iLike]: `%${pesquisa}%` 
                        }
                    }
                ]
            }
        });

        return data;
    } catch (error) {
        console.error("Erro ao buscar dados do cliente:", error);
        throw error; // Lança o erro para o controlador ou camada superior tratar
    }   
}
export const getDadosPesquisaDescRacService = async (empresa_id: any, pesquisa: any) => {
    try {
        const data = await CadastroRac.findAll({
            where: {
                empresa_id: empresa_id, // Busca exata pelo ID da empresa
                [Op.or]: [
                    {
                        descricao: {
                            [Op.iLike]: `%${pesquisa}%` 
                        }
                    }
                ]
            }
        });

        return data;
    } catch (error) {
        console.error("Erro ao buscar dados do cliente:", error);
        throw error; // Lança o erro para o controlador ou camada superior tratar
    }   
}
export const getDadosPesquisaDescIluminacaoService = async (empresa_id: any, pesquisa: any) => {
    try {
        const data = await CadastroIluminacao.findAll({
            where: {
                empresa_id: empresa_id, // Busca exata pelo ID da empresa
                [Op.or]: [
                    {
                        descricao: {
                            [Op.iLike]: `%${pesquisa}%` 
                        }
                    }
                ]
            }
        });

        return data;
    } catch (error) {
        console.error("Erro ao buscar dados do cliente:", error);
        throw error; // Lança o erro para o controlador ou camada superior tratar
    }   
}
export const getDadosPesquisaDescEquipamentoService = async (empresa_id: any, pesquisa: any) => {
    try {
        const data = await CadastroEquipamento.findAll({
            where: {
                empresa_id: empresa_id, // Busca exata pelo ID da empresa
                [Op.or]: [
                    {
                        descricao: {
                            [Op.iLike]: `%${pesquisa}%` 
                        }
                    }
                ]
            }
        });

        return data;
    } catch (error) {
        console.error("Erro ao buscar dados do cliente:", error);
        throw error; // Lança o erro para o controlador ou camada superior tratar
    }   
}
export const getDadosPesquisaDescEdificacaoService = async (empresa_id: any, pesquisa: any) => {
    try {
        const data = await CadastroEdificacao.findAll({
            where: {
                empresa_id: empresa_id, // Busca exata pelo ID da empresa
                [Op.or]: [
                    {
                        descricao: {
                            [Op.iLike]: `%${pesquisa}%` 
                        }
                    }
                ]
            }
        });

        return data;
    } catch (error) {
        console.error("Erro ao buscar dados do cliente:", error);
        throw error; // Lança o erro para o controlador ou camada superior tratar
    }   
}
export const getDadosPesquisaDescVentilacaoService = async (empresa_id: any, pesquisa: any) => {
    try {
        const data = await CadastroVentilacao.findAll({
            where: {
                empresa_id: empresa_id, // Busca exata pelo ID da empresa
                [Op.or]: [
                    {
                        descricao: {
                            [Op.iLike]: `%${pesquisa}%` 
                        }
                    }
                ]
            }
        });

        return data;
    } catch (error) {
        console.error("Erro ao buscar dados do cliente:", error);
        throw error; // Lança o erro para o controlador ou camada superior tratar
    }   
}
export const getDadosPesquisaDescVeiculoService = async (empresa_id: any, pesquisa: any) => {
    try {
        const data = await CadastroVeiculo.findAll({
            where: {
                empresa_id: empresa_id, // Busca exata pelo ID da empresa
                [Op.or]: [
                    {
                        descricao: {
                            [Op.iLike]: `%${pesquisa}%` 
                        }
                    }
                ]
            }
        });

        return data;
    } catch (error) {
        console.error("Erro ao buscar dados do cliente:", error);
        throw error; // Lança o erro para o controlador ou camada superior tratar
    }   
}
export const getDadosPesquisaDescTipoPgrService = async (empresa_id: any, pesquisa: any) => {
    try {
        const data = await CadastroTipoPgr.findAll({
            where: {
                empresa_id: empresa_id, // Busca exata pelo ID da empresa
                [Op.or]: [
                    {
                        descricao: {
                            [Op.iLike]: `%${pesquisa}%` 
                        }
                    }
                ]
            }
        });

        return data;
    } catch (error) {
        console.error("Erro ao buscar dados do cliente:", error);
        throw error; // Lança o erro para o controlador ou camada superior tratar
    }   
}
export const getDadosPesquisaDescCursoObrigatorioService = async (empresa_id: any, pesquisa: any) => {
    try {
        const data = await CadastroCursoObrigatorio.findAll({
            where: {
                empresa_id: empresa_id, // Busca exata pelo ID da empresa
                [Op.or]: [
                    {
                        descricao: {
                            [Op.iLike]: `%${pesquisa}%` 
                        }
                    }
                ]
            }
        });

        return data;
    } catch (error) {
        console.error("Erro ao buscar dados do cliente:", error);
        throw error; // Lança o erro para o controlador ou camada superior tratar
    }   
}

export const getDadosPesquisaTrabalhadoresService = async (empresa_id: any, pesquisa: any) => {
    try {
        const data = await Trabalhadores.findAll({
            where: {
                empresa_id: empresa_id, // Busca exata pelo ID da empresa
                [Op.or]: [
                    {
                        codigo: {
                            [Op.iLike]: `%${pesquisa}%` 
                        }
                    },
                    {
                        nome: {
                            [Op.iLike]: `%${pesquisa}%`
                        } as any
                    },
                    {
                        cpf: {
                            [Op.iLike]: `%${pesquisa}%`
                        } as any
                    },
                    {
                        cargo: {
                            [Op.iLike]: `%${pesquisa}%`
                        } as any
                    }
                ]
            }
        });

        return data;
    } catch (error) {
        console.error("Erro ao buscar dados do trabalhador:", error);
        throw error; // Lança o erro para o controlador ou camada superior tratar
    }
};
