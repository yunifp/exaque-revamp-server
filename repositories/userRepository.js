const db = require("../models");
const { User } = db;
const { Op } = require("sequelize");

/**
 * Mencari satu user berdasarkan alamat email.
 * @param {string} email - Alamat email user.
 * @returns {Promise<User|null>}
 */
const findUserByEmail = async (email) => {
  try {
    const user = await User.findOne({
      where: { email: email },
    });
    return user;
  } catch (error) {
    console.error("Error in userRepository.findUserByEmail:", error);
    throw new Error("Gagal mencari user di database.");
  }
};
/**
 * Update data user berdasarkan ID
 * @param {number} id - ID User
 * @param {object} data - Data yang akan di-update
 */
const updateUserById = async (id, data) => {
  return await User.update(data, { where: { id } });
};

// === 3. TAMBAHKAN FUNGSI INI ===
/**
 * Mencari user berdasarkan token reset yang (sudah di-hash)
 * @param {string} hashedToken - Token yang sudah di-hash
 */
const findUserByResetToken = async (hashedToken) => {
  return await User.findOne({
    where: {
      reset_password_token: hashedToken,
      // Pastikan tokennya belum kedaluwarsa
      reset_password_expires: {
        [Op.gt]: new Date(), // 'gt' = Greater Than (Lebih besar dari waktu sekarang)
      },
    },
  });
};

module.exports = {
  findUserByEmail,
  updateUserById,
  findUserByResetToken,
};
