import { ItemNr, ItemNrAttributes, ItemNrCreationAttributes } from "../../../../models/ItemNr";
import { Transaction } from "sequelize";

export const itemNrPostService = async (
    params: ItemNrCreationAttributes, // Use ItemNrCreationAttributes em vez de ItemNrAttributes
    options: { transaction?: Transaction } = {}
  ) => {
    const data = await ItemNr.create(params, options);
    return data;
  };

export const itemNrGetAll = async (
  fatorRiscoId: string,
  options: { transaction?: Transaction } = {}
) => {
  const data = await ItemNr.findAll({
    where: { fator_risco_id: Number(fatorRiscoId) },
    ...options,
  });
  return data;
};

export const itemNrGet = async (
  fatorRiscoId: string,
  itemNrId: string,
  options: { transaction?: Transaction } = {}
) => {
  const data = await ItemNr.findOne({
    where: {
      fator_risco_id: Number(fatorRiscoId),
      id: Number(itemNrId),
    },
    ...options,
  });
  return data;
};

export const itemNrDelete = async (
  fatorRiscoId: string,
  itemNrId: string,
  options: { transaction?: Transaction } = {}
) => {
  const data = await ItemNr.destroy({
    where: {
      fator_risco_id: Number(fatorRiscoId),
      id: Number(itemNrId),
    },
    ...options,
  });
  return data;
};

export const itemNrPut = async (
  fatorRiscoId: string,
  itemNrId: string,
  params: ItemNrAttributes,
  options: { transaction?: Transaction } = {}
) => {
  const data = await ItemNr.update(params, {
    where: {
      fator_risco_id: Number(fatorRiscoId),
      id: Number(itemNrId),
    },
    ...options,
  });
  return data;
};