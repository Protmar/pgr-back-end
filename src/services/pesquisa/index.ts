import { Op } from "sequelize";
import { Cliente } from "../../models/Cliente";
import Servicos from "../../models/Servicos";
import { CadastroGerencia } from "../../models/Cadastro_gerencia";
import { CadastroCargo } from "../../models/CadastroCargo";
import { CadastroSetor } from "../../models/CadastroSetor";
import Trabalhadores from "../../models/Trabalhadores";
import { CadastroMobiliario } from "../../models/Cadastro_mobiliario";
import { CadastroParede } from "../../models/Cadastro_parede";
import { CadastroPiso } from "../../models/Cadastro_piso";

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

export const getDadosPesquisaMobiliariosService = async (empresa_id: any, pesquisa: any) => {
    try {
        const data = await CadastroMobiliario.findAll({
            where: {
                empresa_id: empresa_id,
                [Op.or]: [
                    {
                        descricao: {
                            [Op.iLike]: `%${pesquisa}%` 
                        }
                    },
                ]
            }
        });

        return data;
    } catch (error) {
        console.error("Erro ao buscar dados do cliente:", error);
        throw error; 
    }
}

export const getDadosPesquisaParedeService = async (empresa_id: any, pesquisa: any) => {
    try {
        const data = await CadastroParede.findAll({
            where: {
                empresa_id: empresa_id,
                [Op.or]: [
                    {
                        descricao: {
                            [Op.iLike]: `%${pesquisa}%` 
                        }
                    },
                ]
            }
        }); 

        return data;    
    } catch (error) {
        console.error("Erro ao buscar dados do cliente:", error);
        throw error; 
    }
}

export const getDadosPesquisaPisoService = async (empresa_id: any, pesquisa: any) => {
    try {
        const data = await CadastroPiso.findAll({
            where: {
                empresa_id: empresa_id,
                [Op.or]: [
                    {
                        descricao: {
                            [Op.iLike]: `%${pesquisa}%` 
                        }
                    },
                ]
            }
        }); 

        return data;    
    } catch (error) {
        console.error("Erro ao buscar dados do cliente:", error);
        throw error; 
    }
}