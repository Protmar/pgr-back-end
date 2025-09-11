import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../database";
import { GesCurso } from "./subdivisoesGes/GesCursos";
import { GesRac } from "./subdivisoesGes/GesRacs";
import { GesTipoPgr } from "./subdivisoesGes/GesTiposPgrs";
import { GesTrabalhador } from "./subdivisoesGes/GesTrabalhadores";
import { AmbienteTrabalho } from "./AmbienteTrabalho";
import { CadastroEdificacao } from "./Edificacoes";
import { CadastroTeto } from "./Tetos";
import { CadastroParede } from "./Paredes";
import { CadastroVentilacao } from "./Ventilacoes";
import { AtImagesUrls } from "./subdivisoesAmbienteTrabalho/AtImagesUrls";
import { Risco } from "./Risco";

export interface GesAttributes {
  id: number;
  empresa_id?: number; // Tornado opcional
  codigo?: string;
  descricao_ges?: string;
  cliente_id?: number;
  servico_id?: number;
  observacao?: string;
  responsavel?: string;
  cargo?: string;
  nome_fluxograma?: string;
  texto_caracterizacao_processos?: string;
  tipo_pgr?: string;
  riscos?: any;
  created_at?: Date;
  updated_at?: Date;
}


// Torna o ID opcional durante a criação
export interface GesCreationAttributes extends Optional<GesAttributes, "id"> { }

export const Ges = sequelize.define<Model<GesAttributes, GesCreationAttributes>>(
  "ges",
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
      allowNull: true, // Permitido ser nulo, se necessário
    },
    cliente_id: {
      type: DataTypes.INTEGER,
      references: { model: "clientes", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
      allowNull: false,
    },
    servico_id: {
      type: DataTypes.INTEGER,
      references: { model: "servicos", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    codigo: {
      type: DataTypes.STRING,
    },
    descricao_ges: {
      type: DataTypes.TEXT,
    },
    observacao: {
      type: DataTypes.TEXT,
    },
    responsavel: {
      type: DataTypes.TEXT,
    },
    cargo: {
      type: DataTypes.TEXT,
    },
    nome_fluxograma: {
      type: DataTypes.TEXT,
    },
    texto_caracterizacao_processos: {
      type: DataTypes.TEXT,
    },
    tipo_pgr: {
      type: DataTypes.STRING,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

  },
  {
    timestamps: true,
    underscored: true,
  }
);

Ges.hasMany(GesCurso, {
  foreignKey: "id_ges",
  as: "cursos",
});

Ges.hasMany(GesRac, {
  foreignKey: "id_ges",
  as: "racs",
});

Ges.hasMany(GesTipoPgr, {
  foreignKey: "id_ges",
  as: "tiposPgr",
});

Ges.hasMany(GesTrabalhador, {
  foreignKey: "id_ges",
  as: "trabalhadores",
});

Ges.hasMany(AmbienteTrabalho, {
  foreignKey: "ges_id",
  as: "ambientesTrabalhos",
});

Ges.hasMany(AtImagesUrls, {
  foreignKey: "id_ges",
  as: "imagens",
  onDelete: "CASCADE",
  hooks: true,
});

Ges.hasMany(Risco, {
  foreignKey: "ges_id",
  as: "riscos",
});
