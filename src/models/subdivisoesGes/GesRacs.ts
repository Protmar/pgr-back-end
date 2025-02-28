import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../../database";
import { CadastroRac } from "../Racs";

export interface GesRacAttributes {
    id: number;
    id_ges: number;
    id_rac: number;
    created_at?: Date;
    updated_at?: Date;
}

// Torna o ID opcional durante a criação
export interface GesRacCreationAttributes extends Optional<GesRacAttributes, 'id'> {}

export const GesRac = sequelize.define<Model<any>>(
    "ges_racs",
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
        id_rac: {
            type: DataTypes.INTEGER,
            references: { model: "racs", key: "id" },
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

GesRac.belongsTo(CadastroRac, {
    foreignKey: "id_rac",
    as: "rac",
});