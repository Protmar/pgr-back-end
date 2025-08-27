import { DataTypes, HasMany, Model, Optional, Sequelize } from "sequelize";
import { sequelize } from "../database";
import { CadastroCargo } from "./Cargos";
import { CadastroSetor } from "./Setores";

export interface ParticipantesAttributes {
  id: number;
  empresa_id: number;
  cliente_id: number;
  servico_id: number;
  nome: string;
  cargo: number;
  setor: number;
  created_at: Date;
  updated_at: Date;
}

// Atributos opcionais na criação
export interface ParticipantesCreationAttributes
  extends Optional<ParticipantesAttributes, "id" | "nome" | "cargo" | "setor" | "created_at" | "updated_at"> {}

// Instância do model
export interface ParticipantesInstance
  extends Model<ParticipantesAttributes, ParticipantesCreationAttributes>,
    ParticipantesAttributes {}

// Definição do modelo
export const Participantes = sequelize.define<ParticipantesInstance>(
  "participantes",
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
    nome: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cargo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    setor: {
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
    tableName: "participantes",
    timestamps: false,
  }
);

export default Participantes;
