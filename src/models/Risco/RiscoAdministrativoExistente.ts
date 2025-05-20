import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../../database";
import { CadastroMedidaControleAdministrativaExistente } from "../MedidaControleAdministrativaExistente";
import { Risco } from "../Risco";

export interface RiscoAdministrativoExistenteAttributes {
  id: number;
  id_risco: number;
  id_medida_controle_administrativa_existentes: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface RiscoAdministrativoExistenteCreationAttributes
  extends Optional<RiscoAdministrativoExistenteAttributes, "id"> {}

export const RiscoAdministrativoExistente = sequelize.define<
  Model<RiscoAdministrativoExistenteAttributes, RiscoAdministrativoExistenteCreationAttributes>
>(
  "risco_administrativa_existente",
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
    id_medida_controle_administrativa_existentes: {
      type: DataTypes.INTEGER,
      references: { model: "medida_controle_administrativa_existentes", key: "id" },
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

Risco.belongsToMany(CadastroMedidaControleAdministrativaExistente, {
  through: RiscoAdministrativoExistente,
  foreignKey: "id_risco",
  otherKey: "id_medida_controle_administrativa_existentes",
  as: "medidas_administrativas_existentes",
});

CadastroMedidaControleAdministrativaExistente.belongsToMany(Risco, {
  through: RiscoAdministrativoExistente,
  foreignKey: "id_medida_controle_administrativa_existentes",
  otherKey: "id_risco",
  as: "riscos",
});