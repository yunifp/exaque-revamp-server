const db = require("../models");
const { Inquiry } = db;

const createInquiry = async (data) => {
  return await Inquiry.create(data);
};

const findInquiryById = async (id) => {
  return await Inquiry.findByPk(id);
};

const deleteInquiryById = async (id) => {
  return await Inquiry.destroy({ where: { id } });
};

const updateInquiryById = async (id, data) => {
  // HAPUS 'returning: true' dan 'plain: true'
  // Fungsi ini sekarang akan mengembalikan array [1] (jika sukses)
  const [rowsUpdated] = await Inquiry.update(data, {
    where: { id },
  });
  return rowsUpdated; // Kembalikan angkanya saja (cth: 1)
};

/**
 * Mencari semua inquiries dengan pagination dan filter
 * @param {object} options - Berisi where, limit, offset
 */
const findAllInquiries = async (options) => {
  return await Inquiry.findAndCountAll(options);
};

module.exports = {
  createInquiry,
  findInquiryById,
  deleteInquiryById,
  updateInquiryById,
  findAllInquiries,
};
