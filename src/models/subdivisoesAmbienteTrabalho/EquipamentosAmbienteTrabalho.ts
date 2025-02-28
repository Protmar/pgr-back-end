import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../../database";
import { CadastroEquipamento } from "../Equipamentos";

export interface EquipamentosAmbienteTrabalhoAttributes {
    id: number;
    empresa_id?: number;
    id_ambiente_trabalho: number;
    id_equipamentos: number;
    created_at?: Date;
    updated_at?: Date;
}

// Torna o ID opcional durante a criação
export interface EquipamentosAmbienteTrabalhoCreationAttributes
    extends Optional<EquipamentosAmbienteTrabalhoAttributes, "id"> { }

export const EquipamentosAmbienteTrabalho = sequelize.define<
    Model<EquipamentosAmbienteTrabalhoAttributes, EquipamentosAmbienteTrabalhoCreationAttributes>
>(
    "equipamentos_ambiente_trabalhos",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        id_ambiente_trabalho: {
            type: DataTypes.INTEGER,
            references: { model: "ambientes_trabalhos", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT"
        },
        id_equipamentos: {
            type: DataTypes.INTEGER,
            references: { model: "equipamentos", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT"
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

EquipamentosAmbienteTrabalho.belongsTo(CadastroEquipamento, {
    foreignKey: "id_equipamentos",
    as: "equipamento",
});