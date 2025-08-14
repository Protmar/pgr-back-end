'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("responsavel_tecnicos_servicos", {
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
      responsavel_tecnico_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: { model: "responsavel_tecnicos", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
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
    await queryInterface.dropTable("responsavel_tecnicos_servicos");
  }
};
