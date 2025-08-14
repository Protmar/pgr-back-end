import ART, { ARTCreationAttributes } from "../../models/ART";


export const postArt = (params: ARTCreationAttributes) => {
    try {
        const data = ART.create(params);
        return data;
    } catch (error) {
        return error;
    }
}

export const putArt = (id: number, params: ARTCreationAttributes) => {
    try {
        const data = ART.update(params, { where: { id } });
        return data;
    } catch (error) {
        return error;
    }
}

export const getAllArt = (empresaId: number, servicoId: number) => {
    try {
        const data = ART.findAll({ where: { empresa_id: empresaId, servico_id: servicoId } });
        return data;
    } catch (error) {
        return error;
    }
}

export const getOneArt = (empresaId: number, servicoId: number) => {
    try {
        const data = ART.findAll({ where: { empresa_id: empresaId, id: servicoId } });
        return data;
    } catch (error) {
        return error;
    }
}

export const deleteArt = (empresaId: number, dadoestatisticoid: string) => {
    try {
        const data = ART.destroy({ where: { empresa_id: empresaId, id: dadoestatisticoid } });
        return data;
    } catch (error) {
        return error;
    }
}

export const getDataArtByOneLaudoType = (empresaId: number, servicoId: number, laudoType: string) => {
    try {
        const data = ART.findAll(
            { where: 
                { empresa_id: empresaId, servico_id: servicoId },
                attributes: ['url_imagem', 'descricao']
            }
        );
        return data;
    } catch (error) {
        return error;
    }
}