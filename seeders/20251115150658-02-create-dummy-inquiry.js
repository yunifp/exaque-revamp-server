"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Inquiries",
      [
        {
          first_name: "Calon",
          last_name: "Pelanggan",
          email: "calon@pelanggan.com",
          company: "PT Sukses Selalu",
          job_title: "Manajer IT",
          phone_number: "081234567890",
          user_persona: "Sedang mencari solusi antrian",
          service_needed: "Permintaan Demo", // <-- TAMBAHAN BARU
          message:
            "Saya tertarik untuk demo produk Exaque untuk perusahaan kami.",
          status: "new",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "Inquiries",
      { email: "calon@pelanggan.com" },
      {}
    );
  },
};
