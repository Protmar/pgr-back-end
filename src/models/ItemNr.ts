import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../database";

// Atualize a interface para tornar o id opcional na criação
export interface ItemNrAttributes {
    id: number;
    fator_risco_id: number;
    item_norma: string;
    created_at?: Date;
    updated_at?: Date;
}

// Use a versão `Optional` para tornar id opcional durante a criação
export interface ItemNrCreationAttributes extends Optional<ItemNrAttributes, 'id'> {}

export const ItemNr = sequelize.define<Model<ItemNrAttributes, ItemNrCreationAttributes>>(
    "item_nr",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false, 
        },
        fator_risco_id: {
            type: DataTypes.INTEGER,
            references: { model: "fatores_riscos", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
            allowNull: false, 
        },
        item_norma: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    { tableName: "item_nr" }
);
