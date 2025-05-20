import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../../../database";
import { PlanoAcaoRisco } from "./PlanoAcaoRisco";
import { CadastroMedidaControleAdministrativaNecessaria } from "../../MedidaControleAdministrativaNecessaria";


export interface RiscoAdministrativoNecessariaAttributes {
  id: number;
  id_plano_acao_riscos: number;
  id_medida_controle_administrativa_necessarias: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface RiscoAdministrativoNecessariaCreationAttributes
  extends Optional<RiscoAdministrativoNecessariaAttributes, "id"> {}

export const RiscoAdministrativoNecessaria = sequelize.define<
  Model<RiscoAdministrativoNecessariaAttributes, RiscoAdministrativoNecessariaCreationAttributes>
>(
  "risco_administrativa_necessaria",
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
    id_medida_controle_administrativa_necessarias: {
      type: DataTypes.INTEGER,
      references: { model: "medida_controle_administrativa_necessarias", key: "id" },
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

PlanoAcaoRisco.belongsToMany(CadastroMedidaControleAdministrativaNecessaria, {
  through: RiscoAdministrativoNecessaria,
  foreignKey: "id_plano_acao_riscos",
  otherKey: "id_medida_controle_administrativa_necessarias",
  as: "medidas_administrativas_necessarias"
});

CadastroMedidaControleAdministrativaNecessaria.belongsToMany(PlanoAcaoRisco, {
  through: RiscoAdministrativoNecessaria,
  foreignKey: "id_medida_controle_administrativa_necessarias",
  otherKey: "id_plano_acao_riscos",
  as: "riscos",
});