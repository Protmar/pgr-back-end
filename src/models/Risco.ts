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
import { CadastroExigenciaAtividade } from "./ExigenciasAtividades";

const enumTransmitirEsocial = Object.keys(TransmitirEsocial);
const enumClasseRisco = Object.keys(ClasseRisco);

export interface RiscoAttributes {
  id: number;
  empresa_id: number;
  id_fator_risco?: string;
  id_fonte_geradora?: string;
  id_trajetoria?: string;
  id_exposicao?: string;
  id_exigencia_atividade?: string;
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
  conclusao_ltcat?: string | null;
  conclusao_periculosidade?: string | null;
  conclusao_insalubridade?: string | null;
  menor_limite_quantificacao?: boolean | null;
}

export interface RiscoCreationAttributes
  extends Optional<RiscoAttributes, "id" | "conclusao_ltcat" | "conclusao_periculosidade" | "conclusao_insalubridade"> { }

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
      allowNull: true,
    },
    id_fonte_geradora: {
      type: DataTypes.INTEGER,
      references: { model: "fontes_geradoras", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
      allowNull: true,
    },
    id_exigencia_atividade: {
      type: DataTypes.INTEGER,
      references: { model: "exigencia_atividade", key: "id" },
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
      allowNull: true,
      type: DataTypes.ENUM,
      values: enumTransmitirEsocial,
      validate: {
        isIn: [enumTransmitirEsocial],
      },
    },
    intens_conc: {
      type: DataTypes.DECIMAL,
    },
    lt_le: {
      type: DataTypes.STRING,
    },
    comentario: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    nivel_acao: {
      type: DataTypes.STRING,
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
    },
    desvio_padrao: {
      type: DataTypes.DECIMAL,
    },
    percentil: {
      type: DataTypes.DECIMAL,

    },
    obs: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    probab_freq: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    conseq_severidade: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    grau_risco: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    classe_risco: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    conclusao_ltcat: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    conclusao_periculosidade: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    conclusao_insalubridade: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    menor_limite_quantificacao: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
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
Risco.belongsTo(CadastroExigenciaAtividade, {
  foreignKey: "id_exigencia_atividade",
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