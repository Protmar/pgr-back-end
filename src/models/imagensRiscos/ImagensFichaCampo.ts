import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../../database";
import { Risco } from "../Risco";

// Interface com todos os atributos da tabela
export interface ImagensFichaCampoAttributes {
  id: number;
  risco_id: number;
  url: string;
  file_type?: string;
  created_at?: Date;
  updated_at?: Date;
}

// Interface para criação (id é opcional ao criar)
export interface ImagensFichaCampoCreationAttributes
  extends Optional<ImagensFichaCampoAttributes, "id"> {}

// Definição do model
export const ImagensFichaCampo = sequelize.define<
  Model<ImagensFichaCampoAttributes, ImagensFichaCampoCreationAttributes>
>(
  "ImagensFichaCampo",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    risco_id: {
      type: DataTypes.INTEGER,
      references: { model: "riscos", key: "id" }, // model: "risco" (deve bater com o nome da tabela referenciada)
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "images_ficha_campo", // Nome da tabela real no banco
    timestamps: true, // ou true se tiver `createdAt` e `updatedAt`
  }
);

// // Associação com o model Risco
// ImagensFichaCampo.belongsTo(Risco, {
//   foreignKey: "risco_id",
//   as: "riscos",
// });
