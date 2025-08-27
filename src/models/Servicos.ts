import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { sequelize } from "../database";
import { EmpresaInstance } from "./Empresa"; // Importação do modelo de Empresa
import ResponsavelTecnico from "./ResponsavelTecnico";
import ResponsavelTecnicoServico from "./ResponsaveisTecnicosServicos";
import Participantes from "./Participantes";
import MemorialProcessos from "./MemorialProcessos";

// Definição dos atributos do Servico
export interface ServicoAttributes {
  id: number;
  empresa_id: number;
  in_use?: boolean;
  cliente_id?: number;
  descricao?: string;
  responsavel_aprovacao?: string;
  cargo_responsavel_aprovacao?: string;
  id_responsavel_aprovacao?: number;
  data_inicio?: Date;
  data_fim?: Date;
  art_url?: string;
  base_document_url_pgr?: string;
  base_document_url_pgrtr?: string;
  base_document_url_ltcat?: string;
  base_document_url_lp?: string;
  base_document_url_li?: string;
  base_document_url_pca?: string;
  base_document_url_pcmso?: string;
  base_document_url_ppr?: string;
  memorial_descritivo_processo_pgr?: string;
  memorial_descritivo_processo_pgrtr?: string;
  memorial_descritivo_processo_ltcat?: string;
  memorial_descritivo_processo_lp?: string;
  memorial_descritivo_processo_li?: string;
  memorial_descritivo_processo_pca?: string;
  memorial_descritivo_processo_pcmso?: string;
  memorial_descritivo_processo_ppr?: string;
  created_at: Date;
  updated_at: Date;
}

// Atributos para a criação de um novo Servico
export interface ServicoCreationAttributes
  extends Optional<ServicoAttributes, "id" | "created_at" | "updated_at"> { }

// Definindo o tipo da instância do modelo Servico
export interface ServicoInstance
  extends Model<ServicoAttributes, ServicoCreationAttributes>,
  ServicoAttributes { }

// Definindo o modelo Servico
export const Servicos = sequelize.define<ServicoInstance>("servicos", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  empresa_id: {
    type: DataTypes.INTEGER,
    references: { model: "empresas", key: "id" },
    onUpdate: "CASCADE",
    onDelete: "RESTRICT",
    allowNull: false,
  },
  cliente_id: {
    type: DataTypes.INTEGER,
    references: { model: "clientes", key: "id" },
    onUpdate: "CASCADE",
    onDelete: "RESTRICT",
    allowNull: false,
  },
  in_use: {
    type: DataTypes.BOOLEAN
  },
  descricao: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  responsavel_aprovacao: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cargo_responsavel_aprovacao: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  id_responsavel_aprovacao: {
    type: DataTypes.INTEGER,
  },
  data_inicio: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  data_fim: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  art_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  base_document_url_pgr: {
    type: DataTypes.TEXT,
  },
  base_document_url_pgrtr: {
    type: DataTypes.TEXT,
  },
  base_document_url_ltcat: {
    type: DataTypes.TEXT,
  },
  base_document_url_lp: {
    type: DataTypes.TEXT,
  },
  base_document_url_li: {
    type: DataTypes.TEXT,
  },
  base_document_url_pca: {
    type: DataTypes.TEXT,
  },
  base_document_url_pcmso: {
    type: DataTypes.TEXT,
  },
  base_document_url_ppr: {
    type: DataTypes.TEXT,
  },
  memorial_descritivo_processo_pgr: {
    type: DataTypes.TEXT,
  },
  memorial_descritivo_processo_pgrtr: {
    type: DataTypes.TEXT,
  },
  memorial_descritivo_processo_ltcat: {
    type: DataTypes.TEXT,
  },
  memorial_descritivo_processo_lp: {
    type: DataTypes.TEXT,
  },
  memorial_descritivo_processo_li: {
    type: DataTypes.TEXT,
  },
  memorial_descritivo_processo_pca: {
    type: DataTypes.TEXT,
  },
  memorial_descritivo_processo_pcmso: {
    type: DataTypes.TEXT,
  },
  memorial_descritivo_processo_ppr: {
    type: DataTypes.TEXT,
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
  { tableName: "servicos" });

  // Associação many-to-many: Serviços <-> Responsável Técnico
Servicos.belongsToMany(ResponsavelTecnico, {
  through: ResponsavelTecnicoServico,
  foreignKey: "servico_id",
  otherKey: "responsavel_tecnico_id",
  as: "responsaveisTecnicos",
});

// Se quiser acessar direto a pivot:
Servicos.hasMany(ResponsavelTecnicoServico, {
  foreignKey: "servico_id",
  as: "responsavelTecnicoServicos",
});

// Associação com Participantes
Servicos.hasMany(Participantes, {
  foreignKey: "servico_id",
  as: "participantes",
});

// Associação com MemorialProcessos
Servicos.hasMany(MemorialProcessos, {
  foreignKey: "servico_id",
  as: "memorialProcessos",
});

export default Servicos;
