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
import { CadastroEstrategiaAmostragem } from "./EstrategiaAmostragem";

const enumTransmitirEsocial = Object.keys(TransmitirEsocial);
const enumClasseRisco = Object.keys(ClasseRisco);

export interface RiscoAttributes {
  id: number;
  empresa_id: number;
  id_fator_risco?: string;
  id_fonte_geradora?: string;
  id_trajetoria?: string;
  id_exposicao?: string;
  id_meio_propagacao?: string;
  transmitir_esocial: string;
  intens_conc?: number;
  lt_le: string;
  comentario?: string;
  nivel_acao: string;
  id_tecnica_utilizada?: string;
  id_estrategia_amostragem: string;
  desvio_padrao?: number;
  percentil?: number;
  obs: string;
  probab_freq: string;
  conseq_severidade: string;
  grau_risco: string;
  classe_risco: string;
  ges_id?: number;
}

export interface RiscoCreationAttributes
  extends Optional<RiscoAttributes, "id"> {}

export const Risco = sequelize.define<
  Model<RiscoAttributes, RiscoCreationAttributes>
>(
  "riscos",
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
    id_trajetoria: {
      type: DataTypes.INTEGER,
      references: { model: "trajetorias", key: "id" },
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
    ges_id: {
      type: DataTypes.INTEGER,
      references: { model: "ges", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT"
    },
    transmitir_esocial: {
      allowNull: false,
      type: DataTypes.ENUM,
      values: enumTransmitirEsocial,
      validate: {
        isIn: [enumTransmitirEsocial],
      },
    },
    intens_conc: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    lt_le: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    comentario: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    nivel_acao: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id_tecnica_utilizada: {
      type: DataTypes.INTEGER,
      references: { model: "tecnicas_utilizadas", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
      allowNull: true,
    },
    id_estrategia_amostragem: {
      type: DataTypes.INTEGER,
      references: { model: "estrategia_amostragens", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
      allowNull: true,
    },
    desvio_padrao: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    percentil: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    obs: {
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
  },
  { tableName: "riscos" }
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
Risco.belongsTo(CadastroEstrategiaAmostragem, {
  foreignKey: "id_estrategia_amostragem",
});
