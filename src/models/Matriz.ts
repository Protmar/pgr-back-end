import { DataTypes, Model, Optional } from "sequelize";
import { Parametro } from "./enums/parametros.enum";
import { TipoRisco } from "./enums/tipo_risco.enum";
import { sequelize } from "../database";
import { Cliente } from "./Cliente";

const enumParametro = Object.keys(Parametro);
const enumTipo = Object.keys(TipoRisco);

export interface MatrizAttributes {
    id: number;
    cliente_id: number;
    size: number;
    tipo: string;
    parametro: string;
}

export interface MatrizCreationAttributes
    extends Optional<MatrizAttributes, "id"> {}

    export const Matriz = sequelize.define<
    Model<MatrizAttributes, MatrizCreationAttributes>
>("matriz", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    cliente_id: {
        type: DataTypes.INTEGER,
        references: { model: "clientes", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
        allowNull: true,
    },
    size: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    tipo: {
        allowNull: false,
        type: DataTypes.ENUM,
        values: enumTipo,
        validate: {
            isIn: [enumTipo]
        }
    },
        parametro: {
            allowNull: false,
            type: DataTypes.ENUM,
            values: enumParametro,
            validate: {
                isIn: [enumParametro]
            }
        }
    },
{tableName: "matrizes"},
);
Matriz.belongsTo(Cliente, {
    foreignKey: "cliente_id",
})