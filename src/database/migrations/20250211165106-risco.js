'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("riscos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      empresa_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: { model: "empresas", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      id_fator_risco: {
        type: Sequelize.DataTypes.INTEGER,
        references: { model: "fatores_riscos", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      id_fonte_geradora: {
        type: Sequelize.DataTypes.INTEGER,
        references: { model: "fontes_geradoras", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      id_trajetoria: {
        type: Sequelize.DataTypes.INTEGER,
        references: { model: "trajetorias", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      id_exposicao: {
        type: Sequelize.DataTypes.INTEGER,
        references: { model: "exposicoes", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      id_meio_propagacao: {
        type: Sequelize.DataTypes.INTEGER,
        references: { model: "meios_de_propagacoes", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      ges_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: { model: "ges", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      transmitir_esocial: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      intens_conc: {
        allowNull: false,
        type: Sequelize.DataTypes.DECIMAL,
      },
      lt_le: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
      },
      comentario: {
        allowNull: false,
        type: Sequelize.DataTypes.TEXT,
      },
      nivel_acao: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
      },
      id_tecnica_utilizada: {
        type: Sequelize.DataTypes.INTEGER,
        references: { model: "tecnicas_utilizadas", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      id_estrategia_amostragem: {
        type: Sequelize.DataTypes.INTEGER,
        references: { model: "estrategia_amostragens", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
        allowNull: true
      },
      desvio_padrao: {
        allowNull: false,
        type: Sequelize.DataTypes.DECIMAL,
      },
      percentil: {
        allowNull: false,
        type: Sequelize.DataTypes.DECIMAL,

      },
      obs: {
        allowNull: false,
        type: Sequelize.DataTypes.TEXT,
      },
      probab_freq: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      conseq_severidade: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      grau_risco: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      classe_risco: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      conclusao_ltcat:{
        allowNull: true,
        type: Sequelize.DataTypes.TEXT,
      },
      conclusao_periculosidade: {
        allowNull: true,
        type: Sequelize.DataTypes.TEXT,
      },
      conclusao_insalubridade: {
        allowNull: true,
        type: Sequelize.DataTypes.TEXT,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("riscos");
  }
};