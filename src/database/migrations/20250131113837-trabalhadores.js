'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("trabalhadores", {
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
      gerencia_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: { model: "gerencias", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      cargo_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: { model: "cargos", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      setor_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: { model: "setores", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      codigo: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      nome: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      genero: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      data_nascimento: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      cpf: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      rg: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      orgao_expeditor: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      nis_pis: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      ctps: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      serie: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      uf: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      jornada_trabalho: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      cargo: {
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
    await queryInterface.dropTable("trabalhadores");
  }
};
