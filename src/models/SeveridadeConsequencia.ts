import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database";
import { MatrizPadrao } from "./MatrizPadrao";

export interface SeveridadeConsequenciaAttributes {
  id: number;
  matriz_id: number;
  position: number;
  description: string;
  criterio: string;
}

export interface SeveridadeConsequenciaCreationAttributes
  extends Optional<SeveridadeConsequenciaAttributes, "id"> {}

export const SeveridadeConsequencia = sequelize.define<
  Model<SeveridadeConsequenciaAttributes, SeveridadeConsequenciaCreationAttributes>
>(
  "severidade_consequencia",
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
      onDelete: "RESTRICT",
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
  },
  { tableName: "severidade_consequencias" }
);
