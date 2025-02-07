'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
<<<<<<< HEAD:src/database/migrations/20250131124230-cadastroVeiculo.js
    await queryInterface.createTable("cadastro_veiculos", {
=======
    await queryInterface.createTable("setores", {
>>>>>>> origin/Lucas:src/database/migrations/20250129134953-setores.js
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      empresa_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: { model: "empresas", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      descricao: {
        allowNull: false,
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
<<<<<<< HEAD:src/database/migrations/20250131124230-cadastroVeiculo.js
    await queryInterface.dropTable("cadastro_veiculos");
=======
    await queryInterface.dropTable("setores");
>>>>>>> origin/Lucas:src/database/migrations/20250129134953-setores.js
  }
};
