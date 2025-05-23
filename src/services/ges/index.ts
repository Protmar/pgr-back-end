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
import uploadFileToS3, { deleteFileToS3 } from "../aws/s3";
import { AtImagesUrls } from "../../models/subdivisoesAmbienteTrabalho/AtImagesUrls";
import { Sequelize } from "sequelize";
import { getCache } from "../../controllers/cliente/cliente";
import { CadastroFuncao } from "../../models/Funcoes";
import { Risco } from "../../models/Risco";
import { CadastroFatoresRisco } from "../../models/FatoresRisco";
import { CadastroFonteGeradora } from "../../models/FontesGeradoras";
import { CadastroMedidaControleAdministrativaExistente } from "../../models/MedidaControleAdministrativaExistente";
import { CadastroMedidaControleColetivaExistente } from "../../models/MedidaControleColetivaExistente";
import { CadastroMedidaControleIndividualExistente } from "../../models/MedidaControleIndividualExistente";
import { RiscoAdministrativoExistente } from "../../models/Risco/RiscoAdministrativoExistente";
import { RiscoColetivoExistente } from "../../models/Risco/RiscoColetivoExistente";
import { RiscoIndividualExistente } from "../../models/Risco/RiscoIndividualExistente";
import { CadastroCargo } from "../../models/Cargos";
import { PlanoAcaoRisco } from "../../models/Risco/PlanoAcao/PlanoAcaoRisco";

export const gesPostService = async (
    empresa_id: number,
    listCurso: any[],
    listRac: any[],
    listTrabalhadores: any[],
    params: any,
    listequipamentos: { label: string; value: number; literalValue: string }[],
    listmobiliarios: { label: string; value: number; literalValue: string }[],
    listveiculos: { label: string; value: number; literalValue: string }[],
    paramsAT: any,
    pathFluxograma?: string,
    fileNameFluxograma?: any,
    mimeTypeFluxograma?: string
) => {
    const cliente_id = globalThis.cliente_id;
    const servico_id = globalThis.servico_id;
    const ges = await Ges.create({ ...params, servico_id, empresa_id, nome_fluxograma: fileNameFluxograma, cliente_id });
    const id_ges = ges.get("id") as number;

    await ATPostService(empresa_id, listequipamentos, listmobiliarios, listveiculos, paramsAT, id_ges, pathFluxograma, fileNameFluxograma, mimeTypeFluxograma);
    await GesTrabalhadoresPost(empresa_id, id_ges, listTrabalhadores);
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
                id_trabalhador: curso.id,
                id_funcao: curso.funcao_id
            })
        )
    );

};

