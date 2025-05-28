import { sequelize } from "../../../../database";
import { CadastroMedidaControleAdministrativaNecessaria } from "../../../../models/MedidaControleAdministrativaNecessaria";
import { CadastroMedidaControleColetivaNecessaria } from "../../../../models/MedidaControleColetivaNecessaria";
import { CadastroMedidaControleIndividualNecessaria } from "../../../../models/MedidaControleIndividualNecessaria";
import {
  CadastroPlanoAcaoRiscoCreationAttributes,
  PlanoAcaoRisco,
} from "../../../../models/Risco/PlanoAcao/PlanoAcaoRisco";
import { RiscoAdministrativoNecessaria } from "../../../../models/Risco/PlanoAcao/RiscoAdministrativoNecessaria";
import { RiscoColetivoNecessaria } from "../../../../models/Risco/PlanoAcao/RiscoColetivoNecessaria";
import { RiscoIndividualNecessaria } from "../../../../models/Risco/PlanoAcao/RiscoIndividualNecessaria";

export const postDadosPlanoAcaoService = async (
  params: CadastroPlanoAcaoRiscoCreationAttributes & {
    medidasColetivasNecessarias: number[];
    medidasIndividualNecessarias: number[];
    medidasAdministrativasNecessarias: number[];
  }
) => {
  const transaction = await sequelize.transaction();
  try {
    const planoAcaoRisco = await PlanoAcaoRisco.create(params, { transaction });
    const idPlanoAcaoRisco = planoAcaoRisco.get("id") as number;

    const validateIds = async (ids: number[], model: any) => {
        const existingIds = await model.findAll({ where: { id: ids } });
        if (existingIds.length !== ids.length) throw new Error("IDs de medidas inválidos");
    }

    if (
      params.medidasColetivasNecessarias &&
      params.medidasColetivasNecessarias.length > 0
    ) {
      await RiscoColetivoNecessaria.bulkCreate(
        params.medidasColetivasNecessarias.map((id) => ({
          id_plano_acao_riscos: idPlanoAcaoRisco,
          id_medida_controle_coletiva_necessarias: id,
        })),
        { transaction }
      );
    }
    if (
      params.medidasAdministrativasNecessarias &&
      params.medidasAdministrativasNecessarias.length > 0
    ) {
      await RiscoAdministrativoNecessaria.bulkCreate(
        params.medidasAdministrativasNecessarias.map((id) => ({
          id_plano_acao_riscos: idPlanoAcaoRisco,
          id_medida_controle_administrativa_necessarias: id,
        })),
        { transaction }
      );
    }
    if (
      params.medidasIndividualNecessarias &&
      params.medidasIndividualNecessarias.length > 0
    ) {
      await RiscoIndividualNecessaria.bulkCreate(
        params.medidasIndividualNecessarias.map((id) => ({
          id_plano_acao_riscos: idPlanoAcaoRisco,
          id_medida_controle_individual_necessarias: id,
        })),
        { transaction }
      );
    }

    const planoAcaoRiscoMedidas = await PlanoAcaoRisco.findOne({
      where: { id: idPlanoAcaoRisco },
      include: [
        {
          model: CadastroMedidaControleColetivaNecessaria,
          as: "medidas_coletivas_necessarias",
        },
        {
          model: CadastroMedidaControleAdministrativaNecessaria,
          as: "medidas_administrativas_necessarias",
        },
        {
          model: CadastroMedidaControleIndividualNecessaria,
          as: "medidas_individual_necessarias",
        },
      ],
      transaction,
    });

    if (!planoAcaoRiscoMedidas) {
      throw new Error(
        "Plano de ação atualizado, mas não encontrado ao buscar associações"
      );
    }
    await transaction.commit();
    return planoAcaoRiscoMedidas;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const getDadosPlanoAcaoService = async (
  riscoId: string,
  planoAcaoId: string
) => {
  const riscoIdNumber = Number(riscoId);
  const planoAcaoIdNumber = Number(planoAcaoId);

  if (isNaN(riscoIdNumber) || isNaN(planoAcaoIdNumber)) {
    throw new Error("ID inválido");
  }

  const data = await PlanoAcaoRisco.findOne({
    where: { id_risco: riscoIdNumber, id: planoAcaoIdNumber },
    include: [
      {
        model: CadastroMedidaControleColetivaNecessaria,
        as: "medidas_coletivas_necessarias",
      },
      {
        model: CadastroMedidaControleAdministrativaNecessaria,
        as: "medidas_administrativas_necessarias",
      },
      {
        model: CadastroMedidaControleIndividualNecessaria,
        as: "medidas_individual_necessarias",
      },
    ],
  });
  return data;
};

export const getAllDadosPlanoAcaoService = async (riscoId: string) => {
  const riscoIdNumber = Number(riscoId);
  if (isNaN(riscoIdNumber)) {
    throw new Error("ID inválido");
  }
  const data = await PlanoAcaoRisco.findAll({
    where: { id_risco: riscoIdNumber },
    include: [
      {
        model: CadastroMedidaControleColetivaNecessaria,
        as: "medidas_coletivas_necessarias"
      },
      {
        model: CadastroMedidaControleAdministrativaNecessaria,
        as: "medidas_administrativas_necessarias"
      },
      {
        model: CadastroMedidaControleIndividualNecessaria,
        as: "medidas_individual_necessarias"
      },
    ],
  });
  return data;
};

export const putDadosPlanoAcaoService = async (
  riscoId: string,
  planoAcaoId: string,
  params: CadastroPlanoAcaoRiscoCreationAttributes & {
    medidasColetivasNecessarias: number[];
    medidasIndividualNecessarias: number[];
    medidasAdministrativasNecessarias: number[];
  }
) => {
  const riscoIdNumber = Number(riscoId);
  const planoAcaoIdNumber = Number(planoAcaoId);

  if (isNaN(riscoIdNumber) || isNaN(planoAcaoIdNumber)) {
    throw new Error("ID inválido");
  }
  const transaction = await sequelize.transaction();
  try {
    await PlanoAcaoRisco.update(params, {
      where: { id_risco: riscoIdNumber, id: planoAcaoIdNumber },
      transaction,
    });
    await RiscoColetivoNecessaria.destroy({
      where: { id_plano_acao_riscos: planoAcaoIdNumber },
      transaction,
    });
    await RiscoAdministrativoNecessaria.destroy({
      where: { id_plano_acao_riscos: planoAcaoIdNumber },
      transaction,
    });
    await RiscoIndividualNecessaria.destroy({
      where: { id_plano_acao_riscos: planoAcaoIdNumber },
      transaction,
    });

    if (
      params.medidasColetivasNecessarias &&
      params.medidasColetivasNecessarias.length > 0
    ) {
      await RiscoColetivoNecessaria.bulkCreate(
        params.medidasColetivasNecessarias.map((id) => ({
          id_plano_acao_riscos: planoAcaoIdNumber,
          id_medida_controle_coletiva_necessarias: id,
        })),
        { transaction }
      );
    }
    if (
      params.medidasAdministrativasNecessarias &&
      params.medidasAdministrativasNecessarias.length > 0
    ) {
      await RiscoAdministrativoNecessaria.bulkCreate(
        params.medidasAdministrativasNecessarias.map((id) => ({
          id_plano_acao_riscos: planoAcaoIdNumber,
          id_medida_controle_administrativa_necessarias: id,
        })),
        { transaction }
      );
    }
    if (
      params.medidasIndividualNecessarias &&
      params.medidasIndividualNecessarias.length > 0
    ) {
      await RiscoIndividualNecessaria.bulkCreate(
        params.medidasIndividualNecessarias.map((id) => ({
          id_plano_acao_riscos: planoAcaoIdNumber,
          id_medida_controle_individual_necessarias: id,
        })),
        { transaction }
      );
    }

    const planoAcaoRiscoMedidas = await PlanoAcaoRisco.findOne({
      where: { id_risco: riscoIdNumber, id: planoAcaoIdNumber },
      include: [
        {
          model: CadastroMedidaControleColetivaNecessaria,
          as: "medidas_coletivas_necessarias",
        },
        {
          model: CadastroMedidaControleAdministrativaNecessaria,
          as: "medidas_administrativas_necessarias",
        },
        {
          model: CadastroMedidaControleIndividualNecessaria,
          as: "medidas_individual_necessarias",
        },
      ],
      transaction,
    });
    if (!planoAcaoRiscoMedidas) {
      throw new Error(
        "Plano de ação atualizado, mas não encontrado ao buscar associações"
      );
    }
    await transaction.commit();
    return planoAcaoRiscoMedidas;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const deleteDadosPlanoAcaoService = async (
  riscoId: string,
  planoAcaoId: string
) => {
  const riscoIdNumber = Number(riscoId);
  const planoAcaoIdNumber = Number(planoAcaoId);

  if (isNaN(riscoIdNumber) || isNaN(planoAcaoIdNumber)) {
    throw new Error("ID inválido");
  }

  const transaction = await sequelize.transaction();
  try {
    await RiscoColetivoNecessaria.destroy({
      where: { id_plano_acao_riscos: planoAcaoIdNumber },
      transaction,
    });
    await RiscoAdministrativoNecessaria.destroy({
      where: { id_plano_acao_riscos: planoAcaoIdNumber },
      transaction,
    });
    await RiscoIndividualNecessaria.destroy({
      where: { id_plano_acao_riscos: planoAcaoIdNumber },
      transaction,
    });

    const data = await PlanoAcaoRisco.destroy({
      where: { id_risco: riscoIdNumber, id: planoAcaoIdNumber },
      transaction,
    });

    if (data === 0) {
      throw new Error("Plano de ação não encontrado");
    }
    await transaction.commit();
    return data;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const medidaColetivaNecessariasService = {
  getAll: async () => {
    try {
      const medidas = await CadastroMedidaControleColetivaNecessaria.findAll({
        attributes: ["id", "descricao"],
      });
      return medidas;
    } catch (error) {
      throw new Error("Erro ao buscar medidas coletivas");
    }
  },
};
export const medidaAdministrativaNecessariasService = {
  getAll: async () => {
    try {
      const medidas =
        await CadastroMedidaControleAdministrativaNecessaria.findAll({
          attributes: ["id", "descricao"],
        });
      return medidas;
    } catch (error) {
      throw new Error("Erro ao buscar medidas administrativas");
    }
  },
};
export const medidaIndividualNecessariasService = {
  getAll: async () => {
    try {
      const medidas = await CadastroMedidaControleIndividualNecessaria.findAll({
        attributes: ["id", "descricao"],
      });
      return medidas;
    } catch (error) {
      throw new Error("Erro ao buscar medidas individuais");
    }
  },
};
