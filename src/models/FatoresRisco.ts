import { DataTypes, Optional, Model } from "sequelize";
import { sequelize } from "../database";
import { EmpresaInstance } from "./Empresa";
import bcrypt from "bcrypt";
import { TipoRisco } from "./enums/tipo_risco.enum";

const enumTipoRisco = Object.keys(TipoRisco);


export interface CadastroFatoresRiscoAttributes {
  id: number;
  empresaId: number;
  tipo: string;
  ordem: number;
  codigo_esocial: string;
  descricao: string;
  danos_saude: string;
  tecnica_utilizada: string;
  lt_le:string;
  nivel_acao:string;
}

export interface CadastroFatoresRiscoCreationAttributes extends Optional<CadastroFatoresRiscoAttributes, 'id'> {}

export const CadastroFatoresRisco = sequelize.define<Model<CadastroFatoresRiscoAttributes, CadastroFatoresRiscoCreationAttributes>>(
    "fatores_riscos",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    empresaId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: { model: "empresas", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    tipo: {
      allowNull: false,
      type: DataTypes.ENUM,
      values: enumTipoRisco,
      validate: {
        isIn: [enumTipoRisco],
      },
    },
    ordem: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    codigo_esocial: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    descricao: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    danos_saude: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    tecnica_utilizada: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    lt_le: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    nivel_acao: {
      allowNull: false,
      type: DataTypes.STRING,
    },

  },
)