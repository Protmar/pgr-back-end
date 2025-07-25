import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../../../database";
import { Risco } from "../../Risco";
import { RiscoAdministrativoNecessaria } from "./RiscoAdministrativoNecessaria";
import { RiscoColetivoNecessaria } from "./RiscoColetivoNecessaria";
import { RiscoIndividualNecessaria } from "./RiscoIndividualNecessaria";
import { CadastroMedidaControleAdministrativaNecessaria } from "../../MedidaControleAdministrativaNecessaria";
import { CadastroMedidaControleColetivaNecessaria } from "../../MedidaControleColetivaNecessaria";
import { CadastroMedidaControleIndividualNecessaria } from "../../MedidaControleIndividualNecessaria";
import { EliminacaoRisco } from "../../enums/eliminacao_risco";

const enumEliminacaoRisco = Object.keys(EliminacaoRisco);

// Atualize a interface para tornar o id opcional na criação
export interface CadastroPlanoAcaoRiscoAttributes {
  id: number;
  id_risco: number;
  eliminar_risco_coletivo?: string;
  eliminar_risco_individual?: string;
  eliminar_risco_administrativo?: string;
  responsavel: string;
  data_prevista: Date;
  data_realizada: Date;
  data_inspecao: Date;
  data_monitoramento: Date;
  resultado_realizacacao: Text;
  created_at?: Date;
  updated_at?: Date;
}

// Use a versão `Optional` para tornar id opcional durante a criação
export interface CadastroPlanoAcaoRiscoCreationAttributes extends Optional<CadastroPlanoAcaoRiscoAttributes, 'id'> { }

export const PlanoAcaoRisco = sequelize.define<Model<CadastroPlanoAcaoRiscoAttributes, CadastroPlanoAcaoRiscoCreationAttributes>>(
    "plano_acao_risco",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        id_risco: {
            type: DataTypes.INTEGER,
            references: { model: "empresas", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
            allowNull: false,
        },
        eliminar_risco_coletivo: {
            type: DataTypes.STRING,
        },
        eliminar_risco_individual: {
            type: DataTypes.STRING,
        },
        eliminar_risco_administrativo: {
            type: DataTypes.STRING,
        },
        responsavel: {
            type: DataTypes.STRING,
        },
        data_prevista: {
            type: DataTypes.DATE,
        },
        data_realizada: {
            type: DataTypes.DATE,
        },
        data_inspecao: {
            type: DataTypes.DATE,
        },
        data_monitoramento: {
            type: DataTypes.DATE,
        },
        resultado_realizacacao: {
            type: DataTypes.TEXT,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    }
);

PlanoAcaoRisco.hasMany(RiscoAdministrativoNecessaria, {
    foreignKey: "id_plano_acao_riscos",
    as: "riscosAdministrativosNecessaria",
});

PlanoAcaoRisco.belongsToMany(CadastroMedidaControleAdministrativaNecessaria, {
  through: RiscoAdministrativoNecessaria,
  foreignKey: "id_plano_acao_riscos",
  otherKey: "id_medida_controle_administrativa_necessarias",
  as: "medidas_administrativas_necessarias"
// =======
// export interface CadastroPlanoAcaoRiscoCreationAttributes
//   extends Optional<CadastroPlanoAcaoRiscoAttributes, "id"> {}

// export const PlanoAcaoRisco = sequelize.define<
//   Model<
//     CadastroPlanoAcaoRiscoAttributes,
//     CadastroPlanoAcaoRiscoCreationAttributes
//   >
// >("plano_acao_risco", {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//     allowNull: false,
//   },
//   id_risco: {
//     type: DataTypes.INTEGER,
//     references: { model: "empresas", key: "id" },
//     onUpdate: "CASCADE",
//     onDelete: "RESTRICT",
//     allowNull: false,
//   },
//   eliminar_risco_coletivo: {
//     type: DataTypes.ENUM,
//     allowNull: true,
//     values: enumEliminacaoRisco,
//     validate: {
//       isIn: [enumEliminacaoRisco],
//     },
//   },
//   eliminar_risco_individual: {
//     type: DataTypes.ENUM,
//     allowNull: true,
//     values: enumEliminacaoRisco,
//     validate: {
//       isIn: [enumEliminacaoRisco],
//     },
//   },
//   eliminar_risco_administrativo: {
//     type: DataTypes.ENUM,
//     allowNull: true,
//     values: enumEliminacaoRisco,
//     validate: {
//       isIn: [enumEliminacaoRisco],
//     },
//   },
//   responsavel: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   data_prevista: {
//     type: DataTypes.DATE,
//     allowNull: false,
//   },
//   data_realizada: {
//     type: DataTypes.DATE,
//     allowNull: true,
//   },
//   data_inspecao: {
//     type: DataTypes.DATE,
//     allowNull: true,
//   },
//   data_monitoramento: {
//     type: DataTypes.DATE,
//     allowNull: true,
//   },
//   resultado_realizacacao: {
//     type: DataTypes.TEXT,
//     allowNull: true,
//   },
//   created_at: {
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW,
//   },
//   updated_at: {
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW,
//   },
// });

// Risco.belongsToMany(PlanoAcaoRisco, {
//   through: PlanoAcaoRisco,
//   foreignKey: "id_risco",
//   otherKey: "id_risco",
//   as: "planosAcao",
// });
// PlanoAcaoRisco.belongsToMany(Risco, {
//   through: PlanoAcaoRisco,
//   foreignKey: "id_risco",
//   otherKey: "id_risco",
//   as: "risco",
// >>>>>>> f94e7e89814945a911d233b7a1731b863d90afea
});

PlanoAcaoRisco.hasMany(RiscoColetivoNecessaria, {
    foreignKey: "id_plano_acao_riscos",
    as: "riscosColetivosNecessaria",
});

PlanoAcaoRisco.belongsToMany(CadastroMedidaControleColetivaNecessaria, {
  through: RiscoColetivoNecessaria,
  foreignKey: "id_plano_acao_riscos",
  otherKey: "id_medida_controle_coletiva_necessarias",
  as: "medidas_coletivas_necessarias"
});

PlanoAcaoRisco.hasMany(RiscoIndividualNecessaria, {
    foreignKey: "id_plano_acao_riscos",
    as: "riscosIndividuaisNecessaria",
});

PlanoAcaoRisco.belongsToMany(CadastroMedidaControleIndividualNecessaria, {
  through: RiscoIndividualNecessaria,
  foreignKey: "id_plano_acao_riscos",
  otherKey: "id_medida_controle_individual_necessarias",
  as: "medidas_individual_necessarias"
});

// Risco.belongsToMany(PlanoAcaoRisco, {
//     through: PlanoAcaoRisco,
//     foreignKey: "id_risco",
//     otherKey: "id_risco",
//     as: "planosAcao",
// });
// PlanoAcaoRisco.belongsToMany(Risco, {
//     through: PlanoAcaoRisco,
//     foreignKey: "id_risco",
//     otherKey: "id_risco",
//     as: "risco",
// });
