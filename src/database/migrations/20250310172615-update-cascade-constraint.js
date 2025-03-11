module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("at_images_urls", "id_ges", {
      type: Sequelize.INTEGER,
      references: { model: "ges", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("at_images_urls", "id_ges", {
      type: Sequelize.INTEGER,
      references: { model: "ges", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT", // Reverte caso necessário
    });
  },
};
