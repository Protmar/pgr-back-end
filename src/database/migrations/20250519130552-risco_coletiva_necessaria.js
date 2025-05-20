'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("risco_coletiva_necessaria", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      id_plano_acao_riscos: {
        type: Sequelize.DataTypes.INTEGER,
        references: { model: "plano_acao_riscos", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: false,
      },
      id_medida_controle_coletiva_necessarias: {
        type: Sequelize.DataTypes.INTEGER,
        references: { model: "medida_controle_coletiva_necessarias", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DataTypes.DATE,
      },
      updated_at: {
        type: Sequelize.DataTypes.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("risco_coletiva_necessaria");
  }
};
