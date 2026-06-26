"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Stories",
      [
        {
          title: "Kisah Sukses Klinik Sehat",
          slug: "kisah-sukses-klinik-sehat",
          content: "Ini adalah isi konten lengkap dari kisah sukses...",
          excerpt: "Ringkasan singkat (excerpt) kisah sukses.",
          featured_image_url: "https://via.placeholder.com/800x400.png",
          status: "published",
          published_at: new Date(),
          author_id: 1, // Asumsi User 'admin@exaque.com' (ID 1)
          author_override: "Tim Exaque", // Contoh penggunaan override
          meta_title: "Kisah Sukses Klinik (Studi Kasus)",
          meta_description: "Deskripsi Meta SEO untuk kisah sukses.",
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
      "Stories",
      { slug: "kisah-sukses-klinik-sehat" },
      {}
    );
  },
};
