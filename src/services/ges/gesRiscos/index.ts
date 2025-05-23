import { CadastroFatoresRisco } from "../../../models/FatoresRisco";
import { ImagensFichaCampo } from "../../../models/imagensRiscos/ImagensFichaCampo";
import { ImagensFotoAvaliacao } from "../../../models/imagensRiscos/ImagensFotoAvaliação";
import { ImagensHistogramas } from "../../../models/imagensRiscos/ImagensHistogramas";
import { ImagensMemorialCalculo } from "../../../models/imagensRiscos/ImagensMemorialCalculo";
import { sequelize } from "../../../database"; 
import { Risco, RiscoCreationAttributes } from "../../../models/Risco";
import { CadastroMedidaControleColetivaExistente } from "../../../models/MedidaControleColetivaExistente";
import { CadastroMedidaControleAdministrativaExistente } from "../../../models/MedidaControleAdministrativaExistente";
import { CadastroMedidaControleIndividualExistente } from "../../../models/MedidaControleIndividualExistente";
import { RiscoColetivoExistente } from "../../../models/Risco/RiscoColetivoExistente";
import { RiscoAdministrativoExistente } from "../../../models/Risco/RiscoAdministrativoExistente";
import { RiscoIndividualExistente } from "../../../models/Risco/RiscoIndividualExistente";

