import { DataTypes, Optional, Model } from "sequelize";
import { sequelize } from "../database";
import { EmpresaInstance } from "./Empresa";
import bcrypt from "bcrypt";
import { TipoRisco } from "./enums/tipo_risco.enum";
import { Parametro } from "./enums/parametros.enum";
import { ItemNr } from "./ItemNr";

const enumTipoRisco = Object.keys(TipoRisco);
const enumParametro = Object.keys(Parametro);


export interface CadastroFatoresRiscoAttributes {
  id: number;
  empresaId: number;
  tipo: string;
  parametro: string;
  ordem: number;
  codigo_esocial: string;
  descricao: string;
  danos_saude: string;
  tecnica_utilizada: string;
  lt_le:string;
  nivel_acao:string;
  ltcat:boolean | null;
  laudo_insalubridade:boolean | null;
  pgr:boolean | null;
  pgrtr:boolean | null;
  laudo_periculosidade:boolean | null;
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
    parametro: {
      allowNull: false,
      type: DataTypes.ENUM,
      values: enumParametro,
      validate: {
        isIn: [enumParametro],
      },
    },
    ordem: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    codigo_esocial: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    descricao: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    danos_saude: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    tecnica_utilizada: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    lt_le: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    nivel_acao: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    ltcat: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    laudo_insalubridade: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    pgr: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    pgrtr: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    laudo_periculosidade: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },

  },
  {tableName: "fatores_riscos"}
);
CadastroFatoresRisco.hasMany(ItemNr, {
  foreignKey: "fator_risco_id",
  as: "itensNormas",
})