import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database";
import { CadastroFatoresRisco } from "./FatoresRisco";
import { CadastroFonteGeradora } from "./FontesGeradoras";
import { CadastroExposicao } from "./Exposicoes";
import { CadastroMeioDePropagacao } from "./MeiosDePropagacoes";
import { CadastroTrajetoria } from "./Trajetorias";
import { CadastroTecnicaUtilizada } from "./TecnicasUtilizadas";
import { CadastroMedidaControleColetivaExistente } from "./MedidaControleColetivaExistente";
import { CadastroMedidaControleAdministrativaExistente } from "./MedidaControleAdministrativaExistente";
import { CadastroMedidaControleIndividualExistente } from "./MedidaControleIndividualExistente";
import { TransmitirEsocial } from "./enums/transmitir_esocial.enum";
import { ClasseRisco } from "./enums/classe_risco.enum";

const enumTransmitirEsocial = Object.keys(TransmitirEsocial)
const enumClasseRisco = Object.keys(ClasseRisco)

export interface RiscoAttributes {
  id: number;
  empresa_id: number;
  id_fator_risco?: string
  id_fonte_geradora?: string;
  id_exposicao?: string;
  id_meio_propagacao?: string;
  id_trajetoria?: string;
  transmitir_esocial: string;
  lt_le: string;
  nivel_acao: string;
  id_tecnica_utilizada?: string;
  estrategia_amostragem: string;
  probab_freq: string;
  conseq_severidade: string;
  grau_risco: string;
  classe_risco:string;
  obs: string;
}

export interface RiscoCreationAttributes
  extends Optional<RiscoAttributes, "id"> {}

export const Risco = sequelize.define<
  Model<RiscoAttributes, RiscoCreationAttributes>
>("riscos", {
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
    allowNull: true,
  },
  id_fator_risco: {
    type: DataTypes.INTEGER,
    references: { model: "fatores_riscos", key: "id" },
    onUpdate: "CASCADE",
    onDelete: "RESTRICT",
    allowNull: true,
  },
  id_fonte_geradora: {
    type: DataTypes.INTEGER,
    references: { model: "fontes_geradoras", key: "id" },
    onUpdate: "CASCADE",
    onDelete: "RESTRICT",
    allowNull: true,
  },
  id_exposicao: {
    type: DataTypes.INTEGER,
    references: { model: "exposicoes", key: "id" },
    onUpdate: "CASCADE",
    onDelete: "RESTRICT",
    allowNull: true,
  },
  id_meio_propagacao: {
    type: DataTypes.INTEGER,
    references: { model: "meios_de_propagacoes", key: "id" },
    onUpdate: "CASCADE",
    onDelete: "RESTRICT",
    allowNull: true,
  },
  id_trajetoria: {
    type: DataTypes.INTEGER,
    references: { model: "trajetorias", key: "id" },
    onUpdate: "CASCADE",
    onDelete: "RESTRICT",
    allowNull: true,
  },
  transmitir_esocial: {
      allowNull: false,
      type: DataTypes.ENUM,
      values: enumTransmitirEsocial,
      validate: {
        isIn: [enumTransmitirEsocial],
      },
  },
  lt_le: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nivel_acao: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  id_tecnica_utilizada:{
    type: DataTypes.INTEGER,
    references: { model: "tecnicas_utilizadas", key: "id" },
    onUpdate: "CASCADE",
    onDelete: "RESTRICT",
    allowNull: true,
  },
  estrategia_amostragem: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  probab_freq: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  conseq_severidade: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  grau_risco: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  classe_risco: {
      allowNull: false,
      type: DataTypes.ENUM,
      values: enumClasseRisco,
      validate: {
        isIn: [enumClasseRisco],
      },
  },
  obs: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},
{tableName: "riscos"},
);
Risco.belongsTo(CadastroFatoresRisco, {
  foreignKey: "id_fator_risco",
});
Risco.belongsTo(CadastroFonteGeradora, {
  foreignKey: "id_fonte_geradora",
});
Risco.belongsTo(CadastroExposicao, {
  foreignKey: "id_exposicao",
});
Risco.belongsTo(CadastroMeioDePropagacao, {
  foreignKey: "id_meio_propagacao",
});
Risco.belongsTo(CadastroTrajetoria, {
  foreignKey: "id_trajetoria",
});
Risco.belongsTo(CadastroTecnicaUtilizada, {
  foreignKey: "id_tecnica_utilizada",
});

