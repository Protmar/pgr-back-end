import { CadastroMedidaControleAdministrativaNecessaria } from "../../../../models/MedidaControleAdministrativaNecessaria";

const formatarNome = (nome: string) => {
  if (!nome) return "";
  const palavras = nome.toLowerCase().split(" ");
  palavras[0] = palavras[0].charAt(0).toUpperCase() + palavras[0].slice(1);
  return palavras.join(" ");
};

export const administrativaNecessariaPostService = async (
  empresaId: string,
  descricao: string
) => {
  const descricaoFormatada = formatarNome(descricao);
  const data = await CadastroMedidaControleAdministrativaNecessaria.create({
    empresa_id: Number(empresaId),
    descricao: descricaoFormatada,
  });
  return data;
};

export const administrativaNecessariaGetAllService = async (
  empresaId: string
) => {
  const data = await CadastroMedidaControleAdministrativaNecessaria.findAll({
    where: {
      empresa_id: Number(empresaId),
    },
  });

  return data;
};

export const administrativaNecessariaGetService = async (
  empresaId: string,
  administrativanecessaria: string
) => {
  const data = await CadastroMedidaControleAdministrativaNecessaria.findOne({
    where: {
      empresa_id: Number(empresaId),
      id: administrativanecessaria,
    },
  });

  return data;
};

export const administrativaNecessariaDeleteService = (
  empresaId: string,
  administrativanecessaria: string
) => {
  const data = CadastroMedidaControleAdministrativaNecessaria.destroy({
    where: {
      empresa_id: Number(empresaId),
      id: administrativanecessaria,
    },
  });

  return data;
};

export const administrativaNecessariaPutService = (
  empresaId: string,
  descricao: string,
  administrativanecessariaId: string
) => {
  const descricaoFormatada = formatarNome(descricao);
  const data = CadastroMedidaControleAdministrativaNecessaria.update(
    {
      descricao: descricaoFormatada,
    },
    {
      where: {
        empresa_id: Number(empresaId),
        id: administrativanecessariaId,
      },
    }
  );

  return data;
};
