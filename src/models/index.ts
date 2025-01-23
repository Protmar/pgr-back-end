import { Empresa } from "./Empresa";
import { User } from "./User";

Empresa.hasMany(User, { foreignKey: "empresaId", as: "usuarios"});

User.belongsTo(Empresa, { foreignKey: "empresaId", as: "empresa"});

export{ Empresa, User };