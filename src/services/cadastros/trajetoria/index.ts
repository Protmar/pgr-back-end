import { CadastroTrajetoria } from "../../../models/Trajetorias";

const formatarNome = (nome: string) => {
  if (!nome) return "";
  const palavras = nome.toLowerCase().split(" ");
  palavras[0] = palavras[0].charAt(0).toUpperCase() + palavras[0].slice(1);
  return palavras.join(" ");
};

export const trajetoriaPostService = async (
  empresaId: string,
  descricao: string
) => {
  const descricaoFormatada = formatarNome(descricao);

  const data = await CadastroTrajetoria.create({
    empresa_id: Number(empresaId),
    descricao: descricaoFormatada,
  });

  return data;
};

export const trajetoriaGetAllService = async (empresaId: string) => {
  const data = await CadastroTrajetoria.findAll({
    where: {
      empresa_id: Number(empresaId),
    },
  });

  return data;
};

export const trajetoriaGetService = async (
  empresaId: string,
  idtrajetoria: string
) => {
  const data = await CadastroTrajetoria.findOne({
    where: {
      empresa_id: Number(empresaId),
      id: idtrajetoria,
    },
  });

  return data;
};

export const trajetoriaDeleteService = (
  empresaId: string,
  idtrajetoria: string
) => {
  const data = CadastroTrajetoria.destroy({
    where: {
      empresa_id: Number(empresaId),
      id: idtrajetoria,
    },
  });

  return data;
};

export const trajetoriaPutService = (
  empresaId: string,
  descricao: string,
  trajetoriaId: string
) => {
  const descricaoFormatada = formatarNome(descricao);

  const data = CadastroTrajetoria.update(
    {
      descricao: descricaoFormatada,
    },
    {
      where: {
        empresa_id: Number(empresaId),
        id: trajetoriaId,
      },
    }
  );

  return data;
};
