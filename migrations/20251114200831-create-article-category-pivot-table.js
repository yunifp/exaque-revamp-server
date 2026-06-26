"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ArticleCategoryPivot", {
      article_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true, 
        references: {
          model: "Articles", 
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      article_category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true, 
        references: {
          model: "ArticleCategories", 
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
    await queryInterface.dropTable("ArticleCategoryPivot");
  },
};
