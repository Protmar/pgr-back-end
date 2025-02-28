"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("at_images_urls", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      id_at: {
        type: Sequelize.DataTypes.INTEGER,
        references: { model: "ambientes_trabalhos", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      nome_fluxograma: {
        type: Sequelize.DataTypes.TEXT,
      },
      name: {
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
    await queryInterface.dropTable("at_images_urls");
  },
};