export const getAllGesService = async (empresa_id: number) => {
    const servico_id = globalThis.servico_id;;

    const data = await Ges.findAll({
        where: {
            empresa_id,
            servico_id: Number(servico_id)
        },
        include: [
            { model: GesCurso, as: "cursos" },
            { model: GesRac, as: "racs" },
            { model: GesTipoPgr, as: "tiposPgr" },
            {
                model: GesTrabalhador,
                as: "trabalhadores",
                include: [
                    {
                        model: Trabalhadores,
                        as: "trabalhador",
                        include: [
                            {
                                model: CadastroFuncao,
                                as: "funcao",
                            },
                        ]
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
                ]
            },

        ]
    });

    return data;

};


export const getOneGesRiscoService = async (empresa_id: number, idges: number, clienteId?: number) => {
    const whereClause: any = {
        empresa_id,
        id: idges,
    };

    if (clienteId !== undefined) {
        whereClause.cliente_id = Number(clienteId);
    }

    const data = await Ges.findOne({
        where: whereClause,
        include: [
            {
                model: Risco, as: "riscos",
                include: [
                    {
                        model: CadastroFatoresRisco,
                        as: "fatorRisco",
                    },
                    {
                        model: CadastroFonteGeradora,
                        as: "fonteGeradora",
                    },
                    {
                        model: RiscoAdministrativoExistente,
                        as: "risco_administrativa_existente",
                    },
                    {
                        model: RiscoColetivoExistente,
                        as: "risco_coletivo_existente",
                    },
                    {
                        model: RiscoIndividualExistente,
                        as: "risco_individual_existente",
                    }
                ],
            },
        ]
    })

    return data;
}

// services/ges/getRiscos.ts
export const getRiscos = async (empresa_id: number, idges: number) => {
    return Ges.findOne({
        where: { empresa_id, id: idges },
        include: [
            {
                model: Risco,
                as: "riscos",
                include: [
                    {
                        model: CadastroFatoresRisco,
                        as: "fatorRisco"
                    },
                    {
                        model: CadastroFonteGeradora,
                        as: "fonteGeradora"
                    },
                    {
                        model: RiscoAdministrativoExistente,
                        as: "relacoes_administrativas",
                        include: [
                            {
                                model: CadastroMedidaControleAdministrativaExistente,
                                as: "medidas_administrativas_existentes",
                                attributes: ["descricao"]
                            }
                        ]
                    },
                    {
                        model: RiscoColetivoExistente,
                        as: "relacoes_coletivas",
                        include: [
                            {
                                model: CadastroMedidaControleColetivaExistente,
                                as: "medidas_coletivas_existentes",
                                attributes: [["descricao", "descrica"]] 
                            }
                        ]
                    },
                    {
                        model: RiscoIndividualExistente,
                        as: "relacoes_individuais",
                        include: [
                            {
                                model: CadastroMedidaControleIndividualExistente,
                                as: "medidas_individuais_existentes",
                                attributes: [["descricao", "desc"]]
                            }
                        ]
                    },
                    {
                        model: PlanoAcaoRisco,
                        as: "planosAcao"    
                    }
                ],
            },
        ],
    });
};

// services/ges/getCursos.ts
export const getCursos = async (empresa_id: number, idges: number) => {
    return Ges.findOne({
        where: { empresa_id, id: idges },
        include: [
            {
                model: GesCurso,
                as: "cursos",
                include: [{ model: CadastroCursoObrigatorio, as: "curso" }],
            },
        ],
    });
};

// services/ges/getImagens.ts
export const getImagens = async (empresa_id: number, idges: number) => {
    return Ges.findOne({
        where: { empresa_id, id: idges },
        include: [{ model: AtImagesUrls, as: "imagens" }],
    });
};

// services/ges/getRacs.ts
export const getRacs = async (empresa_id: number, idges: number) => {
    return Ges.findOne({
        where: { empresa_id, id: idges },
        include: [
            {
                model: GesRac,
                as: "racs",
                include: [{ model: CadastroRac, as: "rac" }],
            },
        ],
    });
};

// services/ges/getTiposPgr.ts
export const getTiposPgr = async (empresa_id: number, idges: number) => {
    return Ges.findOne({
        where: { empresa_id, id: idges },
        include: [
            {
                model: GesTipoPgr,
                as: "tiposPgr",
                include: [{ model: CadastroTipoPgr, as: "tipoPgr" }],
            },
        ],
    });
};

// services/ges/getTrabalhadores.ts
export const getTrabalhadores = async (empresa_id: number, idges: number) => {
    return Ges.findOne({
        where: { empresa_id, id: idges },
        include: [
            {
                model: GesTrabalhador,
                as: "trabalhadores",
                include: [
                    {
                        model: Trabalhadores,
                        as: "trabalhador",
                    },
                ],
            },
        ],
    });
};

// services/ges/getAmbientesTrabalho.ts
export const getAmbientesTrabalho = async (empresa_id: number, idges: number) => {
    return Ges.findOne({
        where: { empresa_id, id: idges },
        include: [
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
                        include: [{ model: CadastroVeiculo, as: "veiculo" }],
                    },
                    {
                        model: MobiliarioAmbienteTrabalho,
                        as: "MobiliarioAmbienteTrabalho",
                        attributes: ["id"],
                        include: [{ model: CadastroMobiliario, as: "mobiliario" }],
                    },
                    {
                        model: EquipamentosAmbienteTrabalho,
                        as: "EquipamentoAmbienteTrabalho",
                        attributes: ["id"],
                        include: [{ model: CadastroEquipamento, as: "equipamento" }],
                    },
                ],
            },
        ],
    });
};

