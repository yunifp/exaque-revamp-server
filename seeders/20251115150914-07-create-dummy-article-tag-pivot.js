"useS trict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "ArticleTagPivot",
      [
        {
          article_id: 1, // Asumsi Artikel pertama (ID 1)
          article_tag_id: 1, // Asumsi Tag 'SEO' (ID 1)
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "ArticleTagPivot",
      { article_id: 1, article_tag_id: 1 },
      {}
    );
  },
};
