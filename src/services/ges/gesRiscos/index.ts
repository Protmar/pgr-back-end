import { Risco, RiscoCreationAttributes } from "../../../models/Risco";

export const postDadosRiscoService = (params: RiscoCreationAttributes) => {
  const data = Risco.create(params);
  return data;
};
export const getDadosRiscoService = (empresaId: string, riscoId: string) => {
  const empresaIdNumber = Number(empresaId);
  const riscoIdNumber = Number(riscoId);

  // Verifica se a conversão foi bem-sucedida
  if (isNaN(empresaIdNumber) || isNaN(riscoIdNumber)) {
    throw new Error("ID de empresa ou risco inválido");
  }
  const data = Risco.findOne({
    where: { empresa_id: Number(empresaId), id: Number(riscoId) },
  });

  return data;
};

export const getDadosAllRiscoService = (empresaId: string) => {
  const data = Risco.findAll({
    where: { empresa_id: Number(empresaId) },
  });
  return data;
};

export const putDadosRiscoService = (
  empresa_id: string,
  id_risco: string,
  id_fator_risco: string,
  id_fonte_geradora: string,
  id_trajetoria: string,
  id_exposicao: string,
  id_meio_propagacao: string,
  transmitir_esocial: string,
  intens_conc:number,
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
) => {
  const empresaIdNumber = Number(empresa_id);

  const data = Risco.update(
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
    { where: { empresa_id: empresaIdNumber, id: id_risco } }
  );

  return data;
};

export const deleteDadosRiscoService = (empresaId: string, riscoId: string) => {
  const data = Risco.destroy({
    where: { empresa_id: Number(empresaId), id: riscoId },
  });
  return data;
};
