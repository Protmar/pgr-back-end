import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../../database";

export interface GesCursoAttributes {
    id: number;
    empresa_id?: number;
    id_ges: number;
    id_curso: number;
    created_at?: Date;
    updated_at?: Date;
}

// Torna o ID opcional durante a criação
export interface GesCursoCreationAttributes extends Optional<GesCursoAttributes, 'id'> {}

export const GesCurso = sequelize.define<Model<GesCursoAttributes, GesCursoCreationAttributes>>(
    "ges_cursos",
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
        id_curso: {
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
