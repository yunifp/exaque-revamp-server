"use strict";
// 1. Panggil bcrypt di sini
const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    // 2. Buat hash-nya secara manual
    const hashedPassword = await bcrypt.hash("password123", 10);

    await queryInterface.bulkInsert(
      "Users",
      [
        {
          name: "Admin Exaque",
          email: "admin@exaque.com",
          // 3. Gunakan password yang sudah di-hash
          password: hashedPassword,
          role: "admin",
          reset_password_token: null,
          reset_password_expires: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    // Metode 'down' tetap sama
    await queryInterface.bulkDelete("Users", { email: "admin@exaque.com" }, {});
  },
};
