import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database";
import { Matriz } from "./Matriz";

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
      references: { model: "matrizes", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
      allowNull: true,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    criterio: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { tableName: "matrizes" }
);
SeveridadeConsequencia.belongsTo(Matriz, {
  foreignKey: "matriz_id",
});
