'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("matrizes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      servico_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: { model: "servicos", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      size:{
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      tipo:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      parametro:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      is_padrao:{
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
      },
      lessChecked : {
        type: Sequelize.DataTypes.BOOLEAN,
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
    await queryInterface.dropTable("matrizes");
  }
};
