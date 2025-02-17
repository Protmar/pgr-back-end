'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ambientes_trabalhos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      ges_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: { model: "ges", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      area: {
        type: Sequelize.DataTypes.INTEGER,
      },
      pe_direito: {
        type: Sequelize.DataTypes.INTEGER,
      },
      qnt_janelas: {
        type: Sequelize.DataTypes.INTEGER,
      },
      tipo_edificacao_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: { model: "edificacoes", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      teto_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: { model: "tetos", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      parede_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: { model: "paredes", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      ventilacao_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: { model: "ventilacoes", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      iluminacao_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: { model: "iluminacoes", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      piso_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: { model: "pisos", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      qnt_equipamentos: {
        type: Sequelize.DataTypes.INTEGER,
      },
      informacoes_adicionais: {
        type: Sequelize.DataTypes.TEXT,
        
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
    await queryInterface.dropTable("ambientes_trabalhos");
  }
};
