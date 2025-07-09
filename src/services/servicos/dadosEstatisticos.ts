import DadosEstatisticos, { DadosEstatisticosAttributes, DadosEstatisticosCreationAttributes } from "../../models/DadosEstatisticos";


export const postDadosEstatisticos = (params: DadosEstatisticosCreationAttributes) => {
    try {
        const data = DadosEstatisticos.create(params);
        return data;
    } catch (error) {
        return error;
    }
}

export const getAllDadosEstatisticos = (empresaId: number, servicoId: number) => {
    try {
        const data = DadosEstatisticos.findAll({ where: { empresa_id: empresaId, servico_id: servicoId } });
        return data;
    } catch (error) {
        return error;
    }
}

export const deleteDadosEstatisticos = (empresaId: number, dadoestatisticoid: string) => {
    try {
        const data = DadosEstatisticos.destroy({ where: { empresa_id: empresaId, id: dadoestatisticoid } });
        return data;
    } catch (error) {
        return error;
    }
}

export const getDataDadosEstatisticosByOneLaudoType = (empresaId: number, servicoId: number, laudoType: string) => {
    try {
        const data = DadosEstatisticos.findAll(
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