import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../database";
import Trabalhadores from "./Trabalhadores";
import { GesTrabalhador } from "./subdivisoesGes/GesTrabalhadores";

// Atualize a interface para tornar o id opcional na criação
export interface CadastroFuncaoAttributes {
    id: number;
    empresa_id: number;
    funcao?: string;
    descricao?: string;
    cbo?: string;
    created_at?: Date;
    updated_at?: Date;
}

// Use a versão `Optional` para tornar id opcional durante a criação
export interface CadastroFuncaoCreationAttributes extends Optional<CadastroFuncaoAttributes, 'id'> { }

export const CadastroFuncao = sequelize.define<Model<CadastroFuncaoAttributes, CadastroFuncaoCreationAttributes>>(
    "funcoes",
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
            allowNull: false,
        },
        funcao: {
            type: DataTypes.STRING,
        },
        descricao: {
            allowNull: false,
            type: DataTypes.TEXT,
        },
        cbo: {
            type: DataTypes.STRING,
        },
    }


);