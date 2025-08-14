import ResponsavelTecnicoServico, { ResponsavelTecnicoServicoCreationAttributes } from "../../models/ResponsaveisTecnicosServicos";
import ResponsavelTecnico from "../../models/ResponsavelTecnico";

export const getAllResponsavelTecnicoService = async (empresaId: number) => {   
        const data = await ResponsavelTecnico.findAll({
            where: { empresa_id: Number(empresaId) },
        });
        return data;
}

export const postResponsavelTecnicoService = async (params: any) => {
        const data = await ResponsavelTecnico.create(params);
        return data;
}

export const getOneResponsavelTecnicoService = async (empresaId: number, idresponsaveltecnico: number) => {
        const data = await ResponsavelTecnico.findOne({
            where: { empresa_id: Number(empresaId), id: Number(idresponsaveltecnico) },
        });
        return data;
}

export const putResponsavelTecnicoService = async (id:number, empresaId:number, params: any) => {
        const data = await ResponsavelTecnico.update(params, {
            where: { id: Number(id), empresa_id: Number(empresaId) },
        });
        return data;
}

export const deleteResponsavelTecnicoService = async (empresaId: number, idresponsaveltecnico: number) => {
        const data = await ResponsavelTecnico.destroy({
            where: { empresa_id: Number(empresaId), id: Number(idresponsaveltecnico) },
        });
        return data;
}

export const postResponsavelTecnicoServicoService = async (params: ResponsavelTecnicoServicoCreationAttributes) => {
        const data = await ResponsavelTecnicoServico.create(params);
        return data;
}       

export const getAllResponsavelTecnicoServicoService = async (empresaId: number, servicoId: number) => {
        const data = await ResponsavelTecnicoServico.findAll({
            where: { empresa_id: Number(empresaId), servico_id: Number(servicoId) },
            attributes: ['id', 'responsavel_tecnico_id'],
            include: [{
                model: ResponsavelTecnico,
                as: "responsavelTecnico",
                attributes: ['nome', 'funcao'],
            }],
        });
        return data;
}

export const deleteServicoServicoService = async (empresaId: number, idResponsavelTecnicoServico: number) => {
        const data = await ResponsavelTecnicoServico.destroy({
            where: { empresa_id: Number(empresaId), id: Number(idResponsavelTecnicoServico) },
        });
        return data;
}

export const getOneResponsavelTecnicoServicoService = async (empresaId: number, servicoId: number) => {
        const data = await ResponsavelTecnicoServico.findAll({
            where: { empresa_id: Number(empresaId), servico_id: Number(servicoId) },
        });
        return data;
}

export const putResponsavelTecnicoServicoService = async (id: number, empresaId: number, params: ResponsavelTecnicoServicoCreationAttributes) => {
        const data = await ResponsavelTecnicoServico.update(params, {
            where: { id: Number(id), empresa_id: Number(empresaId) },
        });
        return data;
}