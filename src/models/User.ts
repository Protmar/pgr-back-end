import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { sequelize } from "../database";
import bcrypt from "bcrypt";
export interface UserAttributes {
    id: number;
    nome: string;
    email: string;
    senha: string;
    empresaId: number;
    visualizarLaudos: boolean;
    editarLaudos: boolean;
    visualizarConfigClientes: boolean;
    editarConfigClientes: boolean;
    realizarPagamentos: boolean;
    recoverCode: string | null;
    recoverExpires: Date | null;
    role: string;
}

export interface UserCreationAttributes
    extends Optional<UserAttributes, "id"> {}

export interface UserInstance 
    extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {}

export const User = sequelize.define<UserInstance>("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
      },
      senha: {
        type: DataTypes.STRING,
      },
      empresaId: {
        type: DataTypes.INTEGER,
        references: { model: "empresas", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      visualizarLaudos: {
        type: DataTypes.BOOLEAN,
      },
      editarLaudos: {
        type: DataTypes.BOOLEAN,
      },
      visualizarConfigClientes: {
        type: DataTypes.BOOLEAN,
      },
      editarConfigClientes: {
        type: DataTypes.BOOLEAN,
      },
      realizarPagamentos: {
        type: DataTypes.BOOLEAN,
      },
      recoverCode: {
        type: DataTypes.STRING,
      },
      recoverExpires: {
        type: DataTypes.DATE,
      },
      role: {
        allowNull: false,
        type: DataTypes.STRING,
        }
      }, 

      {
        hooks:
        {
            beforeSave: async (user) => {
                if (user.isNewRecord || user.changed('senha')) {
                    user.senha = await bcrypt.hash(user.senha.toString(), 10);
                }
              }
            }
          })