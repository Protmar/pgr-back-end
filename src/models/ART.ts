import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { sequelize } from "../database";

export interface ARTAttributes {
  id: number;
  empresa_id: number;
  cliente_id: number;
  servico_id: number;
  url_imagem?: string;
  descricao?: string;
  created_at: Date;
  updated_at: Date;
}

// Atributos opcionais na criação
export interface ARTCreationAttributes
  extends Optional<ARTAttributes, "id" | "url_imagem" | "descricao" | "created_at" | "updated_at"> { }

// Instância do model
export interface ARTInstance
  extends Model<ARTAttributes, ARTCreationAttributes>,
  ARTAttributes { }

// Definição do modelo
export const ART = sequelize.define<ARTInstance>(
  "art",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    empresa_id: {
      type: DataTypes.INTEGER,
      references: { model: "empresas", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
      allowNull: false,
    },
    cliente_id: {
      type: DataTypes.INTEGER,
      references: { model: "clientes", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
      allowNull: false,
    },
    servico_id: {
      type: DataTypes.INTEGER,
      references: { model: "servicos", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
      allowNull: false,
    },
    url_imagem: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn("NOW"),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn("NOW"),
    },
  },
  {
    tableName: "art",
    timestamps: false,
  }
);

export default ART;
