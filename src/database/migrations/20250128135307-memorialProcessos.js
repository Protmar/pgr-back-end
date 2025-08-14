'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("memorial_processos", {
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
        onDelete: "RESTRICT",
      },
      cliente_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: { model: "clientes", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      servico_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: { model: "servicos", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      url_imagem: {
        type: Sequelize.DataTypes.TEXT,
      },
      descricao: {
        type: Sequelize.DataTypes.TEXT,
      },
      tipo_laudo: {
        type: Sequelize.DataTypes.TEXT,
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("memorial_processos");
  }
};
