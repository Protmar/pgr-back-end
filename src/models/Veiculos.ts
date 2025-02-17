import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../database";
import { VeiculosAmbienteTrabalho } from "./subdivisoesAmbienteTrabalho/VeiculosAmbientesTrabalho";
import { AmbienteTrabalho } from "./AmbienteTrabalho";

// Atualize a interface para tornar o id opcional na criação
export interface CadastroVeiculoAttributes {
    id: number;
    empresa_id: number;
    descricao: string;
    created_at?: Date;
    updated_at?: Date;
}

// Use a versão `Optional` para tornar id opcional durante a criação
export interface CadastroVeiculoCreationAttributes extends Optional<CadastroVeiculoAttributes, 'id'> {}

export const CadastroVeiculo = sequelize.define<Model<CadastroVeiculoAttributes, CadastroVeiculoCreationAttributes>>(
    "veiculos",
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
        descricao: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }
);