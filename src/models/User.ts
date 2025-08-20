import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { sequelize } from "../database";
import bcrypt from "bcrypt";
import { Role } from "./enums/role.enum";
import { EmpresaInstance } from "./Empresa";
import Servicos from "./Servicos";
import { Cliente } from "./Cliente";

const roles = Object.keys(Role)

export type CheckPasswordCallback = (err?: Error, isSame?: boolean) => void;
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
  token_mfa?: string | null;
  use_token_mfa?: boolean | null;
  clienteselecionado?: number | null;
  servicoselecionado?: number | null;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, "id"> { }

export interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
  UserAttributes {
  checkPassword(senha: string, callbackfn: CheckPasswordCallback): void;
  Empresa?: EmpresaInstance;
}

export const User = sequelize.define<UserInstance>("users", {
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
    onDelete: "CASCADE"
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
  },
  clienteselecionado: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: "clienteselecionado", 
  },
  servicoselecionado: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: "servicoselecionado",
  },
  token_mfa: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  use_token_mfa: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
},

  {
    hooks:
    {
      beforeSave: async (users) => {
        if (users.isNewRecord || users.changed('senha')) {
          users.senha = await bcrypt.hash(users.senha.toString(), 10);
        }
      }
    }
  })

//@ts-ignore
User.prototype.checkPassword = function (
  senha: string, callbackfn: CheckPasswordCallback
) {
  //@ts-ignore
  bcrypt.compare(senha, this.senha, (err, isSame) => {
    if (err) {
      callbackfn(err);
    } else {
      callbackfn(undefined, isSame);
    }
  })
}

User.belongsTo(Servicos, {
  foreignKey: "servicoselecionado",
  as: "servicos"
});

User.belongsTo(Cliente, {
  foreignKey: "clienteselecionado",
  as: "clientes"
});