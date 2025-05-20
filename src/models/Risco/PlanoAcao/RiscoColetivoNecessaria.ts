import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../../../database";
import { PlanoAcaoRisco } from "./PlanoAcaoRisco";
import { CadastroMedidaControleColetivaNecessaria } from "../../MedidaControleColetivaNecessaria";


export interface RiscoColetivoNecessariaAttributes {
  id: number;
  id_plano_acao_riscos: number;
  id_medida_controle_coletiva_necessarias: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface RiscoColetivoNecessariaCreationAttributes
  extends Optional<RiscoColetivoNecessariaAttributes, "id"> {}

export const RiscoColetivoNecessaria = sequelize.define<
  Model<RiscoColetivoNecessariaAttributes, RiscoColetivoNecessariaCreationAttributes>
>(
  "risco_coletiva_necessaria",
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
    id_medida_controle_coletiva_necessarias: {
      type: DataTypes.INTEGER,
      references: { model: "medida_controle_coletiva_necessarias", key: "id" },
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

PlanoAcaoRisco.belongsToMany(CadastroMedidaControleColetivaNecessaria, {
  through: RiscoColetivoNecessaria,
  foreignKey: "id_plano_acao_riscos",
  otherKey: "id_medida_controle_coletiva_necessarias",
  as: "medidas_coletivas_necessarias"
});

CadastroMedidaControleColetivaNecessaria.belongsToMany(PlanoAcaoRisco, {
  through: RiscoColetivoNecessaria,
  foreignKey: "id_medida_controle_coletiva_necessarias",
  otherKey: "id_plano_acao_riscos",
  as: "riscos",
});