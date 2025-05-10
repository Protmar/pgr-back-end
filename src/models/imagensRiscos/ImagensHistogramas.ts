import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../../database";
import { Risco } from "../Risco";
// Atualize a interface para tornar o id opcional na criação
export interface ImagensHistogramasAttributes {
    id: number;
    risco_id: number;
    url: string;
}

// Use a versão `Optional` para tornar id opcional durante a criação
export interface ImagensHistogramasCreationAttributes extends Optional<ImagensHistogramasAttributes, 'id'> {}

export const ImagensHistogramas = sequelize.define<Model<ImagensHistogramasAttributes, ImagensHistogramasCreationAttributes>>(
    "images_histogramas",
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
          },
          risco_id: {
            type: DataTypes.INTEGER,
            references: { model: "riscos", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
            allowNull: false,
          },
          url: {
            type: DataTypes.STRING,
            allowNull: false,
          },
    }
);

ImagensHistogramas.belongsTo(Risco, {
    foreignKey: "id",
    as: "risco",
})