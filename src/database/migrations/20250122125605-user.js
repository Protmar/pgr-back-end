'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable("users", {
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
          unique: true,
        },
        senha: {
          type: Sequelize.DataTypes.STRING,
        },
        empresa_id: {
          type: Sequelize.DataTypes.INTEGER,
          references: { model: "empresas", key: "id" },
          onUpdate: "CASCADE",
          onDelete: "CASCADE"
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
        },
        recover_code: {
          type: Sequelize.DataTypes.STRING,
        },
        recover_expires: {
          type: Sequelize.DataTypes.DATE,
        },
        role: {
          allowNull: false,
          type: Sequelize.DataTypes.STRING,
        },
        clienteselecionado: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true,
        },
        servicoselecionado: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true,
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

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};
