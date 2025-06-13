'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("plano_acao_riscos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      id_risco: {
        type: Sequelize.DataTypes.INTEGER,
        references: { model: "riscos", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      responsavel: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      eliminar_risco_coletivo: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      eliminar_risco_individual: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      eliminar_risco_administrativo: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      data_prevista: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
      },
      data_realizada: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
      },
      data_inspecao: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
      },
      data_monitoramento: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
      },
      resultado_realizacacao:{
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DataTypes.DATE,
      },
      updated_at: {
        type: Sequelize.DataTypes.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("plano_acao_riscos");
  }
};
