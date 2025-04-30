'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('classificacao_riscos_servicos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      matriz_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: { model: "matrizes", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: false,
      },
      grau_risco: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      classe_risco: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      cor: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      definicao: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      },
      forma_atuacao:{
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("classificacao_riscos_servicos");
  }
};
