"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Articles", "content", {
      type: Sequelize.TEXT("long"),
      allowNull: false,
    });
    await queryInterface.changeColumn("Articles", "excerpt", {
      type: Sequelize.TEXT("long"),
      allowNull: true,
    });
    await queryInterface.changeColumn("Stories", "content", {
      type: Sequelize.TEXT("long"),
      allowNull: false,
    });
    await queryInterface.changeColumn("Stories", "excerpt", {
      type: Sequelize.TEXT("long"),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Articles", "content", {
      type: Sequelize.TEXT,
      allowNull: false,
    });
    await queryInterface.changeColumn("Articles", "excerpt", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn("Stories", "content", {
      type: Sequelize.TEXT,
      allowNull: false,
    });
    await queryInterface.changeColumn("Stories", "excerpt", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },
};
