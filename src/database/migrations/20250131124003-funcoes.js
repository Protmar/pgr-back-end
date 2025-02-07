'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
<<<<<<< HEAD:src/database/migrations/20250131124209-cadastroTipoPgr.js
    await queryInterface.createTable("cadastro_tipo_pgrs", {
=======
    await queryInterface.createTable("funcoes", {
>>>>>>> origin/Lucas:src/database/migrations/20250131124003-funcoes.js
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
<<<<<<< HEAD:src/database/migrations/20250131124209-cadastroTipoPgr.js
    await queryInterface.dropTable("cadastro_tipo_pgrs");
=======
    await queryInterface.dropTable("funcoes");
>>>>>>> origin/Lucas:src/database/migrations/20250131124003-funcoes.js
  }
};
