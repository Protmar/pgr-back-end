import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { sequelize } from "../database";
import ResponsavelTecnico from "./ResponsavelTecnico";
import Servicos from "./Servicos";

export interface ResponsavelTecnicoServicoAttributes {
  id: number;
  empresa_id: number;
  servico_id: number;
  responsavel_tecnico_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface ResponsavelTecnicoServicoCreationAttributes
  extends Optional<ResponsavelTecnicoServicoAttributes, "id" | "created_at" | "updated_at"> {}

export interface ResponsavelTecnicoServicoInstance
  extends Model<ResponsavelTecnicoServicoAttributes, ResponsavelTecnicoServicoCreationAttributes>,
    ResponsavelTecnicoServicoAttributes {}

export const ResponsavelTecnicoServico = sequelize.define<ResponsavelTecnicoServicoInstance>(
  "responsavel_tecnicos_servicos",
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
    servico_id: {
      type: DataTypes.INTEGER,
      references: { model: "servicos", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
      allowNull: false,
    },
    responsavel_tecnico_id: {
      type: DataTypes.INTEGER,
      references: { model: "responsavel_tecnicos", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
      allowNull: false,
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
  {
    tableName: "responsavel_tecnicos_servicos",
    timestamps: false,
  }
);

ResponsavelTecnicoServico.belongsTo(ResponsavelTecnico, {
  foreignKey: "responsavel_tecnico_id",
  as: "responsavelTecnico",
});

export default ResponsavelTecnicoServico;
