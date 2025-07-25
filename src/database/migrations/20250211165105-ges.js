'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ges", {
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
      codigo: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      descricao_ges: {
        allowNull: false,
        type: Sequelize.DataTypes.TEXT,
      },
      observacao: {
        allowNull: false,
        type: Sequelize.DataTypes.TEXT,
      },
      responsavel: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      cargo: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      nome_fluxograma: {
        type: Sequelize.DataTypes.STRING,
      },
      texto_caracterizacao_processos: {
        type: Sequelize.DataTypes.STRING,
      },
      tipo_pgr: {
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
    await queryInterface.dropTable("ges");
  }
};
