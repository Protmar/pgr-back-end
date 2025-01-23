'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("clientes", {
      id: {
        allowNull: false,
        autoIncrementIdentity: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
  },
  empresa_id: {
    type: Sequelize.DataTypes.INTEGER,
    references: { model: "empresas", key: "id" },
    onUpdate: "CASCADE",
    onDelete: "RESTRICT"
  },
  cnpj: {
    type: Sequelize.DataTypes.STRING,
  },
  nome_fantasia: {
    allowNull: false,
    type: Sequelize.DataTypes.STRING,
  },
  razao_social: {
    allowNull: false,
    type: Sequelize.DataTypes.STRING,
  },
  cnae: {
    type: Sequelize.DataTypes.STRING,
  },
  atividade_principal: {
    type: Sequelize.DataTypes.STRING,
  },
  grau_de_risco: {
    type: Sequelize.DataTypes.STRING,
  },
  cep: {
    type: Sequelize.DataTypes.STRING,
  },
  estado: {
    type: Sequelize.DataTypes.STRING, 
  },
  cidade: {
    type: Sequelize.DataTypes.STRING,
  },
  localizacao_completa: {
    type: Sequelize.DataTypes.STRING,
  },
  email_financeiro: {
    type: Sequelize.DataTypes.STRING,
  },
  contato_financeiro: {
    type: Sequelize.DataTypes.STRING,
  },
  observacoes: {
    type: Sequelize.DataTypes.STRING,
  },
  logo_url: {
    type: Sequelize.DataTypes.STRING,
  },
  add_documento_base_url: {
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

  async down (queryInterface, Sequelize) {

  }
};
