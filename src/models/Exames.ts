import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../database";
import { Empresa } from "./Empresa";
import Servicos from "./Servicos";
import { Cliente } from "./Cliente";
import { Ges } from "./Ges";

// Interface principal
export interface ExamesAttributes {
  id: number;
  empresa_id: number;
  servico_id: number;
  cliente_id: number;
  ges_id: number;
  procedimento: string;
  codigo: string;
  admissional: string;
  periodico: string;
  demissional: string;
  mudanca_riscos: string;
  retorno_trabalho: string;
  conclusao?: string;
  created_at?: Date;
  updated_at?: Date;
}

// Interface para criação (id opcional)
export interface ExamesCreationAttributes extends Optional<ExamesAttributes, "id" | "conclusao" | "created_at" | "updated_at"> {}

// Definição do model
export const Exames = sequelize.define<Model<ExamesAttributes, ExamesCreationAttributes>>(
  "exames",
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
    servico_id: {
      type: DataTypes.INTEGER,
      references: { model: "servicos", key: "id" },
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
    ges_id: {
      type: DataTypes.INTEGER,
      references: { model: "ges", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    procedimento: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    codigo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    admissional: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Não",
    },
    periodico: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Não",
    },
    demissional: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Não",
    },
    mudanca_riscos: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Não",
    },
    retorno_trabalho: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Não",
    },
    conclusao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "exames",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Associations
Exames.belongsTo(Empresa, { foreignKey: "empresa_id", as: "empresa" });
Empresa.hasMany(Exames, { foreignKey: "empresa_id", as: "exames" });

Exames.belongsTo(Servicos, { foreignKey: "servico_id", as: "servico" });
Servicos.hasMany(Exames, { foreignKey: "servico_id", as: "exames" });

Exames.belongsTo(Cliente, { foreignKey: "cliente_id", as: "cliente" });
Cliente.hasMany(Exames, { foreignKey: "cliente_id", as: "exames" });

Exames.belongsTo(Ges, { foreignKey: "ges_id", as: "ges" });
Ges.hasMany(Exames, { foreignKey: "ges_id", as: "exames" });
