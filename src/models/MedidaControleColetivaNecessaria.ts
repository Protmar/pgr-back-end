import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../database";

// Atualize a interface para tornar o id opcional na criação
export interface CadastroMedidaControleColetivaNecessariaAttributes {
    id: number;
    empresa_id: number;
    descricao: string;
    created_at?: Date;
    updated_at?: Date;
}

// Use a versão `Optional` para tornar id opcional durante a criação
export interface CadastroMedidaControleColetivaNecessariaCreationAttributes extends Optional<CadastroMedidaControleColetivaNecessariaAttributes, 'id'> {}

export const CadastroMedidaControleColetivaNecessaria = sequelize.define<Model<CadastroMedidaControleColetivaNecessariaAttributes, CadastroMedidaControleColetivaNecessariaCreationAttributes>>(
    "medida_controle_coletiva_necessaria",
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
