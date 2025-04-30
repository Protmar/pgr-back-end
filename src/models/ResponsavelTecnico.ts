import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { sequelize } from "../database";
import { EmpresaInstance } from "./Empresa"; // Importação do modelo de Empresa

// Definição dos atributos do Servico
export interface responsavelTecnicoAttributes {
  id: number;
  nome: string;
  funcao: string;
  numero_crea: string;
  estado_crea: string;
  empresa_id: number;
  created_at: Date;
  updated_at: Date;
}

// Atributos para a criação de um novo responsavelTecnico
export interface responsavelTecnicoCreationAttributes
  extends Optional<responsavelTecnicoAttributes, "id" | "created_at" | "updated_at"> { }

// Definindo o tipo da instância do modelo responsavelTecnico
export interface responsavelTecnicoInstance
  extends Model<responsavelTecnicoAttributes, responsavelTecnicoCreationAttributes>,
  responsavelTecnicoAttributes { }

// Definindo o modelo responsavelTecnico
export const ResponsavelTecnico = sequelize.define<responsavelTecnicoInstance>("responsavel_tecnico", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING
  },
  funcao: {
    type: DataTypes.STRING,
  },
  numero_crea: {
    type: DataTypes.STRING,
  },
  estado_crea: {
    type: DataTypes.STRING,
  },
  empresa_id: {
    type: DataTypes.INTEGER,
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
  { tableName: "responsavel_tecnico" });

export default ResponsavelTecnico;
