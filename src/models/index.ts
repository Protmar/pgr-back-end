import { Empresa } from "./Empresa";
import { Ges } from "./Ges";
import { GesCurso } from "./subdivisoesGes/GesCursos";
import { User } from "./User";

Empresa.hasMany(User, { foreignKey: "empresaId", as: "usuarios"});

User.belongsTo(Empresa, { foreignKey: "empresaId", as: "empresa"});

Ges.hasMany(GesCurso, {
    foreignKey: "id_ges", 
    as: "cursos",         
});
GesCurso.belongsTo(Ges, {
    foreignKey: "id_ges", 
    as: "ges",            
});
export{ Empresa, User, Ges, GesCurso };