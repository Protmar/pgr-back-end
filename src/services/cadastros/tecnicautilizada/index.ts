import { CadastroTecnicaUtilizada } from "../../../models/TecnicasUtilizadas";

const formatarNome = (nome: string) => {
  if (!nome) return "";
  const palavras = nome.toLowerCase().split(" ");
  palavras[0] = palavras[0].charAt(0).toUpperCase() + palavras[0].slice(1);
  return palavras.join(" ");
};

export const tecnicaUtilizadaPostService = async (
  empresaId: string,
  descricao: string
) => {
  const descricaoFormatada = formatarNome(descricao);
  const data = await CadastroTecnicaUtilizada.create({
    empresa_id: Number(empresaId),
    descricao: descricaoFormatada,
  });

  return data;
};

export const tecnicaUtilizadaGetAllService = async (empresaId: string) => {
  const data = await CadastroTecnicaUtilizada.findAll({
    where: {
      empresa_id: Number(empresaId),
    },
  });

  return data;
};

export const tecnicaUtilizadaGetService = async (
  empresaId: string,
  tecnicautilizada: string
) => {
  const data = await CadastroTecnicaUtilizada.findOne({
    where: {
      empresa_id: Number(empresaId),
      id: tecnicautilizada,
    },
  });

  return data;
};

export const tecnicaUtilizadaDeleteService = (
  empresaId: string,
  tecnicautilizada: string
) => {
  const data = CadastroTecnicaUtilizada.destroy({
    where: {
      empresa_id: Number(empresaId),
      id: tecnicautilizada,
    },
  });

  return data;
};

export const tecnicaUtilizadaPutService = (
  empresaId: string,
  descricao: string,
  tecnicautilizadaId: string
) => {
  const descricaoFormatada = formatarNome(descricao);
  const data = CadastroTecnicaUtilizada.update(
    {
      descricao: descricaoFormatada,
    },
    {
      where: {
        empresa_id: Number(empresaId),
        id: tecnicautilizadaId,
      },
    }
  );

  return data;
};
