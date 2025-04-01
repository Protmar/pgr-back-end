import { Matriz, MatrizCreationAttributes } from "../../../../models/Matriz";
import { parametroPostService } from "../../matrizpadrao/probabilidades";

export const matrizPostService = async (params: MatrizCreationAttributes) => {
  const data = await Matriz.create(params);
  return data;
};

export const matrizGetAll = async (clienteId: string) => {
  const data = await Matriz.findAll({
    where: {
      cliente_id: Number(clienteId),
    },
  });
  return data;
};

export const matrizGet = async (clienteId: string, matrizId: string) => {
  const data = await Matriz.findOne({
    where: {
      cliente_id: Number(clienteId),
      id: matrizId,
    },
  });
  return data;
};

export const matrizDelete = (clienteId: string, matrizId: string) => {
  const data = Matriz.destroy({
    where: {
      cliente_id: Number(clienteId),
      id: matrizId,
    },
  });
  return data;
};

export const matrizPut = (
  clienteId: string,
  size: string,
  tipo: string,
  parametro: string,
  matrizId: string
) => {
  const data = Matriz.update(
    {
      size: Number(size),
      tipo: tipo,
      parametro: parametro,
    },
    {
      where: {
        cliente_id: Number(clienteId),
        id: matrizId,
      },
    }
  );

  return data;
};
