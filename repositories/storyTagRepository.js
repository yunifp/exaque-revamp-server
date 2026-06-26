const db = require("../models");
const { StoryTag } = db;
const { Op } = require("sequelize");

// Create
const createTag = async (data) => {
  return await StoryTag.create(data);
};

// Cek duplikat (Find or Create)
const findOrCreateTag = async (tagName, transaction) => {
  const slug = tagName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const [tag] = await StoryTag.findOrCreate({
    where: { slug: slug },
    defaults: { name: tagName, slug: slug },
    transaction: transaction,
  });
  return tag;
};

// Cek duplikat (untuk service)
const findTagByNameOrSlug = async (name, slug) => {
  return await StoryTag.findOne({
    where: { [Op.or]: [{ name }, { slug }] },
  });
};

// Read All
const findAllTags = async () => {
  return await StoryTag.findAll({ order: [["name", "ASC"]] });
};

// Read by ID
const findTagById = async (id) => {
  return await StoryTag.findByPk(id);
};

// Delete
const deleteTagById = async (id) => {
  return await StoryTag.destroy({ where: { id } });
};

module.exports = {
  createTag,
  findOrCreateTag, // <-- Penting untuk service
  findTagByNameOrSlug,
  findAllTags,
  findTagById,
  deleteTagById,
};
