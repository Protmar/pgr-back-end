'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable("usuario", {
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
        email: {
          type: Sequelize.DataTypes.STRING,
        },
        senha: {
          type: Sequelize.DataTypes.STRING,
        },
        empresa_id: {
          type: Sequelize.DataTypes.INTEGER,
          references: { model: "empresas", key: "id" },
          onUpdate: "CASCADE",
          onDelete: "RESTRICT"
        },
        visualizar_laudos: {
          type: Sequelize.DataTypes.BOOLEAN,
        },
        editar_laudos: {
          type: Sequelize.DataTypes.BOOLEAN,
        },
        visualizar_config_clientes: {
          type: Sequelize.DataTypes.BOOLEAN,
        },
        editar_config_clientes: {
          type: Sequelize.DataTypes.BOOLEAN,
        },
        realizar_pagamentos: {
          type: Sequelize.DataTypes.BOOLEAN,
        }
     });
  },

  // async down (queryInterface, Sequelize) {
  //   await queryInterface.dropTable("clientes");
  // },
};
