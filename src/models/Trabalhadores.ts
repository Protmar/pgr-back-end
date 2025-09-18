import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { sequelize } from "../database";
import { CadastroFuncao } from "./Funcoes";
import { CadastroSetor } from "./Setores";

// Todos os atributos opcionais
export interface TrabalhadorAttributes {
  id?: number;
  empresa_id?: number;
  gerencia_id?: number;
  cargo_id?: number;
  setor_id?: number;
  cliente_id?: number;
  servico_id?: number;
  funcao_id?: number;
  codigo?: string;
  nome?: string;
  genero?: string;
  data_nascimento?: string;
  cpf?: string;
  rg?: string;
  orgao_expeditor?: string;
  nis_pis?: string;
  ctps?: string;
  serie?: string;
  uf?: string;
  jornada_trabalho?: string;
  cargo?: string;
  qnt_trabalhadores?: number;
  nao_existe?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

// Todos opcionais na criação
export interface TrabalhadorCreationAttributes
  extends Optional<TrabalhadorAttributes, keyof TrabalhadorAttributes> { }

// Instância do modelo
export interface TrabalhadorInstance
  extends Model<TrabalhadorAttributes, TrabalhadorCreationAttributes>,
  TrabalhadorAttributes { }

// Modelo Sequelize
export const Trabalhadores = sequelize.define<TrabalhadorInstance>(
  "trabalhadores",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    empresa_id: { type: DataTypes.INTEGER, allowNull: true },
    gerencia_id: { type: DataTypes.INTEGER, allowNull: true },
    cargo_id: { type: DataTypes.INTEGER, allowNull: true },
    setor_id: { type: DataTypes.INTEGER, allowNull: true },
    cliente_id: { type: DataTypes.INTEGER, allowNull: true },
    servico_id: { type: DataTypes.INTEGER, allowNull: true },
    funcao_id: { type: DataTypes.INTEGER, allowNull: true },
    codigo: { type: DataTypes.STRING, allowNull: true },
    nome: { type: DataTypes.STRING, allowNull: true },
    genero: { type: DataTypes.STRING, allowNull: true },
    data_nascimento: { type: DataTypes.STRING, allowNull: true },
    cpf: { type: DataTypes.STRING, allowNull: true },
    rg: { type: DataTypes.STRING, allowNull: true },
    orgao_expeditor: { type: DataTypes.STRING, allowNull: true },
    nis_pis: { type: DataTypes.STRING, allowNull: true },
    ctps: { type: DataTypes.STRING, allowNull: true },
    serie: { type: DataTypes.STRING, allowNull: true },
    uf: { type: DataTypes.STRING, allowNull: true },
    jornada_trabalho: { type: DataTypes.STRING, allowNull: true },
    cargo: { type: DataTypes.STRING, allowNull: true },
    qnt_trabalhadores: { type: DataTypes.INTEGER, allowNull: true },
    nao_existe: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    created_at: { type: DataTypes.DATE, allowNull: true, defaultValue: Sequelize.fn("NOW") },
    updated_at: { type: DataTypes.DATE, allowNull: true, defaultValue: Sequelize.fn("NOW") },
  },
  { tableName: "trabalhadores", timestamps: false }
);

// Relações
Trabalhadores.belongsTo(CadastroFuncao, { foreignKey: "funcao_id", as: "funcao" });
Trabalhadores.belongsTo(CadastroSetor, { foreignKey: "setor_id", as: "setor" });

export default Trabalhadores;
