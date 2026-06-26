"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "StoryTagPivot",
      [
        {
          story_id: 1, // Asumsi Story pertama (ID 1)
          story_tag_id: 1, // Asumsi Tag 'Klinik' (ID 1)
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "StoryTagPivot",
      { story_id: 1, story_tag_id: 1 },
      {}
    );
  },
};
