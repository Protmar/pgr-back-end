import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { sequelize } from "../database";

export interface MemorialProcessosAttributes {
  id: number;
  empresa_id: number;
  cliente_id: number;
  servico_id: number;
  url_imagem?: string;
  tipo_laudo?: string;
  descricao?: string;
  created_at: Date;
  updated_at: Date;
}

// Atributos opcionais na criação
export interface MemorialProcessosCreationAttributes
  extends Optional<MemorialProcessosAttributes, "id" | "url_imagem" | "descricao" | "tipo_laudo" | "created_at" | "updated_at"> { }

// Instância do model
export interface MemorialProcessosInstance
  extends Model<MemorialProcessosAttributes, MemorialProcessosCreationAttributes>,
  MemorialProcessosAttributes { }

// Definição do modelo
export const MemorialProcessos = sequelize.define<MemorialProcessosInstance>(
  "memorial_processos",
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
    tipo_laudo: {
      type: DataTypes.STRING,
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
    tableName: "memorial_processos",
    timestamps: false,
  }
);

export default MemorialProcessos;
