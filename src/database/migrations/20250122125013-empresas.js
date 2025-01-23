'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("empresas", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      cnpj: {
        type: Sequelize.DataTypes.STRING,
      },
      nome: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      email: {
        type: Sequelize.DataTypes.STRING,
      },
      nmr_crea: {
        type: Sequelize.DataTypes.STRING,
      },
      endereco: {
        type: Sequelize.DataTypes.STRING,
      },
      telefone: {
        type: Sequelize.DataTypes.STRING,
      },

      logo_url: {
        type: Sequelize.DataTypes.STRING,
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
    await queryInterface.dropTable("empresas");
  }
};