// services/ges/getOneGesService.ts
export const getOneGesService = async (empresa_id: number, idges: number, clienteId?: number) => {
    const whereClause: any = { empresa_id, id: idges };
    if (clienteId !== undefined) {
        whereClause.cliente_id = Number(clienteId);
    }

    const [riscos, cursos, imagens, racs, tiposPgr, trabalhadores, ambientesTrabalho] = await Promise.all([
        getRiscos(empresa_id, idges),
        getCursos(empresa_id, idges),
        getImagens(empresa_id, idges),
        getRacs(empresa_id, idges),
        getTiposPgr(empresa_id, idges),
        getTrabalhadores(empresa_id, idges),
        getAmbientesTrabalho(empresa_id, idges),
    ]);

    return {
        dataValues: {
            ...riscos?.dataValues,
            riscos: riscos?.dataValues || [],
            cursos: cursos?.dataValues || [],
            imagens: imagens?.dataValues || [],
            racs: racs?.dataValues || [],
            tiposPgr: tiposPgr?.dataValues || [],
            trabalhadores: trabalhadores?.dataValues || [],
            ambientesTrabalhos: ambientesTrabalho?.dataValues || [],
        },
    };
};



export const gesPutService = async (
    newValuesMultiInput: any,
    empresa_id: number,
    id_ges: number,
    listTrabalhadores: any[],
    params: any,
    paramsAT: any,
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
                    id_trabalhador: trabalhador.id,
                    id_funcao: trabalhador.funcao_id,
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



export const fluxogramaDeleteService = async (ges_id: number) => {
    try {
        const data = await Ges.findOne({
            where: { id: ges_id },
            attributes: ["nome_fluxograma"],
        });

        if (!data) {
            console.error("Registro não encontrado.");
            return;
        }

        const nameImage = data.dataValues.nome_fluxograma;

        // Atualiza nome_fluxograma para NULL corretamente
        await Ges.update(
            { nome_fluxograma: Sequelize.literal("NULL") }, // Corrigido aqui
            { where: { id: ges_id } }
        );

        if (nameImage) {
            await deleteFileToS3(nameImage.toString());
        }

    } catch (error) {
        console.error("Erro ao deletar o fluxograma:", error);
    }
};

export const fluxogramaUpdateNameService = async (ges_id: number, fluxogramaName: string) => {
    try {

        const data = await Ges.update({
            nome_fluxograma: fluxogramaName
        }, {
            where: {
                id: ges_id
            }
        })

        return data

    } catch (error) {
        console.error(error)
    }
}

export const postImagesAtService = async (name: string, id_ges: number, nome_fluxograma: string) => {
    try {
        const data = await AtImagesUrls.create({
            name,
            id_ges,
            nome_fluxograma
        })
        return data;
    } catch (error) {
        console.error(error)
    }
}

export const getImagesAtService = async (id_ges: number) => {
    try {
        const data = await AtImagesUrls.findAll({
            where: {
                id_ges
            }
        })

        return data;
    } catch (error) {
        console.error(error)
    }
}

export const getCursosInString = async (id_curso: number) => {
    try {
        const data = await CadastroCursoObrigatorio.findOne({
            where: {
                id: id_curso,
            }
        })

        return data?.get('descricao');
    } catch (error) {

    }
}

export const getEpisInString = async (id_curso: number) => {
    try {
        const data = await CadastroEquipamento.findOne({
            where: {
                id: id_curso
            }
        })

        return data?.get('descricao');
    } catch (error) {

    }
}

export const getRacsInString = async (id_rac: number) => {
    try {
        const data = await CadastroRac.findOne({
            where: {
                id: id_rac
            }
        })

        return data?.get('descricao');
    } catch (error) {

    }
}

export const getAllGesByServico = async (empresaId: number, idServico: number) => {
    try {
        const data = await Ges.findAll({
            where: {
                empresa_id: empresaId,
                servico_id: idServico
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
                            as: "trabalhador",
                            include: [
                                {
                                    model: CadastroFuncao,
                                    as: "funcao",
                                },
                            ]
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
                    ]
                }
            ]
        })

        return data;
    } catch (error) {
        console.error(error)
    }
}

export const getAllGesByClienteService = async (empresaId: number, clienteId: number) => {
    try {
        const data = await Ges.findAll({
            where: {
                empresa_id: empresaId,
                cliente_id: clienteId
            }
        })

        return data;
    } catch (error) {
        console.error(error)
    }
}

export const deleteImageAtService = async (id: number) => {
    try {
        const data = await AtImagesUrls.destroy({
            where: {
                name: id
            }
        })

        return data;
    } catch (error) {
        console.error(error)
    }
}