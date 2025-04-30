'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('responsavel_tecnico', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      nome: {
        type: Sequelize.DataTypes.STRING,
      },
      funcao: {
        type: Sequelize.DataTypes.STRING,
      },
      numero_crea: {
        type: Sequelize.DataTypes.STRING,
      },
      estado_crea: {
        type: Sequelize.DataTypes.STRING,
      },
      empresa_id: {
        type: Sequelize.DataTypes.INTEGER,
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
    await queryInterface.dropTable("responsavel_tecnico");
  }
};
