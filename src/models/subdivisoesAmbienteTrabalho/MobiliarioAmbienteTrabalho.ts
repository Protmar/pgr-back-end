import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../../database";

export interface MobiliarioAmbienteTrabalhoAttributes {
    id: number;
    empresa_id?: number;
    id_ambiente_trabalho: number;
    id_mobiliario: number;
    created_at?: Date;
    updated_at?: Date;
}

// Torna o ID opcional durante a criação
export interface MobiliarioAmbienteTrabalhoCreationAttributes
    extends Optional<MobiliarioAmbienteTrabalhoAttributes, "id"> {}

export const MobiliarioAmbienteTrabalho = sequelize.define<
    Model<MobiliarioAmbienteTrabalhoAttributes, MobiliarioAmbienteTrabalhoCreationAttributes>
>(
    "mobiliario_ambiente_trabalhos",
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
        id_mobiliario: {
            type: DataTypes.INTEGER,
            references: { model: "mobiliarios", key: "id" },
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
