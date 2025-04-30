import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../../database";
import Trabalhadores from "../Trabalhadores";
import { CadastroFuncao } from "../Funcoes";

export interface GesTrabalhadorAttributes {
    id: number;
    empresa_id?: number;
    id_ges: number;
    id_trabalhador: number;
    id_funcao: number;
    created_at?: Date;
    updated_at?: Date;
}

// Torna o ID opcional durante a criação
export interface GesTrabalhadorCreationAttributes extends Optional<GesTrabalhadorAttributes, 'id'> {}

export const GesTrabalhador = sequelize.define<Model<GesTrabalhadorAttributes, GesTrabalhadorCreationAttributes>>(
    "ges_trabalhadores",
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
        id_trabalhador: {
            type: DataTypes.INTEGER,
            references: { model: "trabalhadores", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT"
        },
        id_funcao: {
            type: DataTypes.INTEGER,
            references: { model: "funcoes", key: "id" },
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
    }
);

GesTrabalhador.belongsTo(Trabalhadores, {
    foreignKey: "id_trabalhador",
    as: "trabalhador",
});

GesTrabalhador.belongsTo(CadastroFuncao, {
    foreignKey: "id_funcao",
    as: "funcao",
});