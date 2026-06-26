const db = require("../models");
const { StoryCategory } = db;

// Fungsi untuk Create
const createCategory = async (data) => {
  return await StoryCategory.create(data);
};

// Cek duplikat
const findCategoryByNameOrSlug = async (name, slug) => {
  const { Op } = require("sequelize");
  return await StoryCategory.findOne({
    where: { [Op.or]: [{ name }, { slug }] },
  });
};

// Read All
const findAllCategories = async () => {
  return await StoryCategory.findAll({ order: [["name", "ASC"]] });
};

// Read by ID
const findCategoryById = async (id) => {
  return await StoryCategory.findByPk(id);
};

// Delete
const deleteCategoryById = async (id) => {
  return await StoryCategory.destroy({ where: { id } });
};

module.exports = {
  createCategory,
  findCategoryByNameOrSlug,
  findAllCategories,
  findCategoryById,
  deleteCategoryById,
};
