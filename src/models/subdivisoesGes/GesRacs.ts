import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../../database";

export interface GesRacAttributes {
    id: number;
    empresa_id?: number;
    id_ges: number;
    id_rac: number;
    created_at?: Date;
    updated_at?: Date;
}

// Torna o ID opcional durante a criação
export interface GesRacCreationAttributes extends Optional<GesRacAttributes, 'id'> {}

export const GesRac = sequelize.define<Model<GesRacAttributes, GesRacCreationAttributes>>(
    "ges_racs",
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
        },
        id_ges: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        id_rac: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    }
);
