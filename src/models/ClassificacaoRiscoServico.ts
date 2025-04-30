import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database";

export interface ClassificacaoRiscoServicoAttributes {
    id: number;
    matriz_id: number;
    grau_risco: number;
    classe_risco: string;
    cor: string;
    definicao: string;
    forma_atuacao: string;
}

export interface ClassificacaoRiscoServicoCreationAttributes
    extends Optional<ClassificacaoRiscoServicoAttributes, "id"> {}

export const ClassificacaoRiscoServico = sequelize.define<
    Model<ClassificacaoRiscoServicoAttributes, ClassificacaoRiscoServicoCreationAttributes>
    >(
        "classificacao_riscos_servico",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
              },
              matriz_id: {
                type: DataTypes.INTEGER,
                references: { model: "matrizes", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
                allowNull: false,
              },
              grau_risco: {
                type: DataTypes.INTEGER,
                allowNull: false,
              },
              classe_risco: {
                type: DataTypes.TEXT,
                allowNull: false,
              },
              cor: {
                type: DataTypes.STRING,
                allowNull: false,
              },
              definicao: {
                type: DataTypes.TEXT,
                allowNull: true,
              },
              forma_atuacao: {
                type: DataTypes.TEXT,
                allowNull: true,
              },
        },
        { tableName: "classificacao_riscos_servicos" }
    )