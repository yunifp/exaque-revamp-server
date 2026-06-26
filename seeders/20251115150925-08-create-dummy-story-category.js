"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "StoryCategories",
      [
        {
          name: "Studi Kasus",
          slug: "studi-kasus",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "StoryCategories",
      { slug: "studi-kasus" },
      {}
    );
  },
};
