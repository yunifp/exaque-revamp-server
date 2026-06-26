"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Stories", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, 
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      excerpt: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      featured_image_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("draft", "published", "archived"),
        allowNull: false,
        defaultValue: "draft",
      },
      published_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      
      author_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users", 
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      author_override: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },

      
      meta_title: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      meta_description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      canonical_url: {
        type: Sequelize.STRING,
        allowNull: true,
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
    await queryInterface.dropTable("Stories");
  },
};
