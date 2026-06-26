"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "StoryCategoryPivot",
      [
        {
          story_id: 1, // Asumsi Story pertama (ID 1)
          story_category_id: 1, // Asumsi Kategori 'Studi Kasus' (ID 1)
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "StoryCategoryPivot",
      { story_id: 1, story_category_id: 1 },
      {}
    );
  },
};
