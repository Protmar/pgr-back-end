import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database";

import { MatrizPadrao } from "./MatrizPadrao";
import { Sinal } from "./enums/sinal";
import { Valor } from "./enums/valor";

const enumSinal = Object.keys(Sinal);
const enumValor = Object.keys(Valor);

export interface ProbabilidadeAttributes {
  id: number;
  matriz_id: number;
  position: number;
  description: string;
  criterio: string | null;
  sinal: string | null;
  valor: string | null ;
  sem_protecao:boolean | null;
}

export interface ProbabilidadeCreationAttributes
  extends Optional<ProbabilidadeAttributes, "id"> {}

export const Probabilidade = sequelize.define<
  Model<ProbabilidadeAttributes, ProbabilidadeCreationAttributes>
>(
  "probabilidade",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    matriz_id: {
      type: DataTypes.INTEGER,
      references: { model: "matriz_padroes", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      allowNull: true,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    criterio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    sinal: {
      allowNull: true,
      type: DataTypes.ENUM,
      values: enumSinal,
      validate: {
        isIn: [enumSinal],
      },
    },
    valor: {
      allowNull: true,
      type: DataTypes.ENUM,
      values: enumValor,
      validate: {
        isIn: [enumValor],
      },
    },
    sem_protecao: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    }
  },
  { tableName: "probabilidades" }
);

