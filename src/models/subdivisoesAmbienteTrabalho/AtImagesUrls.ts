import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../../database";

export interface AtImagesUrlsAttributes {
    id: number;
    id_at: number;
    url: string;
    name: string;
    created_at?: Date;
    updated_at?: Date;
}

// Torna o ID opcional durante a criação
export interface AtImagesUrlsCreationAttributes
    extends Optional<AtImagesUrlsAttributes, "id"> {}

export const AtImagesUrls = sequelize.define<
    Model<AtImagesUrlsAttributes, AtImagesUrlsCreationAttributes>
>(
    "at_images_urls",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        id_at: {
            type: DataTypes.INTEGER,
            references: { model: "ambientes_trabalhos", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        url: {
            type: DataTypes.STRING,
        },
        name: {
            type: DataTypes.STRING,
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
    },
    {
        timestamps: true,
        underscored: true,
        tableName: "at_images_urls",
    }
);
