import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../database";

export interface GesAttributes {
    id: number;
    empresa_id?: number; // Tornado opcional
    codigo: string;
    descricao_ges: string;
    observacao: string;
    caracterizacao_processos_id: number;
    caracterizacao_ambientes_trabalho_id: number;
    responsavel: string;
    cargo: string;
    created_at?: Date;
    updated_at?: Date;
}

// Torna o ID opcional durante a criação
export interface GesCreationAttributes extends Optional<GesAttributes, 'id'> {}

export const Ges = sequelize.define<Model<GesAttributes, GesCreationAttributes>>(
    "ges",
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
            allowNull: true, // Permitido ser nulo, se necessário
        },
        codigo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        descricao_ges: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        observacao: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        caracterizacao_processos_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        caracterizacao_ambientes_trabalho_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        responsavel: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cargo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    }
);
