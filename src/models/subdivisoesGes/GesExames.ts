import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../../database";
import Trabalhadores from "../Trabalhadores";
import { CadastroFuncao } from "../Funcoes";
import { Exames } from "../Exames";
import { Ges } from "../Ges";

export interface GesExamesAttributes {
    id: number;
    empresa_id?: number;
    id_ges: number;
    id_exames: number;
    created_at?: Date;
    updated_at?: Date;
}

// Torna o ID opcional durante a criação
export interface GesExamesCreationAttributes extends Optional<GesExamesAttributes, 'id'> {}

export const GesExames = sequelize.define<Model<GesExamesAttributes, GesExamesCreationAttributes>>(
    "ges_exames",
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
        id_exames: {
            type: DataTypes.INTEGER,
            references: { model: "exames", key: "id" },
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
// GesExames.ts
GesExames.belongsTo(Ges, {
  foreignKey: "id_ges",
  as: "ges",
});

GesExames.belongsTo(Exames, {
  foreignKey: "id_exames",
  as: "exame", // <-- alterei para "exame"
});

// Ges.ts
Ges.hasMany(GesExames, {
  foreignKey: "id_ges",
  as: "gesExames", // <-- alterei para não conflitar
});

// Exames.ts
Exames.hasMany(GesExames, {
  foreignKey: "id_exames",
  as: "gesExames", // <-- também um alias único
});
