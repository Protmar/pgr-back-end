import { Model, DataTypes, InferAttributes, InferCreationAttributes } from "sequelize";
import { sequelize } from "../../database";
import { deleteFileToS3 } from "../../services/aws/s3";

export interface AtImagesUrlsAttributes {
    id: number;
    id_ges: number;
    url: string;
    name: string;
    created_at?: Date;
    updated_at?: Date;
}

// Modelo Sequelize
export const AtImagesUrls:any = sequelize.define<
    Model<InferAttributes<typeof AtImagesUrls>, InferCreationAttributes<typeof AtImagesUrls>>
>(
    "at_images_urls",
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

AtImagesUrls.beforeDestroy(async (instance:any) => {
    const name = instance.getDataValue("name");
    if (name) {
        await deleteFileToS3(name);
    }
});

