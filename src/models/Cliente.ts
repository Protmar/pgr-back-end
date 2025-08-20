import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../database";

// Atualize a interface para tornar o id opcional na criação
export interface ClienteAttributes {
    id: number;
    empresa_id: number;
    cnpj?: string;
    nome_fantasia?: string;
    razao_social?: string;
    cnae?: string;
    atividade_principal?: string;
    grau_de_risco?: string;
    cep?: string;
    estado?: string;
    cidade?: string;
    localizacao_completa?: string;
    email_financeiro?: string;
    contato_financeiro?: string;
    observacoes?: string;
    logo_url?: string;
    add_documento_base_url?: string;
    contato_responsavel?: string;
    email_responsavel?: string;
    nome_responsavel?: string;    
    created_at?: Date;
    updated_at?: Date;
}

// Use a versão `Optional` para tornar id opcional durante a criação
export interface ClienteCreationAttributes extends Optional<ClienteAttributes, 'id'> { }

export const Cliente = sequelize.define<Model<ClienteAttributes, ClienteCreationAttributes>>(
    "Cliente",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false, // Não permitir null
        },
        empresa_id: {
            type: DataTypes.INTEGER,
            references: { model: "empresas", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
            allowNull: false, // Definido como obrigatório
        },
        cnpj: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nome_fantasia: {
            type: DataTypes.STRING,
        },
        razao_social: {
            type: DataTypes.STRING,
        },
        cnae: {
            type: DataTypes.STRING,
        },
        atividade_principal: {
            type: DataTypes.STRING,
        },
        grau_de_risco: {
            type: DataTypes.STRING,
        },
        cep: {
            type: DataTypes.STRING,
        },
        estado: {
            type: DataTypes.STRING,
        },
        cidade: {
            type: DataTypes.STRING,
        },
        localizacao_completa: {
            type: DataTypes.STRING,
        },
        email_financeiro: {
            type: DataTypes.STRING,
        },
        contato_financeiro: {
            type: DataTypes.STRING,
        },
        observacoes: {
            type: DataTypes.STRING,
        },
        logo_url: {
            type: DataTypes.STRING,
        },
        add_documento_base_url: {
            type: DataTypes.STRING,
        },
        contato_responsavel: {
            type: DataTypes.STRING,
        },
        email_responsavel: {
            type: DataTypes.STRING,
        },
        nome_responsavel: {
            type: DataTypes.STRING,
        },
    }
);
