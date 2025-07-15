import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../database";
import { Risco } from "./Risco";

// Atualize a interface para tornar o id opcional na criação
export interface CadastroFonteGeradoraAttributes {
    id: number;
    empresa_id: number;
    descricao: string;
    created_at?: Date;
    updated_at?: Date;
}

// Use a versão `Optional` para tornar id opcional durante a criação
export interface CadastroFonteGeradoraCreationAttributes extends Optional<CadastroFonteGeradoraAttributes, 'id'> { }

export const CadastroFonteGeradora = sequelize.define<Model<CadastroFonteGeradoraAttributes, CadastroFonteGeradoraCreationAttributes>>(
    "fontes_geradoras",
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
            type: DataTypes.TEXT,
            allowNull: false,
        }
    }
);
