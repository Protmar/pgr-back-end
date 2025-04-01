import { getCache } from "../../controllers/cliente/cliente";
import Trabalhadores, {
  TrabalhadorCreationAttributes,
} from "../../models/Trabalhadores";

export const postDadosTrabalhadorService = (
  params: TrabalhadorCreationAttributes
) => {
  const data = Trabalhadores.create(params);
  return data;
};

export const getDadosAllTrabalhadoresService = (empresaId: string) => {
  const cliente_id = globalThis.cliente_id;
  const servico_id = globalThis.servico_id;

  if(cliente_id) {
    const data = Trabalhadores.findAll({
      where: { empresa_id: Number(empresaId), cliente_id: Number(cliente_id), servico_id },
    });
    return data;
  }
};

export const getDadosTrabalhadorService = (
  empresaId: string,
  trabalhadorId: string
) => {
  const data = Trabalhadores.findOne({
    where: { empresa_id: Number(empresaId), id: Number(trabalhadorId) },
  });
  return data;
};

export const putDadosTrabalhadorService = (
  empresaId: string,
  trabalhadorId: string,
  gerencia_id: string,
  cargo_id: string,
  setor_id: string,
  codigo: string,
  nome: string,
  genero: string,
  data_nascimento: string,
  cpf: string,
  rg: string,
  orgao_expeditor: string,
  nis_pis: string,
  ctps: string,
  serie: string,
  uf: string,
  jornada_trabalho: string,
  cargo: string
) => {
  const data = Trabalhadores.update(
    {
      gerencia_id: Number(gerencia_id),
      cargo_id: Number(cargo_id),
      setor_id: Number(setor_id),
      codigo,
      nome,
      genero,
      data_nascimento,
      cpf,
      rg,
      orgao_expeditor,
      nis_pis,
      ctps,
      serie,
      uf,
      jornada_trabalho,
      cargo,
    },
    { where: { empresa_id: Number(empresaId), id: trabalhadorId } }
  );
  return data;
};

export const deleteDadosTrabalhadorService = (
  empresaId: string,
  trabaladorId: string
) => {
  const data = Trabalhadores.destroy({
    where: { empresa_id: Number(empresaId), id: trabaladorId },
  });
  return data;
};
