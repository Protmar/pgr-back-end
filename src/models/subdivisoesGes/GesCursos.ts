import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../../database";

export interface GesCursoAttributes {
    id: number;
    id_ges: number;
    id_curso: number;
    created_at?: Date;
    updated_at?: Date;
}
export interface GesCreationAttributes extends Optional<GesCursoAttributes, 'id'> {}

export const GesCurso = sequelize.define<Model<GesCursoAttributes, GesCreationAttributes>>(
    "ges_cursos",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        id_ges: {
            type: DataTypes.INTEGER,
            references: { model: "ges", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        id_curso: {
            type: DataTypes.INTEGER,
            references: { model: "cursosobrigatorios", key: "id" },
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

