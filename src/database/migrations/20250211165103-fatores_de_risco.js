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
        onDelete: "CASCADE",
      },
      tipo: {
        allowNull: false,
        type: Sequelize.DataTypes.TEXT,
      },
      parametro: {
        allowNull: false,
        type: Sequelize.DataTypes.TEXT,
      },
      ordem: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
      },
      codigo_esocial: {
        allowNull: false,
        type: Sequelize.DataTypes.TEXT,
      },
      descricao: {
        allowNull: false,
        type: Sequelize.DataTypes.TEXT,
      },
      danos_saude: {
        allowNull: false,
        type: Sequelize.DataTypes.TEXT,
      },
      tecnica_utilizada: {
        allowNull: false,
        type: Sequelize.DataTypes.TEXT,
      },
      lt_le: {
        allowNull: false,
        type: Sequelize.DataTypes.TEXT,
      },
      nivel_acao: {
        allowNull: false,
        type: Sequelize.DataTypes.TEXT,
      },
      ltcat: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: true,
      },
      laudo_insalubridade: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: true,
      },
      pgr: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: true,
      },
      pgrtr: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: true,
      },
      laudo_periculosidade: {
        type: Sequelize.DataTypes.BOOLEAN,
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("fatores_riscos");
  },
};
