"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("fatores_riscos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      empresa_id: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: { model: "empresas", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      tipo: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      ordem: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
      },
      codigo_esocial: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      descricao: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      danos_saude: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      tecnica_utilizada: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      lt_le: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      nivel_acao: {
        allowNull: false,
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
    await queryInterface.dropTable("fatores_riscos");
  },
};