export const postDadosRiscoService = async (
  params: RiscoCreationAttributes & {
    medidasColetivas?: number[];
    medidasAdministrativas?: number[];
    medidasIndividuais?: number[];
  }
) => {
  const transaction = await sequelize.transaction();
  try {
    // Cria o risco
    const risco = await Risco.create(params, { transaction });
    const id_risco = risco.get("id") as number;

    // Salva as medidas coletivas
    if (params.medidasColetivas && params.medidasColetivas.length > 0) {
      await RiscoColetivoExistente.bulkCreate(
        params.medidasColetivas.map((id) => ({
          id_risco, // Usa o ID do risco criado
          id_medida_controle_coletiva_existentes: id,
        })),
        { transaction }
      );
    }

    // Salva as medidas administrativas
    if (
      params.medidasAdministrativas &&
      params.medidasAdministrativas.length > 0
    ) {
      await RiscoAdministrativoExistente.bulkCreate(
        params.medidasAdministrativas.map((id) => ({
          id_risco, // Usa o ID do risco criado
          id_medida_controle_administrativa_existentes: id,
        })),
        { transaction }
      );
    }

    // Salva as medidas individuais
    if (params.medidasIndividuais && params.medidasIndividuais.length > 0) {
      await RiscoIndividualExistente.bulkCreate(
        params.medidasIndividuais.map((id) => ({
          id_risco, // Usa o ID do risco criado
          id_medida_controle_individual_existentes: id,
        })),
        { transaction }
      );
    }

    // Busca o risco com as associações incluídas
    const riscoComMedidas = await Risco.findOne({
      where: { id: id_risco, empresa_id: params.empresa_id },
      include: [
        {
          model: CadastroMedidaControleColetivaExistente,
          as: "medidas_coletivas_existentes",
        },
        {
          model: CadastroMedidaControleAdministrativaExistente,
          as: "medidas_administrativas_existentes",
        },
        {
          model: CadastroMedidaControleIndividualExistente,
          as: "medidas_individuais_existentes",
        },
      ],
      transaction,
    });

    if (!riscoComMedidas) {
      throw new Error("Risco criado, mas não encontrado ao buscar associações");
    }

    await transaction.commit();
    return riscoComMedidas;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const getDadosRiscoService = async (
  empresaId: string,
  riscoId: string
) => {
  const empresaIdNumber = Number(empresaId);
  const riscoIdNumber = Number(riscoId);

  if (isNaN(empresaIdNumber) || isNaN(riscoIdNumber)) {
    throw new Error("ID de empresa ou risco inválido");
  }

  const data = await Risco.findOne({
    where: { empresa_id: empresaIdNumber, id: riscoIdNumber },
    include: [
      {
        model: CadastroMedidaControleColetivaExistente,
        as: "medidas_coletivas_existentes",
      },
      {
        model: CadastroMedidaControleAdministrativaExistente,
        as: "medidas_administrativas_existentes",
      },
      {
        model: CadastroMedidaControleIndividualExistente,
        as: "medidas_individuais_existentes",
      },
    ],
  });

  return data;
};

export const getRiscoByGesService = (empresaId: string, gesId: string) => {
  const data = Risco.findAll({
    where: { empresa_id: Number(empresaId), ges_id: Number(gesId) },
  });

  return data;
};

export const getDadosAllRiscoService = async (empresaId: string) => {
  const empresaIdNumber = Number(empresaId);
  if (isNaN(empresaIdNumber)) {
    throw new Error("ID de empresa inválido");
  }

  const data = await Risco.findAll({
    where: { empresa_id: empresaIdNumber },
    include: [
      {
         model: CadastroFatoresRisco, as: 'fatores_risco', attributes: ["descricao"] 
      },
      {
        model: CadastroMedidaControleColetivaExistente,
        as: "medidas_coletivas_existentes",
      },
      {
        model: CadastroMedidaControleAdministrativaExistente,
        as: "medidas_administrativas_existentes",
      },
      {
        model: CadastroMedidaControleIndividualExistente,
        as: "medidas_individuais_existentes",
      },
    ],
  });

  return data;
};

export const putDadosRiscoService = async (
  empresa_id: string,
  id_risco: string,
  id_fator_risco: string,
  id_fonte_geradora: string,
  id_trajetoria: string,
  id_exposicao: string,
  id_meio_propagacao: string,
  transmitir_esocial: string,
  intens_conc: number,
  lt_le: string,
  comentario: string,
  nivel_acao: string,
  id_tecnica_utilizada: string,
  id_estrategia_amostragem: string,
  desvio_padrao: number,
  percentil: number,
  obs: string,
  probab_freq: string,
  conseq_severidade: string,
  grau_risco: string,
  classe_risco: string,
  medidasColetivas?: number[],
  medidasAdministrativas?: number[],
  medidasIndividuais?: number[]
) => {
  const empresaIdNumber = Number(empresa_id);
  const riscoIdNumber = Number(id_risco);

  if (isNaN(empresaIdNumber) || isNaN(riscoIdNumber)) {
    throw new Error("ID de empresa ou risco inválido");
  }

  const transaction = await sequelize.transaction();
  try {
    // Atualiza o risco
    await Risco.update(
      {
        empresa_id: empresaIdNumber,
        id_fator_risco,
        id_fonte_geradora,
        id_trajetoria,
        id_exposicao,
        id_meio_propagacao,
        transmitir_esocial,
        intens_conc,
        lt_le,
        comentario,
        nivel_acao,
        id_tecnica_utilizada,
        id_estrategia_amostragem,
        desvio_padrao,
        percentil,
        probab_freq,
        conseq_severidade,
        grau_risco,
        classe_risco,
        obs,
      },
      { where: { empresa_id: empresaIdNumber, id: riscoIdNumber }, transaction }
    );

    // Remove associações existentes
    await RiscoColetivoExistente.destroy({
      where: { id_risco: riscoIdNumber },
      transaction,
    });
    await RiscoAdministrativoExistente.destroy({
      where: { id_risco: riscoIdNumber },
      transaction,
    });
    await RiscoIndividualExistente.destroy({
      where: { id_risco: riscoIdNumber },
      transaction,
    });

    // Cria novas associações
    if (medidasColetivas && medidasColetivas.length > 0) {
      await RiscoColetivoExistente.bulkCreate(
        medidasColetivas.map((id) => ({
          id_risco: riscoIdNumber,
          id_medida_controle_coletiva_existentes: id,
        })),
        { transaction }
      );
    }

    if (medidasAdministrativas && medidasAdministrativas.length > 0) {
      await RiscoAdministrativoExistente.bulkCreate(
        medidasAdministrativas.map((id) => ({
          id_risco: riscoIdNumber,
          id_medida_controle_administrativa_existentes: id,
        })),
        { transaction }
      );
    }

    if (medidasIndividuais && medidasIndividuais.length > 0) {
      await RiscoIndividualExistente.bulkCreate(
        medidasIndividuais.map((id) => ({
          id_risco: riscoIdNumber,
          id_medida_controle_individual_existentes: id,
        })),
        { transaction }
      );
    }

    // Busca o risco com as associações incluídas
    const riscoComMedidas = await Risco.findOne({
      where: { id: riscoIdNumber, empresa_id: empresaIdNumber },
      include: [
        {
          model: CadastroMedidaControleColetivaExistente,
          as: "medidas_coletivas_existentes",
        },
        {
          model: CadastroMedidaControleAdministrativaExistente,
          as: "medidas_administrativas_existentes",
        },
        {
          model: CadastroMedidaControleIndividualExistente,
          as: "medidas_individuais_existentes",
        },
      ],
      transaction,
    });

    if (!riscoComMedidas) {
      throw new Error(
        "Risco atualizado, mas não encontrado ao buscar associações"
      );
    }

    await transaction.commit();
    return riscoComMedidas;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const deleteDadosRiscoService = async (
  empresaId: string,
  riscoId: string
) => {
  const empresaIdNumber = Number(empresaId);
  const riscoIdNumber = Number(riscoId);

  if (isNaN(empresaIdNumber) || isNaN(riscoIdNumber)) {
    throw new Error("ID de empresa ou risco inválido");
  }

  const transaction = await sequelize.transaction();
  try {
    // Remove associações nas tabelas de junção explicitamente
    await RiscoColetivoExistente.destroy({
      where: { id_risco: riscoIdNumber },
      transaction,
    });
    await RiscoAdministrativoExistente.destroy({
      where: { id_risco: riscoIdNumber },
      transaction,
    });
    await RiscoIndividualExistente.destroy({
      where: { id_risco: riscoIdNumber },
      transaction,
    });

    // Deleta o risco
    const data = await Risco.destroy({
      where: { empresa_id: empresaIdNumber, id: riscoIdNumber },
      transaction,
    });

    if (data === 0) {
      throw new Error("Risco não encontrado ou já deletado");
    }

    await transaction.commit();
    return data;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const medidaColetivaService = {
  getAll: async () => {
    try {
      const medidas = await CadastroMedidaControleColetivaExistente.findAll({
        attributes: ["id", "descricao"],
      });
      return medidas;
    } catch (error) {
      throw new Error("Erro ao buscar medidas coletivas.");
    }
  },
};
export const medidaAdministrativaService = {
  getAll: async () => {
    try {
      const medidas =
        await CadastroMedidaControleAdministrativaExistente.findAll({
          attributes: ["id", "descricao"],
        });
      return medidas;
    } catch (error) {
      throw new Error("Erro ao buscar medidas administrativas.");
    }
  },
};

export const medidaIndividualService = {
  getAll: async () => {
    try {
      const medidas = await CadastroMedidaControleIndividualExistente.findAll({
        attributes: ["id", "descricao"],
      });
      return medidas;
    } catch (error) {
      throw new Error("Erro ao buscar medidas individuais.");
    }
  },
};

export const postImagePerigoService = async (tiporisco: string, risco_id: number, url: string, file_type?: string) => {

  console.log({
    tiporisco,
    risco_id,
    url
  })
  if (tiporisco === "fichaCampo") {
    const data = await ImagensFichaCampo.create({
      risco_id,
      url,
      file_type
    });
    return data;
  }

  if (tiporisco === "memorialCalculo") {
    const data = await ImagensMemorialCalculo.create({
      risco_id,
      url,
      file_type
    });
    return data;
  }

  if (tiporisco === "histogramas") {
    const data = await ImagensHistogramas.create({
      risco_id,
      url,
      file_type
    });
    return data;
  }

  if (tiporisco === "fotosAvaliacao") {
    const data = await ImagensFotoAvaliacao.create({
      risco_id,
      url,
      file_type
    });
    return data;
  }

};

export const getImagesPerigoService = (risco_id: string, origem: any, tipo: string) => {

  if (origem == "fichaCampo") {
    const data = ImagensFichaCampo.findAll({ where: { risco_id: Number(risco_id), file_type: tipo } });
    return data;
  }

  if (origem == "memorialCalculo") {
    const data = ImagensMemorialCalculo.findAll({ where: { risco_id: Number(risco_id), file_type: tipo } });
    return data;
  }

  if (origem == "histogramas") {
    const data = ImagensHistogramas.findAll({ where: { risco_id: Number(risco_id), file_type: tipo } });
    return data;
  }

  if (origem == "fotosAvaliacao") {
    const data = ImagensFotoAvaliacao.findAll({ where: { risco_id: Number(risco_id), file_type: tipo } });
    return data;
  }

};

export const deleteImagePerigoService = (id: string, origem: any) => {

  if (origem == "fichaCampo") {
    const data = ImagensFichaCampo.destroy({ where: { id: Number(id) } });
    return data;
  }

  if (origem == "memorialCalculo") {
    const data = ImagensMemorialCalculo.destroy({ where: { id: Number(id) } });
    return data;
  }

  if (origem == "histogramas") {
    const data = ImagensHistogramas.destroy({ where: { id: Number(id) } });
    return data;
  }

  if (origem == "fotosAvaliacao") {
    const data = ImagensFotoAvaliacao.destroy({ where: { id: Number(id) } });
    return data;
  }
}