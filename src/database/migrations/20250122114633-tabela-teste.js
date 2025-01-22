"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("empresas", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      nome: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      cnpj: {
        type: Sequelize.DataTypes.STRING,
      },
      logo_url: {
        type: Sequelize.DataTypes.STRING,
      },
      marca_dagua_url: {
        type: Sequelize.DataTypes.STRING,
      },
      cidade: {
        type: Sequelize.DataTypes.STRING,
      },
      estado: {
        type: Sequelize.DataTypes.STRING,
      },
      numero_crea: {
        type: Sequelize.DataTypes.STRING,
      },
      localizacao_completa: {
        type: Sequelize.DataTypes.TEXT,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DataTypes.TEXT,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("empresas");
  },
};