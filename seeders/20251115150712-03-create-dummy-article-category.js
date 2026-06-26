"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "ArticleCategories",
      [
        {
          name: "Blog",
          slug: "blog", // Hook di model harusnya otomatis, tapi kita isi manual di seeder
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("ArticleCategories", { slug: "blog" }, {});
  },
};
