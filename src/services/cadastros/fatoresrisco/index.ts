import {
  CadastroFatoresRisco,
  CadastroFatoresRiscoCreationAttributes,
} from "../../../models/FatoresRisco";

export const postDadosFatoresRiscoService = (
  params: CadastroFatoresRiscoCreationAttributes
) => {
  const data = CadastroFatoresRisco.create(params);
  return data;
};

export const getDadosAllFatoresRiscoService = (empresaId: string) => {
  const data = CadastroFatoresRisco.findAll({ where: { empresaId } });
  return data;
};

export const getDadosFatoresRiscoService = (
  empresaId: string,
  fatoresRiscoId: string
) => {
  const data = CadastroFatoresRisco.findOne({
    where: { empresaId, id: Number(fatoresRiscoId) },
  });
  return data;
};

export const putDadosFatoresRiscoService = (
  empresaId: number,
  trabaladorId: number,
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
) => {
  const data = CadastroFatoresRisco.update(
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
    { where: { empresaId, id: trabaladorId } }
  );
  return data;
};

export const deleteDadosFatoresRiscoService = (
  empresaId: number,
  fatoresRiscoId: number
) => {
  const data = CadastroFatoresRisco.destroy({
    where: { empresaId, id: fatoresRiscoId },
  });
  return data;
};
