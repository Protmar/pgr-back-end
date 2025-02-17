import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../../database";
import { CadastroCargo } from "../Cargos";
import { CadastroVeiculo } from "../Veiculos";
import { Ges } from "../Ges";
import { AmbienteTrabalho } from "../AmbienteTrabalho";

export interface VeiculosAmbienteTrabalhoAttributes {
    id: number;
    empresa_id?: number;
    id_ambiente_trabalho: number;
    id_veiculos: number;
    created_at?: Date;
    updated_at?: Date;
}

// Torna o ID opcional durante a criação
export interface VeiculosAmbienteTrabalhoCreationAttributes
    extends Optional<VeiculosAmbienteTrabalhoAttributes, "id"> {}

export const VeiculosAmbienteTrabalho = sequelize.define<
    Model<VeiculosAmbienteTrabalhoAttributes, VeiculosAmbienteTrabalhoCreationAttributes>
>(
    "veiculos_ambiente_trabalhos",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        id_ambiente_trabalho: {
            type: DataTypes.INTEGER,
            references: { model: "ambientes_trabalhos", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT"
        },
        id_veiculos: {
            type: DataTypes.INTEGER,
            references: { model: "veiculos", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT"
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

VeiculosAmbienteTrabalho.hasMany(CadastroVeiculo, {
    foreignKey: "id_veiculos",
    as: "veiculo",
});
