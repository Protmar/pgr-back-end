'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("servicos", {
      id: {
        allowNull: false,
        autoIncrement: true, // Corrigido
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      empresa_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: { model: "empresas", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      in_use: {
        type: Sequelize.DataTypes.BOOLEAN
      },
      cliente_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: { model: "clientes", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      descricao: {
        type: Sequelize.DataTypes.STRING,
      },
      responsavel_aprovacao: {
        type: Sequelize.DataTypes.STRING,
      },
      cargo_responsavel_aprovacao: {
        type: Sequelize.DataTypes.STRING,
      },
      id_responsavel_aprovacao: {
        type: Sequelize.DataTypes.INTEGER,
      },
      data_inicio: {
        type: Sequelize.DataTypes.STRING,
      },
      data_fim: {
        type: Sequelize.DataTypes.STRING,
      },
      art_url: {
        type: Sequelize.DataTypes.STRING,
      },
      base_document_url_pgr: {
        type: Sequelize.DataTypes.TEXT,
      },
      base_document_url_pgrtr: {
        type: Sequelize.DataTypes.TEXT,
      },
      base_document_url_ltcat: {
        type: Sequelize.DataTypes.TEXT,
      },
      base_document_url_lp: {
        type: Sequelize.DataTypes.TEXT,
      },
      base_document_url_li: {
        type: Sequelize.DataTypes.TEXT,
      },
      base_document_url_pca: {
        type: Sequelize.DataTypes.TEXT,
      },
      base_document_url_pcmso: {
        type: Sequelize.DataTypes.TEXT,
      },
      base_document_url_ppr: {
        type: Sequelize.DataTypes.TEXT,
      },
      memorial_descritivo_processo_pgr: {
        type: Sequelize.DataTypes.TEXT,
      },
      memorial_descritivo_processo_pgrtr: {
        type: Sequelize.DataTypes.TEXT,
      },
      memorial_descritivo_processo_ltcat: {
        type: Sequelize.DataTypes.TEXT,
      },
      memorial_descritivo_processo_lp: {
        type: Sequelize.DataTypes.TEXT,
      },
      memorial_descritivo_processo_li: {
        type: Sequelize.DataTypes.TEXT,
      },
      memorial_descritivo_processo_pca: {
        type: Sequelize.DataTypes.TEXT,
      },
      memorial_descritivo_processo_pcmso: {
        type: Sequelize.DataTypes.TEXT,
      },
      memorial_descritivo_processo_ppr: {
        type: Sequelize.DataTypes.TEXT,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.fn('NOW'), // Define o valor padrão
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.fn('NOW'), // Define o valor padrão
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("servicos");
  }
};
