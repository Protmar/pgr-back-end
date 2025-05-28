import { sequelize } from "../../../database"; // Importa a conexão Sequelize
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
      
    const risco = await Risco.create(params, { transaction });
    const id_risco = risco.get("id") as number;


    if (params.medidasColetivas && params.medidasColetivas.length > 0) {
      await RiscoColetivoExistente.bulkCreate(
        params.medidasColetivas.map((id) => ({
          id_risco, 
          id_medida_controle_coletiva_existentes: id,
        })),
        { transaction }
      );
    }

    if (
      params.medidasAdministrativas &&
      params.medidasAdministrativas.length > 0
    ) {
      await RiscoAdministrativoExistente.bulkCreate(
        params.medidasAdministrativas.map((id) => ({
          id_risco, 
          id_medida_controle_administrativa_existentes: id,
        })),
        { transaction }
      );
    }


    if (params.medidasIndividuais && params.medidasIndividuais.length > 0) {
      await RiscoIndividualExistente.bulkCreate(
        params.medidasIndividuais.map((id) => ({
          id_risco, 
          id_medida_controle_individual_existentes: id,
        })),
        { transaction }
      );
    }


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

export const getDadosAllRiscoService = async (empresaId: string) => {
  const empresaIdNumber = Number(empresaId);
  if (isNaN(empresaIdNumber)) {
    throw new Error("ID de empresa inválido");
  }

  const data = await Risco.findAll({
    where: { empresa_id: empresaIdNumber },
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
  medidasIndividuais?: number[],
  conclusaoLtcat?: string,
  conclusaoPericulosidade?: string,
  conclusaoInsalubridade?: string
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
        conclusao_ltcat: conclusaoLtcat,
        conclusao_insalubridade: conclusaoPericulosidade,
        conclusao_periculosidade: conclusaoInsalubridade,
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
