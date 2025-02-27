import { Risco, RiscoCreationAttributes } from "../../../models/Risco";

export const postDadosRiscoService = (
  params: RiscoCreationAttributes
) => {
  try {
    const data = Risco.create(params);
    return data;
  } catch (error) {
    console.error("Erro ao salvar no banco:", error);
  }
};
export const getDadosRiscoService = (
  empresaId: string,
  riscoId: string
) => {
  try {
    const empresaIdNumber = Number(empresaId);
    const riscoIdNumber = Number(riscoId);

    // Verifica se a conversão foi bem-sucedida
    if (isNaN(empresaIdNumber) || isNaN(riscoIdNumber)) {
      throw new Error('ID de empresa ou risco inválido');
    }
    const data = Risco.findOne({
      where: { empresa_id: Number(empresaId), id: Number(riscoId) },
    });
    
    return data;
  } catch (error) {
    console.error("Erro ao buscar risco:", error);
  }
};

export const getDadosAllRiscoService = (empresaId: string) => {
  try {
    const data = Risco.findAll({
      where: { empresa_id: Number(empresaId) },
    });
    return data;
  } catch (error) {
    console.error("Erro ao buscar todos os riscos:", error);
  }
};

export const putDadosRiscoService = (
  empresa_id: string,
  id_risco:string,
  id_fator_risco: string,
  id_fonte_geradora: string,
  id_exposicao: string,
  id_meio_propagacao: string,
  id_trajetoria: string,
  transmitir_esocial: string,
  lt_le: string,
  nivel_acao: string,
  id_tecnica_utilizada: string,
  estrategia_amostragem: string,
  probab_freq: string,
  conseq_severidade: string,
  grau_risco: string,
  classe_risco: string,
  obs: string,
) => {

  const empresaIdNumber = Number(empresa_id);


  const data = Risco.update(
    {
      empresa_id: empresaIdNumber, 
      id_fator_risco, 
      id_fonte_geradora,
      id_exposicao,
      id_meio_propagacao,
      id_trajetoria,
      transmitir_esocial, 
      lt_le,
      nivel_acao,
      id_tecnica_utilizada,
      estrategia_amostragem,
      probab_freq,
      conseq_severidade,
      grau_risco,
      classe_risco,
      obs,
    },
    { where: { empresa_id: empresaIdNumber, id: id_risco } }  
  );
  
  return data;
}

























export const deleteDadosRiscoService = (
  empresaId: string,
  riscoId: string
) => {
  try {
    const data = Risco.destroy({
      where: { empresa_id: Number(empresaId), id: riscoId },
    });
    return data;
  } catch (error) {
    console.error(error);
  }
};
