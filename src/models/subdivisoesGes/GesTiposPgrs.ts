import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../../database";

export interface GesTipoPgrAttributes {
    id: number;
    empresa_id?: number;
    id_ges: number;
    id_tipo_pgr: number;
    created_at?: Date;
    updated_at?: Date;
}

// Torna o ID opcional durante a criação
export interface GesTipoPgrCreationAttributes extends Optional<GesTipoPgrAttributes, 'id'> {}

export const GesTipoPgr = sequelize.define<Model<GesTipoPgrAttributes, GesTipoPgrCreationAttributes>>(
    "ges_tipos_pgrs",
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
        id_tipo_pgr: {
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
