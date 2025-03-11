'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("parametros", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      matriz_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: { model: "matrizes", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      position:{
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      description:{
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      criterio:{
        type: Sequelize.DataTypes.STRING,
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
    await queryInterface.dropTable("parametros");
  }
};
