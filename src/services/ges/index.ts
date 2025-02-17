import { AmbienteTrabalho } from "../../models/AmbienteTrabalho";
import { CadastroEdificacao } from "../../models/Edificacoes";
import { Ges, GesCreationAttributes } from "../../models/Ges";
import { CadastroIluminacao } from "../../models/Iluminacoes";
import { CadastroParede } from "../../models/Paredes";
import { CadastroPiso } from "../../models/Pisos";
import { VeiculosAmbienteTrabalho } from "../../models/subdivisoesAmbienteTrabalho/VeiculosAmbientesTrabalho";
import { GesCurso } from "../../models/subdivisoesGes/GesCursos";
import { GesRac } from "../../models/subdivisoesGes/GesRacs";
import { GesTipoPgr } from "../../models/subdivisoesGes/GesTiposPgrs";
import { GesTrabalhador } from "../../models/subdivisoesGes/GesTrabalhadores";
import { CadastroTeto } from "../../models/Tetos";
import { CadastroVeiculo } from "../../models/Veiculos";
import { CadastroVentilacao } from "../../models/Ventilacoes";
import { ATPostService } from "../ambientesTrabalho";

export const gesPostService = async (
    empresa_id: number,
    listCurso: any[],
    listRac: { label: string; value: number; literalValue: string }[],
    listTipoPgr: { label: string; value: number; literalValue: string }[],
    listTrabalhadores: { label: string; value: number; literalValue: string }[],
    params:any,
    listequipamentos: { label: string; value: number; literalValue: string }[],
    listmobiliarios: { label: string; value: number; literalValue: string }[],
    listveiculos: { label: string; value: number; literalValue: string }[],
    paramsAT: any
) => {

        const ges = await Ges.create({ ...params, empresa_id });
        const id_ges = ges.get("id") as number;
      
        await ATPostService(empresa_id, listequipamentos, listmobiliarios, listveiculos, paramsAT, id_ges);
        await gesCursoPost(empresa_id, id_ges, listCurso);
        await gesRacsPost(empresa_id, id_ges, listRac);
        await GesTipoPgrPost(empresa_id, id_ges, listTipoPgr);
        await GesTrabalhadoresPost(empresa_id, id_ges, listTrabalhadores);
        
        return ges;
};

export const gesCursoPost = async (
    empresa_id: number,
    id_ges: number,
    listCurso: { label: string; value: number; literalValue: string }[]
) => {
        await Promise.all(
            listCurso.map((curso) =>
                GesCurso.create({
                    id_ges,
                    id_curso: curso.value
                })
            )
        );

};

export const gesRacsPost = async (
    empresa_id: number,
    id_ges: number,
    listCurso: { label: string; value: number; literalValue: string }[]
) => {
        await Promise.all(
            listCurso.map((curso) =>
                GesRac.create({
                    id_ges,
                    id_rac: curso.value
                })
            )
        );

};

export const GesTipoPgrPost = async (
    empresa_id: number,
    id_ges: number,
    listCurso: { label: string; value: number; literalValue: string }[]
) => {
        await Promise.all(
            listCurso.map((curso) =>
                GesTipoPgr.create({
                    id_ges,
                    id_tipo_pgr: curso.value
                })
            )
        );
};

export const GesTrabalhadoresPost = async (
    empresa_id: number,
    id_ges: number,
    listCurso:any[]
) => {
        await Promise.all(
            listCurso.map((curso) =>
                GesTrabalhador.create({
                    id_ges,
                    id_trabalhador: curso.value
                })
            )
        );

};

export const getAllGesService = async (empresa_id: number) => {
        const data = await Ges.findAll({
            where: {
                empresa_id
            },
            include: [
                { model: GesCurso, as: "cursos" },
                { model: GesRac, as: "racs" },
                { model: GesTipoPgr, as: "tiposPgr" },
                { model: GesTrabalhador, as: "trabalhadores" },
                { model: AmbienteTrabalho, as: "ambientesTrabalhos" },
                
            ]
        });

        return data;

};


export const getOneGesService = async (empresa_id: number, idges: number) => {
    const data = await Ges.findOne({
        where: {
            empresa_id,
            id: idges
        },
        include: [
            { model: GesCurso, as: "cursos" },
            { model: GesRac, as: "racs" },
            { model: GesTipoPgr, as: "tiposPgr" },
            { model: GesTrabalhador, as: "trabalhadores" },
            { 
                model: AmbienteTrabalho, 
                as: "ambientesTrabalhos", 
                include: [
                    { model: CadastroTeto, as: "teto", attributes: ["descricao"] },
                    { model: CadastroEdificacao, as: "edificacao", attributes: ["descricao"] },
                    { model: CadastroParede, as: "parede", attributes: ["descricao"] },
                    { model: CadastroVentilacao, as: "ventilacao", attributes: ["descricao"] },
                    { model: CadastroIluminacao, as: "iluminacao", attributes: ["descricao"] },
                    { model: CadastroPiso, as: "piso", attributes: ["descricao"] },
                    { 
                        model: VeiculosAmbienteTrabalho, 
                        as: "veiculoat", 
                        
                    }
                ]
            }
        ]
    });

    return data;
};

