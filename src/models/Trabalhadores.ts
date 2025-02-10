import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { sequelize } from "../database";

// Definição dos atributos do Trabalhador
export interface TrabalhadorAttributes {
  id: number;
  empresa_id: number;
  gerencia_id: number;
  cargo_id: number;
  setor_id: number;
  codigo: string;
  nome: string;
  genero: string;
  data_nascimento: string;
  cpf: string;
  rg: string;
  orgao_expeditor: string;
  nis_pis: string;
  ctps: string;
  serie: string;
  uf: string;
  jornada_trabalho: string;
  cargo: string;
  created_at: Date;
  updated_at: Date;
}

// Atributos para a criação de um novo Trabalhador
export interface TrabalhadorCreationAttributes
  extends Optional<TrabalhadorAttributes, "id" | "created_at" | "updated_at"> {}

// Definindo o tipo da instância do modelo Trabalhador
export interface TrabalhadorInstance
  extends Model<TrabalhadorAttributes, TrabalhadorCreationAttributes>,
    TrabalhadorAttributes {}

// Definindo o modelo Trabalhador
export const Trabalhadores = sequelize.define<TrabalhadorInstance>("trabalhadores", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  empresa_id: {
    type: DataTypes.INTEGER,
    references: { model: "empresas", key: "id" },
    onUpdate: "CASCADE",
    onDelete: "RESTRICT",
  },
  gerencia_id: {
    type: DataTypes.INTEGER,
    references: { model: "gerencias", key: "id" },
    onUpdate: "CASCADE",
    onDelete: "RESTRICT",
  },
  cargo_id: {
    type: DataTypes.INTEGER,
    references: { model: "cargos", key: "id" },
    onUpdate: "CASCADE",
    onDelete: "RESTRICT",
  },
  setor_id: {
    type: DataTypes.INTEGER,
    references: { model: "setores", key: "id" },
    onUpdate: "CASCADE",
    onDelete: "RESTRICT",
  },
  codigo: {
    type: DataTypes.STRING,
  },
  nome: {
    type: DataTypes.STRING,
  },
  genero: {
    type: DataTypes.STRING,
  },
  data_nascimento: {
    type: DataTypes.STRING,
  },
  cpf: {
    type: DataTypes.STRING,
  },
  rg: {
    type: DataTypes.STRING,
  },
  orgao_expeditor: {
    type: DataTypes.STRING,
  },
  nis_pis: {
    type: DataTypes.STRING,
  },
  ctps: {
    type: DataTypes.STRING,
  },
  serie: {
    type: DataTypes.STRING,
  },
  uf: {
    type: DataTypes.STRING,
  },
  jornada_trabalho: {
    type: DataTypes.STRING,
  },
  cargo: {
    type: DataTypes.STRING,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn("NOW"),
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn("NOW"),
  },
},
{ tableName: "trabalhadores" });

export default Trabalhadores;