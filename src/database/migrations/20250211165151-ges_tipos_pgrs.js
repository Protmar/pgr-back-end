'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ges_tipos_pgrs", {
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
      id_tipo_pgr: {
        type: Sequelize.DataTypes.INTEGER,
        references: { model: "tipo_pgrs", key: "id" },
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
    await queryInterface.dropTable("ges_tipos_pgrs");
  }
};
