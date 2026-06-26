"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("StoryTagPivot", {
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
      story_tag_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true, 
        references: {
          model: "StoryTags", 
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
    await queryInterface.dropTable("StoryTagPivot");
  },
};
