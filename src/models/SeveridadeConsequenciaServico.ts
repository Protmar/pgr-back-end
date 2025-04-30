import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database";

export interface SeveridadeConsequenciaServicoAttributes {
  id: number;
  matriz_id: number;
  position: number;
  description: string;
  criterio: string;
}

export interface SeveridadeConsequenciaServicoCreationAttributes
  extends Optional<SeveridadeConsequenciaServicoAttributes, "id"> {}

export const SeveridadeConsequenciaServico = sequelize.define<
  Model<SeveridadeConsequenciaServicoAttributes, SeveridadeConsequenciaServicoCreationAttributes>
>(
  "severidade_consequencias_servico",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    matriz_id: {
      type: DataTypes.INTEGER,
      references: { model: "matrizes", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
      allowNull: false,
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
  { tableName: "severidade_consequencias_servicos" }
);
