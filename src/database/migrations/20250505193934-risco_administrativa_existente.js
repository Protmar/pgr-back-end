'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("risco_administrativa_existente", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      id_risco: {
        type: Sequelize.DataTypes.INTEGER,
        references: { model: "riscos", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_medida_controle_administrativa_existentes: {
        type: Sequelize.DataTypes.INTEGER,
        references: { model: "medida_controle_administrativa_existentes", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
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
    await queryInterface.dropTable("risco_administrativa_existente");
  }
};
