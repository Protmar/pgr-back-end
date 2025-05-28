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
import { RiscoAdministrativoExistente } from "./Risco/RiscoAdministrativoExistente";
import { RiscoIndividualExistente } from "./Risco/RiscoIndividualExistente";
import { RiscoColetivoExistente } from "./Risco/RiscoColetivoExistente";
import { PlanoAcaoRisco } from "./Risco/PlanoAcao/PlanoAcaoRisco";
import { ImagensFichaCampo } from "./imagensRiscos/ImagensFichaCampo";
import { ImagensFotoAvaliacao } from "./imagensRiscos/ImagensFotoAvaliação";
import { ImagensHistogramas } from "./imagensRiscos/ImagensHistogramas";
import { ImagensMemorialCalculo } from "./imagensRiscos/ImagensMemorialCalculo";

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
  intens_conc?: number | null;
  lt_le?: string | null;
  comentario?: string;
  nivel_acao?: string | null;
  id_tecnica_utilizada?: string;
  id_estrategia_amostragem?: string | null;
  desvio_padrao?: number | null;
  percentil?: number | null;
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
      allowNull: false,
    },
    id_fator_risco: {
      type: DataTypes.INTEGER,
      references: { model: "fatores_riscos", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
      allowNull: false,
    },
    id_fonte_geradora: {
      type: DataTypes.INTEGER,
      references: { model: "fontes_geradoras", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
      allowNull: false,
    },
    id_trajetoria: {
      type: DataTypes.INTEGER,
      references: { model: "trajetorias", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
      allowNull: false,
    },
    id_exposicao: {
      type: DataTypes.INTEGER,
      references: { model: "exposicoes", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
      allowNull: false,
    },
    id_meio_propagacao: {
      type: DataTypes.INTEGER,
      references: { model: "meios_de_propagacoes", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
      allowNull: false,
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
      allowNull: true,
    },
    comentario: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    nivel_acao: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    id_tecnica_utilizada: {
      type: DataTypes.INTEGER,
      references: { model: "tecnicas_utilizadas", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
      allowNull: false,
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
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { tableName: "riscos" }
);

Risco.hasMany(ImagensFichaCampo, {
  foreignKey: "risco_id",  
  as: "imagensFichaCampo",
});
Risco.hasMany(ImagensFotoAvaliacao, {
  foreignKey: "risco_id",  
  as: "imagensFotoAvaliacao",
});
Risco.hasMany(ImagensHistogramas, {
  foreignKey: "risco_id",  
  as: "imagensHistogramas",
});
Risco.hasMany(ImagensMemorialCalculo, {
  foreignKey: "risco_id",  
  as: "imagensMemorialCalculo",
})


Risco.belongsTo(CadastroFatoresRisco, {
  foreignKey: "id_fator_risco",
  as: "fatorRisco"
});
Risco.belongsTo(CadastroFonteGeradora, {
  foreignKey: "id_fonte_geradora",
  as: "fonteGeradora"
});
Risco.belongsTo(CadastroExposicao, {
  foreignKey: "id_exposicao",
  as: "exposicao"
});
Risco.belongsTo(CadastroMeioDePropagacao, {
  foreignKey: "id_meio_propagacao",
  as: "meioPropagacao"
});
Risco.belongsTo(CadastroTrajetoria, {
  foreignKey: "id_trajetoria",
  as: "trajetoria"
});
Risco.belongsTo(CadastroTecnicaUtilizada, {
  foreignKey: "id_tecnica_utilizada",
  as: "tecnicaUtilizada"
});
Risco.belongsTo(CadastroEstrategiaAmostragem, {
  foreignKey: "id_estrategia_amostragem",
});


Risco.hasMany(PlanoAcaoRisco, {
  foreignKey: "id_risco",
  as: "planosAcao",
});

Risco.belongsToMany(CadastroMedidaControleAdministrativaExistente, {
  through: RiscoAdministrativoExistente,
  foreignKey: "id_risco",
  otherKey: "id_medida_controle_administrativa_existentes",
  as: "medidas_administrativas_existentes",
});

Risco.hasMany(RiscoAdministrativoExistente, {
  foreignKey: "id_risco",
  as: "relacoes_administrativas", 
});

Risco.belongsToMany(CadastroMedidaControleColetivaExistente, {
  through: RiscoColetivoExistente,
  foreignKey: "id_risco",
  otherKey: "id_medida_controle_coletiva_existentes",
  as: "medidas_coletivas_existentes",
});

Risco.hasMany(RiscoColetivoExistente, {
  foreignKey: "id_risco",
  as: "relacoes_coletivas", 
});

Risco.belongsToMany(CadastroMedidaControleIndividualExistente, {
  through: RiscoIndividualExistente,
  foreignKey: "id_risco",
  otherKey: "id_medida_controle_individual_existentes",
  as: "medidas_individuais_existentes",
});

Risco.hasMany(RiscoIndividualExistente, {
  foreignKey: "id_risco",
  as: "relacoes_individuais", 
});