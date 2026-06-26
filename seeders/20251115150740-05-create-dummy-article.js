"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Articles",
      [
        {
          title: "Judul Artikel Pertama Saya",
          slug: "judul-artikel-pertama-saya",
          content: "Ini adalah isi konten lengkap dari artikel pertama...",
          excerpt: "Ini adalah ringkasan singkat (excerpt) artikel.",
          featured_image_url: "https://via.placeholder.com/800x400.png",
          status: "published",
          published_at: new Date(),
          author_id: 1, // Asumsi User 'admin@exaque.com' memiliki ID 1
          author_override: null,
          meta_title: "Judul Artikel SEO Pertama",
          meta_description: "Deskripsi Meta SEO untuk artikel pertama.",
          canonical_url: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "Articles",
      { slug: "judul-artikel-pertama-saya" },
      {}
    );
  },
};
