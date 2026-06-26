"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "StoryTags",
      [
        {
          name: "Klinik",
          slug: "klinik",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("StoryTags", { slug: "klinik" }, {});
  },
};
