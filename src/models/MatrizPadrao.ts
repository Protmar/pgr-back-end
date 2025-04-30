import { DataTypes, Model, Optional } from "sequelize";
import { Parametro } from "./enums/parametros.enum";
import { TipoRisco } from "./enums/tipo_risco.enum";
import { sequelize } from "../database";
import { Empresa } from "./Empresa";
import { Probabilidade } from "./Probabilidades";
import { SeveridadeConsequencia } from "./SeveridadeConsequencia";
import { ClassificacaoRisco } from "./ClassificacaoRisco";

const enumParametro = Object.keys(Parametro);
const enumTipo = Object.keys(TipoRisco);

export interface MatrizPadraoAttributes {
    id: number;
    empresa_id: number;
    size: number;
    tipo: string;
    parametro: string;
    is_padrao: boolean;
}

export interface MatrizPadraoCreationAttributes
    extends Optional<MatrizPadraoAttributes, "id"> {}

    export const MatrizPadrao = sequelize.define<
    Model<MatrizPadraoAttributes, MatrizPadraoCreationAttributes>
>("matriz_padrao", {
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
    size: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    tipo: {
        allowNull: false,
        type: DataTypes.ENUM,
        values: enumTipo,
        validate: {
            isIn: [enumTipo]
        }
    },
        parametro: {
            allowNull: false,
            type: DataTypes.ENUM,
            values: enumParametro,
            validate: {
                isIn: [enumParametro]
            }
        },
    is_padrao:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
    }
    },
{tableName: "matriz_padroes"},
);
MatrizPadrao.belongsTo(Empresa, {
    foreignKey: "empresa_id",
})
MatrizPadrao.hasMany(Probabilidade, {
  foreignKey: "matriz_id",
  as: "probabilidades",
});
MatrizPadrao.hasMany(SeveridadeConsequencia, {
  foreignKey: "matriz_id",
  as: "severidades",
});
MatrizPadrao.hasMany(ClassificacaoRisco, {
  foreignKey: "matriz_id",
  as: "classificacaoRisco",
});