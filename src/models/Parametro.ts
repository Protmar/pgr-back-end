import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database";
import { Matriz } from "./Matriz";

export interface ParametroAttributes {
  id: number;
  matriz_id: number;
  position: number;
  description: string;
  criterio: string;
}

export interface ParametroCreationAttributes
  extends Optional<ParametroAttributes, "id"> {}

export const Parametro = sequelize.define<
  Model<ParametroAttributes, ParametroCreationAttributes>
>(
  "parametro",
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
Parametro.belongsTo(Matriz, {
  foreignKey: "matriz_id",
});
