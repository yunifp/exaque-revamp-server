const db = require("../models");
const { ArticleCategory } = db;

const createCategory = async (data) => {
  return await ArticleCategory.create(data);
};

// Cek duplikat (berguna untuk service)
const findCategoryByNameOrSlug = async (name, slug) => {
  const { Op } = require("sequelize");
  return await ArticleCategory.findOne({
    where: { [Op.or]: [{ name }, { slug }] },
  });
};

const findAllCategories = async () => {
  return await ArticleCategory.findAll({ order: [["name", "ASC"]] });
};

const findCategoryById = async (id) => {
  return await ArticleCategory.findByPk(id);
};

const updateCategoryById = async (id, data) => {
  const [rowsUpdated] = await ArticleCategory.update(data, {
    where: { id },
  });
  return rowsUpdated;
};

const deleteCategoryById = async (id) => {
  return await ArticleCategory.destroy({ where: { id } });
};

module.exports = {
  createCategory,
  findCategoryByNameOrSlug,
  findAllCategories,
  findCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
