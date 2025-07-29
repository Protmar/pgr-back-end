import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database";

export interface ClassificacaoRiscoAttributes {
  id: number;
  matriz_id: number;
  grau_risco: number;
  classe_risco: string;
  cor: string;
  definicao: string;
  forma_atuacao: string;
  lessChecked?: boolean;
}

export interface ClassificacaoRiscoCreationAttributes
  extends Optional<ClassificacaoRiscoAttributes, "id"> { }

export const ClassificacaoRisco = sequelize.define<
  Model<ClassificacaoRiscoAttributes, ClassificacaoRiscoCreationAttributes>
>(
  "classificacao_risco",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    matriz_id: {
      type: DataTypes.INTEGER,
      references: { model: "matriz_padroes", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      allowNull: false,
    },
    grau_risco: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    classe_risco: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    cor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    definicao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    forma_atuacao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    lessChecked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  { tableName: "classificacao_riscos" }
)