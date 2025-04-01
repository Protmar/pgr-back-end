'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("servicos", {
      id: {
        allowNull: false,
        autoIncrement: true, // Corrigido
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      empresa_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: { model: "empresas", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      in_use: {
        type: Sequelize.DataTypes.BOOLEAN
    },
      cliente_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: { model: "clientes", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      descricao: {
        type: Sequelize.DataTypes.STRING,
      },
      responsavel_aprovacao: {
        type: Sequelize.DataTypes.STRING,
      },
      cargo_responsavel_aprovacao: {
        type: Sequelize.DataTypes.STRING,
      },
      data_inicio: {
        type: Sequelize.DataTypes.STRING,
      },
      data_fim: {
        type: Sequelize.DataTypes.STRING,
      },
      art_url: {
        type: Sequelize.DataTypes.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.fn('NOW'), // Define o valor padrão
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.fn('NOW'), // Define o valor padrão
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("servicos");
  }
};
