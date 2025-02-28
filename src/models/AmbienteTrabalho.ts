import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../database";
import { CadastroEdificacao } from "./Edificacoes";
import { CadastroTeto } from "./Tetos";
import { CadastroParede } from "./Paredes";
import { CadastroVentilacao } from "./Ventilacoes";
import { CadastroIluminacao } from "./Iluminacoes";
import { CadastroPiso } from "./Pisos";
import { CadastroVeiculo } from "./Veiculos";
import { VeiculosAmbienteTrabalho } from "./subdivisoesAmbienteTrabalho/VeiculosAmbientesTrabalho";
import { MobiliarioAmbienteTrabalho } from "./subdivisoesAmbienteTrabalho/MobiliarioAmbienteTrabalho";
import { EquipamentosAmbienteTrabalho } from "./subdivisoesAmbienteTrabalho/EquipamentosAmbienteTrabalho";
import { AtImagesUrls } from "./subdivisoesAmbienteTrabalho/AtImagesUrls";

export interface AmbienteTrabalhoAttributes {
    id: number;
    empresa_id?: number;
    ges_id?: number;
    area: number;
    pe_direito: number;
    qnt_janelas: number;
    qnt_equipamentos: number;
    informacoes_adicionais: string;
    tipo_edificacao_id: number;
    teto_id: number;
    parede_id: number;
    ventilacao_id: number;
    iluminacao_id: number;
    piso_id: number;
    created_at?: Date;
    updated_at?: Date;
}

// Torna o ID opcional durante a criação
export interface AmbienteTrabalhoCreationAttributes
    extends Optional<AmbienteTrabalhoAttributes, "id"> {}

export const AmbienteTrabalho = sequelize.define<
    Model<AmbienteTrabalhoAttributes, AmbienteTrabalhoCreationAttributes>
>(
    "ambientes_trabalhos",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        ges_id: {
            type: DataTypes.INTEGER,
            references: { model: "ges", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "CASCADE"
        },
        area: {
            type: DataTypes.INTEGER,
        },
        pe_direito: {
            type: DataTypes.INTEGER,
        },
        qnt_janelas: {
            type: DataTypes.INTEGER,
        },
        qnt_equipamentos: {
            type: DataTypes.INTEGER,
        },
        tipo_edificacao_id: {
            type: DataTypes.INTEGER,
            references: { model: "edificacoes", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },
        teto_id: {
            type: DataTypes.INTEGER,
            references: { model: "tetos", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },
        parede_id: {
            type: DataTypes.INTEGER,
            references: { model: "paredes", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },
        ventilacao_id: {
            type: DataTypes.INTEGER,
            references: { model: "ventilacoes", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },
        iluminacao_id: {
            type: DataTypes.INTEGER,
            references: { model: "iluminacoes", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },
        piso_id: {
            type: DataTypes.INTEGER,
            references: { model: "pisos", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },
        informacoes_adicionais: {
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
    },
    {
        timestamps: true,
        underscored: true,
    }
);



AmbienteTrabalho.belongsTo(CadastroTeto, {
    foreignKey: "teto_id",
    as: "teto",
});

AmbienteTrabalho.belongsTo(CadastroEdificacao, {
    foreignKey: "tipo_edificacao_id",
    as: "edificacao",
});

AmbienteTrabalho.belongsTo(CadastroParede, {
    foreignKey: "parede_id",
    as: "parede",
});

AmbienteTrabalho.belongsTo(CadastroVentilacao, {
    foreignKey: "ventilacao_id",
    as: "ventilacao",
});

AmbienteTrabalho.belongsTo(CadastroIluminacao, {
    foreignKey: "iluminacao_id",
    as: "iluminacao",
});

AmbienteTrabalho.belongsTo(CadastroPiso, {
    foreignKey: "piso_id",
    as: "piso",
});

AmbienteTrabalho.hasMany(VeiculosAmbienteTrabalho, {
    foreignKey: "id_ambiente_trabalho",
    as: "veiculosAmbienteTrabalho",
});

AmbienteTrabalho.hasMany(MobiliarioAmbienteTrabalho, {
    foreignKey: "id_ambiente_trabalho",
    as: "MobiliarioAmbienteTrabalho",
});

AmbienteTrabalho.hasMany(EquipamentosAmbienteTrabalho, {
    foreignKey: "id_ambiente_trabalho",
    as: "EquipamentoAmbienteTrabalho",
});

AmbienteTrabalho.hasMany(AtImagesUrls, {
    foreignKey: "id_at",
    as: "fluxogramaUrl",
})