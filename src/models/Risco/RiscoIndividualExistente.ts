import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../../database";
import { CadastroMedidaControleIndividualExistente } from "../MedidaControleIndividualExistente";
import { Risco } from "../Risco";

export interface RiscoIndividualExistenteAttributes {
  id: number;
  id_risco: number;
  id_medida_controle_individual_existentes: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface RiscoIndividualExistenteCreationAttributes
  extends Optional<RiscoIndividualExistenteAttributes, "id"> {}

export const RiscoIndividualExistente = sequelize.define<
  Model<RiscoIndividualExistenteAttributes, RiscoIndividualExistenteCreationAttributes>
>(
  "risco_individual_existente",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    id_risco: {
      type: DataTypes.INTEGER,
      references: { model: "riscos", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    id_medida_controle_individual_existentes: {
      type: DataTypes.INTEGER,
      references: { model: "medida_controle_individual_existentes", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
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
    freezeTableName: true,
  }
);

Risco.belongsToMany(CadastroMedidaControleIndividualExistente, {
  through: RiscoIndividualExistente,
  foreignKey: "id_risco",
  otherKey: "id_medida_controle_individual_existentes",
  as: "medidas_individuais_existentes",
});

CadastroMedidaControleIndividualExistente.belongsToMany(Risco, {
  through: RiscoIndividualExistente,
  foreignKey: "id_medida_controle_individual_existentes",
  otherKey: "id_risco",
  as: "riscos",
});