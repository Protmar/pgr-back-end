import { AmbienteTrabalho } from "../../models/AmbienteTrabalho";
import { Ges, GesCreationAttributes } from "../../models/Ges";
import { EquipamentosAmbienteTrabalho } from "../../models/subdivisoesAmbienteTrabalho/EquipamentosAmbienteTrabalho";
import { MobiliarioAmbienteTrabalho } from "../../models/subdivisoesAmbienteTrabalho/MobiliarioAmbienteTrabalho";
import { VeiculosAmbienteTrabalho } from "../../models/subdivisoesAmbienteTrabalho/VeiculosAmbientesTrabalho";
import uploadFileToS3 from "../aws/s3";

export const ATPostService = async (

    empresa_id: number,
    listequipamentos: { label: string; value: number; literalValue: string }[],
    listmobiliarios: { label: string; value: number; literalValue: string }[],
    listveiculos: { label: string; value: number; literalValue: string }[],
    params:any,
    ges_id:number,
    pathFluxograma?: string, 
    fileName?: string, 
    mimeType?: string,
    
) => {

        const AT = await AmbienteTrabalho.create({ ...params, empresa_id, ges_id });
        const id_AT = AT.get("id") as number;
              
        await ATEquipamentosPost(empresa_id, id_AT, listequipamentos);
        await ATMobiliariosPost(empresa_id, id_AT, listmobiliarios);
        await ATVeiculosPost(empresa_id, id_AT, listveiculos);
        if(pathFluxograma && fileName && mimeType){
            await uploadFileToS3(id_AT, pathFluxograma, fileName, mimeType);
        }
        return AT;

};

export const ATEquipamentosPost = async (
    empresa_id: number,
    id_ambiente_trabalho: number,
    listequipamentos: any[]
) => {
    
        if (listequipamentos.length === 0) {
            listequipamentos = [];
        }

        await Promise.all(
            listequipamentos.map((curso) =>
                EquipamentosAmbienteTrabalho.create({
                    empresa_id,
                    id_ambiente_trabalho,
                    id_equipamentos: curso.value
                })
            )
        );
};



export const ATMobiliariosPost = async (
    empresa_id: number,
    id_ambiente_trabalho: number,
    listmobiliarios: any[]
) => {
        if (listmobiliarios.length === 0) {
            listmobiliarios = [];
        }

        await Promise.all(
            listmobiliarios.map((curso) =>
                MobiliarioAmbienteTrabalho.create({
                    empresa_id,
                    id_ambiente_trabalho,
                    id_mobiliario: curso.value
                })
            )
        );
    
};

export const ATVeiculosPost = async (
    empresa_id: number,
    id_ambiente_trabalho: number,
    listveiculos: any[]
) => {
    
        if (listveiculos.length === 0) {
            listveiculos = [];
        }

        await Promise.all(
            listveiculos.map((curso) =>
                VeiculosAmbienteTrabalho.create({
                    empresa_id,
                    id_ambiente_trabalho,
                    id_veiculos: curso.value
                })
            )
        );
};

export const ATPutService = async (
    empresa_id: number,
    data: any,
    params: any,
    ges_id: number
) => {
    // Busca o AmbienteTrabalho pelo ges_id
    const AT = await AmbienteTrabalho.findOne({ where: { ges_id } });

    if (!AT) {
        throw new Error("Registro de Ambiente de Trabalho não encontrado.");
    }

    const id_AT = AT.get("id") as number;
    await AT.update({ ...params, empresa_id });
    await ATEquipamentosPut(empresa_id, id_AT, data.equipamentos);
    await ATMobiliariosPut(empresa_id, id_AT, data.mobiliarios);
    await ATVeiculosPut(empresa_id, id_AT, data.veiculos);


    return AT;
};

export const ATEquipamentosPut = async (
    empresa_id: number,
    id_ambiente_trabalho: number,
    listequipamentos: any
) => {

    listequipamentos.deletedEquipamentos.map(async (e: any) => {
        await EquipamentosAmbienteTrabalho.destroy({
            where: {
                id: e.id
            }
        })
    })
    
    listequipamentos.updatedEquipamentos.map(async (e: any) => {
        await EquipamentosAmbienteTrabalho.create({
            id_ambiente_trabalho,
            id_equipamentos: e.value
        })
    })
};

export const ATMobiliariosPut = async (
    empresa_id: number,
    id_ambiente_trabalho: number,
    listMobiliario: any
) => {

    listMobiliario.deletedMobiliarios.map(async (e: any) => {
        await MobiliarioAmbienteTrabalho.destroy({
            where: {
                id: e.id
            }
        })
    })
    
    listMobiliario.updatedMobiliarios.map(async (e: any) => {
        await MobiliarioAmbienteTrabalho.create({
            id_ambiente_trabalho,
            id_mobiliario: e.value
        })
    })
};

export const ATVeiculosPut = async (
    empresa_id: number,
    id_ambiente_trabalho: number,
    listVeiculos: any
) => {

    listVeiculos.deletedVeiculos.map(async (e: any) => {
        await VeiculosAmbienteTrabalho.destroy({
            where: {
                id: e.id
            }
        })
    })
    
    listVeiculos.updatedVeiculos.map(async (e: any) => {
        await VeiculosAmbienteTrabalho.create({
            id_ambiente_trabalho,
            id_veiculos: e.value
        })
    })

};
