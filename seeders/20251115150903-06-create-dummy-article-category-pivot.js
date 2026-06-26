"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "ArticleCategoryPivot",
      [
        {
          article_id: 1, // Asumsi Artikel pertama (ID 1)
          article_category_id: 1, // Asumsi Kategori 'Blog' (ID 1)
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "ArticleCategoryPivot",
      { article_id: 1, article_category_id: 1 },
      {}
    );
  },
};
