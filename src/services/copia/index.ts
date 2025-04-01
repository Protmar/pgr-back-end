import { Ges } from "../../models";
import { AmbienteTrabalho } from "../../models/AmbienteTrabalho";
import { AtImagesUrls } from "../../models/subdivisoesAmbienteTrabalho/AtImagesUrls";
import { EquipamentosAmbienteTrabalho } from "../../models/subdivisoesAmbienteTrabalho/EquipamentosAmbienteTrabalho";
import { MobiliarioAmbienteTrabalho } from "../../models/subdivisoesAmbienteTrabalho/MobiliarioAmbienteTrabalho";
import { VeiculosAmbienteTrabalho } from "../../models/subdivisoesAmbienteTrabalho/VeiculosAmbientesTrabalho";
import uploadFileToS3, { copyFileInS3WithUniqueName, getFileToS3 } from "../aws/s3";

interface CopiaGesParams {
    newServico_id: number;
    newCliente_id: number;
    ges_id: number;
}

export const copiaGesService = async (params: CopiaGesParams) => {
    const dataOldGes = await Ges.findOne({
        where: { id: params.ges_id },
    });

    if (!dataOldGes) {
        throw new Error("Ges não encontrado.");
    }

    // 🛠️ Verifica se nome_fluxograma existe antes de chamar toString()
    const fileNameToCopy = dataOldGes.dataValues.nome_fluxograma 
        ? dataOldGes.dataValues.nome_fluxograma.toString() 
        : null;

    let newNameFluxogramaFileEdited = "";
    
    if (fileNameToCopy) {
        const newNameFluxogramaFile = await copyFileInS3WithUniqueName(fileNameToCopy);
        newNameFluxogramaFileEdited = newNameFluxogramaFile.replace("uploads/", "");
    }

    const dataNewGes = await Ges.create({
        empresa_id: dataOldGes.dataValues.empresa_id,
        cliente_id: params.newCliente_id,
        servico_id: params.newServico_id,
        codigo: dataOldGes.dataValues.codigo || "",
        descricao_ges: dataOldGes.dataValues.descricao_ges || "",
        observacao: dataOldGes.dataValues.observacao || "",
        responsavel: dataOldGes.dataValues.responsavel || "",
        cargo: dataOldGes.dataValues.cargo || "",
        nome_fluxograma: newNameFluxogramaFileEdited, // Agora sempre será uma string válida
        tipo_pgr: dataOldGes.dataValues.tipo_pgr || "",
        texto_caracterizacao_processos: dataOldGes.dataValues.texto_caracterizacao_processos || "",
    });

    const ambientesTrabalhoOld = await AmbienteTrabalho.findAll({
        where: { ges_id: dataOldGes.dataValues.id },
        include: [
            { model: VeiculosAmbienteTrabalho, as: "veiculosAmbienteTrabalho" },
            { model: MobiliarioAmbienteTrabalho, as: "MobiliarioAmbienteTrabalho" },
            { model: EquipamentosAmbienteTrabalho, as: "EquipamentoAmbienteTrabalho" },
        ]
    });

    for (const ambiente of ambientesTrabalhoOld) {
        const newAmbiente = await AmbienteTrabalho.create({
            ges_id: dataNewGes.dataValues.id,
            empresa_id: ambiente.dataValues.empresa_id,
            area: ambiente.dataValues.area,
            pe_direito: ambiente.dataValues.pe_direito,
            qnt_janelas: ambiente.dataValues.qnt_janelas,
            qnt_equipamentos: ambiente.dataValues.qnt_equipamentos,
            informacoes_adicionais: ambiente.dataValues.informacoes_adicionais,
            tipo_edificacao_id: ambiente.dataValues.tipo_edificacao_id,
            teto_id: ambiente.dataValues.teto_id,
            parede_id: ambiente.dataValues.parede_id,
            ventilacao_id: ambiente.dataValues.ventilacao_id,
            iluminacao_id: ambiente.dataValues.iluminacao_id,
            piso_id: ambiente.dataValues.piso_id,
        });

        await copiarRelacionamentos(ambiente.dataValues.id, newAmbiente.dataValues.id, dataOldGes.dataValues.id, dataNewGes.dataValues.id);
    }

    return dataNewGes;
};


const copiarRelacionamentos = async (oldAmbienteId: number, newAmbienteId: number, oldGesId: number, newGesId: number) => {
    const veiculosOld = await VeiculosAmbienteTrabalho.findAll({
        where: { id_ambiente_trabalho: oldAmbienteId }
    });
    for (const veiculo of veiculosOld) {
        await VeiculosAmbienteTrabalho.create({
            ...veiculo.dataValues,
            id: undefined,
            id_ambiente_trabalho: newAmbienteId
        });
    }

    const mobiliariosOld = await MobiliarioAmbienteTrabalho.findAll({
        where: { id_ambiente_trabalho: oldAmbienteId }
    });
    for (const mobiliario of mobiliariosOld) {
        await MobiliarioAmbienteTrabalho.create({
            ...mobiliario.dataValues,
            id: undefined,
            id_ambiente_trabalho: newAmbienteId
        });
    }

    const equipamentosOld = await EquipamentosAmbienteTrabalho.findAll({
        where: { id_ambiente_trabalho: oldAmbienteId }
    });
    for (const equipamento of equipamentosOld) {
        await EquipamentosAmbienteTrabalho.create({
            ...equipamento.dataValues,
            id: undefined,
            id_ambiente_trabalho: newAmbienteId
        });
    }

    const imagensOld = await AtImagesUrls.findAll({
        where: { id_ges: oldGesId }
    });


    for (const imagem of imagensOld) {
        const novaUrl = await copyFileInS3WithUniqueName(imagem.dataValues.name);

        await AtImagesUrls.create({
            id_ges: newGesId,
            name: novaUrl.replace("uploads/", ""),
        });
    }
};