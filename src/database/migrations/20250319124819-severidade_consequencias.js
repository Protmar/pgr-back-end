'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("severidade_consequencias", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      matriz_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: { model: "matriz_padroes", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      position:{
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      description:{
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      },
      criterio:{
        type: Sequelize.DataTypes.TEXT,
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

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("severidade_consequencias");
  }
};
