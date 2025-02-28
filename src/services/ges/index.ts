import { AmbienteTrabalho } from "../../models/AmbienteTrabalho";
import { CadastroEdificacao } from "../../models/Edificacoes";
import { Ges, GesCreationAttributes } from "../../models/Ges";
import { CadastroIluminacao } from "../../models/Iluminacoes";
import { CadastroParede } from "../../models/Paredes";
import { CadastroPiso } from "../../models/Pisos";
import { CadastroVeiculo } from "../../models/Veiculos";
import { VeiculosAmbienteTrabalho } from "../../models/subdivisoesAmbienteTrabalho/VeiculosAmbientesTrabalho";
import { GesCurso } from "../../models/subdivisoesGes/GesCursos";
import { GesRac } from "../../models/subdivisoesGes/GesRacs";
import { GesTipoPgr } from "../../models/subdivisoesGes/GesTiposPgrs";
import { GesTrabalhador } from "../../models/subdivisoesGes/GesTrabalhadores";
import { CadastroTeto } from "../../models/Tetos";
import { CadastroVentilacao } from "../../models/Ventilacoes";
import { ATPostService, ATPutService } from "../ambientesTrabalho";
import { MobiliarioAmbienteTrabalho } from "../../models/subdivisoesAmbienteTrabalho/MobiliarioAmbienteTrabalho";
import { CadastroMobiliario } from "../../models/Mobiliarios";
import { EquipamentosAmbienteTrabalho } from "../../models/subdivisoesAmbienteTrabalho/EquipamentosAmbienteTrabalho";
import { CadastroEquipamento } from "../../models/Equipamentos";
import { CadastroRac } from "../../models/Racs";
import { CadastroCursoObrigatorio } from "../../models/Cursosobrigatorios";
import { CadastroTipoPgr } from "../../models/TipoPgrs";
import Trabalhadores from "../../models/Trabalhadores";
import uploadFileToS3 from "../aws/s3";
import { AtImagesUrls } from "../../models/subdivisoesAmbienteTrabalho/AtImagesUrls";

export const gesPostService = async (
    empresa_id: number,
    listCurso: any[],
    listRac: any[],
    listTipoPgr: { label: string; value: number; literalValue: string }[],
    listTrabalhadores: any[],
    params: any,
    listequipamentos: { label: string; value: number; literalValue: string }[],
    listmobiliarios: { label: string; value: number; literalValue: string }[],
    listveiculos: { label: string; value: number; literalValue: string }[],
    paramsAT: any,
    pathFluxograma: string,
    fileNameFluxograma: string,
    mimeTypeFluxograma: string
) => {

    const ges = await Ges.create({ ...params, empresa_id, nome_fluxograma: fileNameFluxograma });
    const id_ges = ges.get("id") as number;

    await ATPostService(empresa_id, listequipamentos, listmobiliarios, listveiculos, paramsAT, id_ges, pathFluxograma, fileNameFluxograma, mimeTypeFluxograma);
    await GesTrabalhadoresPost(empresa_id, id_ges, listTrabalhadores);
    await GesTipoPgrPost(empresa_id, id_ges, listTipoPgr);
    await gesRacsPost(empresa_id, id_ges, listRac);
    await gesCursoPost(empresa_id, id_ges, listCurso);
    return ges;
};

