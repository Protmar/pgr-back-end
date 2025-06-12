import { DataTypes, Model, Optional } from "sequelize";
import { Parametro } from "./enums/parametros.enum";
import { TipoRisco } from "./enums/tipo_risco.enum";
import { sequelize } from "../database";
import Servicos from "./Servicos";
import { ProbabilidadeServico } from "./ProbabildadesServicos";
import { SeveridadeConsequenciaServico } from "./SeveridadeConsequenciaServico";
import { ClassificacaoRiscoServico } from "./ClassificacaoRiscoServico";

const enumParametro = Object.keys(Parametro);
const enumTipo = Object.keys(TipoRisco);

export interface MatrizAttributes {
    id: number;
    servico_id: number;
    size: number;
    tipo: string;
    parametro: string;
    is_padrao: boolean;
}

export interface MatrizCreationAttributes
    extends Optional<MatrizAttributes, "id"> { }

export const Matriz = sequelize.define<
    Model<MatrizAttributes, MatrizCreationAttributes>
>("matrizes", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    servico_id: {
        type: DataTypes.INTEGER,
        references: { model: "servicos", key: "id" },
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
    is_padrao: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    }
},
    { tableName: "matrizes" },
);
Matriz.belongsTo(Servicos, {
    foreignKey: "servico_id",
})
Matriz.hasMany(ProbabilidadeServico, {
    foreignKey: "matriz_id",
    as: "probabilidades",
});
Matriz.hasMany(SeveridadeConsequenciaServico, {
    foreignKey: "matriz_id",
    as: "severidades",
});
Matriz.hasMany(ClassificacaoRiscoServico, {
    foreignKey: "matriz_id",
    as: "classificacaoRisco",
});