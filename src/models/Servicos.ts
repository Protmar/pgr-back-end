import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { sequelize } from "../database";
import { EmpresaInstance } from "./Empresa"; // Importação do modelo de Empresa

// Definição dos atributos do Servico
export interface ServicoAttributes {
  id: number;
  empresa_id: number;
  in_use?: boolean;
  cliente_id?: number;
  descricao?: string;
  responsavel_aprovacao?: string;
  cargo_responsavel_aprovacao?: string;
  id_responsavel_aprovacao?: number;
  data_inicio?: Date;
  data_fim?: Date;
  art_url?: string;
  created_at: Date;
  updated_at: Date;
}

// Atributos para a criação de um novo Servico
export interface ServicoCreationAttributes
  extends Optional<ServicoAttributes, "id" | "created_at" | "updated_at"> {}

// Definindo o tipo da instância do modelo Servico
export interface ServicoInstance
  extends Model<ServicoAttributes, ServicoCreationAttributes>,
    ServicoAttributes {}

// Definindo o modelo Servico
export const Servicos = sequelize.define<ServicoInstance>("servicos", {
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
    allowNull: false,
  },
  cliente_id: {
    type: DataTypes.INTEGER,
    references: { model: "clientes", key: "id" },
    onUpdate: "CASCADE",
    onDelete: "RESTRICT",
    allowNull: false,
  },
  in_use: {
    type: DataTypes.BOOLEAN
},
  descricao: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  responsavel_aprovacao: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cargo_responsavel_aprovacao: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  id_responsavel_aprovacao: {
    type: DataTypes.INTEGER,
  },
  data_inicio: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  data_fim: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  art_url: {
    type: DataTypes.STRING,
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
{ tableName: "servicos" });

export default Servicos;