export const gesCursoPost = async (
    empresa_id: number,
    id_ges: number,
    listCurso: { label: string; value: number; literalValue: string }[]
) => {
    if (!listCurso) {
        return
    }
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
    listRac: any[]
) => {
    await Promise.all(
        listRac.map((curso) =>
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
    listTipoPgr: any[]
) => {
    if (!listTipoPgr) {
        return
    }
    await Promise.all(
        listTipoPgr.map((curso) =>
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
    listTrabalhadores: any[]
) => {

    await Promise.all(
        listTrabalhadores.map((curso) =>
            GesTrabalhador.create({
                id_ges,
                id_trabalhador: curso.id
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
            {
                model: GesCurso, as: "cursos"
                , include: [
                    {
                        model: CadastroCursoObrigatorio,
                        as: "curso",
                    }
                ]
            },
            {
                model: GesRac,
                as: "racs",
                include: [
                    {
                        model: CadastroRac,
                        as: "rac",
                    }
                ]
            },
            {
                model: GesTipoPgr, as: "tiposPgr",
                include: [
                    { model: CadastroTipoPgr, as: "tipoPgr" }
                ]
            },
            {
                model: GesTrabalhador,
                as: "trabalhadores",
                include: [
                    {
                        model: Trabalhadores,
                        as: "trabalhador", // A associação correta aqui é "trabalhador"
                    },
                ],
            },
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
                        as: "veiculosAmbienteTrabalho",
                        attributes: ["id"],
                        include: [
                            { model: CadastroVeiculo, as: "veiculo" },
                        ]
                    },
                    {
                        model: MobiliarioAmbienteTrabalho,
                        as: "MobiliarioAmbienteTrabalho",
                        attributes: ["id"],
                        include: [
                            { model: CadastroMobiliario, as: "mobiliario" },
                        ]
                    },
                    {
                        model: EquipamentosAmbienteTrabalho,
                        as: "EquipamentoAmbienteTrabalho",
                        attributes: ["id"],
                        include: [
                            { model: CadastroEquipamento, as: "equipamento" },
                        ]
                    },
                    { model: AtImagesUrls, as: "fluxogramaUrl" }
                ]
            }
        ]
    });

    return data;
};

export const gesPutService = async (
    newValuesMultiInput: any,
    empresa_id: number,
    id_ges: number,
    listTrabalhadores: any[],
    params: any,
    paramsAT: any,
    pathFluxograma: string,
    fileName: string,
    mimeType: string
) => {

    const ges = await Ges.findByPk(id_ges);
    if (!ges) {
        throw new Error("Registro GES não encontrado.");
    }

    await ges.update({ ...params, empresa_id });
    const at = await ATPutService(empresa_id, newValuesMultiInput, paramsAT, id_ges);
    await GesTrabalhadoresPut(empresa_id, id_ges, listTrabalhadores);
    await gesCursoPut(newValuesMultiInput.cursos, id_ges);
    await GesTipoPgrPut(newValuesMultiInput.tipoPgr, id_ges);
    await gesRacsPut(newValuesMultiInput.rac, id_ges);

    console.log(at)
    return ges;
};

export const gesCursoPut = async (
    cursos: any,
    id_ges: number,
) => {
    cursos.deletedCursos.map(async (e: any) => {
        await GesCurso.destroy({
            where: {
                id: e.id
            }
        })
    })
    
    cursos.updatedCursos.map(async (e: any) => {
        await GesCurso.create({
            id_ges,
            id_curso: e.value
        })
    })
};

export const gesRacsPut = async (
    racs: any,
    id_ges: number,
) => {
    racs.deletedRac.map((e: any) => {
        GesRac.destroy({
            where: {
                id: e.id
            }
        })
    })

    racs.updatedRac.map((e: any) => {
        GesRac.create({
            id_ges,
            id_rac: e.value
        })
    })
};



export const GesTipoPgrPut = async (
    tipoPgr: any,
    id_ges: number,
) => {
    tipoPgr.deletedTipoPgr.map((e: any) => {
        GesTipoPgr.destroy({
            where: {
                id: e.id
            }
        })
    })

    tipoPgr.updatedTipoPgr.map((e: any) => {
        GesTipoPgr.create({
            id_ges,
            id_tipo_pgr: e.value
        })
    })
};

export const GesTrabalhadoresPut = async (
    empresa_id: number,
    id_ges: number,
    listTrabalhadores: any[]
) => {
    await GesTrabalhador.destroy({ where: { id_ges } });

    if (listTrabalhadores && listTrabalhadores.length > 0) {
        await Promise.all(
            listTrabalhadores.map((trabalhador) =>
                GesTrabalhador.create({
                    id_ges,
                    id_trabalhador: trabalhador.id
                })
            )
        );
    }
};


export const gesDeleteService = async (ges_id: number) => {
    const data = Ges.destroy({
        where: { id: ges_id },
    });

    return data;
}