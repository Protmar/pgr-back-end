import {
  CadastroFatoresRisco,
  CadastroFatoresRiscoCreationAttributes,
} from "../../../models/FatoresRisco";
import { ItemNr } from "../../../models/ItemNr";
import { Transaction } from "sequelize";

export const postDadosFatoresRiscoService = async (
  params: CadastroFatoresRiscoCreationAttributes,
  options: { transaction?: Transaction } = {}
) => {
  const data = await CadastroFatoresRisco.create(params, options);
  return data;
};

export const getDadosAllFatoresRiscoService = async (
  empresaId: string,
  options: { transaction?: Transaction } = {}
) => {
  const data = await CadastroFatoresRisco.findAll({
    where: { empresaId },
    include: [{ model: ItemNr, as: "itensNormas" }],
    ...options,
  });
  return data;
};

export const getDadosFatoresRiscoService = async (
  empresaId: string,
  fatoresRiscoId: string,
  options: { transaction?: Transaction } = {}
) => {
  const data = await CadastroFatoresRisco.findOne({
    where: { empresaId, id: Number(fatoresRiscoId) },
    include: [{ model: ItemNr, as: "itensNormas" }],
    ...options,
  });
  return data;
};

export const putDadosFatoresRiscoService = async (
  empresaId: number,
  fatoresRiscoId: number,
  tipo: string,
  parametro: string,
  ordem: number,
  codigo_esocial: string,
  descricao: string,
  danos_saude: string,
  tecnica_utilizada: string,
  lt_le: string,
  nivel_acao: string,
  ltcat: boolean,
  laudo_insalubridade: boolean,
  pgr: boolean,
  pgrtr: boolean,
  laudo_periculosidade: boolean,
  options: { transaction?: Transaction } = {}
) => {
  const data = await CadastroFatoresRisco.update(
    {
      tipo,
      parametro,
      ordem,
      codigo_esocial,
      descricao,
      danos_saude,
      tecnica_utilizada,
      lt_le,
      nivel_acao,
      ltcat,
      laudo_insalubridade,
      pgr,
      pgrtr,
      laudo_periculosidade,
    },
    { where: { empresaId, id: fatoresRiscoId }, ...options }
  );
  return data;
};

export const deleteDadosFatoresRiscoService = async (
  empresaId: number,
  fatoresRiscoId: number,
  options: { transaction?: Transaction } = {}
) => {
  const data = await CadastroFatoresRisco.destroy({
    where: { empresaId, id: fatoresRiscoId },
    ...options,
  });
  return data;
};