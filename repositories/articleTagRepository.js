const db = require("../models");
const { ArticleTag } = db;
const { Op } = require("sequelize");

// Create
const createTag = async (data) => {
  return await ArticleTag.create(data);
};

// Cek duplikat (Find or Create)
// PERBARUI: Tambahkan 'transaction'
const findOrCreateTag = async (tagName, transaction) => {
  const slug = tagName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const [tag] = await ArticleTag.findOrCreate({
    where: { slug: slug },
    defaults: { name: tagName, slug: slug },
    transaction: transaction, // <-- Terapkan transaction
  });
  return tag;
};

// Cek duplikat (untuk service)
const findTagByNameOrSlug = async (name, slug) => {
  return await ArticleTag.findOne({
    where: { [Op.or]: [{ name }, { slug }] },
  });
};

// Read All
const findAllTags = async () => {
  return await ArticleTag.findAll({ order: [["name", "ASC"]] });
};

// Read by ID
const findTagById = async (id) => {
  return await ArticleTag.findByPk(id);
};

// Delete
const deleteTagById = async (id) => {
  return await ArticleTag.destroy({ where: { id } });
};

module.exports = {
  createTag,
  findOrCreateTag, // <-- Sekarang menerima transaction
  findTagByNameOrSlug,
  findAllTags,
  findTagById,
  deleteTagById,
};
