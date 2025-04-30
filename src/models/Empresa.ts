import { sequelize } from "../database";
import { DataTypes, Model, Optional } from "sequelize";
import { MatrizPadrao } from "./MatrizPadrao";
import { Probabilidade } from "./Probabilidades";
import { SeveridadeConsequencia } from "./SeveridadeConsequencia";
import { ClassificacaoRisco } from "./ClassificacaoRisco";

export interface EmpresaAttributes {
  id: number;
  cnpj: string;
  nome: string;
  cidade: string;
  estado: string;
  email: string;
  emailFinanceiro: string;
  nmrCrea: string | null;
  endereco: string;
  telefone: string;
  logoUrl: string | null;
}

export interface EmpresaCreationAttributes
  extends Optional<EmpresaAttributes, "id"> {}

export interface EmpresaInstance
  extends Model<EmpresaAttributes, EmpresaCreationAttributes>,
    EmpresaAttributes {}

export const Empresa = sequelize.define<EmpresaInstance>(
  "Empresa",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    cnpj: {
      type: DataTypes.STRING,
      unique: true,
    },
    nome: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    cidade: {
      type: DataTypes.STRING,
    },
    estado: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    emailFinanceiro: {
      type: DataTypes.STRING,
    },
    nmrCrea: {
      type: DataTypes.STRING,
    },
    endereco: {
      type: DataTypes.STRING,
    },
    telefone: {
      type: DataTypes.STRING,
    },
    logoUrl: {
      type: DataTypes.STRING,
    },
  },
  { tableName: "empresas" }
);

