import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../../../database";
import { PlanoAcaoRisco } from "./PlanoAcaoRisco";
import { CadastroMedidaControleIndividualNecessaria } from "../../MedidaControleIndividualNecessaria";


export interface RiscoIndividualNecessariaAttributes {
  id: number;
  id_plano_acao_riscos: number;
  id_medida_controle_individual_necessarias: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface RiscoIndividualNecessariaCreationAttributes
  extends Optional<RiscoIndividualNecessariaAttributes, "id"> {}

export const RiscoIndividualNecessaria = sequelize.define<
  Model<RiscoIndividualNecessariaAttributes, RiscoIndividualNecessariaCreationAttributes>
>(
  "risco_individual_necessaria",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    id_plano_acao_riscos: {
      type: DataTypes.INTEGER,
      references: { model: "plano_acao_riscos", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    id_medida_controle_individual_necessarias: {
      type: DataTypes.INTEGER,
      references: { model: "medida_controle_individual_necessarias", key: "id" },
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

RiscoIndividualNecessaria.belongsTo(CadastroMedidaControleIndividualNecessaria, {
  foreignKey: "id_medida_controle_individual_necessarias",
  as: "medidas_individuais_necessarias",
});

// PlanoAcaoRisco.belongsToMany(CadastroMedidaControleIndividualNecessaria, {
//   through: RiscoIndividualNecessaria,
//   foreignKey: "id_plano_acao_riscos",
//   otherKey: "id_medida_controle_individual_necessarias",
//   as: "medidas_individual_necessarias"
// });

// CadastroMedidaControleIndividualNecessaria.belongsToMany(PlanoAcaoRisco, {
//   through: RiscoIndividualNecessaria,
//   foreignKey: "id_medida_controle_individual_necessarias",
//   otherKey: "id_plano_acao_riscos",
//   as: "riscos",
// });