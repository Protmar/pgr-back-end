'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('images_ficha_campo', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      risco_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: { model: "riscos", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: false,
      },
      url: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      file_type: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("images_ficha_campo");
  }
};
