import MemorialProcessos, { MemorialProcessosAttributes, MemorialProcessosCreationAttributes } from "../../models/MemorialProcessos";


export const postMemorialProcessos = (params: MemorialProcessosCreationAttributes) => {
    try {
        const data = MemorialProcessos.create(params);
        return data;
    } catch (error) {
        return error;
    }
}

export const putMemorialProcessos = (id: number, params: MemorialProcessosCreationAttributes) => {
    try {
        const data = MemorialProcessos.update(params, { where: { id } });
        return data;
    } catch (error) {
        return error;
    }
}

export const getAllMemorialProcessos = (empresaId: number, servicoId: number) => {
    try {
        const data = MemorialProcessos.findAll({ where: { empresa_id: empresaId, servico_id: servicoId } });
        return data;
    } catch (error) {
        return error;
    }
}

export const getOneMemorialProcessos = (empresaId: number, servicoId: number) => {
    try {
        const data = MemorialProcessos.findAll({ where: { empresa_id: empresaId, id: servicoId } });
        return data;
    } catch (error) {
        return error;
    }
}

export const deleteMemorialProcessos = (empresaId: number, memorialProcessoid: string) => {
    try {
        const data = MemorialProcessos.destroy({ where: { empresa_id: empresaId, id: memorialProcessoid } });
        return data;
    } catch (error) {
        return error;
    }
}

export const getDataMemorialProcessosByOneLaudoType = (empresaId: number, servicoId: number, laudoType: string) => {
    try {
        const data = MemorialProcessos.findAll(
            { where: 
                { empresa_id: empresaId, servico_id: servicoId, tipo_laudo: laudoType },
                attributes: ['url_imagem', 'descricao']
            }
        );
        return data;
    } catch (error) {
        return error;
    }
}