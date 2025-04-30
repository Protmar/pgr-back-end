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