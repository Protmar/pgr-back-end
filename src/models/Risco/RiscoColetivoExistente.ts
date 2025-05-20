import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../../database";
import { CadastroMedidaControleColetivaExistente } from "../MedidaControleColetivaExistente";
import { Risco } from "../Risco";

export interface RiscoColetivoExistenteAttributes {
  id: number;
  id_risco: number;
  id_medida_controle_coletiva_existentes: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface RiscoColetivoExistenteCreationAttributes
  extends Optional<RiscoColetivoExistenteAttributes, "id"> {}

export const RiscoColetivoExistente = sequelize.define<
  Model<RiscoColetivoExistenteAttributes, RiscoColetivoExistenteCreationAttributes>
>(
  "risco_coletivo_existente",
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
    id_medida_controle_coletiva_existentes: {
      type: DataTypes.INTEGER,
      references: { model: "medida_controle_coletiva_existentes", key: "id" },
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

Risco.belongsToMany(CadastroMedidaControleColetivaExistente, {
  through: RiscoColetivoExistente,
  foreignKey: "id_risco",
  otherKey: "id_medida_controle_coletiva_existentes",
  as: "medidas_coletivas_existentes",
});

CadastroMedidaControleColetivaExistente.belongsToMany(Risco, {
  through: RiscoColetivoExistente,
  foreignKey: "id_medida_controle_coletiva_existentes",
  otherKey: "id_risco",
  as: "riscos",
});