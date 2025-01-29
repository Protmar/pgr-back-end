import { Op } from "sequelize";
import { Cliente } from "../../models/Cliente";
import Servicos from "../../models/Servicos";

export const getDadosPesquisaCnpjNomeService = async (empresa_id: any, pesquisa: any) => {
    try {
        const data = await Cliente.findAll({
            where: {
                empresa_id: empresa_id, // Busca exata pelo ID da empresa
                [Op.or]: [
                    {
                        cnpj: {
                            [Op.like]: `%${pesquisa}%` // Pesquisa parcial no CNPJ
                        }
                    },
                    {
                        nome_fantasia: {
                            [Op.like]: `%${pesquisa}%` // Pesquisa parcial no Nome Fantasia
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
                            [Op.like]: `%${pesquisa}%` 
                        }
                    },
                    {
                        data_inicio: {
                            [Op.like]: `%${pesquisa}%`
                        } as any
                    },
                    {
                        data_fim: {
                            [Op.like]: `%${pesquisa}%`
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