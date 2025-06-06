import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../database";

// Atualize a interface para tornar o id opcional na criação
export interface CadastroExigenciaAtividadeAttributes {
    id: number;
    empresa_id: number;
    descricao: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface CadastroExigenciaAtividadeCreationAttributes extends Optional<CadastroExigenciaAtividadeAttributes, 'id'> {}

export const CadastroExigenciaAtividade = sequelize.define<Model<CadastroExigenciaAtividadeAttributes, CadastroExigenciaAtividadeCreationAttributes>>(
    "exigencia_atividade",
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
    },
    {tableName: "exigencia_atividade",}
);
