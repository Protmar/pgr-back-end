import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../../database";
import { Ges } from "../Ges";
import { CadastroTipoPgr } from "../TipoPgrs";

export interface GesTipoPgrAttributes {
    id: number;
    id_ges: number;
    id_tipo_pgr: number;
    created_at?: Date;
    updated_at?: Date;
}

// Torna o ID opcional durante a criação
export interface GesTipoPgrCreationAttributes extends Optional<GesTipoPgrAttributes, 'id'> {}

export const GesTipoPgr = sequelize.define<Model<GesTipoPgrAttributes, GesTipoPgrCreationAttributes>>(
    "ges_tipos_pgrs",
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
        id_tipo_pgr: {
            type: DataTypes.INTEGER,
            references: { model: "tipo_pgrs", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT"
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW, // 🔹 Definindo um valor padrão para evitar erro
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW, // 🔹 Garantindo que não seja nulo
        },
    },
    {
        timestamps: true, // 🔹 Habilita gerenciamento automático de timestamps
        underscored: true, // 🔹 Mantém o padrão snake_case no banco de dados
    }
);

GesTipoPgr.belongsTo(CadastroTipoPgr, {
    foreignKey: "id_tipo_pgr",
    as: "tipoPgr",
});