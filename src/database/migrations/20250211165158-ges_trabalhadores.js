'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ges_trabalhadores", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      id_ges: {
        type: Sequelize.DataTypes.INTEGER,
        references: { model: "ges", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      id_trabalhador: {
        type: Sequelize.DataTypes.INTEGER,
        references: { model: "trabalhadores", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      id_funcao: {
        type: Sequelize.DataTypes.INTEGER,
        references: { model: "funcoes", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
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
    await queryInterface.dropTable("ges_trabalhadores");
  }
};
