"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("StoryCategoryPivot", {
      story_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true, 
        references: {
          model: "Stories", 
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      story_category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true, 
        references: {
          model: "StoryCategories", 
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("StoryCategoryPivot");
  },
};
