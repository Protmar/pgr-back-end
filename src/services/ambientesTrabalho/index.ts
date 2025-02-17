import { AmbienteTrabalho } from "../../models/AmbienteTrabalho";
import { Ges, GesCreationAttributes } from "../../models/Ges";
import { EquipamentosAmbienteTrabalho } from "../../models/subdivisoesAmbienteTrabalho/EquipamentosAmbienteTrabalho";
import { MobiliarioAmbienteTrabalho } from "../../models/subdivisoesAmbienteTrabalho/MobiliarioAmbienteTrabalho";
import { VeiculosAmbienteTrabalho } from "../../models/subdivisoesAmbienteTrabalho/VeiculosAmbientesTrabalho";

export const ATPostService = async (
    empresa_id: number,
    listequipamentos: { label: string; value: number; literalValue: string }[],
    listmobiliarios: { label: string; value: number; literalValue: string }[],
    listveiculos: { label: string; value: number; literalValue: string }[],
    params:any,
    ges_id:number
) => {
    try {
        const AT = await AmbienteTrabalho.create({ ...params, empresa_id, ges_id });
        const id_AT = AT.get("id") as number;
      
        
        await ATEquipamentosPost(empresa_id, id_AT, listequipamentos);
        await ATMobiliariosPost(empresa_id, id_AT, listmobiliarios);
        await ATVeiculosPost(empresa_id, id_AT, listveiculos);
        
        return AT;
    } catch (error) {
        console.error("Erro ao criar Ambiente de Trabalho:", error);
        throw new Error("Erro ao criar Ambiente de Trabalho");
    }
};

export const ATEquipamentosPost = async (
    empresa_id: number,
    id_ambiente_trabalho: number,
    listCurso: { label: string; value: number; literalValue: string }[]
) => {
    try {
        await Promise.all(
            listCurso.map((curso) =>
                EquipamentosAmbienteTrabalho.create({
                    empresa_id,
                    id_ambiente_trabalho,
                    id_equipamentos: curso.value
                })
            )
        );
    } catch (error) {
        console.error("Erro ao associar cursos ao Ges:", error);
        throw new Error("Erro ao associar cursos ao Ges");
    }
};


export const ATMobiliariosPost = async (
    empresa_id: number,
    id_ambiente_trabalho: number,
    listCurso: { label: string; value: number; literalValue: string }[]
) => {
    try {
        await Promise.all(
            listCurso.map((curso) =>
                MobiliarioAmbienteTrabalho.create({
                    empresa_id,
                    id_ambiente_trabalho,
                    id_mobiliario: curso.value
                })
            )
        );
    } catch (error) {
        console.error("Erro ao associar RACS ao Ges:", error);
        throw new Error("Erro ao associar cursos ao Ges");
    }
};

export const ATVeiculosPost = async (
    empresa_id: number,
    id_ambiente_trabalho: number,
    listCurso: { label: string; value: number; literalValue: string }[]
) => {
    try {
        await Promise.all(
            listCurso.map((curso) =>
                VeiculosAmbienteTrabalho.create({
                    empresa_id,
                    id_ambiente_trabalho,
                    id_veiculos: curso.value
                })
            )
        );
    } catch (error) {
        console.error("Erro ao associar Tipos de PGR ao Ges:", error);
        throw new Error("Erro ao associar cursos ao Ges");
    }
};